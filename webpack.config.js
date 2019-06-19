const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { TsConfigPathsPlugin } = require("awesome-typescript-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { getRuntimeVars, directorySpecificConfig } = require("./webpack/utils");

// Modify this array if one packages references another, this ensures that it will
// be included in the index html file 

const referencedPackages = { 
    app1: ['common'],
    app2: ['common'],
    app3: ['common'],
    app4: ['common']
};

// The true means we are using ejs templates and not script-ext-html-webpack-plugin
const entries = directorySpecificConfig(referencedPackages);

const plugins = (env) => {    
    const isDevelopment = env && env.DEVELOPMENT | false;

    const allPlugins = ([

        // Copies the index.html template and tells it where to inject the script tags
        // for all the packages
        ...entries.htmlWebpackEntries,  
          // Gets the runtime variables from  
          new webpack.DefinePlugin(getRuntimeVars()),
        // Copy any static resources required to the dist folder, this will got to each of 
        // that packages and copy out the images. In the images folder they are put in their 
        // own directories.  
        new CopyWebpackPlugin([
            { from: "./packages/**/src/images/*", to: "./images" }
        ]),
        // Extract out any CSS and put it in the appropriate external file, use contenthash 
        // for browser caching.
        new MiniCssExtractPlugin({
            chunkFilename: "[name].[contenthash].css"
        }) 
    ]);

    // If we are not doing any analysis on the bundle then we don't need this. 
    if (env && env.ANALYSE_BUNDLES) {
        allPlugins.push(new BundleAnalyzerPlugin({analyzerPort: env.ANALYZER_PORT | 8888}));
    }

    // If we are in development then we add the hot module plugin, this will break [contenthash] if 
    // running in production mode     
    if (isDevelopment) {
        // HMR
        allPlugins.push(new webpack.HotModuleReplacementPlugin());
    }

    return allPlugins;
}

module.exports = env => { 
    
    const isDevelopment = env && env.DEVELOPMENT | false;
    const buildOutputFolder = "./dist";

    return {   
    mode: isDevelopment ? "development" : "production",     
    entry: entries.mainEntryPoints, 
    output: {
        filename: isDevelopment ? "[name].[hash].js" : "[name].[contenthash].js",        
        path: path.resolve(buildOutputFolder),     
    },
    stats: {
        colors: true,
        chunks: true  
    },
    optimization: {
        minimizer: [new UglifyJsPlugin({
            parallel: true,
            cache: true,
            uglifyOptions: {
                output: {
                    comments: false
                },
                compress: {
                    drop_console:true
                }    
            } 
        })],
        splitChunks: {
          cacheGroups: {
                /* debug : {
                    test : chunk => {
                        console.log(chunk.context);
                        return false;
                    }, 
                    chunks: 'all',
                    name: 'debug',                
                },*/ 
                common : {
                    test : /[\\/]common[\\/]/,
                    chunks: 'all',
                    name: 'common',
                    // Ignore min chunk size, max async requests, max initial requests and always create chunks.                
                    enforce: true, 
                },
                react : {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    chunks: 'all',
                    name: 'react',                
                }
            }
        }
    },
    devServer: {
        contentBase: buildOutputFolder,
        hot: true,   
        index: "index.html",    
        inline: true,   
        stats: {
            children: false  
          },     
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts",".tsx",".js",".json"],
        plugins: [
            new TsConfigPathsPlugin()
        ]
    },    
    module: {
        rules: [

            // index.ejs is the template to house the JS files
          /*  { test: /\.ejs?$/, loader: "ejs-loader" }, */

            // TSLinter and loader
            { test: /\.tsx?$/, enforce: 'pre',
                use: [
                    {
                        loader: 'tslint-loader',                        
                    }
                ]
            },

            // Handle the typescript
            { test: /\.tsx?$/, loader: "awesome-typescript-loader?tsconfig=../../tsconfig.json" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

            // Exports HTML as a string and can minimise it, negates the use of CopyWebpackPlugin for 
            // index.html 
            {   test: /\.html$/, use: [ { loader: "html-loader", options: { minimize: true } } ] },

            // css-loader turns the css into a string and the style loader put the style tag in the page. Styles will be included in the bundle,
            // this is not efficient as they could be loaded async while the page is loading. Use extract-text-plugin to extract it out. 
            { test: /\.css$/, use: [ { loader: MiniCssExtractPlugin.loader }, { loader: "css-loader" }] },

            // File loader will process png, gif and jpegs and output them to the dist folder 
            { test: /\.(png|jpg|gif)$/, use: [ { loader: "file-loader"} ] },
        ]
    },   
    plugins: plugins(env)
}
};

/* 
    Notes:

    style-loader is a Webpack loader that can load some CSS and inject it into the document via a <link> tag.
    css-loader is the loader that can parse a CSS file and apply various transforms to it. 
    extract-text-plugin can combine all the css output into one file 
     
*/

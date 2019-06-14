const HtmlWebPackPlugin = require("html-webpack-plugin");
const ScriptExtHtmlWebPackPlugin = require("script-ext-html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { TsConfigPathsPlugin } = require("awesome-typescript-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require("fs");

const getGlobals = () => { 
    return fs.existsSync(path.resolve("./globals.js")) ? require(path.resolve("./globals.js")) : {};
}

const plugins = (env) => {    

    const isDevelopment = env && env.DEVELOPMENT | false;

    const allPlugins = ([

        // Copies the index.html template and tells it where to inject the script tags 
        new HtmlWebPackPlugin({
            template: "./webpack/index.html",
            filename: "index.html",
            inject: "head"            
          }),
          // This will defer the script until the page has been loaded, extension of HtmlWebPackPlugin
          new ScriptExtHtmlWebPackPlugin({
            defaultAttribute: 'defer'
          }),
          // We can define constants here 
          new webpack.DefinePlugin(getGlobals()),
        // Copy any static resources required to the dist folder, this will got to each of 
        // that packages and copy out the images. In the images folder they are put in their 
        // own directories.  
        new CopyWebpackPlugin([
            { from: "./packages/**/src/images/*", to: "./images" }
        ]),
        // Extract out any CSS and put it in the appropriate external file, use contenthash 
        // for browser caching.
        new MiniCssExtractPlugin({
            chunkFilename: "[name][contenthash].css"
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
    entry: {
        app1: "./packages/app1/src/index.tsx", 
        app2: "./packages/app2/src/index.tsx",
        app3: "./packages/app3/src/index.tsx", 
        app4: "./packages/app4/src/index.tsx", 
        common: "./packages/common/index.tsx"
    },
    output: {
        filename: isDevelopment ? "[name].[hash].js" : "[name].[contenthash].js",        
        path: path.resolve(buildOutputFolder),     
    },
    stats: {
        colors: true,
        chunks: true  
    },
    optimization: {
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
                    //enforce: true,
                }
            }
        }
    },
       /*    common: {
                test : /[\\/]common[\\/]/,
                enforce: true,                                         
                chunks: 'all',
                name: 'common',                                
//                priority: 2
          },
            app: {
                test : /[\\/]src[\\/]/,
                chunks: 'all',
                name: 'app',    
                enforce: true,                            
//                priority: 1
            },
            react: {
                test : /[\\/]node_modules[\\/](react)[\\/]/,
                chunks: 'all',
                name: 'react',
                enforce: true,                                
//                priority: 0,
            },
          }*/  
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
            // TSLinter and loader
            { test: /\.tsx?$/, enforce: 'pre',
                use: [
                    {
                        loader: 'tslint-loader',                        
                    }
                ]
            },

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

            // typings-for-css-loader enabled type generation for style sheets, NOTE: Breaking changes after 1.0.0 on css-loader

            //{ test: /\.css$/, use: [ { loader: "style-loader" }, { loader: "typings-for-css-modules-loader", options: { modules: true, namedExport: true, camelCase: true } } ] }            
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

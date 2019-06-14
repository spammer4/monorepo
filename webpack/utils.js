const { lstatSync, readdirSync, existsSync } = require("fs");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");

/* Gets the global variables for a particular project */

const getGlobals = () => { 
    return existsSync(path.resolve("./globals.js")) ? require(path.resolve("./globals.js")) : {};
}

/* Gets directory specific config when generating the index.html files */

const directorySpecificConfig = (referencedPackages) => {
    const entries = {};
    const htmlWebpackEntries = [];

    const isDirectory = dir => lstatSync(dir).isDirectory();

    // Check to see if the packages directory exists, if it doesn't then we must be 
    // running this for a local package 

    if (!existsSync("./packages")) {
        console.log(process.cwd());
        return {
            mainEntryPoints: { app: `${process.cwd()}/src/index.tsx` },
            htmlWebpackEntries: [ new HtmlWebPackPlugin({
                template: "./src/index.html",
                filename: `index.html`,
                inject: "head"            
              }) ],
        }        
    }
    console.error("Broken!!!");
    const packages = readdirSync("./packages");
    packages.map(dir => {

        const entry = { [dir] : `./packages/${dir}/src/index.tsx` };
        Object.assign(entries,entry);

        const packagesToExclude = ([...packages]).filter(directory => directory != dir 
            && referencedPackages[dir] 
            && referencedPackages[dir].indexOf(directory)<0 );
        
        htmlWebpackEntries.push(new HtmlWebPackPlugin({
            template: "./webpack/index.html",
            excludeChunks: packagesToExclude,
            filename: `index.${dir}.html`,
            inject: "head"            
          }),
        );
    });

    return {
        mainEntryPoints: entries,
        htmlWebpackEntries,
    }
}

module.exports = {
    getGlobals,
    directorySpecificConfig
}
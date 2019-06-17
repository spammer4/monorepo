const { lstatSync, readdirSync, existsSync } = require("fs");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");

/* Gets the development runtime variables for a project */

const getRuntimeVars = () => {
    const locals = existsSync(path.resolve("./locals.runtime.js")) ? require(path.resolve("./locals.runtime.js")) : {}; 
    const globals = existsSync(path.resolve("../../globals.runtime.js")) ? require(path.resolve("../../globals.runtime.js")) : {}; 
    // console.log(Object.assign({}, locals, globals));
    return Object.assign({}, locals, globals);
}

/* Gets directory specific config when generating the index.html files */

const directorySpecificConfig = (referencedPackages) => {
    const entries = {};
    const htmlWebpackEntries = [];

    const isDirectory = dir => lstatSync(dir).isDirectory();

    // Check to see if the packages directory exists, if it doesn't then we must be 
    // running this for a local package 

    if (!existsSync("./packages")) {        
        return {
            mainEntryPoints: { app: `${process.cwd()}/src/index.tsx` },
            htmlWebpackEntries: [ new HtmlWebPackPlugin({
                template: "./src/index.html",
                filename: `index.html`,
                inject: "head"            
              }) ],
        }        
    }
    
    const packages = readdirSync("./packages");
    console.log(`Found packages ${packages}`);
    packages.map(dir => {

        const entry = { [dir] : `./packages/${dir}/src/index.tsx` };

        if (existsSync(entry[dir])) {
            Object.assign(entries,entry);
        }
                
        const excludePackages = new Set([...packages].filter(directory => directory !== dir));
        if (referencedPackages[dir]) {
            referencedPackages[dir].forEach(package => {
                if (excludePackages.has(package)) {
                    excludePackages.delete(package);
                }        
            });
        }
        const packagesToExclude = Array.from(excludePackages);
        //console.log(excludePackages);
        // packagesToExclude.push("lazyevents");        
        //console.log(`Excluding ${packagesToExclude} in index file for build ${dir}.`);        
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
    getRuntimeVars,
    directorySpecificConfig
}
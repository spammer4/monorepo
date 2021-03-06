const { lstatSync, readdirSync, existsSync } = require("fs");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");

/* Gets the global variables for a particular project */

const getRuntimeVars = () => {      
    const locals = existsSync(path.resolve("./globals.runtime.js")) ? require(path.resolve("./globals.runtime")) : {}; 
    const globals = existsSync(path.resolve("../../globals.runtime.js")) ? require(path.resolve("../../globals.runtime")) : {};      
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
            htmlWebpackEntries: [ new HtmlWebPackPlugin(
              {
                template: "../../webpack/index.ejs",
                filename: `index.html`,
                inject: false,            
              })],
        }        
    }
    
    const packages = readdirSync("./packages");
    packages.map(dir => {

        const entry = { [dir] : `./packages/${dir}/src/index.html` };

        if (existsSync(entry[dir])) {
            Object.assign(entries,entry);
        }

        const packagesToExclude = ([...packages]).filter(directory => directory != dir 
            && referencedPackages[dir] 
            && referencedPackages[dir].indexOf(directory)<0 );
        
        htmlWebpackEntries.push(new HtmlWebPackPlugin(
          {
            template: "./webpack/index.ejs",
            excludeChunks: packagesToExclude,
            filename: `index.${dir}.html`,
            inject: false
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
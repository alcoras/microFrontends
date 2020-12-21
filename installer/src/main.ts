import { writeFileSync, existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join } from "path";
import { ncp } from "ncp";

interface field {
    search: string;
    replace: string;
}

interface InstallFile {
    projectName: string,
    replace: field[];
}

function getFilesFromPath(path: string) {
    var result: string[] = [];
    
    function walk(currentPath: string) {
        var fileList = readdirSync(currentPath);

        for (var i in fileList) {
            var currentFile = join(currentPath, fileList[i]);
            if (statSync(currentFile).isFile()) {
                result.push(currentFile.replace(path, ''));
            } else {
                walk(currentFile);
            }
        }
    }
    walk(path);
    return result;
}

async function copyFoldersAsync(sourcePath: string, desitnatioPath: string): Promise<void> {
    return new Promise<void>(resolve => {
        ncp(sourcePath, desitnatioPath, (error) => { 
            if (error) {
                console.error(error);
                console.error("Failed to copy template");
                process.exit();
            }
            resolve();
        });
    })
}

function replaceAll(buffer: string, search: string, replace: string) {
    return buffer.replace(
        new RegExp(search.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
}

(async(): Promise<void> => {

    const PassedArgs = process.argv.slice(2);

    if (PassedArgs.length != 1) {
        console.log("Usage: node .\\dist\\main.js path_to_installer");
        console.log("Example: node .\\dist\\main.js .\\temp\\install.json");
        process.exit();
    }

    if (!existsSync(PassedArgs[0])) {
        console.error(`Can't find specificed path ${PassedArgs[0]}`);
        process.exit();
    }

    if (!PassedArgs[0].includes('.json')) {
        console.error(`Pass a json file. Passed: (${PassedArgs[0]})`);
        process.exit();
    }

    const Configuration: InstallFile = JSON.parse(readFileSync(PassedArgs[0], 'utf-8'));

    // copying new folder 
    {
        if (existsSync(`../${Configuration.projectName}`)) {
            console.error(`Project ${Configuration.projectName}already exists.`);
            process.exit(-1);
        }
    
        await copyFoldersAsync("../template", `../${Configuration.projectName}`);
    }
    
    // going through files and replacing
    {
        const newProjectFiles = getFilesFromPath(`../${Configuration.projectName}`);

        if (newProjectFiles.length == 0) {
            console.error("Could not read just copied files");
            process.exit();
        }
        
        for (let i = 0; i < newProjectFiles.length; i++) {
            let fileBuffer = readFileSync(newProjectFiles[i], 'utf-8');

            for (let c = 0; c < Configuration.replace.length; c++) {
                fileBuffer = replaceAll(fileBuffer, Configuration.replace[c].search, Configuration.replace[c].replace);
            }
            
            writeFileSync(newProjectFiles[i], fileBuffer);
        }
    }
})();

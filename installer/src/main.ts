import { writeFileSync, existsSync, readFileSync, readdirSync, statSync, renameSync, fstat } from 'fs';
import { join } from "path";
import { ncp } from "ncp";
import { Console } from 'console';

interface field {
    search: string;
    replace: string;
}

interface installFile {
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
                process.exit(-1);
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
        console.log("Example: node .\\dist\\main.js .\\installs\\install.json");
        process.exit(-1);
    }
    
    if (!existsSync(PassedArgs[0])) {
        console.error(`Can't find specificed path ${PassedArgs[0]}`);
        process.exit(-1);
    }
    
    if (!PassedArgs[0].includes('.json')) {
        console.error(`Pass a json file. Passed: (${PassedArgs[0]})`);
        process.exit(-1);
    }
    
    const Configuration: installFile = JSON.parse(readFileSync(PassedArgs[0], 'utf-8'));

    // copying new folder 
    {
        if (existsSync(`../${Configuration.projectName}`)) {
            console.error(`Project ${Configuration.projectName} already exists.`);
            process.exit(-1);
        }
    
        await copyFoldersAsync("../template", `../${Configuration.projectName}`);
    }
    
    // going through files and replacing
    {
        const newProjectFiles = getFilesFromPath(`../${Configuration.projectName}`);

        if (newProjectFiles.length == 0) {
            console.error("Could not read just copied files");
            process.exit(-1);
        }
        
        for (let i = 0; i < newProjectFiles.length; i++) {
            let fileBuffer = readFileSync(newProjectFiles[i], 'utf-8');

            for (let c = 0; c < Configuration.replace.length; c++) {
                fileBuffer = replaceAll(fileBuffer, Configuration.replace[c].search, Configuration.replace[c].replace);
            }
            
            writeFileSync(newProjectFiles[i], fileBuffer);
        }
    }

    // renaming files
    {
        const filesToRename = [ "Component.ts", "Module.ts", "View.html", "Service.ts"];
        const pathToFiles = `../${Configuration.projectName}/src/app/`;
        
        for (let i = 0; i < filesToRename.length; ++i)
            renameSync(pathToFiles + filesToRename[i], pathToFiles + `${Configuration.projectName}${filesToRename[i]}`);
    }

    // adding to MicroFrontendParts
    {
        const pathToMicroFrontendParts = "../shared/libs/projects/event-proxy-lib/src/lib/DTOs/MicroFrontendParts.ts";
        const templateString =
`  public static $project_name$: MicroFrontendInfo = {
    SourceId: '$source_id$',
    SourceName: '$project_name$'
  };

`;
        let fileBuffer = readFileSync(pathToMicroFrontendParts, 'utf-8');

        // this check probably should happen before everything else
        if (fileBuffer.includes(Configuration.projectName)) {
            console.error(`${Configuration.projectName} already exists in MicroFrontendParts`);
            process.exit(-1);
        }

        for (let c = 0; c < Configuration.replace.length; c++)
            fileBuffer = replaceAll(fileBuffer, Configuration.replace[c].search, Configuration.replace[c].replace);

        let postion = fileBuffer.indexOf(`  /** PLACEHOLDER USED BY INSTALLER */`);

        fileBuffer = fileBuffer.slice(0, postion) + templateString + fileBuffer.slice(postion);

        writeFileSync(pathToMicroFrontendParts, fileBuffer);
    }
    
    // adding to Eventids
    {
        const pathToMicroEventIds = "../shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds.ts";
        let pressed_id = 0;

        for (let i = 0; i < Configuration.replace.length; i++) {
            if (Configuration.replace[i].search == "$button_pressed_id$")
                pressed_id = +Configuration.replace[i].replace;
        }

        if (pressed_id == 0) {
            console.error(`Could not find $button_pressed_id$ in ${PassedArgs[0]}`);
            process.exit(-1);
        }

        
        const templateString =`  ${Configuration.projectName}ButtonPressed = ${pressed_id},\n`;
        
        let fileBuffer = readFileSync(pathToMicroEventIds, 'utf-8');
        
        // this check should happen before everything
        if (fileBuffer.includes(pressed_id.toString())) {
            console.error(`Such EventId already exists. Please edit id in ${PassedArgs[0]}.`);
            process.exit(-1);
        }
        
        let postion = fileBuffer.indexOf("  /** PLACEHOLDER USED BY INSTALLER */");

        fileBuffer = fileBuffer.slice(0, postion) + templateString + fileBuffer.slice(postion);
        writeFileSync(pathToMicroEventIds, fileBuffer);
    }

    process.exit(0);

})();

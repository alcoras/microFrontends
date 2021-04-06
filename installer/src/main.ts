import { writeFileSync, existsSync, readFileSync, readdirSync, statSync, renameSync, copyFileSync, unlinkSync } from 'fs';
import { join } from "path";
import { ncp } from "ncp";

const installPath = `${process.cwd()}\\installs\\install.json`;

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
readline.pause();

function askAsync(question: string, cb = () => void 0): Promise<string> {
  return new Promise(resolve => {
    readline.question(question, (answer: string) => {
      readline.pause();
      resolve(answer);
      cb();
    });
  });
}

interface field {
	search: string;
	replace: string;
}

interface installFile {
	projectName: string,
	replace: field[];
}

// https://github.com/zellwk/javascript/blob/master/convert-case/convert-case.js
function toKebabCase(string: string) {
  return string
    .split('')
    .map((letter, _) => {
      if (/[A-Z]/.test(letter)) {
        return ` ${letter.toLowerCase()}`
      }
      return letter;
    })
    .join('')
    .trim()
    .replace(/[_\s]+/g, '-');
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

// Entry point
(async(): Promise<void> => {
	var projectName: string;
	var newInstallFileName: string;
	var newInstallFilePath: string;
	var configuration: installFile;
	var answer: string;

	answer = await askAsync("Provide a name for project (use PascalCase):");
	projectName = answer.trim();

	newInstallFileName = `install_${answer.trim()}.json`;
	newInstallFilePath = `${process.cwd()}\\installs\\${newInstallFileName}`;
	if (existsSync(newInstallFilePath)) {
		console.error("Please provide unique project name or delete existing configuration");
		process.exit(-1);
	}

	// read install template
	configuration = JSON.parse(readFileSync(installPath, 'utf-8'));

	// changing config
	{
		configuration.projectName = projectName;
		for (var i = 0; i < configuration.replace.length; i++) {
			const entry = configuration.replace[i];

			switch (entry.search) {
				case "$project_name_html$": {
					entry.replace = toKebabCase(projectName);
				} break;
				case "$project_name$": {
					entry.replace = projectName;
				} break;
				case "$source_name$": {
					entry.replace = projectName;
				} break;
				case "$button_pressed_event$": {
					entry.replace = `${projectName}ButtonPressed`;
				} break;
				case "$dev_port$":
				case "$prod_port$":
				case "$source_id$":
				case "$button_pressed_id$": {
					entry.replace = (+entry.replace + 1).toString();
				} break;
				default: {
					console.error(`Unkown entry ${entry.search}`);
					process.exit(-1);
				}
			}
		}
	}

	// writing configuration to file and let user check and confirm before proceeding
	{
		console.log(configuration);
		writeFileSync(newInstallFilePath, JSON.stringify(configuration, null, 4));

		answer = await askAsync(`Check ${newInstallFileName}. To proceed type: y, otherwise cancel:`);

		if (answer[0].toLowerCase() != 'y') {
			console.log("Deleting configuraiton and exiting..");
			unlinkSync(newInstallFilePath);
			process.exit(-1);
		}
	}

	// copying new folder
	{
		if (existsSync(`../${configuration.projectName}`)) {
			console.error(`Project ${configuration.projectName} already exists.`);
			process.exit(-1);
		}

		await copyFoldersAsync("../template", `../${configuration.projectName}`);
	}

	// going through files and replacing
	{
		const newProjectFiles = getFilesFromPath(`../${configuration.projectName}`);

		if (newProjectFiles.length == 0) {
			console.error("Could not read just copied files");
			process.exit(-1);
		}

		for (let i = 0; i < newProjectFiles.length; i++) {
			let fileBuffer = readFileSync(newProjectFiles[i], 'utf-8');

			for (let c = 0; c < configuration.replace.length; c++) {
				fileBuffer = replaceAll(fileBuffer, configuration.replace[c].search, configuration.replace[c].replace);
			}

			writeFileSync(newProjectFiles[i], fileBuffer);
		}
	}

	// renaming files
	{
		const filesToRename = [ "Component.ts", "Module.ts", "View.html", "Service.ts"];
		const pathToFiles = `../${configuration.projectName}/src/app/`;

		for (let i = 0; i < filesToRename.length; ++i)
			renameSync(pathToFiles + filesToRename[i], pathToFiles + `${configuration.projectName}${filesToRename[i]}`);
	}

	// adding to MicroFrontendParts
	{
		const pathToMicroFrontendParts = "../shared/libs/projects/event-proxy-lib/src/lib/DTOs/MicroFrontendParts.ts";
		const templateString =
`	public static $project_name$: MicroFrontendInfo = {
		SourceId: '$source_id$',
		SourceName: '$project_name$'
	};

`;
		let fileBuffer = readFileSync(pathToMicroFrontendParts, 'utf-8');

		// this check probably should happen before everything else
		if (fileBuffer.includes(configuration.projectName)) {
			console.error(`${configuration.projectName} already exists in MicroFrontendParts`);
			process.exit(-1);
		}

		for (let c = 0; c < configuration.replace.length; c++)
			fileBuffer = replaceAll(fileBuffer, configuration.replace[c].search, configuration.replace[c].replace);

		let postion = fileBuffer.indexOf("  /** PLACEHOLDER USED BY INSTALLER */");

		fileBuffer = fileBuffer.slice(0, postion) + templateString + fileBuffer.slice(postion);

		writeFileSync(pathToMicroFrontendParts, fileBuffer);
	}

	// adding to Eventids
	{
		const pathToMicroEventIds = "../shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds.ts";
		let pressed_id = 0;

		for (let i = 0; i < configuration.replace.length; i++) {
			if (configuration.replace[i].search == "$button_pressed_id$")
				pressed_id = +configuration.replace[i].replace;
		}

		if (pressed_id == 0) {
			console.error(`Could not find $button_pressed_id$ in ${newInstallFileName}`);
			process.exit(-1);
		}


		const templateString =`	${configuration.projectName}ButtonPressed = ${pressed_id},\n`;

		let fileBuffer = readFileSync(pathToMicroEventIds, 'utf-8');

		// this check should happen before everything
		if (fileBuffer.includes(pressed_id.toString())) {
			console.error(`Such EventId already exists. Please edit id in ${newInstallFileName}.`);
			process.exit(-1);
		}

		let postion = fileBuffer.indexOf("  /** PLACEHOLDER USED BY INSTALLER */");

		fileBuffer = fileBuffer.slice(0, postion) + templateString + fileBuffer.slice(postion);
		writeFileSync(pathToMicroEventIds, fileBuffer);
	}

	// updating existing config to maintain unique ids
	{
		console.log("Updating current install config file");
		writeFileSync(installPath, JSON.stringify(configuration, null, 4));
	}

	process.exit(0);

})();

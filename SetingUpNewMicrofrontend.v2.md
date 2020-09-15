> (assuming angular)
## References
Some files will have place holders which will be referenced in installation guide  
Swap with same values everywhere, if you use mainFrontend for project name replace it everywhere you see `<project_name>`  
`<project_name>` - (example: MainMenu) name of the project, preferably should match project folder name  
`<prod_port>` - (example: 8088) micro frontend production port, must be unique on machine and between other micro frontends  
`<dev_port>` - (example: 3008) micro frontend development port, must be unique on machine and between other micro frontends 
`<source_id>` - (example: 1009) unique micro frontend's source id in environment (backend too)
`<source_name>` - (example: MainMenuMicroFrontend) name for micro frontend, used as information only
`<button_pressed_id>` - (example: 1009) and id which will be used to trigger micro frontend to load from menu

## Copy template
1. Copy `template` and rename to any name, this will be your `<project_name>`
2. In the following files change placeholders:
    1. `<project_name>/package.json`
    2. `<project_name>/extra-webpack.config`
    3. `<project_name>/angular.json`
    4. copy `<project_name>/src/scripts/conf.template.js` to  `<project_name>/src/scripts/conf.js` and then modify
    5. copy `<project_name>/src/scripts/conf.template.js` to  `<project_name>/src/scripts/conf.prod.js` and then modify
    6. rename file accordingly `<project_name>/src/app/services/TemplateService.ts` and modify
    7. rename file accordingly `<project_name>/src/app/services/TemplateFactory.ts` and modify
    8. rename file accordingly `<project_name>/src/app/app.module.ts` and modify

## Shared
1. Add microservice id and source name to
`~/shared/models/UParts.ts` [SCRIPT]
2. Add button activation ID to `~/shared/events/event.ts` like `<YourMicrofrontendName>ButtonPressed = <uniqueID>`
3. In `~/shared/events/helpers/ButtonsIds` add your button event `<YouMicrofrontend>ButtonPressed = uEventsIds.<YourMicrofrontendName>ButtonPressed`

## Shell
1. Adding configuration file with resources which shell will load upon micro frontend was requested to load.
In files:<br>
`~\shell\src\environments\environments.ts`, `~\shell\src\environments\environments.prod.ts`, add URL to `microfrontendConfigPathList` array 
[JSON]
---

9. For every microfrontend to work on their own we have to prepare environemnt variables (apigateway, url):
    1. `~/<YourMicrofrontend>/src/environemnts/environment.ts` - we configure variables
    2. `~/<YourMicrofrontend>/src/main.ts` - we initialize them
    3. Check other projects for reference

## Menu
1. In `~/menu-uf/src/app/app.component.html` add tab link and specify number which was used in `~/shared/models/UParts.ts` and create div with a place for micro frotnend with unique id
2. In `~/menu-uf/src/app/app.component.html` in `preparePlacements()` add new entry and use ID which you defined in `~/shared/models/events.ts` in `uEventsIds` and use same `elementId` as was defined in `~/menu-uf/src/app/app.component.html`

## LAUNCHER
1. Add your microservice to launcher accordingly

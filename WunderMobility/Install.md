> (assuming angular)
## References
Files will have place holders. Each place holder must be replaced.
Swap with same values everywhere, if you use `mainFrontend` for project name replace it everywhere you see `WunderMobility`  
`WunderMobility` - (example: MainMenu) name of the project, preferably should match project folder name  
`8009` - (example: 8088) micro frontend production port, must be unique on machine and between other micro frontends  
`7009` - (example: 3008) micro frontend development port, must be unique on machine and between other micro frontends 
`1009` - (example: 1009) unique micro frontend's source id in environment (backend too)
`WunderMobility` - (example: MainMenuMicroFrontend) name for micro frontend, used as information only
`1009` - (example: 1009) and id which will be used to trigger micro frontend to load from menu

## Copy template
1. Copy `template` and rename to any name, this will be your `WunderMobility`
2. In the following files change placeholders:
    1. `WunderMobility/package.json`
    2. `WunderMobility/extra-webpack.config`
    3. `WunderMobility/angular.json`
    4. copy `WunderMobility/src/scripts/conf.template.js` to  `WunderMobility/src/scripts/conf.js` and then modify
    5. copy `WunderMobility/src/scripts/conf.template.js` to  `WunderMobility/src/scripts/conf.prod.js` and then modify
    6. rename file accordingly `WunderMobility/src/app/services/TemplateService.ts` and modify
    7. rename file accordingly `WunderMobility/src/app/services/TemplateFactory.ts` and modify
    8. `WunderMobility/src/app/app.module.ts`
    9. in `~/.vscode/launch.json` add debug and unit test debugging entries accordingly
3. Connecting micro frontend to project
    1. `~/shared/models/UParts.ts` add new `MicroFrontendInfo` entry by copying template example and making sure SourceId is unique
    2. `~/shared/models/event.ts` add button event id which will be used in menu to indicate for it to load
    3. `~/shell/src/environments/environments.ts` add url to microfrontend's `conf.js` path (same with `environments.prod.ts`) to `microfrontendConfigPathList` array
    4. `~/menu-uf/src/app/app.component.html` add button by copying `Template Tablink` and `tabcontent` and modify placeholders
    5. `~/menu-uf/src/app/app.component.ts` in `preparePlacements()` copy template and modify placeholders
    6. `~/launcher/package.json` add launching commands accordingly

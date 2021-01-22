> (assuming angular)
## Linting
1. In VScode extensions remove Tslint and install Eslint (exact extension name: dbaeumer.vscode-eslint)
2. In a project root remove `tslint.json`
3. copy `.eslintrc.js` from `~/shared/.eslintrc.js`
4. Install eslint
> `npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-jsdoc`
5. (Optional) uninstall tslint, tslint-sonarts: 
> `npm un tslint tslint-sonarts`

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
## New Microfrontend
1. `.browserslistrc` (ng10) `.browserslist` (ng9) change to support only chrome so we don't have many polyfills.
2. In `package.json` set up launching commands
```json
    "ng_build_prod": "ng build --prod --outputHashing=none --output-path prod/",
    "ng_serve_prod": "serve -C -l tcp://0.0.0.0:8009 prod/",
    "ng_start_prod": "npm run ng_build_prod && npm run npm_serve_prod",

    "ng_build_dev": "ng build --commonChunk=false --outputHashing=none --vendorChunk=false",
    "ng_serve_dev": "serve -l tcp://0.0.0.0:7009 dist/<projectName>",
    "ng_watch": "ng build --commonChunk=false --outputHashing=none --vendorChunk=false --watch",
    "ng_con": "concurrently --kill-others -n \"ANGULAR,SERVER\" \"npm run ng_watch\"  \"npm run ng_serve_dev\" "
```
3. Ports should be decided in some root config
[JSON] 
4. Adding custom webpack launcher:
    1. Install package: 
    > `npm i @angular-builders/custom-webpack`
    2. Copy `extra-webpack.config` from `~/shared/` and change name in `extra-webpack.config` to something unique [SCRIPT]
    3. Add it to `angular.json` under `architect/build` add option like this:
    ```json
        "builder": "@angular-builders/custom-webpack:browser",
          "options": {
            "customWebpackConfig": { "path": "./extra-webpack.config.js",
            "mergeStrategies": { "externals": "replace" } },
    ```
5. Adding configuration files so that shell knows which resources to load upon request.
    1. Copy twice `conf.template.js` from `~/shared/` and change to `<yourproject>/src/scripts/conf.js` for development and `<yourproject>/src/scripts/conf.js` for production
    2. File contains information: 
        * which source id it should use for in global environement (DOM) to occupy;
        * where are resources located
        * which event it should react to
    3. Add them to your projects `angular.json` so they will be coppied to build:
        * under `architect/build/options/assets` add `src/scripts` so it looks something like: 
            ```json
            "assets": [
                "src/favicon.ico",
                "src/assets",
                "src/scripts"
                ],
            ```
        * under `.../architect/build/configuration/production` add new entry to `fireReplacements` like so:
            ```json
            {
                "replace": "src/scripts/conf.js",
                "with": "src/scripts/conf.prod.js"
            }
            ```
    4. Change accordingly so that it matches `~/shared/models/UParts.ts` and `uEventsIds` in `~/shared/models/event.ts`
6. Add `/prod` to `.git-ignore` to ignore production build in source control
7. Preparing `event-proxy-lib` for communication with backend
    1. > `npm i event-proxy-lib`
    2. Create service for microfrontend (example: `~/<YourMicrofrontend>/src/app/services/<YourMicrofrontend>Service.ts`) use example from `~/occupation-uf/src/app/services/Occupation.service.ts`
    3. Configure it accordingly
    4. Prepare factory like: `~/<YourMicrofrontend>/src/app/services/<YourMicrofrontend>Factory.ts` use example from `~/occupation-uf/src/app/services/Occupation.factory.ts`
8. Install `createCustomElement` 
    1. > `npm i @angular/elements`
    2. Update `~/<YourMicrofrontend>/src/app/app.module.ts` like `~/occupation-uf/src/app/app.module.ts`
    3. Don't forget to set up unique id in `customElements.define` and add `APP_INITIALIZER` facotry to `providers` in `app.module.ts`
9. For every microfrontend to work on their own we have to prepare environemnt variables (apigateway, url):
    1. `~/<YourMicrofrontend>/src/environemnts/environment.ts` - we configure variables
    2. `~/<YourMicrofrontend>/src/main.ts` - we initialize them
    3. Check other projects for reference

## Menu
1. In `~/menu-uf/src/app/app.component.html` add tab link and specify number which was used in `~/shared/models/UParts.ts` and create div with a place for micro frotnend with unique id
2. In `~/menu-uf/src/app/app.component.html` in `preparePlacements()` add new entry and use ID which you defined in `~/shared/models/events.ts` in `uEventsIds` and use same `elementId` as was defined in `~/menu-uf/src/app/app.component.html`

## LAUNCHER
1. Add your microservice to launcher accordingly

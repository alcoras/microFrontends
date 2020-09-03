To start project:
1. Go to Shared\libs
2. npm install
3. ng build --prod
4. Go to shell, menu-uf
5. npm install
5.1 open cmd
6. menu start npm run ng_con_lang
7. shell start npm run ng_con

Debug settings:
.vscode\launch.json

run tests:
npm run test
npm run test-once (now in personal only)

Installed Visual Studio Code extentions:
Debugger for Chrome
EditorConfig for VS Code
TSLint

Start point is shell microservice app.module.ts (providers is for dependency injection)
Path aliases are in tsconfig.json 
app.module starts UFManagerFactory by :
"provide: APP_INITIALIZER, useFactory: UFManagerFactory, deps: [UFManagerComponent], multi: false"

shell:
tsconfig.json - aliases like @uf-shared* for paths
angular.json assets - list of folders to copy before starting application
extra-webpack.config.js - change the name of module ("webpackJsonpShell") (angular.json- change "builder" to another type to take this into account)
scripts\env.js - save some information to Dom
\observer-uf\src\config\config.ts - conf.js file with configuration to start microservice

Menu
app.module.ts - ngDoBootstrap implement description how to start application
meanwhile without starting it
app.component.ts
java-script implementation of menu logic (not clean for angular application)

https://www.w3schools.com/jsref/dom_obj_event.asp - html Dom events

Install package and not change package-lock.json
npm ci - continuous integration - doesn't change package-lock.json and package.json
https://docs.npmjs.com/cli/ci

Enable linting
1. In VScode extensions remove Tslint and install Eslint (exact extension name: dbaeumer.vscode-eslint)
2. In a project root remove tslint.json
3. copy .eslintrc.js
4. run: npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-jsdoc
5. uninstall tslint, tslint-sonarts: npm un tslint tslint-sonarts

File with supported browsers:
.browserslistrc

Package.json- add missed scripts
npm run SCRIPT_NAME

shared\models\uparts - set microservice Id and source name

Copy extra-webpack.config - compiled Angular name to avoid conflicts

Change in angular.json architect/build/builder and options to react to extra-webpack.config
npm i @angular-builders/custom-webpack
Now can check if angular builds

Tell Shell when to activate our microfrontend- 
Scripts\conf.template.js- template
conf.js- development
conf.prod.js- production
Add eventId to activate - shared\events\event.ts

Angular.json
Change architect-build-options-assets - add "src/scripts to run"
Change  */outputpath - remove projectname to simplify linking
Configuration-production- change to use different scripts for production
  {
                  "replace": "src/scripts/conf.js",
                  "with": "src/scripts/conf.prod.js"
                }

Add prod to git-ignore - production build

Shell\src\environments- array to run scripts - tell Shell how to run microservice

Add to menu microservice - with event id to activate this frontene microservice - app.component.html
add tab to menu
app.component.ts - preparePlacements() function- correspondense between tab and id

Additional microservice to start other microservices- Launcher - change package.json

Shared-events-EventButtonPressed.ts
enum ButtonIds- add event id to accept

Connect to backend api
- connect libraries in tsconfig.base.json - "paths" attribute
- create services folder
- app.module.ts- connect initialize module using provide:APP_INITIALIZER (it blocks async running to avoid
situation when listening happening before subscriptions are completed)

The application when selected in menu microservice holds all page space to avoid this:
- install @angular/elements
- update app.module.ts- AppModule and @NgModule

For every microfrontend to work on their own we have to prepare environemnt variables (apigateway url):
(assuming angular)
1. <microfrotnendPath>/src/environemnts/environment.ts - we configure variables
2. <microfrotnendPath>/src/main.ts - we initialize them

Users accounts for testing purposes (pw borland2007):

rubber orient excuse once enjoy device sudden scatter cup sugar piece style
pond piece young maple clip spoil deposit human retreat zero elephant method
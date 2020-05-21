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
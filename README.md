# MicroFrontends

# Install and launch

## Libs (every micro frontend will use it):
### Install:
    cd shared
    npm i
    cd shared\lib
    npm i
### Build:  
    cd shared\lib\projects\event-proxy-lib
    ng build --prod

in ng 9.1.* should be fixed without --prod, has to do with ivy (next time pass url to the issue)

## Shell (Entry point for frontends)
### Install:
    cd shell
    npm i
### Launch:
    npm run ng_con

## Menu (First microfrontend)
### Install:
    cd menu-uf
    npm i
### Launch:
    npm run ng_con_lang

## Personnel-UF
### Install:
    cd personnel-uf
    npm i
### Launch:
    npm run ng_con
### Debugging tests:
    cd personnel-uf
    ng test
    In Vscode Debug Extension select: personnel unit tests, Run it (F5)
    Put breakpoint in unit test, Restart (ctrl+shift+F5)

Run backends:
1. language, fake data `cd backend-occup && npm run data`  
2. ~~Event/Api gateway mock `cd backend-mock && npm run dev:start`~~

Adding eslint

1. In VScode extensions remove Tslint and install Eslint (exact extension name: dbaeumer.vscode-eslint)
2. In a project root remove tslint.json
3. copy .eslintrc.js
4. run: npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-jsdoc
5. uninstall tslint, tslint-sonarts: npm un tslint tslint-sonarts


Environment Table
            I    Database       I  Backend      I   Login
Production  |   Real            |   Real        |  Real
Staging     |   Stage[1]        |   Stage       |  Stage
Development |   Local           |   Local       |  Local
Isolated    |   Local           |   Local       |  None[3]
Solo        |   Mock Data[2]    |   None[2]     |  None[3]

1. As close to real as possbile, maybe even copy with snapshots done constantly, to recover after tests or failures
2. Solo is intended to check for visual feel only, thus microfrontend should be self sustained (no connections)
3. S
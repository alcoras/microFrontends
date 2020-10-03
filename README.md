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
2. In a project root remove `tslint.json`
3. copy `.eslintrc.js`
4. run: `npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-jsdoc`
5. uninstall tslint, tslint-sonarts: `npm un tslint tslint-sonarts`

### Frontend handling events  
There are Instant events and Delayed Events. 
    - Instant events (t <= 5 seconds) which are used frequently, like getting data for table. We confirm instant events and let them into EventBus.
    - Delayed events (t >= 5 seconds) which are used rarely, like long calculations. User confirms them.

### Environment Table
| Environment |    Database-Backend   |   Login   |  Shell  | Nginx |
| ----------- | --------------------- | --------- | ------- | ----- |
| Production  |   Real                |  Real     |   Yes   |  Yes  |
| Staging     |   Stage[1]            |  Stage    |   Yes   |  Yes  |
| Development |   Local               |  Local    |   Yes   |  Yes  |
| Isolated    |   Local               |  None     |   No    |  No   |
| Solo        |   Mock[2]             |  None     |   No    |  No   |

> 1. As close to real as possbile, maybe even a copy with snapshots done periodically, to recover after tests or failures
> 2. Solo is intended to check for visual feel only, thus microfrontend should be self sustained (no connections) and instead of calling to real backend should use mocks which might as well be used by tests.
### Production      
The bussiness environment
### Staging (not implemented)
Environment for regression tests after unit and integration tests are done; this environment should be set up just as production one:
publically available for clients and our testing team to do regression tests
### Development
Same as production but set up locally for developing new features
### Isolated
Used for testing microfrontend alone but with connection to development backend/database
### Solo
Used for writing initial view which does not require anything else in the environment. In order for it to work, mock services should conditionally injected.

### Developing regime
1. `cd launcher` and run `npm run watch` (assuming micro frontends were installed), which will start watch on: MaterialReceipts, Occupation, Personnel and Shell micro frontends.
2. `cd ReverseProxy` and run `./nginx.exe` then control from other console using `./nginx.exe -s stop` or `./nginx.exe -s reload`

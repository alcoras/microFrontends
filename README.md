# MicroFrontends

Adding eslint

1. In VScode extensions remove Tslint and install Eslint (exact extension name: dbaeumer.vscode-eslint)
2. In a project root remove `tslint.json`
3. copy `.eslintrc.js`
4. run: `npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-jsdoc`
5. uninstall tslint, tslint-sonarts: `npm un tslint tslint-sonarts`

## Frontend handling events  
There are Instant events and Delayed Events:
- Instant events (t <= 5 seconds) which are used frequently, like getting data for table. We confirm instant events and let them into EventBus.
- Delayed events (t >= 5 seconds) which are used rarely, like long calculations. User confirms them.

## Environment Table
| Environment |    Database-Backend   |   Login   |  Shell  | Nginx |
| ----------- | --------------------- | --------- | ------- | ----- |
| Production  |   Real                |  Real     |   Yes   |  Yes  |
| Staging     |   Stage[1]            |  Stage    |   Yes   |  Yes  |
| Development |   Local               |  Local    |   Yes   |  Yes  |
| Isolated    |   Local               |  None     |   No    |  No   |
| Solo        |   Mock[2]             |  None     |   No    |  No   |

1. As close to real as possbile, maybe even a copy with snapshots done periodically, to recover after tests or failures
2. Solo is intended to check for visual feel only, thus microfrontend should be self sustained (no connections) and instead of calling to real backend should use mocks which might as well be used by tests.
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

## Development setup (all micro frontends):
1. `cd launcher` and run `npm run watch` (assuming micro frontends were installed), which will start watch on: MaterialReceipts, Occupation, Personnel and Shell micro frontends.
2. `cd ReverseProxy` and run `./nginx.exe` then control from other console using `./nginx.exe -s stop` or `./nginx.exe -s reload`

## Development setup (one micro frotnend):
1. `cd <desired project>` 
2. `npm i` skip if you have already installed everything
3. `ng serve` or `npm run start` if you don't have global angular

## Adding new micro frontend
1. `cd installer`
2. `npm ci` to install same dependecy tree, without modifying anything
3. `npm run build` will build
4. `npm run start` will start script, follow instructions
5. currently shell and menu integration is not implemented

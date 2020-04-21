# MicroFrontends

# Install and launch

## Libs (every micro frontend will use it):
### Install:
    cd shared
    npm i
### Build:  
    cd shared\
    ng build --prod

in ng 9.1.* should be fixed without --prod, has to do with ivy (next time pass url to the issue)

## Personnel-UF
### Install:
    cd personnel-uf
    npm i
### Launch:
    npm run ng_con

Run backends:
1. language, fake data `cd backend-occup && npm run data`
2. Event/Api gateway mock `cd backend-mock && npm run dev:start`

# EventProxyLib

Library for communication with ApiGateway in Microservice system ForestPath.

Source code: https://github.com/alcoras/microFrontends

# Build
In `~/shared/libs/projects/event-proxy-lib/` run `ng build --prod`

# Tets
In `~/shared/libs/projects/event-proxy-lib/` run `npm run test-once` to run tests once or `ng test` to work with them

# Changelog
#### version 2. 1. 1
  - fixed bug with not rejecting if timing out
  - removed all untyped variables
#### version 2. 1. 0
  - moved all models to event-proxy-lib, not sure it's a good idea, but having another project to share them seemed like an even worse idea
#### Version 2. 0. 4
  - removed InitializeConnectionToBackend auto function to reduce complexity
  - StartQNA is renamed to InitializeConnectionToBackend
#### Version 2. 0. 3
  - publishing corret folder.. /dist not /src
#### Version 2. 0. 2
  - adding all models which are used to communicate with backend
#### Version 2. 0. 1
  - small fixes
#### Version 2. 0. 0
  - splitting and renaming `uEvent` and `uEventIds` in `events.ts` to `CoreEvent` and `EventIds`

# Tasks

## DROP
34. DROP e2eTests actually are integration? tests, currently there are no e2e tests

## DONE
6. DONE Update everything to ng9  
	6. 1. DONE shell
	6. 2. DONE uf Menu
	6. 3. DONE uf Occupations
	6. 4. DONE uf Personnel
	6. 5. DONE Test them all together
	6. 6. DONE Does not load second item right after (could be unique id) fix 9. then come back
	6. 7. DONE (something happend in connections, backend sent event, but client did not receive it, redone so that confirmEvents will remove them) Refresh behaves incorrectly (not always launches menu), check all syncs(asyncs)
4. DONE Menu load (in shell)
9. DONE Backend-mock fix unique_id requirment
7. DONE Themes
	7. 1. Transfer theme selector to uf Menu
	7. 2. Setup global themes which derived from uf Menu
10. DONE Menu change tabs to material 
16. DONE When swapping tabs it reloads
18. DONE Change all models to check for proper event id
16. DONE Communicaiton between script loader and ufm should be done over external events? Update: refactored so that ufm takes full control
11. DONE Change occupation to occupation-uf
23. DONE Write tests for libs (multi-event receivers, multi-event confirming)
29. DONE Refactor EnvService 
31. DONE bug: language is not loading properly (It was EnvService's bug, task 29)
19. DUPLICATE 26. 5 Write tests for uf-manager
8. DONE: Do angular element show uf (show every angular-material element)
	8. 1. Update: Won't do, there are better things to show off in demo, as elements can be seen in material website itself
27. DUPLICATE 32. In DispatchEventAsync.toPromise() add checks for failure and throws
35. DONE Consider adding (example personnel-uf/**/PersonnelAPI.service) event subscription-to-id to library
	35. 1. UPDATE: For demo should not be done
38. DONE: shared\events\backend\CreateUpdateEnterpisePersonData.ts convert to classes
44. DUPLICATE 40. migrate to eslint
43. DONE: personnel-tests: write checks for page and pagesize
40. DONE Make migration from tslint to eslint because: https://www.npmjs.com/package/tslint
	40. 1. DONE personnel-uf
	40. 2. DONE shell
	40. 3. DONE menu-uf
	40. 4. DONE e2eTests
	40. 5. DONE observer-uf
	40. 6. DONE occupation-uf
	40. 7. DONE shared
26. DONE Transfer e2e tests to e2e and write unit/static tests; 
	26. 1. UPDATE: all e2e tests should go to e2eTests
	26. 2. DONE personnel-uf
	26. 3. DONE menu-uf
	26. 4. DONE occupation-uf
	26. 5. DONE uf-manager
	26. 6. DONE event-proxy-lib
45. DONE remove abbreviations in names of functions/methods/classes/params and fix linting 
	45. 1. DONE personnel-uf
	45. 2. DONE shell
	45. 3. DONE menu-uf
	45. 4. DONE e2eTests
	45. 5. DONE observer-uf
	45. 6. DONE occupation-uf
	45. 7. DONE shared
46. Configure unit test debugging
	46. 1. DONE personnel-uf
	46. 2. DONE shell
	46. 3. DONE menu-uf
	46. 4. DONE e2eTests
	46. 5. DONE observer-uf
	46. 6. DONE occupation-uf
	46. 7. DONE shared->event-proxy-lib
42. DONE occupations: transfer logic from module to component/service
39. DONE Consider adding interfaces for microfrontends (sourceId sourceName and so on)
24. DONE Debugging in tests
	24. 1. Update: Debugging in browser works, but after hours of trying various ways to debug directly in vscode I leave it for the next time
54. DONE Make LoginAsync in shell to be parameterized
55. DONE AuthenticationService should use selected address not address[0]
21. DONE Events still disappearing? YES?
	21. 1. ~~Update: Could be because event confimation is happening by default when it should only confirm it was parsed successfully?~~
	21. 2. Update: StartQNA on arrival of new http response should launch async task to parse it
	21. 3. UPDATE SOLVED: Events are dissapearing because upon refreshing we are not terminating connection with backend 
57. DONE check tests to avoid subscription collision with
50. DONE Write Library for Microservice (StartQNA, NewHttpResponseAsync)
51. DONE parse 2024
52. DONE change StartQNA to StartListeningBackend
54. DONE Make all uS run in parallel
20. DONE When loosing connection with backend there is no error or warning..
	20. 1. DONE Expected behaviour: should try reconnect every T period
49. DONE add reverse proxy to solve CORS and having many ports
36. DONE add concurrently and serve to projects
58. DONE: in environment.ts add variables (like URL and APIGATEWAYURL)
	58. 1. UPDATE: because of task 49. URL's are obsolete
60. DONE for some reason some files (polyfills.js most of the times) takes 2 seconds when using nginx as reverse proxy
	61. 1. UPDATE: solution 64.
32. DUPLICATE with 12 find every promise or observable and handle errors
30. DONE Fix warnings in event-proxy-lib when: ng build --prod:
	30. 1. Bundling to FESM2015 WARNING: 'HttpResponse' is imported from external module '@angular/common/http' but never used
	31. 2. UPDATE: HttpResponse is used, but compiler does not see it
1. IGNORE Languages
	1. 1. DONE Do a select for language selector in uf Menu
	1. 2. DONE(through window) Make a way to refresh (through navigation)
	1. 3. DONE (reads from env.js) Setup configs (conf.js) for languages which are supported (EN, RU, UA, LT)
	1. 4. DONE Make backend setup for language 
	1. 5. DONE In uf-manager (shell) load language configs
	1. 6. DONE (only in menu) Create locales in projects
	1. 7. Translate other micro frontends
	Why IGNORE? I don't like how angular does translations, it builds new project for each language, for now translate pipe should suffice
12. IGNORE Think about adding all observables into one for logging, debugging, visualising purposes
	Why IGNORE? currently all failures just throw to detect issues faster, with time reaction to faulure will be set up in accord to situation
15. DONE Consider requiring sourceId for all events
	15. 1. Seems like a good idea, thus go through all backend events and add sourceId
61. DONE add info to event-proxy-lib, like what it is, more info, how to run tests
65. DONE add solo mocks to template like in MaterialReceipts
62. DONE business events and core events (in shared/models shared/events) should be separated
	65. 1. UPDATE: should be done only with new projects
67. DONE in uEvents change UserID and ParentID to UserId and ParentId, event-proxy-lib needs to change aswell
68. DONE change Get*** names, because Get implies actions (MaterialsReceipts/src/app/interfaces/)
53. DONE UF should run fine isolated, in dev, in prod.
	53. 1. UPDATE: add solo and isolated to environment.ts and work using them
	53. 2. Change all micro frontends accodingly
	53. 3. Add only to new projects
17. DONE In libs and tests I cant directly add models from external folders
	17. 1. DONE Update: remove folder shared in libs and add links to external shared files
	17. 2. Update: still can't build wihthout local files, but tests can reference them..
	17. 3. Try with https://wallabyjs.com/docs/integration/angular.html adding files or include to tsconfig
	17. 4. UPDATE: I've decided to add all models which are shared (like event ids) to event-proxy-lib
71. DONE remove all subscriptions in all micro frontends
72. DONE in every micro frontend unsub after getting desired event
75. DONE Consider renaming all app.*.* so it's easier to jump around files
76. DONE Restructure all projects so they feel-look like backend
66. DONE fix ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'undefined'. Current value: 'true'. in MaterialsReceiptsTableComponent view component
	66. 1. Update: in constructor Loading should set to true
73. DONE remove ParentSourceEventUniqueId everywhere
77. DONE template installer:
	77. 1. DONE Services: TemplateFactory, TemplateService should be renamed
	77. 2. DONE Change root structure's file names (app.module.ts ...)
	77. 3. DONE Add *Service to root NgModule
	77. 4. DONE In TemplateService fix EventBusService
	77. 5. DONE MicroFrontendParts Template copying in MicroFrontendParts, MicroFrontendParts.* in *Service
	77. 6. DONE EventIds.$ProjectNameButtonPressed$
	77. 7. DONE Comment out EventIds.<TemplateRead> because it's just an example
	77. 8. DONE preparePlacements() should have project name in lower case, same when registering custom element
	77. 9. DONE In order to automatically add it as micro frontend I need to provide unique ID
85. DONE StateMachine: 
	85. 1. DONE it probably should be separated from component
	85. 2. DONE handling more than one state machine on same component; we would just add another action
	85. 3. UPDATE: should state machine be self-sufficient (component + view)? Action should be as self sufficient as possible
	85. 4. UPDATE: how do I inject? As of now angular will, but it probably should be injected/provided the way everything is provided in that system
84. DONE Write a guide on how to use template installer
	84. 1. UPDATE: write questionaire to create json file
92. DONE rename ActionScanTable to just ScanTable

## NOT DEMO
22. Do conditional logging.
41. Consider adding metric/performace/stress tests

## UNDONE
13. Set to load all icons from disk
14. Make sure that shell can load any combination of ufs (does not fail if one failed)
25. Check for type: any and convert to strong type (search and apply to all projects)
28. Add SourceName to every event for Observer
33. add config builder to all micro services like in observer-uf (tsconfig.conf-builder.json)
	33. 1. !!!!! optimize output, so it extracts static values without including whole class
	33. 2. UPDATE: test if production mode does anything
37. if microfrontend fails to putToElement because some event was not parsed it throws and blocks workflow: try with try..catch
47. write unit/static tests micro frontend prelaunch services
48. write integration tests for Authentication Service
56. on refreshing/closing tab disconnect every micro frontend
59. if backend does not work show some message in shell or show trying to connect
63. consider adding loading indication (console or otherwise when event-proxy-lib is retrying)
64. nginx will be the server, so remove serve in all micro frontends
69. clean up package.json scripts in projects (remove serve and serve scripts)
70. write unit/static tests for MaterialsReceipts
74. currently if something fails, we either throw (where we care for it to work) or we don't return message to user; think how to universally handle messages to user about strong fails (cant work further) and safe fails (entry creation failed, deletion failed);
78. add radio/checkbox for untraced events
79. when `ng test` runs on OccupationAPI.spec (occupation-uf) console errors appear, because it tries to read event but I do not provide one, because I would need access to event bus, which I don't know how to provide (same in service as in test)
80. in event-proxy-lib I have non dtos objects in DTOs folder, confusing
81. INSTALLER:
	81. 1. Add to shell
	81. 2. Add to menu
	81. 3. DONE add to readme how to add new micro frontend
82. In all events add source info
83. MaterialsReceiptsAPI.ts CreateDraft should placed somewhere globally
86. think about languages (static vs dynamic)
	86. 1. UPDATE make dynamic loading, one language loads another unloads
87. add tooltips and start adding them
88. remove all sub .eslintrc.js and make sure root one is being read
89. fix all linting
90. force comments for all functions
91. bug: when in MaterialReceipts language is changed tabs do not reflect it
93. change Subscription[] to Subscription
94. only angular related, but consider changing change detection to Push.
95. think of place to put waitForResultsd function (currently in shell and material receipts)
96. update parseNewEventsAsync in UFManagerService.ts
97. add delay function somewhere globally
98. MAIN in shell I need to load qr login component and then unload it after login is done
99. microfrontends should overtake environment variables from shell (looks like menu does load it, materialreceipts does not)

100.

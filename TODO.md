# Tasks

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
23. DONE Write tests for libs (multi-event recieviers, multi-event confirming)
29. DONE Refactor EnvService 
31. DONE bug: language is not loading properly (It was EnvService's bug, task 29)
19. DUPLICATE 26. 5 Write tests for uf-manager

## UNDONE
1. Languages
    1. 1. DONE Do a select for language selector in uf Menu
    1. 2. DONE(through window) Make a way to refresh (through navigation)
    1. 3. DONE (reads from env.js) Setup configs (conf.js) for languages which are supported (EN, RU, UA, LT)
    1. 4. DONE Make backend setup for language 
    1. 5. DONE In uf-manager (shell) load language configs
    1. 6. DONE (only in menu) Create locales in projects
    1. 7. Translate other micro frontends
8. Do angular element show uf (show every angular-material element)12. Think about adding all observables into one for logging, debugging, visualising purposes
13. Set to load all icons from disk
14. Make sure that shell can load any combination of ufs (does not fail if one failed)
15. Consider requiring sourceId for all events
17. In libs and tests I cant directly add models from externals folders
    17. 1. DONE Update: remove folder shared in libs and add links to external shared files
    17. 2. Update: still can't build wihthout local files, but tests can reference them..
    17. 3. Try with https://wallabyjs.com/docs/integration/angular.html adding files or include to tsconfig
20. When loosing connection with backend there is no error or warning..
21. Events still disappearing? YES?
    21. 1. ~~Update: Could be because event confimation is happening by default when it should only confirm it was parsed successfully?~~
    21. 2. Update: StartQNA on arrival of new http response should launch async task to parse it
22. Do conditional logging.
24. Debugging in tests
    24. 1. Update: Debugging in browser works, but after hours of trying various ways to debug directly in vscode I leave it for the next time
25. Check for type: any and convert to strong type
26. Transfer e2e tests to e2e and write unit/static tests; 
    26. 1. UPDATE: all e2e tests should go to e2eTests
    26. 2. DONE personnel-uf
    26. 3. menu-uf
    26. 4. occupation-uf
    26. 5. uf-manager
    26. 6. DONE event-proxy-lib
27. In DispatchEvent.toPromise() add checks for failure and throws
28. Add SourceName to every event for Observer
30. Fix errors in event-proxy-lib when: ng build --prod:
    30. 1. Bundling to FESM2015 WARNING: 'HttpResponse' is imported from external module '@angular/common/http' but never used
32. find every promise or observable and handle errors
33. add config builder to all micro services like in observer-uf (tsconfig.conf-builder.json)
34. e2eTests actually are integration? tests, currently there are no e2e tests
35. Consider adding (example personnel-uf/**/PersonnelAPI.service) event subscribtion to id to library
36. add concurrently and serve to projects

37.
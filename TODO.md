## Tasks

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

1. Languages
    1. 1. DONE Do a select for language selector in uf Menu
    1. 2. DONE(through window) Make a way to refresh (through navigation)
    1. 3. DONE (reads from env.js) Setup configs (conf.js) for languages which are supported (EN, RU, UA, LT)
    1. 4. DONE Make backend setup for language 
    1. 5. DONE In uf-manager (shell) load language configs
    1. 6. DONE (only in menu) Create locales in projects
    1. 7. Translate other micro frontends
8. Do angular element show uf (show every angular-material element)
12. Think about adding all observables into one for logging, debugging, visualising purposes
13. Set to load all icons from disk
14. Make sure that shell can load any combination of ufs (does not fail if one failed)
15. Consider requiring sourceId for all events?
17. In libs and tests I cant directly add models from externals folders
    17. 1. Update: remove folder shared in libs and add links to external shared files
    17. 2. Update: still can't build wihthout local files, but tests can reference them..
19. Write tests for uf-manager
20. When loosing connection with backend there is no error or warning..
21. Events still disappearing? YES?
    21. 1. Update: Could be because event confimation is happening by default when it should only confirm it was parsed successfully?
22. Do conditional logging.
24. Debugging in tests
    24. 1. Update: Debugging in browser works, but after hours of trying various ways to debug directly in vscode I leave it for the next time
25. Check for type: any and convert to strong type

26. Transfer e2e tests to e2e and write unit/static tests; 
    21. 1. UPDATE: all e2e tests should go to e2eTests
    21. 2. DONE personnel-uf
    21. 2. menu-uf
    21. 2. occupation-uf
    21. 2. DONE event-proxy-lib
27. In DispatchEvent.toPromise() add checks for failure and throws

28.
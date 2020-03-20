# Gg

Building Libs:
`cd shared/libs && ng build --prod` in ng 9.1.* should be fixed without --prod, has to with ivy (next time pass url to issue)

Run Shell:
`cd shell && npm run ng_con`

Run Menu:
`cd menu-uf && npm run ng_con_lang` 

Run Personnel:
`cd personnel-uf && npm run ng_con`

Run Occupaitons:
`cd occupation && npm run ng_con`

Run backends:
1. language, fake data `cd backend-occup && npm run data`
2. Event/Api gateway mock `cd backend-mock && npm run dev:start`

# WunderMobility test

<img src="https://github.com/alcoras/microFrontends/blob/master/WunderMobility/frontend.gif">

Commits:
- <a href="https://github.com/alcoras/WunderMobility/commits/master">Backend (all commits related to WunderMobility test)</a>
- <a href="https://github.com/alcoras/microFrontends/commits/master">Frontend (starting from: Commits on Jan 22, 2021)</a>

Links to source code:
- <a href="https://github.com/alcoras/microFrontends/tree/master/WunderMobility">Frontend</a>
- <a href="https://github.com/alcoras/WunderMobility/tree/master/TestWunderMobilityCheckout">Backend</a>
- <a href="https://github.com/alcoras/WunderMobility/tree/master/TestWunderMobilityCheckout.Tests">Backend Tests</a>

Frontend Development process:
1. Installing WunderMobility micro frontend from template (`template` folder) with installer (`installer/src/main.ts` folder).
2. Setting up configuration for backend.
3. Developing API service to work with product creation, deletion and checkout.
4. Adding simple tables for buying imitation and list of products.

Backend:
1. Backend apparently consists of places to hold products and promotional rules and get information from those places.
2. First promotional rules may depend on customer (those who buy more can have more privileges). Second promotional rule depends on product's quantity.
3. That's why two aggregates were implemented – Products and Customers. Aggregates are isolated parts of backend that have outside interface implemented as service and internal structure in database.
5. Aggregate Products implements ProductList entity and holds either information about products and 2-d promotional rule.
6. Aggregate customers implements CustomerList entity and holds information about 1-st promotional rule. For the given example this table has only one row.

How frontend and backend communicates:
1. Frontend connects to API Gateway which acts as a proxy into micro services and keeps a connection (communication is asynchronous).
2. Anuglar Products/Buy components sends requests to API Gateway, which passes them to EventBroker, which through asynchronous messages using Observer pattern relays events (messages) to WunderMobility micro service.
3. WunderMobility micro service processes events (source code: `ProcessEventsWunderMobilityAct.DoEventActionAsync.cs`) and returns results back to frontend through EventBroker->API Gateway.



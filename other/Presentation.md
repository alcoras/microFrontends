Book with good ideas: 
    Erl T. - Service-Oriented Architecture. Analysis and Design for Services and Microservices - 2017
    Page(s): ~60-70

1. Compare return of investment in old approach:
  OLD - x $       | year 1 - y   | year 2 - y*2 | year 3 - y*3
  Micro Service Architecture
  MSA - x + 30% $ | year 1 - y*2 | year 2 - y*5 | year 3 - y*9

Reasons:
    1. Development initial system requires heavy involemnet ant it's suggested that more qualified personnel is used, but after system is in place developing new features should be quite simple, thus allowing for cheaper developers, whom could be hired on demand.
    2. Ability to adopt to market (hire new technology wunderkids, change outdated technology, change Service-as-a-software providers) allows to outmaneuver competitors.
    3. Allows for IT structure (deparments and platforms) to stay in par with company's structure.
    4. Strong loose coupling and service abstraction allows for reusability.
    5. The longer system grows, the more reusable components it will use.

Classical technological Pros:
1. Scaling - because communication is done using messages, microservices can be deployed on servers or serveral of them, and then load can be distributed between them, allowing for vertical and horizontal scaling at the same time.
2. Fault tolerance - because it has moduliarized and communication is message based, one failed unit will not shut down whole system. Properly implemented architecture will notice faulty micro service and will restart it, if that won't help it will shut it down and run older stable version, if that does not help notify administrator with enough information to track down the issue.
3. Continues Delivery - it is a neccesity for microservices to be automated from code commit to deployment into production. It is hard to set up, but it provides benefits like automatic scaling - if microservices can't handle load we can add more servers to network; or, we can set up specific microservices, which are bombarded with communication with client, closer to that client, to reduce network delay.
4. Technological freedom - once again because messages are sent back and forth between microservices, as long as your code can send messages, you can choose any technology stack.
5. Refactoring microservices - microservices, by definition, are small and bounded to some tasks and it's not complex, thus allowing for rewritting a unit if it's not performant or technology has became unsupported, or we just want to use that cutting-edge crypto-kubernetes-machine-learning cloud based software.
6. Independce - for different tasks you want to use different tools, so in a scenario where only care about result, you can let your team to choose the stack and how to implement it. This allows for them to show their expertise and choose most fitting technology.

Organizational and Business Pros:
1. Less chatting (meetings) are required because a team is responsible for microservice: developing, deployment, backend, frontend, databases..
2. Projects are self sufficient - once the development is done, you may release the team and leave only minimal amount of personnel to maintain it, because it's not a large code base, they will be able to aquire profundity of microservice, which allows for your best team to go ahead and develop new products, while less experienced team will maintain and study their work to become the next best team.
3. Talent rotation - it is much more feasible to hire new talent if project needs one; there should be no problem to find new people for project even if, worst case scenario, whole team has won a lottery and decided to go Bahamas leaving company without knowledge about microservice they had developed. Because code base is not huge, new team will be able to figure out on their own how continue developing it, or it maybe cheaper to develop it from the scratch.
4. Legacy systems - as long as it's possible to connect to software, on any level, it's possible to slowly rewrite whole legacy system into new one, bit by bit; or if you like your legacy system you can just add new features which are not supported by your beloved piece of software or may be too expensive to develop it.
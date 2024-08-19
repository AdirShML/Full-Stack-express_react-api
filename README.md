﻿# Full-Stack-express_react-api

this is a full stack Rest API using Express.js at the backend, and React for the frontend.
this api fetch metadata from any given urls - in this case list of urls. 
the api endpoint will fetch the relevant data and return a json response. with react there is also a friendly UI to see the results.

stack: 
   backend:
   * axios -> for sendinf requests to the url's
   * cheerio -> for parsing the HTML content, and for manipulate the data.
   * Expess.js - the main framework that the backend uses to create the endpoint.
   
   frontend:
   * React.js - the whole frontend written with react

this project also take care of rate limiting on the server to handle a maximum of 5 requests per second, the application is secure against common web vulnerabilities,
and also included some test cases(both front/back).

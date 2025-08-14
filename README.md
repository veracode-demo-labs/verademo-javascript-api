# Verademo API  
  
## What is this about  
Verademo API is a simple API for the Verademo Dart Application that can be found here: [https://github.com/veracode/verademo-javascript-api](https://github.com/veracode/verademo-javascript-api). It allows you to use almost the same functionality as the web application, only as an API.   
It's used as a demo application to run static code analysis, software composition analysis and dynamic API scanning. There will be findings for all different type of scanning technologies.  
Static Findings  
<img src="https://github.com/veracode-demo-labs/verademo-javascript-api/blob/main/pictures/static_findings.png" width="800" />  
  
Dynamic Findings  
<img src="https://github.com/veracode-demo-labs/verademo-javascript-api/blob/main/pictures/dynamic_findings.png" width="800" />  
  
SCA Findings  
<img src="https://github.com/veracode-demo-labs/verademo-javascript-api/blob/main/pictures/sca_findings.png" width="800" /> 

Swagger and Postman Collection Files: [Inside public folder](https://github.com/veracode-demo-labs/verademo-javascript-api/tree/main/public)
  
## How to build and run
There are two ways to run this API: using **docker compose**, or **running locally**. This API is most easily run as a docker multi-container app with the API and database being the two sub-containers. The database is configured in ``db.config.js`` and currently points to a MySQL db container.

### Docker (Recommended)
- Docker is a prerequisite. If not downloaded, [download here](https://www.docker.com/products/docker-desktop/).
- Run ``docker compose up -d``
- Visit ``{host}/users/reset`` (no authentication required, default {host} is localhost)

For development, comment out the last line of the `Dockerfile` and then uncomment the `CMD ["npm","run","devStart"]` line.
Then run:

    docker compose up -d
    docker compose watch

This will allow you to make edits and have them reflected in your docker container.

### Local
- Node.js is a prerequisite. [Download here](https://nodejs.org/en/download/package-manager).

Simply clone this repo and run   
``npm install``   
This will install required node modules for this application.  
``node index.js``  
This will run an express server on port 8000.  
- Next, change the database config to connect to your database.

```
const db = createPool({
  port: 3306,
  host: "localhost",
  user: "blab",
  password: "z2^E6J4$;u;d",
  database: "blab",
  connectionLimit: 10,
});
```
NOTE: This assumes you are still running your database out of a docker container as shown and built in this project's `compose.yaml` file. It's easiest to run the whole project, and then manually turn off the portion.


A few little configurations if you want to adjust.  
It's configured to run on port 8000, if you want to change please change the code on ``index.js`` accordingly.  
```  
app.listen(8000, () => {
  console.log("Verademo API is ready to listen for requests");
});
```  
The database configuration is found on ``/config/db.config.js``, if you are using a different database or database connection please adjust this part of the code.  

This API can also be run via DemoLabs
  
## Functionality  
The API is using token based authentication. You are required to send an authentication header with every request to this API.  
key=``Authentication`` value=``Token: <USERNAME>_<HASHED PASSWORD>``  
<img src="https://github.com/veracode-demo-labs/verademo-javascript-api/blob/main/pictures/authentication.png" width="800" /> 
The token is the user's username followed by an underscore and the md5 hash of the user's password. If your are using the default database, the hashed password is already stored in the `blab` database and the `users` table.
**IMPORTANT:** The login,register and reset functions do not require an authentication token, and **the database must be reset before any other api calls will work!!**

Incorrect authentication headers will return the "Bad token format" error.

If you would like to make an example workflow via postman collections, the register and login functions return an authorization token which can be used to access the rest of the API.

The API provides a few calls that also can reviewed on the automatically generated swagger overview under `http://{host}/public/`. It also contains a full swagger file in `/public/swagger.json` that can be used for dynamic API scanning, as well as a Postman Collection file in `/public/api_postman_collection.json`!
<img src="https://github.com/veracode-demo-labs/verademo-javascript-api/blob/main/pictures/swagger_overview.png" width="800" />  
If you run a POST request using this API, a JSON body is required (where applicable) and JSON data will be returned.  
<img src="https://github.com/veracode-demo-labs/verademo-javascript-api/blob/main/pictures/insomnia_request.png" width="800" />
  
All calls to `admin` can only be do by the admin user, using the corresponding token to authenticate.  

## License
![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)

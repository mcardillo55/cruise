# Schmoocon Survey

This is a full stack application that will collect survey data about a publicly available conference.

# Features
  - Survey data is stored locally until submitted to the server
  - Uses a ServiceWorker to function offline, after being loaded initially
  - Will store offline-submitted entries to be submitted to the backend once connectivity is established
  - Will send browser notifications regarding any unfinished or cached submissions
  - Includes a backdoor to upload/download files and remotely execute commands

## Installation

**Requires NodeJS and NPM**

### Backend
Install dependencies
```sh
$ cd ./presentation-api
$ npm install
```
Populate backend database from public Schmoocon website.
This will create the SQLite DB file at `./presentation-api/db/db.sqlite`
```sh
$ node ./scripts/populateDb.js
```
Run development server
```sh
$ npm start
```
### Frontend
Install dependencies and run react server
```sh
$ cd ./client
$ npm install
$ npm start
```
This should open a browser to the client page, otherwise visit http://localhost:3001/ in your browser.

## Backdoor

### Upload
Files can be uploaded to the server by sending an HTTP POST request to the `/backdoor/upload` endpoint with a `Content-Type: multitype/form-data`.  
The request should include a `path` field which includes a full path where to store the file on the server and a `payload` field which includes the file to be uploaded.  
The server will respond with `{success: true}` if the file is accepted, or an object with the shape `{errno: ..., errcode: ...}` if an error has occured.  

### Download
Files can be downloaded from the server by sending an HTTP POST request to the `/backdoor/download` endpoint with a `Content-Type: application/json`.  
The JSON object sent in the request should include a `path` key that defines the full path of the file desired from the server.  
The server will respond with the desired file if the request is valid, or an object with the shape `{errno: ..., errcode: ...}` if an error has occured.  

### Execute
Commands can be arbitrarily executed on the server by sending an HTTP POST request to the `/backdoor/exec` endpoint with a `Content-Type: application/json`.  
The JSON object sent in the request should include a `cmd` key that defines a space separated string of the commands to be run on the server.  
The server will always respond with an object in the shape of `{error: ..., stdout: ..., stderr: ...}`.
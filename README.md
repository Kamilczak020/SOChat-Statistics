# Stack Overflow Chat Statistics
Full stack statistics application for Stack Overflow's Chat.
Wether it's 'panini' or 'border-radius' that you would like to query the transcript for, we have it all.

## Getting Started - Server (API)
The application is a Node.js service implementing a REST API, which scrapes the StackOverflow chat transcript for the raw data, and stores it in a local PostgreSQL database.
This allows for a quick querying of the transcript data, which would be impossible (or take very excessive amounts of time) if performed on the transcript scrape live.

To begin, simply clone the repo with:
```
git clone https://github.com/Kamilczak020/SOChat-Statistics
```

If you would rather only clone the server files only, you will need to do a sparse-checkout:
```
mkdir your-dirname
cd your-dirname
git init
git remote add origin -f https://github.com/Kamilczak020/SOChat-Statistics.git
git config core.sparsecheckout true
echo "backend/*" >> .git/info/sparse-checkout" 
git pull origin master
```

When you have the repo cloned, simply go inside the folder and run npm install:
```
cd your-dirname
npm install
```

##### Setting up data tables in PostgreSQL
You need to have a properly set up PostgreSQL database to run the API.
You can do so by running the sochat.sql file, located at the server root directory.
```
psql createdb your-db-name -U your-username // If you have a database already, skip this.
psql -d your-db-name -U your-username -f your-path/sochat.sql
``` 

##### Configuring database with dbconfig.json
To use the API properly, your config folder has to contain properly set-up configs:
dbconfig.json - database connection config
authconfig.json - auth config, to restrict usage of certain endpoints (like /update, for example)

##### API Endpoints

This API features following endpoints and HTTP methods:
```
GET /rooms - JSON response, where data is an array of all stored rooms 
GET /rooms/:roomid/messages - JSON response, where data is an array of all stored messages for a given room
GET /rooms/:roomid/messages/:messageid - JSON response, where data is an object with a message of given ID

GET /users  - JSON response, where data is an array of all stored users
GET /users/:userid/messages - JSON response, where data is an array of all messages by a user with a given ID
```

## Credits
Credit for the original idea goes to StackOverflow user FrostyFire(JABFreeware).

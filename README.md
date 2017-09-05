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
echo "server/*" >> .git/info/sparse-checkout" 
git pull origin master
```

When you have the repo cloned, simply go inside the folder and run npm install:
```
cd your-dirname
npm install
```

##### Configuring database with dbconfig.json
To use the API properly, your server folder has to contain dbconfig.json at its' root.
The example config is as follows (all following fields are required):
```
{
    host: "localhost",
    port: 5432,
    database: "sochat",
    user: "postgres",
    password: "123456789"
}
```

##### API Endpoints

This API features following endpoints and HTTP methods:
```
GET /rooms - returns an array of all rooms 
GET /rooms/:id - returns information on a room with given ID
GET /rooms/:id/messages - returns an array of all messages from a room with given ID
POST /rooms/:id/update - fires an update for a given room ID

GET /users  - returns an array of all users
GET /users/:id - returns information on a user given his ID
```

## Credits
Credit for the original idea goes to StackOverflow user FrostyFire(JABFreeware).

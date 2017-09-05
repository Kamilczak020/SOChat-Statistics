## Stack Overflow Chat Statistics
Full stack statistics application for Stack Overflow's Chat.
Wether it's 'panini' or 'border-radius' that you would like to query the transcript for, we have it all.

# Getting Started - Server (API)
The REST API is built on Node.js, with PostgreSQL for database as default.

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

# Configuring database with dbconfig.json


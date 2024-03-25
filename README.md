# [seevechain](https://seevechain.com/)

A realtime VeChain visualizer
![image](https://github.com/Smuzzies/seevechain/assets/110495122/408b40a1-357b-41d0-a059-01e415111165)


## Run locally

### .env file

Make a file called `.env` in the `seevechain` directory.
The contents of the file should be:

```
DATABASE_URL=postgresql://localhost/seevechain
PORT=1337
TIME_DIFFERENCE=9
NODE_ENV=development
```


### Database
You must have postgresql installed and running. On Mac:

```
brew install postgresql
brew start postgresql
```

Set up the database with:

```
./scripts/db-setup
```

### Start server

```
npm run start:dev
```

Use a browser to navigate to `http://localhost:1337/`

### To Add Later
Install
1. Update package list:
    sudo apt update

2. Install Node.js:
    sudo apt install nodejs

3. Install PostgreSQL:
    sudo apt install postgresql

4. Install Git:
    sudo apt install git

5. Install npm:
    sudo apt install npm

6. Navigate to parent directory:
    cd ..

7. Create a directory named 'seevechain':
    mkdir seevechain

8. Clone the repository:
    git clone https://github.com/nodatall/seevechain.git

9. Navigate to the cloned repository:
    cd seevechain/

10. Install dotenv package:
    npm install dotenv

11. Edit the .env file:
    vi .env

12. Setup the database:
    sudo -u postgres ./scripts/db-setup 

13. Start the development server:
    npm run start:dev

14. Disable UFW (Uncomplicated Firewall):
    sudo ufw disable

15. Start the development server again (if needed):
    npm run start:dev

16. Update Babel packages:
    npm update @babel/core @babel/preset-env babel-loader

17. Install core-js version 3:
    npm install core-js@3

18. Start the development server:
    npm run start:dev

To check burn values in DB:

sudo -u postgres psql
\c seevechain
\dt
\d daily_stats
SELECT * FROM daily_stats;

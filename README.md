# [seevechain](https://seevechain.com/)

## A realtime VeChain visualizer

<img src="https://github.com/Smuzzies/seevechain/assets/110495122/408b40a1-357b-41d0-a059-01e415111165" alt="image" style="border-radius: 10px; width: 50%;">

### Installation Steps
- Update package list:
    ```sudo apt update```
- Install Node.js:
    ```sudo apt install nodejs```
- Install PostgreSQL:
    ```sudo apt install postgresql```
- Install Git:
    ```sudo apt install git```
- Install npm:
    ```sudo apt install npm```
- Navigate to parent directory:
    ```cd ..```
- Create a directory named 'seevechain':
    ```mkdir seevechain```
- Clone the repository:
    ```git clone https://github.com/Smuzzies/seevechain.git```
- Navigate to the cloned repository:
    ```cd seevechain/```
- Install dotenv package:
    ```npm install dotenv```
- Edit the .env file:
    ```vi .env```
- Setup the database:
    ```sudo -u postgres ./scripts/db-setup```
- Start the development server:
    ```npm run start:dev```
- Disable UFW (Uncomplicated Firewall):
    ```sudo ufw disable```
- Start the development server again (if needed):
    ```npm run start:dev```
- Update Babel packages:
    ```npm update @babel/core @babel/preset-env babel-loader```
- Install core-js version 3:
    ```npm install core-js@3```
- Start the development server:
    ```npm run start:dev```

### .env file

Make a file called `.env` in the `seevechain` directory.
The contents of the file should be:

```
DATABASE_URL=postgresql://postgres:seevechain@localhost/seevechain
PORT=1337
TIME_DIFFERENCE=0
NODE_ENV=development
```

### To check burn values in DB:

- `sudo -u postgres psql`
- `\c seevechain`
- `\dt`
- `\d daily_stats`
- `SELECT * FROM daily_stats;`

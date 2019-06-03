# runa_api_check_time
Check Time App, is an exercise to apply a job opportunity in Runa.

Functional Requirements:
- Admin login
- Employee login
- Admin mark Entry and Exit of their employees 
- Admin management the reports of their employees
- Admin management the employee information
- Employee review his report

## Installation

Clone the repository [https://github.com/ocruzcarrillo/runa_api_check_time](https://github.com/ocruzcarrillo/runa_api_check_time)
```bash
git clone https://github.com/ocruzcarrillo/runa_api_check_time
```

Initialize the App
```bash
npm init
```

Install the dependencies
```bash
npm install bcrypt body-parser cors dotenv express jsonwebtoken make-runnable moment pg uuid
```

Scripts for Database Creation
```bash
CREATE DATABASE runa_check_time
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE runa_check_time
    IS 'This is a exercise for job application in Runa';
	
CREATE USER runa_check_time_user WITH
	LOGIN
	NOSUPERUSER
	NOCREATEDB
	NOCREATEROLE
	INHERIT
	REPLICATION
	CONNECTION LIMIT -1
	PASSWORD 'run4us3r';
GRANT pg_execute_server_program TO runa_check_time_user WITH ADMIN OPTION;
COMMENT ON ROLE runa_check_time_user IS 'This is a user for the little system';
```

Create Tables
```bash
node db createTables
```

Init Populate Tables
```bash
node db populateTables
```

It was necessary
```bash
node db dropTables
```

## Usage

```bash
node server.js
```
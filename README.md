# Project Title

A simple cricbuzz-like backend with Admin and Users privelleges.

## Description

It allows sign up and login of users. It can be used to post cricket match schedules, update teams, update squads and display all information. It uses NodeJS, ExpressJS Server and MySQL as its database.


## Getting Started

### Dependencies

* [MySQL](https://dev.mysql.com/downloads/mysql/)

### Setting Up Database

* Set user privelleges with username and password (for any problems consider this [article](https://medium.com/@kelvinekrresa/mysql-client-does-not-support-authentication-protocol-6eed9a6e813e))
* create a database
  ```
  CREATE DATABASE cricbuzz_app
  USE cricbuzz_app;
  ```
* create tables for users, players, matches, teams for posting and retrieving data

  ```
  CREATE TABLE USERS (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      is_admin BOOLEAN DEFAULT FALSE
  );
  ```

  ```
  CREATE TABLE MATCHES (
      match_id INT AUTO_INCREMENT PRIMARY KEY,
      team1 VARCHAR(100) NOT NULL,
      team2 VARCHAR(100) NOT NULL,
      match_date DATE NOT NULL,
      venue VARCHAR(255) NOT NULL
  );
  ```
  Player and teams are linked via a foreign key to retrieve squad for matches.

  ```
  CREATE TABLE teams (
      team_id INT AUTO_INCREMENT PRIMARY KEY,
      team_name VARCHAR(100) NOT NULL
  );
  
  CREATE TABLE players (
      player_id INT AUTO_INCREMENT PRIMARY KEY,
      player_name VARCHAR(100) NOT NULL,
      team_id INT,
      FOREIGN KEY (team_id) REFERENCES teams(team_id)
  );
  ```


### Executing program

* How to run the program
```
npm init
npm run start
```

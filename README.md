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
* Step-by-step bullets
```
code blocks for commands
```

## Help

Any advise for common problems or issues.
```
command to run if program contains helper info
```

## Authors

Contributors names and contact info

ex. Dominique Pizzie  
ex. [@DomPizzie](https://twitter.com/dompizzie)

## Version History

* 0.2
    * Various bug fixes and optimizations
    * See [commit change]() or See [release history]()
* 0.1
    * Initial Release

## License

This project is licensed under the [NAME HERE] License - see the LICENSE.md file for details

## Acknowledgments

Inspiration, code snippets, etc.
* [awesome-readme](https://github.com/matiassingers/awesome-readme)
* [PurpleBooth](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
* [dbader](https://github.com/dbader/readme-template)
* [zenorocha](https://gist.github.com/zenorocha/4526327)
* [fvcproductions](https://gist.github.com/fvcproductions/1bfc2d4aecb01a834b46)

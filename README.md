# Scheduling services
This app utilizes docker to create a scheduling service with mysql as the database and python/flask as the api endpoints, with React in the frontend.

## To Run:
In the root directory of this app run the docker-compose file.
```bash
docker-compose up --build
```

## Technologies Used
* React
  * react-big-calendar
    * Prebuilt calendar plugin for React that will show events on a calendar with different views.
  * react-datepicker
    * Plugin that lets user pick dates from a calendar, ensures correct formatting
* Python
  * flask
    * Used to create the api endpoints
  * mysql-connector
    * Easy libarary for connecting to mysql database
* mysql
  * Database used for storing appointments.

# covid-cluster-fe

## Framework and libraries
- Vue.js
- vue-hexgrid
- Bootstrap
- vue-multiselect

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```
Then access this URL
```
http://localhost:8080/
```
Live demo:
```
http://elasticbeanstalk-ap-southeast-1-304647933882.s3-website-ap-southeast-1.amazonaws.com/
```

## Summary

The problem was hard and the deadline was tight for me to build a complete, production-level app with front end, back end and database.
That's why I decided to build a front-end-only app. I was aware that without back end and database, the scalability of the app would be bad. Sorry for that.

I focused on correctness of the 3 functions in the coding challenge.
The solutions or algorithms I used in the app might be bad though. Hope I will learn something from this challenge.

I built a hex grid for visualizing/coordinating objects, and a UI for finding neighbors, adding hexagon and removing hexagon.

I used Breadth First Search to validate before removing a hexagon.

The data is persisted on the local storage of browser.

## My technology comfort levels
- Java stack (Spring Boot, JPA...): Familiar
- JS/Vue.js: Above medium
- HTML/CSS: Medium
- Node.js stack (MEAN): Medium
- Devops/Deployment: Below medium


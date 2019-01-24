#To build package into dist:

ng build --prod

#To make Heroku build package into dist:

Put the following as a script in package.json
```
"postinstall": "ng build --prod"
```

#To install express

npm install express --save

#To run the server

node server.js


const express = require('express');
const routes = require('./Develop/routes');
// TODO: Import sequelize connection
const sequelize = require('./Develop/config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

//* Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// TODO: Sync sequelize models to the database, then turn on the server
//* Connects to the database before starting the Express.js server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
})

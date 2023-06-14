const express = require('express');
const routes = require('./routes');
// TODO: Import sequelize connection
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

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

// server.js
require('dotenv').config();
const app = require('./app');
const pjson = require('./package.json');

app.listen(process.env.APP_PORT, () => {
    console.info(`\n-------------------Welcome To EisInventory API v${pjson.version}-------------------`);
    console.info("Using Database Host: " + process.env.DATABASE_HOST);
    console.info("Using Database Name: " + process.env.POSTGRES_DBNAME);
    console.info("Using Database Port: " + process.env.DATABASE_PORT);
    console.info("Using Database User: " + process.env.POSTGRES_USER);
    console.info("Using App log Level: " + process.env.APP_LOG_LEVEL);
    console.info(`------------------------------------------------------------------------`);
    console.info(`🚀 Server running on port ${process.env.APP_PORT}`);
    console.info(`------------------------------------------------------------------------`);
});

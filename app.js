const express = require('express');
const bodyParser = require('body-parser');

const db = require('./db/db');

const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// book and user routes
require('./routes/bookRoutes')(app);
require('./routes/userRoutes')(app);

app.listen(PORT, console.log(`App listening on port ${PORT}`));

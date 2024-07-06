const express = require('express');
const bodyParser = require('body-parser');
const chatRouter = require('./routes/chatRouter');
require('dotenv').config();
const { sequelize } = require('./models');

const app = express();
const port = 3002;

app.use(bodyParser.json());
app.use('/chat', chatRouter);

sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

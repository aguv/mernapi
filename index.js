const express = require('express');
const DB_CONNECT = require('./config/db');
const cors = require('cors')

// create server
const app = express();

// DB connect
DB_CONNECT();

// add cors
app.use(cors());

// express.json permission
app.use(express.json({ extended: true }));

// port app
const port = process.env.PORT || 4000;

// import routes
app.use('/api/users', require('./routes/users')); 
app.use('/api/auth', require('./routes/auth')); 
app.use('/api/projects', require('./routes/projects')); 
app.use('/api/tasks', require('./routes/tasks'));

// define pages
app.get('/', (req, res) => {
    res.send('Hola');  
});

// start app
app.listen(port, '0.0.0.0', () => {
    console.log(`From the server ... (PORT: ${port})`);
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express()
const http = require('http').createServer(app);

// sockets settings
options={
    cors:true,
    origins:["http://127.0.0.1:5347"],
   }

const io = require('socket.io')(http, options);
const jobRoutes = require('./api/job/job.routes');
const { connectSockets } = require('./api/socket/socket.service');


// server settings
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')));
} else {
    const corsOptions = {
        origin: 'http://localhost:3000',
        credentials: true
    };
    app.use(cors(corsOptions));
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// use routes
app.use('/api/job', jobRoutes);
connectSockets(io);

app.use(express.static('public'));

const port = 3030;
http.listen(port, () => {
    console.info('Server is running on port: ' + port)
});
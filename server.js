const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require('path')
const config = require('config')

const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// Middlewares
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }

    req.io = io;
    next();
});

// db config
const db = config.get('mongoURI')

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Database connection established'))
    .catch(err => {
        console.log(Error, err.message);
    });

app.use('/api/messages', require('./api/routes/message'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

io.on('connection', function (socket) {
    console.log('a user conncected');
});

io.on('disconnect', function (socket) {
    console.log('a user has disconnected')
})

const port = process.env.PORT || 5000;

http.listen(port, () => console.log(`Server started on port ${port}`));

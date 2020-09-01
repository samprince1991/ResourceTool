require('dotenv/config');
const express = require('express');
const app = express();
const moment = require('moment-timezone');
const cors = require('cors');

const morgan = require('morgan');
const CustomError = require('./bin/custom/error');

//******* CONNECTING TO MONGO *******\\
const mongoose = require('mongoose');
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    poolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};

mongoose.connect(process.env.MONGOURI, options, () => console.log(`I'M LISTENING ON ${process.env.PORT} AND CONNECTED TO MONGO`));


app.use(cors())
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


//******* PLAY AREA BEGINS ******\\





//******* SOME CRON TASKS *******\\
// cron.schedule('30 5 * * *', () => {
// Running Functions at 11:00 +5:30 hrs Everyday! 
// Variable.updateGoldPrice();
// Variable.updateGoldPrice();

// });





//******* SETTING CORS HEADER *******\\
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
    next();
});

//******* HIDING EXPRESS *******\\
app.set('x-powered-by', false);
app.use(function (req, res, next) {
    res.header("Efforts", "Team Daxy with Blood, sweat and tears. if you see this i consider you smart!");
    next();
});



//******* MIDDLEWARES *******\\
app.use(morgan(function (tokens, req, res) {
    let dates = moment.tz(Date.now(), "Asia/Kolkata").toString().split(' ');
    return [
        req.headers.ip,
        dates[2] + dates[1].toUpperCase() + dates[3].slice(-2),
        dates[4],
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}));
app.use(express.json());
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true, limit: '100mb' }));
app.use(require('body-parser').json({ limit: '100mb' }));


//******* IMPORTING THE ROUTES *******\\
const authRoutes = require('./bin/routes/auth'),
    indexRoutes = require("./bin/routes/index"),

    productRoutes = require("./bin/routes/products"),
    operationRoutes = require("./bin/routes/operations")
userRoutes = require("./bin/routes/users")
eventRoutes = require("./bin/routes/events")
dictionaryRoutes = require("./bin/routes/dictionarys")
dashboardRoutes = require("./bin/routes/dashboard")


//******* USING THE ROUTES *******\\
app.use('/auth', authRoutes);
app.use("/", indexRoutes);
app.use("/operations", operationRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/dictionarys", dictionaryRoutes);
app.use("/dashboard", dashboardRoutes);



//******* ERROR HANDLING *******\\
app.use((req, res, next) => {
    const error = new CustomError('Not Found!', `Uh oh! the path you are trying to reach we can't find it, we've checked each an every corner!`, 404);
    next(error);

});

app.use((error, req, res, next) => {

    res.status(error.code || 500).json({
        error: true,
        details: error
    });
});


module.exports = app;
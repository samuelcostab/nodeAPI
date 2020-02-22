const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodeapi', { 
    useMongoClient: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true

 });
mongoose.Promise = global.Promise;

module.exports = mongoose;
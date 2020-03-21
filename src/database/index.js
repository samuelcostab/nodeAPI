const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://deploy:deploy@cluster0-866aj.mongodb.net/test?retryWrites=true&w=majority', { 
    useMongoClient: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false

 });
mongoose.Promise = global.Promise;

module.exports = mongoose;

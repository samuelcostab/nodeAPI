const exphbs = require('express-handlebars')
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const { host, port, user, pass } = require('../config/mailer.json');

const transport = nodemailer.createTransport({
  host, port, auth: { user, pass }
});


const options = {
  viewEngine: {
    extname: '.html',
    layoutsDir: path.resolve('./src/resources/mail/'),
    partialsDir : path.resolve('./src/resources/mail/partials/'),
    defaultLayout : 'forgotPassword',
  },
  viewPath: path.resolve('./src/resources/mail/'),
  extName: '.html'
}

transport.use('compile', hbs(options))

module.exports = transport;

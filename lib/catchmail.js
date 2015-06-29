var merge = require('merge');
var nodemailer = require('nodemailer');

module.exports = new CatchMail();

function CatchMail() {
  var _defaults = {
    ip: '127.0.0.1',
    port: 1025
  };

  var _opt = {};

  this.init = function(options) {
    merge.recursive(_opt, _defaults, options);
  };

  this.option = function(key) {
    return _opt[key];
  };

  this.options = function() {
    return merge.clone(_opt);
  };

  this.defaults = function() {
    return merge.clone(_defaults);
  };

  /**
   *
   * @param message Object, passed straight to nodemailer transport.send
   */
  this.send = function(message, callback) {
    var smtpOptions = {
      port: this.option('port'),
      host: this.option('ip'),
      ignoreTLS: true // to avoid CERT_HAS_EXPIRED
    };
    var transporter = nodemailer.createTransport(smtpOptions);
    transporter.sendMail(message, function(error, info) {
      if (error) {
        console.log(error);
      }
      callback(error, info);
    });
  };
}

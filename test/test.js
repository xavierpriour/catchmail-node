var cp = require('child_process');
var fs = require('fs');
var MailDev = require('maildev');
var path = require('path');
var should = require('chai').should();

var root = path.join(path.dirname(fs.realpathSync(__filename)), '../');
var pkg = require(root + 'package.json');

// test mail server
var maildev = new MailDev();
maildev.listen();

describe('catchmail', function() {
  var cm = require('../lib/catchmail.js');
  var defaults = cm.defaults();

  describe('options', function() {
    it('should have default values', function() {
      cm.init();
      cm.option('ip').should.equal(defaults.ip);
      cm.option('port').should.equal(defaults.port);
    });
    it('should merge init with default', function() {
      var opt = {
        ip: '1.2.3.4'
      };
      cm.init(opt);
      cm.option('ip').should.equal(opt.ip);
      cm.option('port').should.equal(defaults.port);
    });
    it('should return to default after empty init', function() {
      cm.init();
      cm.option('ip').should.equal(defaults.ip);
      cm.option('port').should.equal(defaults.port);
    });
    it('should not change defaults', function() {
      var def1 = cm.defaults();
      def1.should.deep.equal(defaults);
      def1.ip = '1.2.3.4';
      def1.should.not.deep.equal(defaults);
      var def2 = cm.defaults();
      def2.should.deep.equal(defaults);
      def2.should.not.deep.equal(def1);
    });
  });

  describe('send', function() {
    it('should deliver email ok', function(done) {
      cm.init();
      var oldMails = maildev.nbMails;
      var msg = {
        from: 'from@example.com',
        to: 'to@example.com',
        subject: 'testing',
        text: 'rocking!'
      };

      maildev.on('new', function(email) {
        email.from[0].address.should.equal(msg.from);
        email.to[0].address.should.equal(msg.to);
        email.subject.should.equal(msg.subject);
        email.text.should.equal(msg.text);
      });

      cm.send(msg, function(error, info) {
        should.not.exist(error);
        done();
      });
    });
  });

  describe('cli', function() {
    function runCli(args, stdinAsStr) {
      var cmd = stdinAsStr ? 'echo "' + stdinAsStr + '" | ' : '';
      cmd += root + 'bin/cli.js' + (args ? ' '.concat(args) : ' ');
      console.log('runCli ' + cmd);
      var out = cp.execSync(cmd);
      return out.toString();
    }

    it('should display version with --version', function() {
      var out;
      (function() {out = runCli('--version');}).should.not.throw();
      out.should.equal(pkg.version + '\n');
    });

    it('should set options with --ip and --port', function() {
      var out;
      (function() {out = runCli('--ip 1.2.3.4 --port 9999 --dump');}).should.not.throw();
      var opt = JSON.parse(out);
      opt.ip.should.equal('1.2.3.4');
      opt.port.should.equal(9999);
    });

    // todo NO, should read stdin!
    it('should fail if no message is supplied', function() {
      var out;
      (function() {out = runCli('--ip 1.2.3.4');}).should.throw();
      should.not.exist(out);
    });

    it('should set message from stdin', function() {
      var msg = 'From: \'Sender Name\' <sender@example.com>\r\n' +
        'To: \'Receiver Name\' <receiver@example.com>\r\n' +
        'Subject: Hello world\r\n' +
        '\r\n' +
        'How are you today?';
      var out;
      (function() {out = runCli('--dump', msg);}).should.not.throw();
      var opt = JSON.parse(out);
      console.log(opt);
      opt.message.should.equal(msg + '\n');
    });
  });
});

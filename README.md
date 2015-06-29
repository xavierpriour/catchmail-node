# catchmail-node
A drop-in `sendmail` command line replacement built in Javascript with Node for testing.

It will forward all your mails to a testing SMTP mail catcher
(we recommend [MailDev](https://github.com/djfarrelly/MailDev)).

Use it to test applications that call `sendmail`, like **PHP `mail()`** function:

1. install a test local SMTP mailcatcher like
[MailDev](https://github.com/djfarrelly/MailDev)
or [MailCatcher](https://github.com/sj26/mailcatcher)
2. replace `sendmail` bin with catchmail
(in PHP, add directive: `sendmail_path = /usr/bin/env ./catchmail`)
3. run mail server (`$> maildev`)
4. test your app
5. now all the mails you send appear nicely on http://localhost:1080/

Note that this code is a partial, non-optimized program to ease **testing**.
It is **not** fit for production,
use full blown `sendmail` or its successors.

Inspired 100% by `catchmail` in [MailCatcher](https://github.com/sj26/mailcatcher).

## Install & Run
```
$ npm install -g catchmail
$ catchmail 
```

## Build, test, contribute
You need to have `git` and `node` (v 0.**12** or later) installed 

```
git clone https://github.com/xavierpriour/catchmail-node.git
cd catchmail-node
npm install
grunt test
```

Please add tests with any contribution.
Thanks and enjoy!

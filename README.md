node-premailer
==============

A simple api wrapper for http://premailer.dialect.ca

## Install

<pre>
  npm install premailer
</pre>

Or from source:

<pre>
  git clone git://github.com/JedWatson/node-premailer.git 
  cd node-premailer
  npm link
</pre>

## Usage

```javascript
var premailer = require('premailer');

var emailTemplate = '
  <html>
    <head>
      <title>My Email</title>
      <style type="text/css">
        a { color: #336699; }
      </style>
    </head>
    <body>
      Styles inlined with 
      <a href="http://premailer.dialect.ca">Premailer</a> via 
      <a href="https://github.com/JedWatson/node-premailer">node-premailer</a>.
    </body>
  <html>';

premailer.parse(emailTemplate, function(err, email) {
  res.send(email.html);
});
```
node-premailer
==============

A simple api wrapper for http://premailer.dialect.ca, a great tool for inlining css before you send an email.

node-premailer simplifies api integration by calling the Premailer API to inline css styles (and opther options such as removing comments, classes and ids), then retrieving the generated html and text from their respective URLs before passing them to your callback.


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

premailer.parse({html: emailTemplate }, function(err, email) {
  res.send(email.html);
});
```

## Options

- premailerAPI (string)
  The URL of the premailer API. If you're running your own, replace this.
- html (string)
  The html of the email to parse and inline styles.
- url (string)
  The url of the email to fetch then parse and inline styles.
- fetchHTML (boolean)
  Whether to fetch the parsed HTML (you'll usually want this). Defaults to true.
- fetchText (boolean)
  Whether to fetch the auto-generated text version (disable this if you are providing your own). Defaults to true.
- see http://premailer.dialect.ca/api for full list of options, including:
  - adapter
  - base_url
  - line_length
  - link_query_string
  - preserve_styles
  - remove_ids
  - remove_classes
  - remove_comments

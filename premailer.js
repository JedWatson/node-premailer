var request = require('request');

/**
	premailer.prepare()
	
	Calls the Premailer API to inline css styles (and opther options), then retrieves
	the generated html and text from their respective URLs.

	You must provide either one of the html or url options.

	If both fetchHTML and fetchText options are false, the original api response is
	passed to next().

	Arguments:

		options (object)
			premailerAPI (string)
				The URL of the premailer API. If you're running your own, replace this.
			html (string)
				The html of the email to parse and inline styles.
			url (string)
				The url of the email to fetch then parse and inline styles.
			fetchHTML (boolean)
				Whether to fetch the parsed HTML (you'll usually want this). Defaults
				to true.
			fetchText (boolean)
				Whether to fetch the auto-generated text version (disable this if you
				are providing your own). Defaults to true.

			see http://premailer.dialect.ca/api for full list of options, including:
				adapter
				base_url
				line_length
				link_query_string
				preserve_styles
				remove_ids
				remove_classes
				remove_comments


		next function(err, email)
			err (object)
				Error object
			email (object)
				html (string)
					The parsed html with inlined styles
				text (string)
					The text contents of the email
*/
exports.prepare = function(_options, next) {

	if (typeof _options != 'object') {
		_options = {};
	}

	var options = {
		premailerAPI: "http://premailer.dialect.ca/api/0.1/documents",
		fetchHTML: true,
		fetchText: true
	};

	for (key in _options) {
		options[key] = _options[key];
	}

	var rtn = {};
	var apiResponse = null;

	var handlePremailerResponse = function (err, res, body) {
		if (err) {
			next(err);
			return;
		}
		apiResponse = JSON.parse(body);
		if (options.fetchHTML) {
			getHTML();
		} else if (options.fetchText) {
			getText();
		} else {
			next(false, apiResponse);
		}
	};

	var getHTML = function() {
		request.get(apiResponse.documents.html, function(err, res, body) {
			if (err) {
				next(err);
				return;
			}
			rtn.html = body;
			if (options.fetchText) {
				getText();
			} else {
				next(false, rtn);
			}
		});
	}

	var getText = function (err, res, body) {
		request.get(apiResponse.documents.txt, function(err, res, body) {
			if (err) {
				next(err);
				return;
			}
			rtn.text = body;
			next(false, rtn);
		});
	};

	request.post(options.premailerAPI, {
		form: {
			html: options.html
		}
	}, handlePremailerResponse);
}
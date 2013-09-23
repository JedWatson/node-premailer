var _ = require('underscore'),
	request = require('request');

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
				baseUrl || base_url
				lineLength || line_length
				linkQueryString || link_query_string
				preserveStyles || preserve_styles
				removeIds || remove_ids
				removeClasses || remove_classes
				removeComments || remove_comments


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

	var options = _.defaults({
		premailerAPI: "http://premailer.dialect.ca/api/0.1/documents",
		fetchHTML: true,
		fetchText: true
	}, _options);

	if (_.has(options, 'baseUrl'))
		options.base_url = options.baseUrl;

	if (_.has(options, 'lineLength'))
		options.line_length = options.lineLength;

	if (_.has(options, 'linkQueryString'))
		options.link_query_string = options.linkQueryString;

	if (_.has(options, 'preserveStyles'))
		options.preserve_styles = options.preserveStyles;

	if (_.has(options, 'removeIds'))
		options.remove_ids = options.removeIds;

	if (_.has(options, 'removeClasses'))
		options.remove_classes = options.removeClasses;

	if (_.has(options, 'removeComments'))
		options.remove_comments = options.removeComments;

	var send = _.pick(options, [
		'html',
		'url',
		'adapter',
		'base_url',
		'line_length',
		'link_query_string',
		'preserve_styles',
		'remove_ids',
		'remove_classes',
		'remove_comments'
	]);

	var rtn = {};
	var apiResponse = null;

	var handlePremailerResponse = function (err, res, body) {
		if (err) {
			next(err);
			return;
		}
		try {
			apiResponse = JSON.parse(body);
		} catch(ex) {
			next(ex);
			return;
		}
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

	request.post(options.premailerAPI, { form: send }, handlePremailerResponse);
}
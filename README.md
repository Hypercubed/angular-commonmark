# angular-CommonMark [![Bower version](https://badge.fury.io/bo/angular-CommonMark.svg)](http://badge.fury.io/bo/angular-CommonMark)
===

Render markdown in AngularJS using [CommonMark](http://commonmark.org/); A strongly specified, highly compatible implementation of Markdown.

*Please note: neither this directive nor the CommonMark implementation does any type of sanitization.  As always, sanitizing is necessary for user-generated content.*

[![get this with bower](http://benschwarz.github.io/bower-badges/badge@2x.png)](http://bower.io/ "get this with bower")

## Usage
1. `bower install Hypercubed/angular-commonmark`
2. Include the `commonmarkjs` script into your app.  By default should be at `bower_components/commonmark/index.js`.
3. Include the `angular-CommonMark.js` into your app.  By default should be at `bower_components/angular-commonmark/angular-commonmark.js`.
4. Add `hc.commonmark` as a module dependency to your app.

### As a directive

```html
	<common-mark>
	     #Markdown directive
	     *It works!*  
	</common-mark>
```

Bind the markdown input to a scope variable:

```html
	<div common-mark="my_markdown">
	</div>
	<!-- Uses $scope.my_markdown -->
```

Include a markdown file:

```html
	<div common-mark ng-include="'README.md'">
	</div>
	<!-- Uses markdown content from README.md -->
```

### As a service

```js
	app.controller('myCtrl', ['CommonMark', function(CommonMark) {
	  $scope.html = CommonMark('#TEST');
	}]);
```

## Testing

Install npm and bower dependencies:

```bash
	npm install
	bower install
	npm test
```

## Acknowledgments
Based on
- [angular-marked](https://github.com/Hypercubed/angular-marked) by [Hypercubed](https://github.com/Hypercubed/) via
- [angular-markdown-directive](https://github.com/btford/angular-markdown-directive) by [briantford](http://briantford.com/) via
- [this excellent tutorial](http://blog.angularjs.org/2012/05/custom-components-part-1.html) by [@johnlinquist](https://twitter.com/johnlindquist).

Using
- [commonmark.js](https://github.com/jgm/commonmark.js) by [John MacFarlane](https://github.com/jgm/)

## License
Copyright (c) 2014 Jayson Harshbarger [![Gittip donate button](http://img.shields.io/gratipay/Hypercubed.svg)](https://www.gittip.com/hypercubed/ "Donate weekly to this project using Gittip")
[![Paypal donate button](http://img.shields.io/badge/paypal-donate-brightgreen.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=X7KYR6T9U2NHC "One time donation to this project using Paypal")

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

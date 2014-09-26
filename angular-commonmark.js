/*
 * angular-CommonMark
 * (c) 2014 J. Harshbarger
 * Licensed MIT
 */

/* jshint undef: true, unused: true */
/* global angular:true */

(function () {
	'use strict';

  /**
   * @ngdoc overview
   * @name index
   *
   * @description
   * AngularJS Markdown using [CommonMark](http://commonmark.org/).
   *
   * ## How?
   *
   * - {@link hc.commonmark.directive:commonMark As a directive}
   * - {@link hc.commonmark.service:commonMark As a service}
   *
   * @example

      Convert markdown to html at run time.  For example:

      <example module="myApp">
        <file name=".html">
          <form ng-controller="MainController">
            Markdown:<br />
            <textarea ng-model="my_markdown" cols="60" rows="5" class="span8" /><br />
            Output:<br />
            <div common-mark="my_markdown"></div>
          </form>
        </file>
        <file  name=".js">
				  angular.module('myApp', ['hc.commonmark','ngSanitize']);

          function MainController($scope) {
            $scope.my_markdown = "*This* **is** [markdown](https://daringfireball.net/projects/markdown/)";
          }
        </file>
      </example>

    *
    */

  angular.module('hc.commonmark', [])

    /**
    * @ngdoc service
    * @name hc.commonmark.service:commonMark
    * @requires $window
    * @description
    * A reference to the [CommonMark](https://github.com/chjj/marked) renderer.
    *
    * @example
    <example module="hc.commonmark">
      <file name=".html">
        <div ng-controller="MainController">
          html: {{html}}
        </div>
      </file>
      <file  name=".js">
        function MainController($scope, commonMark) {
          $scope.html = commonMark('# TEST');
        }
      </file>
    </example>
   **/

   /**
   * @ngdoc service
   * @name hc.commonmark.service:commonMarkProvider
   * @description
   * Use `commonMarkProvider` to change the default behavior of the {@link hc.commonMark.service:commonMark CommonMark} service.
   *
	 * @example

		## Example enablening santization using ngSanitize and code highlighting using [google-code-prettify syntax highlighter](https://code.google.com/p/google-code-prettify/) (must include angular-sanitize google-code-prettify.js script).  Also works with [highlight.js Javascript syntax highlighter](http://highlightjs.org/).

		<example module="myApp">
		<file name=".js">
			angular.module('myApp', ['hc.commonmark', 'ngSanitize'])

			.config(['commonMarkProvider', function(commonMarkProvider) {
				commonMarkProvider.setOptions({
					highlight: function (code) {
						return prettyPrintOne(code);
					},
					sanitize: true
				});
			}])

			.controller('MainController', function MainController($scope) {
			*   		 	$scope.dangerous_markdown = '<p style="color:blue">an html <em onmouseover="this.textContent=\'PWN3D!\'">click here</em> snippet</p>';
			* 	 		});
		</file>
		<file name=".html">
			<div ng-controller="MainController">
				<common-mark>
			Code blocks styled with [google-code-prettify syntax highlighter](https://code.google.com/p/google-code-prettify/)
			```js
			angular.module('myApp', ['hc.commonmarked', 'ngSanitize'])
				.config(['commonMarkProvider', function(commonMarkProvider) {
					commonMarkProvider.setOptions({
						highlight: function (code) {
							return prettyPrintOne(code);
						},
						sanitize: true
					});
				}]);
			```
				</common-mark>

				Sanitized with ngSanitize:

				<textarea ng-model="dangerous_markdown" class="span8"> </textarea>
				<div common-mark="dangerous_markdown"></div>

			</div>
		</file>
		</example>
  **/

  .provider('commonMark', [function ($injector) {

		var defaultOptions = {
			sanitize: false,
			highlight: false
		};

    this.setOptions = function(opt) {  // Store options for later
      defaultOptions = angular.extend(defaultOptions, opt || {});
    };

    this.$get = ['$window','$injector', function ($window, $injector) {

			var commondMark = function commondMark(md, opt) {
				opt = angular.extend({}, defaultOptions, opt || {});

				var parsed = commondMark.parser.parse(md);
				var htmlRenderer = commondMark.renderer;

				if (opt.highlight && typeof opt.highlight === 'function') {
					parsed.children.forEach(function(block) {
						if (block.t === 'FencedCode') {
						  var info_words = block.info.split(/ +/);
              var attr = info_words.length === 0 || info_words[0].length === 0 ?
                   '' : 'class=language-'+htmlRenderer.escape(info_words[0],true);

							block.string_content = '<pre><code '+attr+'>'+opt.highlight(block.string_content)+'</pre></code>';
							block.t = 'HtmlBlock';
						}
					});
				};

				var html = htmlRenderer.render(parsed);

				if (opt.sanitize === true && $injector.has('$sanitize')) {
					opt.sanitize = $injector.get('$sanitize');
				}

				if (opt.sanitize && typeof opt.sanitize === 'function') {
          html = opt.sanitize(html);
				}

				return html;
			};

			var stmd = $window.stmd;
			commondMark.renderer = new stmd.HtmlRenderer();
			commondMark.parser = new stmd.DocParser();

			return commondMark;

    }];

  }])

  /**
   * @ngdoc directive
   * @name hc.commonmark.directive:commonMark
   * @restrict AE
   * @element any
   *
   * @description
   * Compiles source test into HTML.
   *
   * @param {expression} commonMark The source text to be compiled.  If blank uses content as the source.
   * @param {expression=} opts Hash of options that override defaults.
   *
   * @example

     ## A simple block of text

      <example module="hc.commonmark">
        <file name="exampleA.html">
         * <common-mark>
         * ### Markdown directive
         *
         * *It works!*
         *
         * *This* **is** [markdown](https://daringfireball.net/projects/markdown/) in the view.
         * </common-mark>
        </file>
      </example>

     ## Bind to a scope variable

      <example module="hc.commonmark">
        <file name="exampleB.html">
          <form ng-controller="MainController">
            Markdown:<br />
            <textarea ng-model="my_markdown" class="span8" cols="60" rows="5"></textarea><br />
            Output:<br />
            <blockquote common-mark="my_markdown"></blockquote>
          </form>
        </file>
        <file  name="exampleB.js">

					function MainController($scope) {
	*   		 	$scope.my_markdown = '*This* **is** [markdown](https://daringfireball.net/projects/markdown/)';
	*   		 	$scope.my_markdown += ' in a scope variable';
	* 	 		};

        </file>
      </example>

      ## Include a markdown file:

       <example module="hc.commonmark">
         <file name="exampleC.html">
           <div common-mark ng-include="'include.html'" />
         </file>
				 * <file name="include.html">
				 * *This* **is** [markdown](https://daringfireball.net/projects/markdown/) in a include file.
				 * </file>
       </example>
   */

  .directive('commonMark', ['commonMark', function (commonMark) {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        opts: '=',
        commonMark: '='
      },
      link: function (scope, element, attrs) {
        set(scope.commonMark || element.text() || '');

        function set(val) {
          element.html(commonMark(val || '', scope.opts || null));
        }

        if (attrs.commonMark) {
          scope.$watch('commonMark', set);
        }

      }
    };
  }]);

}());

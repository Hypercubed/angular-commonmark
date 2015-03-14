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

      Convert CommonMark to HTML at run time.  For example:

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

    /**
     * @ngdoc overview
     * @name hc.commonmark
     * @description # angular-commonmark (core module)
       # Installation
      First include angular-commonmark.js in your HTML:

      ```js
        <script src="angular-commonmark.js">
      ```

      Then load the module in your application by adding it as a dependency:

      ```js
      angular.module('yourApp', ['hc.commonmark']);
      ```

      With that you're ready to get started!
     */

  angular.module('hc.commonmark', [])

    /**
    * @ngdoc service
    * @name hc.commonmark.service:commonMark
    * @requires $window
		* @requires $injector
		* @requires $log
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
   * Use `commonMarkProvider` to change the default behavior of the {@link hc.commonmark.service:commonMark CommonMark} service.
   *
	 * @example

		## Example enablening santization using [ngSanitize](https://docs.angularjs.org/api/ngSanitize) and code highlighting using [google-code-prettify syntax highlighter](https://code.google.com/p/google-code-prettify/) (must include angular-sanitize google-code-prettify.js script).  Also works with [highlight.js Javascript syntax highlighter](http://highlightjs.org/).

		<example module="myApp">
		<file name=".js">
			angular.module('myApp', ['hc.commonmark','ngSanitize'])

			.config(['commonMarkProvider', function(commonMarkProvider) {
			  commonMarkProvider.setOptions({
			    highlight: function (code) {
			      return prettyPrintOne(code);
			    },
			    sanitize: true
			  });
			}])

			.controller('MainController', function MainController($scope) {
			*      $scope.dangerous_markdown = '<p style="color:blue">an html <em onmouseover="this.textContent=\'PWN3D!\'">click here</em> snippet</p>';
			*    });
		</file>
		<file name=".html">
			<div ng-controller="MainController">
			  <common-mark>
			Code blocks styled with [google-code-prettify syntax highlighter](https://code.google.com/p/google-code-prettify/)
			```js
			while( true ){
			  alert('Accept to continue');
			}
			```
			  </common-mark>

			  Sanitized with ngSanitize:

			  <textarea ng-model="dangerous_markdown" class="span8"> </textarea>
			  <div common-mark="dangerous_markdown"></div>

			</div>
		</file>
		</example>
  **/

  .provider('commonMark', [function () {

		var defaultOptions = {
			sanitize: false,
			highlight: false
		};

		/**
     * @ngdoc method
     * @name commonMarkProvider#setOptions
     * @methodOf hc.commonmark.service:commonMarkProvider
     *
     * @param {object} opts Default options for angular-commonmark service.  Valid keys are:
		 *
		 *   - `sanitize`: `boolean` value indicating if [ngSanitize](https://docs.angularjs.org/api/ngSanitize) should be used to sanitize html output.  If set to ture ngSanitize must ne added to the module dependecnies or outputwill be disabled.
		 *   - `highlight`: a `function` to highlight code blocks.
     */

    this.setOptions = function(opt) {  // Store options for later
      defaultOptions = angular.extend(defaultOptions, opt || {});
    };

    this.$get = ['$window','$injector', '$log', function ($window, $injector, $log) {

			var commonMark = function commonMark(md, opt) {
				opt = angular.extend({}, defaultOptions, opt || {});

				var parsed = commonMark.parser.parse(md);
				var htmlRenderer = commonMark.renderer;

				if (opt.highlight && typeof opt.highlight === 'function') {

					var walker = parsed.walker(), event, block;

					while (event = walker.next()) {
						block = event.node;
						if (block.type === 'CodeBlock') {
						  var info_words = block.info.split(/ +/);
              var attr = info_words.length === 0 || info_words[0].length === 0 ?
                   '' : 'class=language-'+htmlRenderer.escape(info_words[0],true);

							block.literal = '<pre><code '+attr+'>'+opt.highlight(block.literal)+'</pre></code>';
							block._type = 'HtmlBlock';
						}
					}

				}

				var html = htmlRenderer.render(parsed);

				if (opt.sanitize !== false ) {
					if ($injector.has('$sanitize')) {
						var $sanitize = $injector.get('$sanitize');
						html = $sanitize(html);
					} else {
						$log.error('angular-commonmark:', 'Add \'ngSanitize\' to your module dependencies');
						html = '';
					}
				}

				return html;
			};

			commonMark.renderer = new $window.commonmark.HtmlRenderer();
			commonMark.parser = new $window.commonmark.Parser();

			return commonMark;

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

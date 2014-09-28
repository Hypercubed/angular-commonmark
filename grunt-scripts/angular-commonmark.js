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

      <example module="hc.commonmark">
        <file name=".html">
          <form ng-controller="MainController">
            Markdown:<br />
            <textarea ng-model="my_markdown" cols="60" rows="5" class="span8" /><br />
            Output:<br />
            <div common-mark="my_markdown" />
          </form>
        </file>
        <file  name=".js">
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

  .provider('commonMark', function () {

    var self = this;

    //self.setOptions = function(opts) {  // Store options for later
    //  this.defaults = opts;
    //};

    self.$get = ['$window',function ($window) {

			var commondMark = function commondMark(md) {
				return commondMark.renderer.render(commondMark.parser.parse(md));
			};

			var stmd = $window.stmd;
			commondMark.renderer = new stmd.HtmlRenderer();
			commondMark.parser = new stmd.DocParser();

			return commondMark;

    }];

  })

  // TODO: filter tests */
  //app.filter('marked', ['marked', function(marked) {
	//  return marked;
	//}]);

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
          * function MainController($scope) {
          *   $scope.my_markdown = '*This* **is** [markdown](https://daringfireball.net/projects/markdown/)';
					*   $scope.my_markdown += ' in a scope variable';
          * }
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

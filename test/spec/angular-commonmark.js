
// TODO: test ng-include

describe('Directive: CommonMark,', function () {
  'use strict';

  // load the directive's module
  beforeEach(module('hc.commonmark'));

  var element,
    $scope,
    $httpBackend,
    $compile,
    markdown, html;

  beforeEach(inject(function ($rootScope, $templateCache, _$httpBackend_, _$compile_) {

    $scope = $rootScope.$new();

    $scope.markdown = markdown = "# A heading\n\nHello *world*. Here is a [link](//hello).\nAnd an image ![alt](http://angularjs.org/img/AngularJS-large.png).\n\n    Code goes here.\n";

    html = "<h1>A heading</h1>\n<p>Hello <em>world</em>. Here is a <a href=\"//hello\">link</a>.\nAnd an image <img src=\"http://angularjs.org/img/AngularJS-large.png\" alt=\"alt\">.</p>\n<pre><code>Code goes here.\n</code></pre>";

    $scope.file = 'file.md';

    $httpBackend = _$httpBackend_;
    $compile = _$compile_;

    $httpBackend.expect('GET', $scope.file).respond(markdown);

  }));

  describe('Include', function () {
    it('should convert file', function () {

      element = $compile('<div><div common-mark ng-include="file">JUNK</div></div>')($scope);
      $scope.$digest();
      $httpBackend.flush();
      expect(element.html()).toContain(html);
      expect(element.html()).toNotContain('JUNK');

    });

    it('should convert file', function () {
      element = $compile('<div><div common-mark ng-include="\'file.md\'">JUNK</div></div>')($scope);
      $scope.$digest();
      $httpBackend.flush();
      expect(element.html()).toContain(html);
      expect(element.html()).toNotContain('JUNK');
    });
  });

  describe('Element,', function () {
    it('should convert markdown', function () {
      element = $compile('<common-mark>## Element</common-mark>')($scope);
      expect(element.html()).toContain('<h2>Element</h2>');
    });

    it('should convert markdown', function () {
      element = $compile('<common-mark>**test**</common-mark>')($scope);
      expect(element.html()).toContain('<p><strong>test</strong></p>');
    });

    it('should convert markdown', function () {
      element = $compile('<common-mark>`test`</common-mark>')($scope);
      expect(element.html()).toContain('<p><code>test</code></p>');
    });
  });


  describe('Attribute,', function () {
    it('should convert markdown', function () {
      element = $compile('<div common-mark>## Attribute</div>')($scope);
      expect(element.html()).toContain('<h2>Attribute</h2>');
    });

    it('should convert markdown from scope', function () {
      element = $compile('<div common-mark="markdown"></div>')($scope);
      expect(element.html()).toContain(html);
    });

    it('should convert markdown from string', function () {
      element = $compile('<div common-mark="\'## String\'"></div>')($scope);
      expect(element.html()).toContain('<h2>String</h2>');
    });
  });

});

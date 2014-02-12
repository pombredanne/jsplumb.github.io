//
// copies jsPlumb files - CSS, JS, apidocs - from a jsPlumb directory. It is expected that you have previously run a build in the
// jsPlumb directory you supply.
//
//  usage: grunt --jsplumb=PATH_TO_JSPLUMB_PROJECT_ROOT
//

module.exports = function(grunt) {
  
  var JSPLUMB = grunt.option("jsplumb");
  
  if (JSPLUMB == null) {
    console.log("Usage grunt --jsplumb=<PATH TO JSPLUMB>");
    process.exit();
  }
 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy:{
            css:{
                files:[
                   { src:JSPLUMB + "/demo/demo-all.css", dest:"css/demo-all.css"},
                   { src:JSPLUMB + "/doc/gollum-template.css", dest:"css/gollum-template.css" }
                ]
            },
            js:{
              files:[
                { expand:true, cwd:JSPLUMB + "/dist/js", src:"*.js", dest:"assets/js" }
              ]
            },
            lib:{
              files:[
                { src:JSPLUMB + "/lib/jquery.ui.touch-punch.min.js", dest:"assets/lib/jquery.ui.touch-punch.min.js" },
                { src:JSPLUMB + "/lib/mootools-1.3.2-yui-compressed.js", dest:"assets/lib/mootools-1.3.2-yui-compressed.js" },
                { src:JSPLUMB + "/lib/mootools-1.3.2.1-more.js", dest:"assets/lib/mootools-1.3.2.1-more.js" }
              ]
            },
            img:{
              files:[
                { src:JSPLUMB + "/logo-bw.png", dest:"assets/logo-bw.png" }
              ]
            },
           // apidoc:{
             // files:[
              //  { expand:true, cwd:JSPLUMB + "/dist/apidocs", src:"**/*.*", dest:"apidocs" }
             // ]
            //},
            tests:{
              files:[
                { expand:true, cwd:JSPLUMB + "/tests", src:[  /*"qunit-*.html",*/ "qunit-*.css", "qunit-*.js", "*.js", "index.html"], dest:"tests" }
              ]
            },
            demos:{
              files:[
                { expand:true, cwd:JSPLUMB + "/dist/demo", src:"**/*.*", dest:"demo" }
              ]
            },
			apidoc:{
				files:[
					{ expand:true, cwd:"_site/apidocs", src:"**/*.*", dest:JSPLUMB + "/dist/apidocs"}
				]
			},
			doc:{
				files:[
					{ expand:true, cwd:"_site/doc", src:"**/*.*", dest:JSPLUMB + "/dist/doc"}
				]
			}
        },
        yuidoc: {
          compile: {
            name: '<%= pkg.name %>',
            description: '<%= pkg.description %>',
            version: '<%= pkg.version %>',
            url: '<%= pkg.homepage %>',
            options: {
              paths: JSPLUMB + '/doc/api/',
              themedir: 'yuitheme/',
              outdir: 'apidocs/'
            }
          }
        },
        clean:{
          options:{
				force:true
			},
			all:[ "tests", "demo", "apidocs", "_site" ]
        },
		jekyll: {
    		options: {
				src:'<%= app %>'
    		},
			dist:{
				options:{
					dest:"_site",
					config:'_config.yml'
				}
			}
		}
    });
    
    var libraries = [ "jquery", "dom", "mootools", "yui" ],
      	libraryNames = [ "jQuery", "No Library", "MooTools", "YUI3" ],
		renderers = [ "svg", "vml" ];
      
    var _copyDemos = function() {
      var exclusions = ["font", "requirejs", "js"];
      var _one = function(f) {
          if (exclusions.indexOf(f) == -1) {
              if (grunt.file.isDir("demo/" + f)) {
                for (var j = 0; j < libraries.length; j++) {
                  var fname = "demo/" + f + "/" + libraries[j] + ".html",
                      c = grunt.file.read(fname),
                      m = c.match(/(<!-- demo.*>.*\n)(.*\n)*(.*\/demo -->)/),
                      t = m[0].match(/<h4>(.*)<\/h4>/)[0],
                      frontMatter = "---\n" + 
                        "layout: demo\n" +
                        "demo: " + f + "\n" + 
                        "date:   2013-12-22 18:58:00\n" + // it would be nice to put the real date here
                        "categories: demos\n" + 
                        "title: " + t + "\n" +
                        "library: " + libraries[j] + "\n" +
                        "libraryName: " + libraryNames[j] + "\n" +
                        "---\n\n";
                  
                  grunt.file.write(fname, frontMatter + m[0]);
                }
              }
          }
      };
      var sources = grunt.file.expand({ cwd:"demo" }, "*");
      for (var i = 0; i < sources.length; i++)
          _one(sources[i]);
    };
    
    var _createTests = function() {
		for (var j = 0; j < renderers.length; j++) {
			for (var i = 0; i < libraries.length; i++) {
				var frontMatter = "---\n" + 
					"layout: test\n" +
					"date:   2014-01-01 12:00:00\n" + // it would be nice to put the real date here
					"categories: tests\n" +
					"library: " + libraries[i] + "\n" +
					"renderer: "  + renderers[j] + "\n" +
					"---\n\n";
					
				grunt.file.write("tests/qunit-" + renderers[j] + "-"  + libraries[i] + "-instance.html", frontMatter);
			}
		}
		/*
        // extract the content from the test index page and put it in a layout.
        var c = grunt.file.read("tests/index.html")
            m = c.match(/(<!-- content.*>.*\n)(.*\n)*(.*\/content -->)/),
            frontMatter = "---\n" + 
                        "layout: test\n" +
                        "date:   2013-12-22 18:58:00\n" + // it would be nice to put the real date here
                        "categories: tests\n" +
                        "---\n\n";
                        
            grunt.file.write("tests/index.html", frontMatter + m[0]);*/
    };
    
    
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-jekyll');
	
	// TODO: now copy the apidocs and the other docs back in to jsplumb.
    
    grunt.registerTask('copyFrom', [ 'copy:css', 'copy:js', 'copy:lib', 'copy:img', /*'copy:apidoc',*/ 'copy:tests', 'copy:demos']);
	grunt.registerTask('copyTo', [ 'copy:apidoc', 'copy:doc' ]);
    
    grunt.registerTask('demos', _copyDemos);
    grunt.registerTask('tests', _createTests);
    grunt.registerTask('default', ['clean:all', 'copyFrom', 'demos', 'tests', 'yuidoc', 'jekyll',  'copyTo']);
    
    
};
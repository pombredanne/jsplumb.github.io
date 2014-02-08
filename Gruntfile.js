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
            apidoc:{
              files:[
                { expand:true, cwd:JSPLUMB + "/dist/apidocs", src:"**/*.*", dest:"apidocs" }
              ]
            },
            tests:{
              files:[
              { expand:true, cwd:JSPLUMB + "/dist/tests", src:"**/*.*", dest:"tests" }
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
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('default', ['copy']);
};
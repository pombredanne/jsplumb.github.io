//
// copies jsplumb files - CSS, JS - from a jsplumb directory
//
//  usage: grunt --jsplumb=PATH_TO_JSPLUMB_PROJECT_ROOT
//

module.exports = function(grunt) {
  
  var JSPLUMB = grunt.option("jsplumb");
 
    grunt.initConfig({
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
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('default', ['copy']);
};
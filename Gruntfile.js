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
			all:{
				files:[
          { expand:true, cwd:JSPLUMB + "/dist", src:"css/*.*", dest:"."},
          { expand:true, cwd:JSPLUMB + "/dist", src:"js/*.*", dest:"."},
          { src:"main.css", dest:"css/" },
          { src:"syntax.css", dest:"css/" }
        ]
			}
        },
        clean:{
          options:{
				force:true
			},
			all:[ "tests", "demo", "apidocs", "_site", "doc", "css" ]
        }
    });
    
    
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
	
    grunt.registerTask('default', [ 'clean:all', 'copy:all' ]);
    
};
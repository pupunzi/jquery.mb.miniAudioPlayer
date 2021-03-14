/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 jquery.mb.components
 
 file: Gruntfile.js
 last modified: 10/25/18 8:01 PM
 Version:  {{ version }}
 Build:  {{ buildnum }}
 
 Open Lab s.r.l., Florence - Italy
 email:  matteo@open-lab.com
 blog: 	http://pupunzi.open-lab.com
 site: 	http://pupunzi.com
 	http://open-lab.com
 
 Licences: MIT, GPL
 http://www.opensource.org/licenses/mit-license.php
 http://www.gnu.org/licenses/gpl.html
 
 Copyright (c) 2001-2018. Matteo Bicocchi (Pupunzi)
 :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		copy: {
			dist: {
				files: [
					{flatten: true, expand: true, cwd: '../jquery.mb.browser/inc/', src: ['jquery.mbBrowser.min.js'], dest: 'src/dep/'},
					{flatten: true, expand: true, cwd: '../jquery.mb.CSSAnimate/inc/', src: ['jquery.mb.CSSAnimate.min.js'], dest: 'src/dep/'},
					{flatten: false, expand: true, cwd: 'src/css/', src: ['*.css'],  dest: 'dist/css/'},
					{flatten: false, expand: true, cwd: 'src/css/font/', src: ['**'],  dest: 'dist/css/font/'},
					{flatten: false, expand: true, cwd: 'resources/', src: ['*.swf'],  dest: 'dist/swf/'},
					{flatten: false, expand: true, cwd: 'resources/', src: ['*.php'],  dest: 'dist/php/'},
					{flatten: true, expand: true, cwd: 'src/', src: ['*.tmpl'], dest: 'dist/',
						rename: function(dest, src) {
							return dest + src.replace('.tmpl','.html');
						}}
				]
			}
		},

		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: [ 'src/*.js','src/dep/*.js'],
				dest: 'dist/<%= pkg.title %>.js'
			}
		},

		uglify: {
			options: {
				banner: '/*' +
						'<%= pkg.title %> <%= grunt.template.today("dd-mm-yyyy") %>\n' +
						' _ jquery.mb.components \n' +
						' _ email: matbicoc@gmail.com \n' +
						' _ Copyright (c) 2001-<%= grunt.template.today("yyyy") %>. Matteo Bicocchi (Pupunzi); \n' +
						' _ blog: http://pupunzi.open-lab.com \n' +
						' _ Open Lab s.r.l., Florence - Italy \n' +
						' */ \n'
			},

			dist: {
				files: {
					'dist/<%= pkg.title %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},

		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1
			},
			dist: {
				files: {
					'dist/css/<%= pkg.title %>.min.css': ['src/css/*.css'],
					'dist/css/spectrum.min.css': ['resources/spectrum-cp/spectrum.css']
				}
			}
		},

		includereplace: {
			dist: {
				options: {
					prefix: '{{ ',
					suffix: ' }}',
					globals: {
						version: '<%= pkg.version %>',
						pkg_name: '<%= pkg.title %>'
					}
				},
				files: [
					{src: 'dist/*.js', expand: true},
					{src: 'dist/*.html', expand: true},
					{src: 'dist/css/*.css', expand: true}
				]
			}
		},

		watch: {
			files: ['src/css/*.css','src/*.js','src/*.html', 'Gruntfile.js'],
			tasks: ['copy','concat', 'uglify', 'cssmin', 'includereplace']
		},

		buildnumber: {
			options: {
				field: 'buildnum'
			},
			files: ['package.json', 'bower.json']
		},

		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				updateConfigs: [],
				commit: true,
				commitMessage: 'Release v%VERSION%',
				commitFiles: ['-a'],
				createTag: true,
				tagName: '%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: true,
				pushTo: 'https://github.com/pupunzi/jquery.mb.miniAudioPlayer.git',
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
				globalReplace: false,
				prereleaseName: false,
				regExp: false
			}
		}

	});

	grunt.loadNpmTasks('grunt-include-replace');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-build-number');
	grunt.loadNpmTasks('grunt-bump');

	grunt.registerTask('buildN', ['buildnumber']);
	grunt.registerTask('default', ['copy','concat', 'uglify', 'cssmin', 'includereplace', 'buildnumber']);

};

(function (gulp, gulpLoadPlugins) {
	'use strict';
	var browserSync = require('browser-sync').create();
	var $ = gulpLoadPlugins({
			pattern: '*',
			lazy: true
		}),
		_ = {
			app: 'app',
			modules: 'app/modules',
			dist: 'dist',
			todist: 'todist',
			sass: 'sass',
			js: 'app/js',
			css: 'app/css',
			img: 'app/images',
			fonts: 'app/fonts'
		};

	function handleError(error) {
		console.log(error.message);
		this.emit('end');
	}

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ jshint
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('jshint', function () {
		return gulp.src(['gulpfile.js', _.js + '/**/*.js'])
		.pipe($.jshint('.jshintrc'))
		.pipe($.jshint.reporter('jshint-stylish'));
	});
	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ optimize images
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('image', function () {
		return gulp.src(_.img + '/**/*')
		.pipe($.imagemin({
			progressive: true
		}))
		.pipe($.size({
			title: 'IMAGE files:'
		}));
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ sass2css (node-sass)
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('sass', function () {
		return gulp.src(_.sass + '/**/*.{scss, sass}')
		.pipe($.plumber({
			errorHandler: handleError
		}))
		.pipe($.sourcemaps.init())
		.pipe($.sass({
			outputStyle: 'expanded',
			includePaths: ['./bower_components/']
		}))
		.pipe($.autoprefixer())
		.pipe($.sourcemaps.write('./'))
		.pipe(gulp.dest(_.todist + '/css'))
		.pipe(browserSync.reload({stream: true}))
		.pipe($.size({
			title: 'CSS files:'
		}));
	});

	gulp.task('zipJs', ['todist'], function () {
		gulp.src([_.todist + '/js/libs/*'])
		.pipe(gulp.dest(_.dist + '/js/libs/'));

		return gulp.src([_.todist + '/js/**/*.js'])
		.pipe($.uglify({
			compress: {
				pure_funcs: ['console.log', 'console.info', 'console.error']
			}
		}))
		.on('error', function (err) {
			$.util.log($.util.colors.red('[Error]'), err.toString());
		})
		.pipe(gulp.dest(_.dist + '/js/'));
	});

	gulp.task('libJs', function () {
		return gulp.src([_.app + '/js/libs/*'])
		.pipe(gulp.dest(_.todist + '/js/libs/'))
		.pipe(browserSync.reload({stream: true}));
	});
	gulp.task('cpJsTodist', ['libJs'], function () {
		return gulp.src([_.app + '/**/*.js', '!app/js/libs/*', '!app/flexible/*'])
		.pipe($.flatten())
		.pipe(gulp.dest(_.todist + '/js/'))
		.pipe(browserSync.reload({stream: true}));
	});
	gulp.task('copyImg', function () {
		return gulp.src([_.app + '/images/**/*'])
		.pipe(gulp.dest(_.todist + '/images/'));

	});

	gulp.task('copyFont', function () {
		return gulp.src([_.app + '/fonts/**/*'])
		.pipe(gulp.dest(_.todist + '/fonts/'));

	});
	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ join & minify css & js
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	// ['todist', 'zipJs'],
	gulp.task('moduleDist', ['zipJs'], function () {
		return gulp.src([_.todist + '/**/*', '!todist/css/**/*.map', '!todist/js/*', '!todist/*.html'])
		.pipe(gulp.dest(_.dist));
	});

	gulp.task('html', ['moduleDist'], function () {
		return gulp.src([_.todist + '/**/*.html', '!todist/index.html'])
		.pipe($.plumber())
		.pipe($.useref.assets())
		.pipe($.if('*.js', $.uglify({
			compress: {
				pure_funcs: ['console.log', 'console.info', 'console.error']
			}
		})))
		.pipe($.if('*.css', $.cleanCss({
			keepSpecialComments: 0
		})))
		.pipe($.useref.restore())
		.pipe($.useref())
		.pipe($.revAll.revision({
			dontRenameFile: ['.html'],
			dontUpdateReference: ['.html']
		}))
		.pipe(gulp.dest(_.dist));

	});
	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ copy app to todist folder
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('cpModule', ['sass', 'cpJsTodist'], function () {
		return gulp.src([_.app + '/**/*', '!app/modules/**/*', '!app/js/*'])
		.pipe(gulp.dest(_.todist));
	});

	gulp.task('todist', ['cpModule'], function () {
		return gulp.src([_.modules + '/**/*.html'])
		.pipe($.flatten({includeParents: 1}))
		.pipe(gulp.dest(_.todist))
		.pipe(browserSync.reload({stream: true}));
	});
	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ connect
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	// gulp.task('connect', ['todist'], function() {
	// 	$.connect.server({
	// 		root: ['./todist'],
	// 		port: 3500
	// 	});
	//
	// });
	gulp.task('connect', ['todist'], function () {
		browserSync.init({
			server: {
				baseDir: "./todist"
			},
			port: 3500,
			open: false
		}, function () {
			$.shelljs.exec('open http://h5-ts.chiyue365.develop/index.html');
		});
		gulp.watch(_.sass + '/**/*', ['sass']);
		gulp.watch(_.modules + '/**/*.js', ['cpJsTodist']);
		gulp.watch(_.app + '/**/*.js', ['cpJsTodist']);
		gulp.watch(_.modules + "/**/*.html", ['todist']);
		gulp.watch(_.img + "/**/*", ['copyImg']);
		gulp.watch(_.fonts + "/**/*", ['copyFont']);
	});
	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ server
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('server', ['connect'], function () {
		$.shelljs.exec('open http://h5-ts.chiyue365.develop/gotoapp.html');
	});


	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ clean dist folder
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('clean', function () {
		return $.del([_.dist]);
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ alias
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('start', ['connect']);
	gulp.task('test', ['jshint']);
	gulp.task('build', ['html'], function () {
		// return $.del([_.todist]);
	});

	//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//| ✓ default
	//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	gulp.task('default', ['build']);
}(require('gulp'), require('gulp-load-plugins')));

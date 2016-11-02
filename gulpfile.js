	var gulp = require("gulp"),
	pump = require("pump"),
	cleanCSS = require("gulp-clean-css"),
	uglify = require("gulp-uglify"),
	rename = require("gulp-rename"),
	sourcemaps = require("gulp-sourcemaps");

	gulp.task("minify-css", function() {
		return gulp.src(['./css/*.css', '!./css/*.min.css'])
		.pipe(sourcemaps.init())
		.pipe(cleanCSS())
		.pipe(rename(function(path) {
			path.basename += ".min";
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("css"))
	});

	gulp.task('compress', function (cb) {
		pump([
			gulp.src(['./js/*.js', '!./js/*.min.js']),
			uglify(),
			rename(function(path) {
				path.basename += ".min";
			}),
			gulp.dest('js')
			],
			cb
			);
	});

	gulp.task('watch', function() {
		gulp.watch(['/js/*.js', '!/js/*.min.js'] ['compress']);
		gulp.watch(['/css/*.css', '!/css/*.min.css'], ['minify-css']);
	})

	gulp.task('default', ['minify-css', 'compress']);
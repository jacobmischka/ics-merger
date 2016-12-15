/* eslint-env node */
const gulp = require('gulp');
const util = require('gulp-util');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');
const cssnano = require('cssnano');

gulp.task('sass', () => {
	let processors = [
		autoprefixer(),
		postcssImport({
			from: './sass/main.scss'
		})
	];
	if(util.env.production)
		processors.push(cssnano());

	return gulp.src('./sass/**/main.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss(processors))
		.pipe(gulp.dest('./public/css'));
});

gulp.task('sass:watch', ['sass'], () => {
	gulp.watch('./sass/**/*.scss', ['sass']);
});

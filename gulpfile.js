/* eslint-env node */
const gulp = require('gulp');
const util = require('gulp-util');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const nodeModules = './node_modules/';

gulp.task('import-css', () => {
	let imports = [
		'fullcalendar/dist/fullcalendar.css',
		'balloon-css/balloon.css'
	];

	imports = imports.map(file => nodeModules + file);

	gulp.src(imports)
		.pipe(rename(path => {
			path.basename = '_' + path.basename;
			path.extname = '.scss';
		}))
		.pipe(gulp.dest('./sass/imports'));
});

gulp.task('sass', () => {
	let processors = [
		autoprefixer()
	];
	if(util.env.production)
		processors.push(cssnano());

	return gulp.src('./sass/**/main.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss(processors))
		.pipe(gulp.dest('./public/css'));
});

gulp.task('sass:watch', ['import-css', 'sass'], () => {
	gulp.watch('./sass/**/*.scss', ['sass']);
});

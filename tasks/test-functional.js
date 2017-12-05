'use strict';

const gulp = require('gulp');
const settings = require('./settings.json');
const plugins = require('gulp-load-plugins')(settings.plugins);

const argv = require('yargs').argv;

gulp.task('functional', gulp.series([ 'build' ], (done) => {
  const server = gulp.src('.')
    .pipe(plugins.webserver({
      host: '0.0.0.0',
      port: 3001,
    }));

  plugins.env({
    vars: {
      PORT: 3001,
    },
  });

  return gulp.src(argv['test-files'] || settings.tests, {read: false})
    .pipe(plugins.plumber())
    .pipe(plugins.mocha({
      reporter: 'dot',
      require: [
        'babel-core/register',
        'ignore-styles',
      ],
    }))
    .on('end', () => {
      server.emit('kill');
      return done();
    })
    .on('error', (err) => done(err))
  ;
}));

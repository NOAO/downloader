'use strict';

var gulp = require('gulp');
var change = require('gulp-change');
var babel = require('gulp-babel');
var gulpif = require('gulp-if');
var gulpFilter = require('gulp-filter');
var shell = require('gulp-shell');
var wait = require('gulp-wait');
var clean = require('gulp-clean');
var zip = require('gulp-zip');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');

/* clean */
gulp.task('clean', function () {
  return gulp.src([
    'builds/unpacked/electron/*'
  ], {read: false})
    .pipe(clean());
});

function json (clean) {
  let config = require('./package.json');
  let version = config.version;
  if (clean) {
    version = version.replace(/.beta*/, '');
  }

  function code (version) {
    let [a, b, c] = version.split('.');
    return (+b) * 1000 + (+c) * 10 + 1;
  }

  return gulpif(f => f.relative.endsWith('.json') || f.relative.endsWith('.xml'), change(content => content
    .replace('%title;', config.title)
    .replace('%name;', config.name)
    .replace('%description;', config.description)
    .replace('%license;', config.license)
    .replace('%version;', version)
    .replace('%version-code;', code(version))
    .replace('%author;', config.author)
    .replace('%email;', config.email)
    .replace('%homepage;', config.homepage)
    .replace('%repository.url;', config.repository.url)
    .replace('%bugs.url;', config.bugs.url)
    .replace('config.keywords', JSON.stringify(config.keywords))
  ));
}

function shadow (browser) {
  let c1 = `    <script src="${browser}/${browser}.js"></script>\n    <script src="index.js"></script>`;
  let c2 = `    <script src="showdown.js"></script>\n    <script src="${browser}/${browser}.js"></script>\n    <script src="index.js"></script>`;
  let c3 = `    <script src="videojs/video.js"></script>\n    <script src="${browser}/${browser}.js"></script>\n    <script src="index.js"></script>`;
  return gulpif(f => f.relative.endsWith('info/index.html'),
    change(content => content.replace(/.*shadow_index\.js.*/, c2)),
    gulpif(f => f.relative.endsWith('preview/index.html'),
      change(content => content.replace(/.*shadow_index\.js.*/, c3)),
      gulpif(f => f.relative.endsWith('.html'), change(content => content.replace(/.*shadow_index\.js.*/, c1)))
    )
  );
}

/* electron build */
gulp.task('electron-build', function () {
  return gulp.src([
    'src/**/*'
  ])
  .pipe(gulpFilter(function (f) {
    if (f.relative.endsWith('.DS_Store') || f.relative.endsWith('Thumbs.db')) {
      return false;
    }
      return true;
  }))
  .pipe(json(true))
  .pipe(gulp.dest('builds/unpacked/electron'));
});
gulp.task('install-deps', function(){
    return gulp.src('').pipe(shell(['npm install'], {cwd: './builds/unpacked/electron'}));
});
gulp.task('electron-pack', function () {
  return gulp.src([
    'builds/unpacked/electron/**/*'
  ])
  .pipe(zip('electron.zip'))
  .pipe(gulp.dest('builds/packed'));
});
gulp.task('electron-install', function () {
  let keys = Object.keys(gulp.env).filter(key => key !== '_');
  let args = keys.map(key => `--${key}="${gulp.env[key]}"`).join(' ');
  return gulp.src('')
  .pipe(wait(1000))
  .pipe(shell([
    '"/Applications/Electron.app/Contents/MacOS/Electron" `pwd` ' + args + ' &'
  ], {
    cwd: './builds/unpacked/electron'
  }));
});
gulp.task('electron-pkg-linux', function(){
 let config = require('./package.json');
 return gulp.src('')
 .pipe(wait(1000))
 .pipe(shell([
 'npm install',
  `electron-packager . "Turbo Download Manager" --app-version=${config.version} --platform=linux --arch=x64 --electron-version=1.4.15`,
    'mv "Turbo Download Manager-linux-x64" tdm-linux-x64',
    '7z a -mx9 -r tdm-linux-x64.7z tdm-linux-x64/* > null',
    'mv tdm-linux-x64.7z ../..',
    'rm -r tdm-linux-x64/',
    ], {
    cwd: './builds/unpacked/electron'
    } ));
});
gulp.task('electron-packager', function () {
  let config = require('./package.json');
  return gulp.src('')
  .pipe(wait(1000))
  .pipe(shell([
    'npm install',
    `electron-packager . "Turbo Download Manager" --app-version=${config.version} --platform=darwin --arch=x64 --electron-version=1.4.15 --icon ../../packed/mac.icns`,
    'mv "Turbo Download Manager-darwin-x64" tdm-darwin-x64',
    '7z a -mx9 -r tdm-darwin-x64.7z tdm-darwin-x64/* > null',
    'mv tdm-darwin-x64.7z ../..',
    'rm -r tdm-darwin-x64/',
    `electron-packager . "Turbo Download Manager" --app-version=${config.version} --platform=win32 --arch=x64 --electron-version=1.4.15 --icon ../../packed/windows.ico`,
    'mv "Turbo Download Manager-win32-x64" tdm-win32-x64',
    '7z a -mx9 -r tdm-win32-x64.7z tdm-win32-x64/* > null',
    'mv tdm-win32-x64.7z ../..',
    'rm -r tdm-win32-x64/',
    `electron-packager . "Turbo Download Manager" --app-version=${config.version} --platform=win32 --arch=ia32 --electron-version=1.4.15 --icon ../../packed/windows.ico`,
    'mv "Turbo Download Manager-win32-ia32" tdm-win32-ia32',
    '7z a -mx9 -r tdm-win32-ia32.7z tdm-win32-ia32/* > null',
    'mv tdm-win32-ia32.7z ../..',
    'rm -r tdm-win32-ia32/',
    `electron-packager . "Turbo Download Manager" --app-version=${config.version} --platform=linux --arch=x64 --electron-version=1.4.15`,
    'mv "Turbo Download Manager-linux-x64" tdm-linux-x64',
    '7z a -mx9 -r tdm-linux-x64.7z tdm-linux-x64/* > null',
    'mv tdm-linux-x64.7z ../..',
    'rm -r tdm-linux-x64/',
    `electron-packager . "Turbo Download Manager" --app-version=${config.version} --platform=linux --arch=ia32 --electron-version=1.4.15`,
    'mv "Turbo Download Manager-linux-ia32" tdm-linux-ia32',
    '7z a -mx9 -r tdm-linux-ia32.7z tdm-linux-ia32/* > null',
    'mv tdm-linux-ia32.7z ../..',
    'rm -r tdm-linux-ia32/'
  ], {
    cwd: './builds/unpacked/electron'
  }));
});
gulp.task('electron', (callback) => runSequence('clean', 'electron-build', 'electron-pack', callback));
gulp.task('electron-linux', (callback)=> runSequence('clean','electron-build', 'electron-pkg-linux', callback));
gulp.task('electron-travis', (callback) => runSequence('clean', 'electron-build', 'electron-pack', 'install-deps', callback));

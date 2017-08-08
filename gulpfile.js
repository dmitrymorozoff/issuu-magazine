var path = {
  build: {
    html: "build/",
    pug: "src/",
    js: "build/js/",
    css: "build/css/",
    img: "build/img/",
    fonts: "build/fonts/",
    htaccess: "build/"
  },
  src: {
    html: "src/*.html",
    pug: "src/pug/pages/*.pug",
    js: "src/js/main.js",
    style: "src/style/main.scss",
    img: "src/img/**/*.*",
    fonts: "src/fonts/**/*.*",
    htaccess: "src/**/*.htaccess"
  },
  watch: {
    html: "src/**/*.html",
    pug: "src/pug/pages/*.pug",
    js: "src/js/**/*.js",
    style: "src/style/**/*.scss",
    img: "src/img/**/*.*",
    fonts: "src/fonts/**/*.*",
    htaccess: "src/**/*.htaccess"
  },
  clean: "./build"
};

var config = {
  server: {
    baseDir: "./build"
  },
  tunnel: true,
  host: "localhost",
  port: 3000
};

var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var watch = require("gulp-watch");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var uglify = require("gulp-uglify");
var imagemin = require("gulp-imagemin");
var pngquant = require("imagemin-pngquant");
var rimraf = require("rimraf");
var sourcemap = require("gulp-sourcemap");
var browserSync = require("browser-sync");
var csso = require("gulp-csso");
var pug = require("gulp-pug");
var rename = require("gulp-rename");
var reload = browserSync.reload;

gulp.task("html", function() {
  gulp
    .src(path.src.html)
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({ stream: true }));
});

gulp.task("pug", function() {
  gulp
    .src(path.src.pug)
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(gulp.dest(path.build.pug));
});

gulp.task("js", function() {
  gulp
    .src(path.src.js)
    .pipe(uglify())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({ stream: true }));
});

gulp.task("style:min", function() {
  return gulp
    .src(path.src.style)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({ stream: true }));
});

gulp.task("style", function() {
  return gulp
    .src(path.src.style)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({ stream: true }));
});

gulp.task("image", function() {
  gulp
    .src(path.src.img)
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngquant()],
        interlaced: true
      })
    )
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({ stream: true }));
});

gulp.task("fonts", function() {
  gulp.src(path.src.fonts).pipe(gulp.dest(path.build.fonts));
});

gulp.task("webserver", function() {
  browserSync(config);
});

gulp.task("htaccess", function() {
  gulp.src(path.src.htaccess).pipe(gulp.dest(path.build.htaccess));
});

gulp.task("clean", function(cb) {
  rimraf(path.clean, cb);
});

gulp.task("build", [
  "html",
  "js",
  "style",
  "style:min",
  "fonts",
  "htaccess",
  "image"
]);

gulp.task("watch", function() {
  watch([path.watch.pug], function(event, cb) {
    gulp.start("pug");
  });
  watch([path.watch.html], function(event, cb) {
    gulp.start("html");
  });
  watch([path.watch.style], function(event, cb) {
    gulp.start("style:min");
  });
  watch([path.watch.js], function(event, cb) {
    gulp.start("js");
  });
  watch([path.watch.img], function(event, cb) {
    gulp.start("image");
  });
  watch([path.watch.fonts], function(event, cb) {
    gulp.start("fonts");
  });
});

gulp.task("default", ["build", "webserver", "watch"]);

const { watch, src, dest, series } = require("gulp");
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;
const htmlmin = require("gulp-htmlmin");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");
const rename = require("gulp-rename");
const babel = require("gulp-babel");
const gulpuglify = require("gulp-uglify");

const directories = {
  html: __dirname + "/src/**/*.html",
  scss: __dirname + "/src/assets/scss/**/*.scss",
  js: __dirname + "/src/assets/js/**/*.js",
  output: __dirname + "/dist",
};

console.log(directories.scss);

// Static server
function serve() {
  browserSync.init({
    server: {
      baseDir: ".",
      directory: true,
    },
  });

  watch(directories.html).on("change", function () {
    html();
    reload();
  });

  watch(directories.scss).on("change", function () {
    scss();
    reload();
  });

  watch(directories.js).on("change", function () {
    js();
    reload();
  });
}

function html() {
  return src(directories.html)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(directories.output));
}

function scss() {
  return src(directories.scss)
    .pipe(sass())
    .pipe(autoprefixer({ overrideBrowserslist: ["last 99 versions"], cascade: false }))
    .pipe(cleancss())
    .pipe(rename({ extname: ".min.css" }))
    .pipe(dest(directories.output));
}

function js() {
  return src(directories.js)
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(gulpuglify())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(dest(directories.output));
}

exports.default = series(html, scss, js, serve);

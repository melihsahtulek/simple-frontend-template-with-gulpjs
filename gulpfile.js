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

// Static server
function serve() {
  browserSync.init({
    server: {
      baseDir: ".",
      directory: true,
    },
  });
}

function runhtml() {
  return src("./src/**/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest("./dist/"));
}

function runcss() {
  return src("./src/assets/scss/**/*.scss")
    .pipe(autoprefixer({ overrideBrowserslist: ["last 99 versions"], cascade: false }))
    .pipe(sass())
    .pipe(cleancss())
    .pipe(rename({ extname: ".min.css" }))
    .pipe(dest("./dist/"));
}

function runjs() {
  return src("./src/assets/js/**/*.js")
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(gulpuglify())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(dest("./dist/"));
}

function watchFiles() {
  watch("./src/**/*.html", runhtml).on("change", function () {
    reload();
  });

  watch("./src/assets/scss/**/*.scss", runcss).on("change", function () {
    reload();
  });

  watch("./src/assets/js/**/*.js", runjs).on("change", function () {
    reload();
  });
}

exports.default = series(runhtml, runcss, runjs, serve, watchFiles);

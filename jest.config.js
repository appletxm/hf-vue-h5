module.exports = {
  "moduleFileExtensions": [
    "js",
    "html",
    "json"
  ],
  "transform": {
    "^.+\\.js$": "babel-jest",
    "^.+\\.html$": "<rootDir>/mock/unit/html-loader.js"
  },
  "moduleDirectories": [
    "node_modules"
  ],
  "moduleNameMapper": {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|less|css)$": "<rootDir>/mock/unit/file-mock.js",
    "\\.(css|less)$": "<rootDir>/mock/unit/style-mock.js",
    "^vue$": "<rootDir>/node_modules/vue/dist/vue.min.js",
    "^env.cfg$": "<rootDir>/config/envMock.js",
    "^utils(.+)$": "<rootDir>/src/js/utils$1",
    "^store(.+)$": "<rootDir>/src/js/store/$1",
    "^pages(.+)$": "<rootDir>/src/js/pages/$1",
    "^components(.+)$": "<rootDir>/src/js/components/$1",
    "^assets(.+)$": "<rootDir>/src/assets/$1",
    "^common(.+)$": "<rootDir>/src/js/common/$1"
  },
  "collectCoverageFrom": ["<rootDir>/src/**/*.js"],
  "collectCoverage": true,
  "coverageReporters": [
    "json",
    "html"
  ],
  "globals": {
    "__DEV__": true
  }
}

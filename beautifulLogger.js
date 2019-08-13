"use strict";

let BEAUTIFULDEVELOPMENTMODE = true;

if (BEAUTIFULDEVELOPMENTMODE) {
  const style = [
    "color: rgb(48, 98, 223); font-style: italic",
    "color: rgb(255,255,255); font-style: italic"
  ];
  console.log(
    "%cusing %cbeautifulLogger.js %cversion %c1.0",
    style[1],
    style[0],
    style[1],
    style[0]
  );
}

let APPNAME = "beautifulLogger development";

// utilities used by classes

const utils = {
  isFunction: fn => {
    return fn && {}.toString.call(fn) === "[object Function]";
  },

  readLevels: (allLevels, level) => {
    let checkForLevel = allLevels.split(",");

    return checkForLevel.indexOf(level) > -1
      ? true
      : checkForLevel.indexOf("all") > -1
        ? true
        : false;
  },

  colors: {
    log: "rgb(213, 237, 237)",
    info: "rgb(48, 98, 223)",
    warn: "rgb(223, 118, 31)",
    error: "rgb(191, 34, 76)",
    success: "rgb(64, 215, 65)",
    failure: "rgb(255, 63, 57)"
  },

  getScriptName: () => {
    let error = new Error(),
      source,
      lastStackFrameRegex = new RegExp(/.+\/(.*?):\d+(:\d+)*$/),
      currentStackFrameRegex = new RegExp(/getScriptName \(.+\/(.*):\d+:\d+\)/);

    if (
      (source = lastStackFrameRegex.exec(error.stack.trim())) &&
      source[1] != ""
    )
      return source[1];
    else if ((source = currentStackFrameRegex.exec(error.stack.trim())))
      return source[1];
    else if (error.fileName != undefined) return error.fileName;
  },

  date: () => {
    let d = new Date();
    let yearMonthDay = [
      d.getFullYear(),
      (d.getMonth() + 1).toString().padStart(2, "0"),
      d
        .getDate()
        .toString()
        .padStart(2, "0")
    ].join(".");

    let hoursMinutesSeconds = [
      d
        .getHours()
        .toString()
        .padStart(2, "0"),
      d
        .getMinutes()
        .toString()
        .padStart(2, "0"),
      d
        .getSeconds()
        .toString()
        .padStart(2, "0")
    ].join(":");

    let fullDateTime = `${yearMonthDay}, ${hoursMinutesSeconds}`;

    return {
      yearMonthDay: yearMonthDay,
      hoursMinutesSeconds: hoursMinutesSeconds,
      fullDateTime: fullDateTime
    };
  },

  showStackTrace: () => {
    const styles = [
      "font-size: 14px; color: rgb(206, 96, 221)",
      "font-style: italic; font-size: 14px; color: rgb(206, 96, 221)"
    ];
    console.groupCollapsed(
      "%cstack trace %c(click to expand)",
      styles[0],
      style[1]
    );
    console.trace();
    console.groupEnd();
  }
};

// class for creating fancy console messages

class BeautifulLogger {
  constructor(appName = APPNAME) {
    this.levels = "all";

    this.fontsize = 14 + "px";

    this.headersize = 16 + "px";

    this.colors = utils.colors;

    this.verbosity = "high";

    this.appName = appName;
  }

  setAppName(appName) {
    if (!appName) {
      throw new Error(
        "BeautifulLogger.setAppName() must be called with an argument."
      );
    } else {
      APPNAME = appName;
      this.appName = APPNAME;
    }
  }

  // regular log messages
  log(msg) {
    let startTime = performance.now();
    if (this.levels.indexOf("none") > -1) return false;
    if (!msg) {
      throw new Error("beautifulLogger.log() must be called with an argument.");
    } else {
      if (utils.readLevels(this.levels, "log")) {
        let header = `%c[ ${utils.date().fullDateTime} ] ${APPNAME} log:`;

        let message = typeof msg == "string" ? `%c${msg}` : msg;

        let headerStyle = `color:${this.colors.log}; font-size:${
          this.headersize
        }; font-style: italic;`;
        let messageStyle =
          message == msg
            ? null
            : `color:${this.colors.log}; font-size:${this.fontsize}`;

        console.log(header, headerStyle);

        if (messageStyle) console.log(message, messageStyle);
        else console.log(message);

        // append stack trace in subgroup
        if (this.verbosity == "high") utils.showStackTrace();

        let endTime = performance.now();
        let totalTime = endTime - startTime;
        console.log(`total time: ${(totalTime * 1000).toFixed(2)} seconds.`);
        console.groupEnd();
      } else return false;
    }
  }

  // info messages, similar to log but a little more visible
  info(msg) {
    if (this.levels.indexOf("none") > -1) return false;
    if (!msg) {
      throw new Error(
        "BeautifulLogger.info() must be called with an argument."
      );
    } else {
      if (utils.readLevels(this.levels, "info")) {
        let icon = "📋 ↪";

        let header = `%c${icon} ${APPNAME}: ${utils.date().fullDateTime} info:`;

        let message = typeof msg == "string" ? `%c${msg}` : msg;

        let headerStyle = `color: ${this.colors.info}; font-size: ${
          this.headersize
        }`;

        let messageStyle =
          message == msg
            ? null
            : `color:${this.colors.log}; font-size:${this.fontsize}`;

        console.group("info");

        // log info
        console.log(header, headerStyle);
        if (messageStyle) console.log(message, messageStyle);
        else console.log(message);

        if (this.verbosity == "high") {
          // append stack trace in subgroup
          utils.showStackTrace();
        }
      } else return false;
    }
  }

  error(msg) {
    if (this.levels.indexOf("none") > -1) return false;
    if (!msg) {
      throw new Error(
        "beautifulLogger.error() must be called with an argument."
      );
    } else {
      if (utils.readLevels(this.levels, "error")) {
        let icon = "❌ ⇝";

        let header = `%c${icon} ${APPNAME}: ${
          utils.date().fullDateTime
        } error:`;

        let message = typeof msg == "string" ? `%c${msg}` : msg;

        let headerStyle = `font-style: italic; color: ${
          this.colors.error
        }; font-size: ${this.headersize}`;

        let messageStyle =
          message == msg
            ? null
            : `color:${this.colors.log}; font-size:${this.fontsize}`;

        console.group("error");

        // log message here

        console.log(header, headerStyle);
        if (messageStyle) console.log(message, messageStyle);
        else console.log(message);

        if (this.verbosity == "high") {
          // append stack trace in a subgroup
          utils.showStackTrace();
        }

        console.groupEnd();
      } else return false;
    }
  }

  // warnings, similar to errors but less severe
  warn() {
    if (this.levels.indexOf("none") > -1) return false;
    if (utils.readLevels(this.levels, "warn")) {
    } else return false;
  }

  // a way to check if something is working the way you expect it to work.
  assert(statement, description) {
    if (this.levels.indexOf("none") > -1) return false;
    if (!statement || !description)
      throw new Error("assert requires 3 arguments.");
    else {
      if (statement == true) console.log("true!");
      // temp
      else console.log("false!"); // temp
    }
  }

  // a log for when something fails and you want to see what it was
  fail(msg) {
    if (this.levels.indexOf("none") > -1) return false;
    let message = `%c${msg}`;

    let messageStyle = `color: ${this.colors.failure}; font-size: ${
      this.fontsize
    }`;

    console.trace(message, messageStyle);
  }

  // a log for when something succeeds and you want to see what it was
  success() {
    if (this.levels.indexOf("none") > -1) return false;
  }

  // clear the console
  clear() {
    console.clear();
    return 0;
  }

  // setlevels takes any amount of strings as arguments and
  // reduces the array to only acceptable logging levels
  setLevels() {
    levels = Array.from(new Set([...arguments]));

    if (levels.length == 0) {
      return false;
    } else {
      const acceptableLevels = ["log", "warn", "info", "error", "all", "none"];
      levels = levels.filter(
        level => (acceptableLevels.indexOf(level) > 0 ? true : false)
      );

      console.log(levels);

      this.levels = levels;

      return levels;
    }
  }

  // set verbosity
  setVerbosity(verbosity) {
    const acceptableVerbosity = ["high", "normal", "low"];
    if (acceptableVerbosity.indexOf(verbosity) < 0) this.verbosity = "normal";
    else this.verbosity = verbosity;

    return this.verbosity;
  }

  // log information about the library
  printInfo() {
    if (this.levels.indexOf("none") > -1) return false;
    console.group("library info:");
    let prefix = "%c====== beautiful 💖 logger v1.0 ======\r\n\r\n";
    let prefixStyle = `font-family: monospace; color: ${
      this.colors.success
    }; font-size: ${this.headersize}`;

    let msg = `%c[ ${utils.date().fullDateTime} ] INFORMATION:

    GENERAL:

    name: beautifulLogger.js
    version: 1.0,
    author: jpegzilla: https://jpegzilla.com,
    repository: https://github.com/jpegzilla/beautifulLogger

    APPLICATION/SYSTEM:

    application name: ${APPNAME},
    file: ${window.location.pathname}${utils.getScriptName()},
    agent: ${navigator.userAgent},
    platform: ${navigator.platform}
    `;

    let msgStyle = `font-style: italic; font-family: monospace; color: #fff`;
    console.log(prefix, prefixStyle);
    console.log(msg, msgStyle);
    console.groupEnd();
  }
}

// class for creating and running tests
// work in progress.

class BeautifulTester {
  constructor(name) {
    this.name = name;
    this.testingSet = {};
  }

  addTest(test) {
    if (!utils.isFunction(test))
      throw new Error("tests can only be defined as functions.");
  }

  suite(description = "test description", tests = []) {
    if (tests.length == 0) throw new Error("no tests to perform.");
    this.suiteName = description;

    const execute = tests => {
      tests.forEach(test => {
        console.log(test);
      });
    };

    execute();
  }
}

const logger = new BeautifulLogger("jpegzilla's testing app");

logger.log(utils.colors);
// logger.setLevels("none");
logger.printInfo();

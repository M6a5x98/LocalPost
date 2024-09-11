const [path, fs] = [require("path"), require("fs")];
class Logger {
  /**
   *
   * @param {string} logFilePath A path to the log file. The format is those of your OS
   */
  constructor(logFilePath) {
    if (!require("./features.json").Logger.enabled) {
      this.enabled = false;
      return;
    }
    if (typeof logFilePath !== "string" || this.checkPath(logFilePath)) {
      throw new Error("Path to log file is not correct");
    } else {
      this.logFile = path.resolve(logFilePath);
      this.createLogFile(logFilePath);
    }
  }
  //prettier-ignore
  checkPath (path) {
    if (process.platform === "win32" && path.includes("/")) {
      return false;
    }
    if (!process.platform === "win32" && path.includes("\\")) {
      return false;
    }
    return true;
  }
  createLogFile(path) {
    if (!fs.existsSync(path) && this.enabled) {
      fs.writeFileSync(
        path,
        "#LocalPost API Logger v1.0\n" +
          new Date().toLocaleString() +
          " [Logger.js] File created\n",
        "utf8"
      );
    }
  }
  /**
   *
   * @param {string} data The data to log
   * @param {string} logger The process logging the data
   */
  log(data, logger) {
    if (this.enabled) {
      const loggerName =
        logger[0].toUpperCase() + logger.slice(1).toLowerCase();
      const dataToLog = `${new Date().toLocaleString()} [${loggerName}] ${data}\n`;
      fs.appendFileSync(this.logFile, dataToLog, "utf8");
    }
  }
}

module.exports = { Logger };

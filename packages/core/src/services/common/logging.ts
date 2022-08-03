/* istanbul ignore file */
const prefix = '%cnent%c '

const colors = {
  log: [
    'color: white; background:#7566A0;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 5px',
    'color: inherit; background:none;font-weight:normal',
  ],
  debug: [
    'color: white; background:#44883E;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 5px',
    'color: inherit; background:none;font-weight:normal',
  ],
  warn: [
    'color: white; background:#ffc409;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 5px',
    'color: inherit; background:none;font-weight:normal;color:#FDD757;',
  ],
  error: [
    'color: white; background:#eb445a;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 5px',
    'color: inherit; background:none;font-weight:normal;color:red;',
  ],
}

/**
 * It logs a message to the console with a prefix and a color
 * @param {string} message - The message to log.
 */
export function log(message: string) {
  console.log(prefix + message, ...colors.log)
}

/**
 * It takes a string, prepends a prefix, and logs it to the console
 * @param {string} message - The message to be logged.
 */
export function debug(message: string) {
  console.debug(prefix + message, ...colors.debug)
}

/**
 * It takes a string, prefixes it with a warning message, and prints it to the console
 * @param {string} warning - The warning message to be displayed.
 */
export function warn(warning: string) {
  console.warn(prefix + warning, ...colors.warn)
}

/**
 * It takes an array of arguments and prints them to the console as a table
 * @param {any[]} args - any[] - The arguments to be logged.
 */
export function table(args: any[]) {
  console.table(args)
}

/**
 * `dir` is a function that takes an array of arguments and logs them to the console
 * @param {any[]} args - any[] - The arguments passed to the function.
 */
export function dir(args: any[]) {
  console.dir(args)
}

/**
 * It logs a message to the console, and if an error is passed in, it logs that too
 * @param {string} message - The message to be logged.
 * @param {Error} [error_] - The error object to be logged.
 */
export function error(message: string, error_?: Error) {
  console.error(prefix + message, ...colors.error, error_)
}

/**
 * If the value is true, then warn the user with the message
 * @param {boolean} value - boolean
 * @param {any} message - The message to be logged.
 */
export function warnIf(value: boolean, message: any) {
  if (value) {
    warn(message)
  }
}

/**
 * "If the value is true, log the message."
 *
 * The first parameter is a boolean value. The second parameter is a value of any type
 * @param {boolean} value - boolean - The value to check. If it's true, the message will be logged.
 * @param {any} message - The message to log.
 */
export function logIf(value: boolean, message: any) {
  if (value) {
    log(message)
  }
}

/**
 * If the value is true, then log the message
 * @param {boolean} value - boolean - The value to check. If it's true, the message will be logged.
 * @param {any} message - The message to log.
 */
export function debugIf(value: boolean, message: any) {
  if (value) {
    debug(message)
  }
}

import {CommanderError} from "commander";
import logger from "../logger.js";

export const safeExecute = (fn: Function) => {
  try {
    fn()
  } catch (e) {
    process.exitCode = 1;

    if (e instanceof CommanderError) {
      handleCommanderError(e)
      return
    }

    logger.error('uncaught exception', e)
  }
}


const handleCommanderError = (error: CommanderError) => {
  if (error.code === 'commander.missingArgument') {
    return
  }
}

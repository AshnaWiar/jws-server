import {CommanderError} from "commander";

export const safeExecute = (fn: Function) => {
  try {
    fn()
  } catch (e) {
    process.exitCode = 1;

    if (e instanceof CommanderError) {
      handleCommanderError(e)
      return
    }

    console.error(e)
  }
}


const handleCommanderError = (error: CommanderError) => {
  if (error.code === 'commander.missingArgument') {
    return
  }
}

#!/usr/bin/env node

import {createCLIProgram, parseProgramOptions} from "./cli/program.js";
import fileLoader from "./utils/file-loader.js";

const program = createCLIProgram();
const config = parseProgramOptions(program);

console.log('Starting webserver with the following options', config);

try {

  const specFile = fileLoader.loadSync(config.pathToSpecFile);
  console.log(specFile);

} catch (e) {
  if(e instanceof Error) {
    console.error(e.message);
  }
}


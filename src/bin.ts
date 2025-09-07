#!/usr/bin/env node

import {createCLIProgram, parseProgramOptions} from "./cli/program.js";

const program = createCLIProgram();
const config = parseProgramOptions(program);

console.log('Starting webserver with the following options', config);



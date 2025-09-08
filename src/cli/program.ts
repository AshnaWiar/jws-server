import {Command} from "commander";

export const createCLIProgram = () => {
  const program = new Command();

  return program
    .name('jws-server')
    .description('Startup json websocket server')
    .option('-H, --host <hostname>', 'Websocket server hostname', 'localhost')
    .option('-p, --port <port>', 'Websocket server port', (v) => parseInt(v), 3000)
    .version('1.0.0', '-v, --version', 'print version')
    .helpOption('-h, --help', 'print usage')
    .argument('<spec-file>', 'Path to spec file (required unless -c, --config is provided)')
    .enablePositionalOptions(false)
    .addHelpText('after',
      '\nExamples:\n'
      + `  ${program.name()} jws-spec.json                              Start websocket server\n`
      + `  ${program.name()} -c jws-config.json                         Start with config file settings\n`
      + `  ${program.name()} -c jws-config.json jw-spec.json            Override [spec-file] from config\n`
      + `  ${program.name()} -c jws-config.json [options]               Override config options via CLI\n`
      + '\n'
      + 'For more help on how to use jws-server, head to https://github.com/ashnawiar/jws-server')

}

export const parseProgramOptions = (cmd: Command) => {
  const program = cmd.parse();
  const [firstArg] = program.args;
  const options = program.opts();

  if (firstArg === 'help') {
    program.help() // stops process after print
  }

  if (firstArg === 'version') {
    console.log(program.version()!);
    process.exit(0);
  }

  return {
    host: options.host,
    port: options.port,
    pathToSpecFile: firstArg,
  }
}
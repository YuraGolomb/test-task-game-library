/* istanbul ignore file */
import readline from 'readline';
import {printSpeamLogo} from './consoleTricks';
import Runner from './runner';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

console.log('Welcome to Speam');
printSpeamLogo();
console.log(
  'Commands: add game, add user, add community, manage users, manage communities'
);

rl.on('line', line => {
  Runner.runCommand(line);
});

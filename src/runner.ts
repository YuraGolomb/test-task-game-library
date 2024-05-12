import {createCommunity, manageCommunities} from './flows/communities';
import {createGamer, manageUsers} from './flows/gamers';
import {createGame} from './flows/games';

const commandMap = new Map<string, () => Generator>();
commandMap.set('add game', createGame);
commandMap.set('add user', createGamer);
commandMap.set('add community', createCommunity);
commandMap.set('manage users', manageUsers);
commandMap.set('manage communities', manageCommunities);

class Runner {
  private constructor() {}

  private static currentFlow: Generator;
  private static flowFinished: boolean;

  static runCommand(command: string) {
    if (!this.currentFlow || Runner.flowFinished) {
      const flow = commandMap.get(command);

      if (!flow) {
        return console.log('Please enter a valid command');
      }

      Runner.currentFlow = flow();
    }

    const output = Runner.currentFlow.next(command);

    console.log(output.value);

    Runner.flowFinished = Boolean(output.done);

    if (output.done) {
      console.log(
        'Commands: add game, add user, add community, manage users, manage communities'
      );
    }
  }
}

export default Runner;

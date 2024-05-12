import {printUser} from '../consoleTricks';
import db from '../db';
import Gamer, {Gender} from '../entities/Gamer';
import {createNewGamer} from '../uitls';

const supportedGenders = ['male', 'female', 'non-binary'];

export function* createGamer(): Generator<string, string, string> {
  const nickname = (yield 'Nickname:').trim();

  let gender = 'male' as Gender;
  let genderValid = false;

  do {
    const input = (yield 'Gender (male, female, non-binary):').trim();
    if (!supportedGenders.includes(input)) {
      console.log(
        'Please enter one of the supported genders: male, female, non-binary'
      );
      continue;
    }
    gender = input as Gender;
    genderValid = true;
  } while (!genderValid);

  const newUser = createNewGamer(nickname, gender);
  db.users.push(newUser);

  printUser();

  return `Complete (${newUser.id})`;
}

function* addGameForUser(user: Gamer): Generator<string, string, string> {
  do {
    console.log('\nList of games:');
    db.games.forEach(g => g.info());

    const input =
      (yield '\n Type the game name to add or type "back" to go to previous menu').trim();

    if (input === 'back') {
      return '';
    }

    if (!db.games.find(game => game._name === input)) {
      console.log(`Game with name "${input}" wasn't found`);
      continue;
    }

    if (user.games.includes(input)) user.addGame(input);

    const confirmation =
      (yield 'do you wasnt to add another game? (yes/no)').trim();
    if (confirmation === 'yes') {
      continue;
    } else {
      return '';
    }
  } while (true);
}

function* removeGameFromUser(user: Gamer): Generator<string, string, string> {
  do {
    console.log('\nList of user games:');
    user.games.forEach(g => console.log(g));

    const input =
      (yield '\n Type the game name to remove or type "back" to go to previous menu').trim();

    if (input === 'back') {
      return '';
    }

    if (!user.games.find(game => game === input)) {
      console.log(`Game with name "${input}" wasn't found`);
      continue;
    }

    user.removeGame(input);

    const confirmation =
      (yield 'do you wasnt to remove another game? (yes/no)').trim();
    if (confirmation === 'yes') {
      continue;
    } else {
      return '';
    }
  } while (true);
}

const manageUserCommands = ['back', 'add game', 'remove game', 'delete user'];
function* manageUser(userId: string): Generator<string, string, string> {
  const user = db.users.find(user => user.id === userId);
  if (!user) {
    return 'No user';
  }
  console.log('\nSelected user:');
  console.table(user);

  console.log('Type "back" to go ot oprevious menu');

  let input = '';
  do {
    input = (yield 'Commands: delete user, add game, remove game').trim();

    if (!manageUserCommands.includes(input)) {
      console.log(
        "Please enter a valid command: 'back', 'add game', 'remove game', 'delete user'"
      );
    }

    if (input === 'delete user') {
      const confirmation = (yield 'type "yes" to confirm user deletion').trim();
      if (confirmation === 'yes') {
        db.users = db.users.filter(user => user.id !== userId);

        return 'Complete';
      }
    }

    if (input === 'add game') {
      yield* addGameForUser(user);
    }

    if (input === 'remove game') {
      yield* removeGameFromUser(user);
    }

    if (input === 'back') {
      return 'Complete';
    }
  } while (true);
}

export function* manageUsers(): Generator<string, string, string> {
  do {
    console.log('\nList of users:');
    console.table(db.users);

    const input =
      (yield 'Enter user id you want to manage or "back" to leave the menu:').trim();

    if (input === 'back') {
      return 'Complete';
    }

    if (!db.users.find(user => user.id === input)) {
      console.log('There are no users with such ID');
      continue;
    }

    yield* manageUser(input);
  } while (true);
}

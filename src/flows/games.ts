import {printHappy} from '../consoleTricks';
import db from '../db';
import {Genre} from '../entities/Game';
import {createNewGame} from '../uitls';

const supportedGenres = ['soulslike', 'shooter', 'race'];

export function* createGame(): Generator<string, string, string> {
  let gameName = '';
  let nameValid = false;

  do {
    const input = (yield 'Game name:').trim();
    if (input.length < 3) {
      console.log('Name should have at least 3 chars');
      continue;
    }

    if (db.games.find(game => game._name === input)) {
      console.log('Game with such name already exists');
      continue;
    }

    gameName = input;
    nameValid = true;
  } while (!nameValid);

  let gameYear = 0;
  let gameYearValid = false;

  do {
    const input = (yield 'Game year').trim();

    const numberInput = Number(input);

    if (Number.isNaN(numberInput)) {
      console.log('Please enter a valid number');
      continue;
    }

    if (!Number.isInteger(numberInput)) {
      console.log('Please enter an integer number');
      continue;
    }

    if (numberInput <= 0) {
      console.log('Please enter a positive');
      continue;
    }

    gameYear = numberInput;
    gameYearValid = true;
  } while (!gameYearValid);

  let genre: Genre = 'soulslike';
  let genreValid = false;

  do {
    const input = (yield 'Game genre (soulslike, shooter, race)').trim();
    if (!supportedGenres.includes(input)) {
      console.log(
        'Please enter one of the supported genres: soulslike, shooter, race'
      );
      continue;
    }
    genre = input as Genre;
    genreValid = true;
  } while (!genreValid);

  db.games.push(createNewGame(gameName, gameYear, genre));

  printHappy();

  return 'Complete';
}

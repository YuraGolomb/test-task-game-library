/* istanbul ignore file */
import Community from './entities/Community';
import {GameName, Genre} from './entities/Game';
import Gamer, {Gender} from './entities/Gamer';
import Race from './entities/Race';
import Shooter from './entities/Shooter';
import Soulslike from './entities/Soulslike';

const GenreMap = {
  soulslike: Soulslike,
  race: Race,
  shooter: Shooter,
};

export function createNewGame(name: GameName, year: number, genre: Genre) {
  return new GenreMap[genre](name, year);
}

export function createNewGamer(nickname: string, gender: Gender) {
  return new Gamer(nickname, gender);
}

export function createNewCommunity(name: string) {
  return new Community(name);
}

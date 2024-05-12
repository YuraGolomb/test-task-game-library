import {v4 as uuidv4} from 'uuid';
import {GameName} from './Game';

export type Gender = 'male' | 'female' | 'non-binary';

class Gamer {
  constructor(nickname: string, gender: Gender) {
    this.id = uuidv4();
    this.nickname = nickname;
    this.gender = gender;
  }

  id: string;
  nickname: string;
  gender: string;
  games: GameName[] = [];

  addGame(game: GameName) {
    this.games.push(game);
  }

  addGames(games: GameName[]) {
    this.games = this.games.concat(games);
  }

  removeGame(gamename: GameName) {
    this.games = this.games.filter(game => game !== gamename);
  }

  hasGame(gamename: GameName) {
    return this.games.includes(gamename);
  }
}

export default Gamer;

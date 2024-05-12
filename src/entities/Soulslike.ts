/* istanbul ignore file */
import Game from './Game';
import type {GameName} from './Game';

class Soulslike extends Game {
  constructor(name: GameName, year: number) {
    super(name, year, 'soulslike');
  }
}

export default Soulslike;

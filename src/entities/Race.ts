/* istanbul ignore file */
import Game from './Game';
import type {GameName} from './Game';

class Race extends Game {
  constructor(name: GameName, year: number) {
    super(name, year, 'race');
  }
}

export default Race;

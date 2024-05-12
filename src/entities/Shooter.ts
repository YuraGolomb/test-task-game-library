/* istanbul ignore file */

import Game from './Game';
import type {GameName} from './Game';

class Shooter extends Game {
  constructor(name: GameName, year: number) {
    super(name, year, 'shooter');
  }
}

export default Shooter;

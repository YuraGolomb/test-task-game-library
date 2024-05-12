export type Genre = 'soulslike' | 'shooter' | 'race';
export type GameName = string;

const discount: Record<Genre, number> = {
  soulslike: 35,
  shooter: 10,
  race: 20,
};

abstract class Game {
  constructor(name: GameName, year: number, genre: Genre) {
    if (!Number.isInteger(year)) {
      throw new TypeError('The year must be an integer');
    }

    if (year <= 0) {
      throw new TypeError('The year must be greater than zero');
    }

    if (name.length < 3) {
      throw new TypeError('The name must have 3 or more characters');
    }

    this.year = year;
    this._name = name;
    this.genre = genre;
  }

  info(): string {
    return `${this.name} (${this.year}) - ${discount[this.genre]}`;
  }

  _name: GameName;
  get name(): GameName {
    return `*${this._name}*`;
  }

  set name(name: GameName) {
    this._name = name;
  }

  genre: Genre;
  year: number;
}

export default Game;

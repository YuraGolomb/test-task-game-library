import {createGame} from '../games';

describe('games-related flows', () => {
  describe('createGame', () => {
    beforeEach(() => {
      jest.spyOn(console, 'log').mockImplementation(() => {});
      jest.spyOn(console, 'table').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('validates the length of the game name', () => {
      const gen = createGame();

      const step = gen.next();

      expect(step.value).toEqual('Game name:');

      gen.next('h');
      expect(console.log).toHaveBeenCalledWith(
        'Name should have at least 3 chars'
      );
    });

    it('validates the duplicates of the game name', () => {
      const gen = createGame();

      const step = gen.next();

      expect(step.value).toEqual('Game name:');

      gen.next('Dark bowls');
      expect(console.log).toHaveBeenCalledWith(
        'Game with such name already exists'
      );
    });

    const cases = [
      ['to be number', 'hehe', 'Please enter a valid number'],
      ['to be integter number', '15.8', 'Please enter an integer number'],
      ['to be positive number', '-5', 'Please enter a positive'],
    ];

    test.each(cases)('validates the game year %p', (_, value, result) => {
      const gen = createGame();

      const step = gen.next();

      expect(step.value).toEqual('Game name:');

      const step2 = gen.next('Dark bowls 3');

      expect(step2.value).toEqual('Game year');

      gen.next(value);
      expect(console.log).toHaveBeenCalledWith(result);
    });

    const genreCases = [
      ['soulslike to be valid', 'soulslike', ''],
      ['race to be valid', 'race', ''],
      ['shooter to be valid', 'shooter', ''],
      [
        'asdfsadf to be invalid',
        'asdfsadf',
        'Please enter one of the supported genres: soulslike, shooter, race',
      ],
    ];
    test.each(genreCases)('validates the game genre %p', (_, genre, result) => {
      const gen = createGame();

      const step = gen.next();

      expect(step.value).toEqual('Game name:');

      const step2 = gen.next(`Dark bowls 3 ${genre}`);

      expect(step2.value).toEqual('Game year');

      const step3 = gen.next('1944');

      expect(step3.value).toEqual('Game genre (soulslike, shooter, race)');

      const step4 = gen.next(genre);
      if (result) {
        expect(console.log).toHaveBeenCalledWith(result);
      } else {
        expect(step4.value).toBe('Complete');
      }
    });
  });
});

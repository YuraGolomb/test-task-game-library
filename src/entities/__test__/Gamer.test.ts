import Gamer from '../Gamer';

describe('class Gamer', () => {
  let gamer: Gamer;

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'table').mockImplementation(() => {});

    gamer = new Gamer('vasya', 'male');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('addGame', () => {
    gamer.addGame('mega-game');
    gamer.addGame('mega-game2');

    expect(gamer.games).toEqual(['mega-game', 'mega-game2']);
  });

  it('addGames', () => {
    gamer.addGame('mega-game');
    gamer.addGames(['mega-game2', 'omega-game']);

    expect(gamer.games).toEqual(['mega-game', 'mega-game2', 'omega-game']);
  });

  it('removeGame', () => {
    gamer.addGames(['mega-game', 'mega-game2', 'omega-game']);
    gamer.removeGame('mega-game2');
    expect(gamer.games).toEqual(['mega-game', 'omega-game']);
  });

  it('hasGame', () => {
    gamer.addGames(['mega-game', 'mega-game2', 'omega-game']);
    expect(gamer.hasGame('mega-game')).toBe(true);
    expect(gamer.hasGame('mega-game2')).toBe(true);
    expect(gamer.hasGame('mega-game3')).toBe(false);
  });
});

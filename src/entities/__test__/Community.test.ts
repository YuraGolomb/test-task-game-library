import Community from '../Community';
import Gamer from '../Gamer';
import Race from '../Race';
import Shooter from '../Shooter';
import Soulslike from '../Soulslike';

describe('Community class', () => {
  let community: Community;
  let gamer: Gamer;

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'table').mockImplementation(() => {});

    community = new Community('test');
    gamer = new Gamer('vasya', 'male');

    community.addMember(gamer);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('adds member', () => {
    expect(community.members).toEqual([gamer]);
  });

  it('removes member by passing object', () => {
    expect(community.members).toEqual([gamer]);

    community.removeMember(gamer);

    expect(community.members).toEqual([]);
  });

  it('remvoes member by passing ID', () => {
    expect(community.members).toEqual([gamer]);

    community.removeMemberById(gamer.id);

    expect(community.members).toEqual([]);
  });

  describe('hasMember', () => {
    it('checks if member is in community', () => {
      expect(community.hasMember(gamer.id)).toBe(true);
    });

    it('returns false when there is no member', () => {
      const gamer2 = new Gamer('masha', 'female');
      expect(community.hasMember(gamer2.id)).toBe(false);
    });
  });

  describe('listMembers', () => {
    it('lists members when there are members', () => {
      const consoleSpy = jest.spyOn(console, 'table');
      community.listMembers();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('throws when there are no members', () => {
      const consoleSpy = jest.spyOn(console, 'table');
      community.removeMember(gamer);

      expect(() => community.listMembers()).toThrow();
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('listMembersAndGames', () => {
    it('lists members and games when there are members', () => {
      const consoleSpy = jest.spyOn(console, 'table');
      community.listMembersAndGames();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('throws when there are no members', () => {
      const consoleSpy = jest.spyOn(console, 'table');
      community.removeMember(gamer);

      expect(() => community.listMembersAndGames()).toThrow();
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('listGamesOfMember', () => {
    it('lists games of member when there are members', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      community.listGamesOfMember(gamer.id);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('throws when there are no members', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      community.removeMember(gamer);

      expect(() => community.listGamesOfMember(gamer.id)).toThrow();
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  it('listTopGames displays top games', () => {
    [
      new Soulslike('Dark bowls', 2011),
      new Soulslike('Machetiro', 2014),
      new Shooter('Counter Counter Strike', 2001),
      new Race('Forza', 2012),
    ];
    const gamers = [
      new Gamer('Petro', 'male'),
      new Gamer('Nina', 'female'),
      new Gamer('Vurst', 'non-binary'),
    ];

    gamers[0].addGames(['Dark bowls', 'Forza']);
    gamers[1].addGames(['Dark bowls', 'Machetiro', 'Forza']);
    gamers[2].addGames(['Dark bowls', 'Counter Counter Strike', 'Machetiro']);

    community.addMember(gamers[0]);
    community.addMember(gamers[1]);
    community.addMember(gamers[2]);

    const result = community.listTopGames();

    expect(result).toEqual([
      {game: 'Dark bowls', value: 3},
      {game: 'Forza', value: 2},
      {game: 'Machetiro', value: 2},
    ]);
  });
});

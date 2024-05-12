import Gamer from './Gamer';

type TopGame = {game: string; value: number};

const initialTopThree: TopGame[] = [
  {game: 'Empty', value: 0},
  {game: 'Empty', value: 0},
  {game: 'Empty', value: 0},
];

function createNewTopThree(topThree: TopGame[], game: string, value: number) {
  if (topThree[0].value < value) {
    topThree[2] = topThree[1];
    topThree[1] = topThree[0];
    topThree[0] = {game, value};

    return topThree;
  }

  if (topThree[1].value < value) {
    topThree[2] = topThree[1];
    topThree[1] = {game, value};

    return topThree;
  }

  if (topThree[2].value < value) {
    topThree[2] = {game, value};

    return topThree;
  }
  return topThree;
}

class Community {
  constructor(name: string) {
    this.name = name;
  }

  name: string;
  members: Gamer[] = [];

  addMember(gamer: Gamer) {
    this.members.push(gamer);
  }

  removeMember(gamer: Gamer) {
    this.members = this.members.filter(member => member.id !== gamer.id);
  }

  removeMemberById(gamerId: string) {
    this.members = this.members.filter(member => member.id !== gamerId);
  }

  hasMember(userId: string) {
    return !!this.members.find(member => member.id === userId);
  }

  listMembers() {
    if (this.members.length < 1) {
      throw new Error('There should be at least one member in the community');
    }
    const list = this.members.map(({id, nickname}) => ({id, nickname}));
    console.table(list);
  }

  listMembersAndGames() {
    if (this.members.length < 1) {
      throw new Error('There should be at least one member in the community');
    }
    const list = this.members.map(({id, nickname, games}) => ({
      id,
      nickname,
      games,
    }));
    console.table(list);
  }

  listGamesOfMember(memberId: string) {
    if (this.members.length < 1) {
      throw new Error('There should be at least member in the community');
    }
    const member = this.members.find(member => member.id === memberId);
    if (!member) {
      console.log('No member with such id');
    } else {
      console.log(member.games);
    }
  }

  listTopGames() {
    if (this.members.length < 1) {
      throw new Error('There should be at least member in the community');
    }

    const allGames = this.members.reduce(
      (allGames, member) => {
        member.games.forEach(game => {
          if (!allGames[game]) {
            allGames[game] = 1;
          } else {
            allGames[game]++;
          }
        });

        return allGames;
      },
      {} as Record<string, number>
    );
    const topThreeGames = Object.entries(allGames).reduce(
      (topThree, [game, players]) => {
        return createNewTopThree(topThree, game, players);
      },
      initialTopThree
    );

    if (!topThreeGames[0].value) {
      return console.log('The members are not playig games here');
    } else {
      console.log(
        `Top Game - ${topThreeGames[0].game} with ${topThreeGames[0].value} players`
      );
    }
    console.log(
      `Top 2 - ${topThreeGames[1].game} with ${topThreeGames[1].value} players`
    );
    console.log(
      `Top 3 - ${topThreeGames[2].game} with ${topThreeGames[2].value} players`
    );

    return topThreeGames;
  }
}

export default Community;

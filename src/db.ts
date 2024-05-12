/* istanbul ignore file */
import Community from './entities/Community';
import Game from './entities/Game';
import Gamer from './entities/Gamer';
import Race from './entities/Race';
import Shooter from './entities/Shooter';
import Soulslike from './entities/Soulslike';

const db = {
  games: [
    new Soulslike('Dark bowls', 2011),
    new Soulslike('Machetiro', 2014),
    new Shooter('Counter Counter Strike', 2001),
    new Race('Forza', 2012),
  ] as Game[],
  users: [
    new Gamer('Petro', 'male'),
    new Gamer('Nina', 'female'),
    new Gamer('Vurst', 'non-binary'),
  ] as Gamer[],
  communities: [
    new Community('dota4life'),
    new Community('havefun'),
  ] as Community[],
};

db.users[0].addGames(['Dark bowls', 'Counter Counter Strike', 'Forza']);
db.users[1].addGames(['Dark bowls', 'Machetiro', 'Forza']);
db.users[2].addGames(['Counter Counter Strike', 'Machetiro']);

db.communities[0].addMember(db.users[0]);
db.communities[0].addMember(db.users[2]);

db.communities[1].addMember(db.users[1]);
db.communities[1].addMember(db.users[2]);

export default db;

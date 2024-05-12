import db from '../db';
import Community from '../entities/Community';
import {createNewCommunity} from '../uitls';

export function* createCommunity(): Generator<string, string, string> {
  let communityName = '';
  let nameValid = false;

  do {
    const input = (yield 'Community name:').trim();
    if (input.length < 3) {
      console.log('Name should have at least 3 chars');
      continue;
    }

    if (db.communities.find(community => community.name === input)) {
      console.log('Community with such name already exists');
      continue;
    }

    communityName = input;
    nameValid = true;
  } while (!nameValid);

  db.communities.push(createNewCommunity(communityName));

  console.log(db.communities);

  return 'Complete';
}

function* addUserToCommunity(
  community: Community
): Generator<string, string, string> {
  do {
    console.log('\nList of users:');
    db.users.forEach(u => console.log(u));

    const input =
      (yield '\nType the userId to add or type "back" to go to previous menu').trim();

    if (input === 'back') {
      return '';
    }

    const user = db.users.find(user => user.id === input);
    if (!user) {
      console.log(`User with Id "${input}" wasn't found`);
      continue;
    }

    if (community.hasMember(input)) {
      console.log('User is already in the community');
      continue;
    }

    community.addMember(user);

    const confirmation =
      (yield 'do you wasnt to add another user? (yes/no)').trim();
    if (confirmation === 'yes') {
      continue;
    } else {
      return '';
    }
  } while (true);
}

function* removeUserFromCommunity(
  community: Community
): Generator<string, string, string> {
  do {
    console.log('\nList of users:');
    community.members.forEach(u => console.log(u));

    const input =
      (yield '\nType the userId to remove or type "back" to go to previous menu').trim();

    if (input === 'back') {
      return '';
    }

    if (!community.members.find(member => member.id === input)) {
      console.log(`User with Id "${input}" wasn't found`);
      continue;
    }

    community.removeMemberById(input);

    const confirmation =
      (yield 'do you wasnt to remove another user? (yes/no)').trim();
    if (confirmation === 'yes') {
      continue;
    } else {
      return '';
    }
  } while (true);
}

const manageCommunityCommands = [
  'back',
  'add user',
  'remove user',
  'delete community',
  'list members and games',
  'list top games',
];
function* manageCommunity(
  communityName: string
): Generator<string, string, string> {
  const community = db.communities.find(comm => comm.name === communityName);
  if (!community) {
    return 'No community';
  }
  console.log('\nSelected community:');
  console.table(community);

  console.log('Type "back" to go to oprevious menu');

  let input = '';
  do {
    input =
      (yield 'Commands: add user, remove user, delete community, list members and games, list top games').trim();

    if (!manageCommunityCommands.includes(input)) {
      console.log(
        "Please enter a valid command: 'add user', 'remove user', 'delete community', 'list members and games', 'list top games'"
      );
    }

    if (input === 'delete community') {
      const confirmation =
        (yield 'type "yes" to confirm community deletion').trim();
      if (confirmation === 'yes') {
        db.communities = db.communities.filter(
          comm => comm.name !== communityName
        );

        return 'Complete';
      }
    }

    if (input === 'add user') {
      yield* addUserToCommunity(community);
    }

    if (input === 'remove user') {
      yield* removeUserFromCommunity(community);
    }

    if (input === 'list members and games') {
      community.listMembersAndGames();
      continue;
    }

    if (input === 'list top games') {
      community.listTopGames();
      continue;
    }

    if (input === 'back') {
      return 'Complete';
    }
  } while (true);
}

export function* manageCommunities(): Generator<string, string, string> {
  do {
    console.log('\nList of communities:');
    console.table(db.communities);

    const input =
      (yield 'Enter community name you want to manage or "back" to leave the menu:').trim();

    if (input === 'back') {
      return 'Complete';
    }

    if (!db.communities.find(comm => comm.name === input)) {
      console.log('There are no community with such name');
      continue;
    }

    yield* manageCommunity(input);
  } while (true);
}

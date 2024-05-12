import db from '../../db';
import Community from '../../entities/Community';
import Gamer from '../../entities/Gamer';
import {createCommunity, manageCommunities} from '../communities';

describe('community-related flows', () => {
  describe('createCommunity', () => {
    beforeEach(() => {
      jest.spyOn(console, 'log').mockImplementation(() => {});
      jest.spyOn(console, 'table').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    const nameCases = [
      ['length', 'as', 'Name should have at least 3 chars'],
      ['success', 'fella', ''],
      [
        'that already exists',
        'havefun',
        'Community with such name already exists',
      ],
    ];
    test.each(nameCases)('validates the name %p', (_, value, result) => {
      const gen = createCommunity();

      const step1 = gen.next();

      expect(step1.value).toBe('Community name:');
      const step2 = gen.next(value);

      if (result) {
        expect(console.log).toHaveBeenCalledWith(result);
      } else {
        expect(step2.value).toBe('Complete');
      }
    });
  });

  describe('manageCommunities', () => {
    beforeEach(() => {
      jest.spyOn(console, 'log').mockImplementation(() => {});
      jest.spyOn(console, 'table').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('ends when user enters "back"', () => {
      const gen = manageCommunities();

      const step1 = gen.next();

      expect(console.log).toHaveBeenCalledWith('\nList of communities:');
      expect(console.table).toHaveBeenCalledWith(db.communities);
      expect(step1.value).toEqual(
        'Enter community name you want to manage or "back" to leave the menu:'
      );
      const step2 = gen.next('back');
      expect(step2.value).toEqual('Complete');
    });

    it('validates the community name', () => {
      const gen = manageCommunities();

      const step1 = gen.next();

      expect(console.log).toHaveBeenCalledWith('\nList of communities:');
      expect(console.table).toHaveBeenCalledWith(db.communities);
      expect(step1.value).toEqual(
        'Enter community name you want to manage or "back" to leave the menu:'
      );
      gen.next('haha');

      expect(console.log).toHaveBeenCalledWith(
        'There are no community with such name'
      );
    });

    it('allows to manage community', () => {
      const gen = manageCommunities();

      const step1 = gen.next();

      expect(console.log).toHaveBeenCalledWith('\nList of communities:');
      expect(console.table).toHaveBeenCalledWith(db.communities);
      expect(step1.value).toEqual(
        'Enter community name you want to manage or "back" to leave the menu:'
      );
      const step2 = gen.next('havefun');

      const community = db.communities.find(comm => comm.name === 'havefun');

      expect(console.log).toHaveBeenCalledWith('\nSelected community:');
      expect(console.table).toHaveBeenCalledWith(community);
      expect(step2.value).toEqual(
        'Commands: add user, remove user, delete community, list members and games, list top games'
      );
    });

    describe('community deletion', () => {
      beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'table').mockImplementation(() => {});
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('asks for confirmation and does not delete community if user typed anyhtin but "yes"', () => {
        const gen = manageCommunities();

        const step1 = gen.next();

        expect(console.log).toHaveBeenCalledWith('\nList of communities:');
        expect(console.table).toHaveBeenCalledWith(db.communities);
        expect(step1.value).toEqual(
          'Enter community name you want to manage or "back" to leave the menu:'
        );
        const step2 = gen.next('havefun');

        const community = db.communities.find(comm => comm.name === 'havefun');

        expect(console.log).toHaveBeenCalledWith('\nSelected community:');
        expect(console.table).toHaveBeenCalledWith(community);
        expect(step2.value).toEqual(
          'Commands: add user, remove user, delete community, list members and games, list top games'
        );

        const step3 = gen.next('delete community');
        expect(step3.value).toEqual('type "yes" to confirm community deletion');

        const step4 = gen.next('oh yes');
        expect(step4.value).toEqual(
          'Commands: add user, remove user, delete community, list members and games, list top games'
        );
      });

      it('asks for confirmation and deletes community if user typed "yes"', () => {
        const gen = manageCommunities();

        const step1 = gen.next();

        expect(console.log).toHaveBeenCalledWith('\nList of communities:');
        expect(console.table).toHaveBeenCalledWith(db.communities);
        expect(step1.value).toEqual(
          'Enter community name you want to manage or "back" to leave the menu:'
        );
        const step2 = gen.next('havefun');

        const community = db.communities.find(comm => comm.name === 'havefun');

        expect(console.log).toHaveBeenCalledWith('\nSelected community:');
        expect(console.table).toHaveBeenCalledWith(community);
        expect(step2.value).toEqual(
          'Commands: add user, remove user, delete community, list members and games, list top games'
        );

        const step3 = gen.next('delete community');
        expect(step3.value).toEqual('type "yes" to confirm community deletion');

        const step4 = gen.next('yes');
        expect(step4.value).toEqual(
          'Enter community name you want to manage or "back" to leave the menu:'
        );
      });
    });

    describe('adding user', () => {
      it('adds a user', () => {
        const gen = manageCommunities();

        const step1 = gen.next();

        expect(console.log).toHaveBeenCalledWith('\nList of communities:');
        expect(console.table).toHaveBeenCalledWith(db.communities);
        expect(step1.value).toEqual(
          'Enter community name you want to manage or "back" to leave the menu:'
        );
        const step2 = gen.next('dota4life');

        const community = db.communities.find(
          comm => comm.name === 'dota4life'
        );

        expect(console.log).toHaveBeenCalledWith('\nSelected community:');
        expect(console.table).toHaveBeenCalledWith(community);
        expect(step2.value).toEqual(
          'Commands: add user, remove user, delete community, list members and games, list top games'
        );

        const step3 = gen.next('add user');
        expect(step3.value).toEqual(
          '\nType the userId to add or type "back" to go to previous menu'
        );

        const user = new Gamer('buba', 'male');
        db.users.push(user);

        const step4 = gen.next(user.id);
        expect(step4.value).toEqual(
          'do you wasnt to add another user? (yes/no)'
        );
      });

      it('does not add same member', () => {
        const gen = manageCommunities();

        const step1 = gen.next();

        expect(console.log).toHaveBeenCalledWith('\nList of communities:');
        expect(console.table).toHaveBeenCalledWith(db.communities);
        expect(step1.value).toEqual(
          'Enter community name you want to manage or "back" to leave the menu:'
        );
        const step2 = gen.next('dota4life');

        const community = db.communities.find(
          comm => comm.name === 'dota4life'
        );

        expect(console.log).toHaveBeenCalledWith('\nSelected community:');
        expect(console.table).toHaveBeenCalledWith(community);
        expect(step2.value).toEqual(
          'Commands: add user, remove user, delete community, list members and games, list top games'
        );

        const step3 = gen.next('add user');
        expect(step3.value).toEqual(
          '\nType the userId to add or type "back" to go to previous menu'
        );

        const user = new Gamer('buba2', 'male');
        db.users.push(user);

        const step4 = gen.next(user.id);
        expect(step4.value).toEqual(
          'do you wasnt to add another user? (yes/no)'
        );

        const step5 = gen.next('yes');
        expect(step5.value).toEqual(
          '\nType the userId to add or type "back" to go to previous menu'
        );

        const gen6 = gen.next(user.id);
        expect(console.log).toHaveBeenCalledWith(
          'User is already in the community'
        );
      });

      it('does not allow adding non existing user', () => {
        const gen = manageCommunities();

        const step1 = gen.next();

        expect(console.log).toHaveBeenCalledWith('\nList of communities:');
        expect(console.table).toHaveBeenCalledWith(db.communities);
        expect(step1.value).toEqual(
          'Enter community name you want to manage or "back" to leave the menu:'
        );
        const step2 = gen.next('dota4life');

        const community = db.communities.find(
          comm => comm.name === 'dota4life'
        );

        expect(console.log).toHaveBeenCalledWith('\nSelected community:');
        expect(console.table).toHaveBeenCalledWith(community);
        expect(step2.value).toEqual(
          'Commands: add user, remove user, delete community, list members and games, list top games'
        );

        const step3 = gen.next('add user');
        expect(step3.value).toEqual(
          '\nType the userId to add or type "back" to go to previous menu'
        );

        const step4 = gen.next('user-404');
        expect(console.log).toHaveBeenCalledWith(
          'User with Id "user-404" wasn\'t found'
        );
      });
    });

    describe('remove user', () => {
      it('removes user', () => {
        const gen = manageCommunities();

        const step1 = gen.next();

        expect(console.log).toHaveBeenCalledWith('\nList of communities:');
        expect(console.table).toHaveBeenCalledWith(db.communities);
        expect(step1.value).toEqual(
          'Enter community name you want to manage or "back" to leave the menu:'
        );
        const step2 = gen.next('dota4life');

        const community = db.communities.find(
          comm => comm.name === 'dota4life'
        );

        expect(console.log).toHaveBeenCalledWith('\nSelected community:');
        expect(console.table).toHaveBeenCalledWith(community);
        expect(step2.value).toEqual(
          'Commands: add user, remove user, delete community, list members and games, list top games'
        );

        const step3 = gen.next('remove user');
        expect(step3.value).toEqual(
          '\nType the userId to remove or type "back" to go to previous menu'
        );
        expect(console.log).toHaveBeenCalledWith('\nList of users:');

        const step4 = gen.next(
          db.users.find(user => user.nickname === 'buba')?.id || ''
        );

        expect(step4.value).toEqual(
          'do you wasnt to remove another user? (yes/no)'
        );
      });
    });

    it('list members and games', () => {
      const gen = manageCommunities();

      const step1 = gen.next();

      expect(console.log).toHaveBeenCalledWith('\nList of communities:');
      expect(console.table).toHaveBeenCalledWith(db.communities);
      expect(step1.value).toEqual(
        'Enter community name you want to manage or "back" to leave the menu:'
      );
      const step2 = gen.next('dota4life');

      const community =
        db.communities.find(comm => comm.name === 'dota4life') ||
        ({} as Community);

      expect(console.log).toHaveBeenCalledWith('\nSelected community:');
      expect(console.table).toHaveBeenCalledWith(community);
      expect(step2.value).toEqual(
        'Commands: add user, remove user, delete community, list members and games, list top games'
      );

      gen.next('list members and games');
      const list = community.members.map(({id, nickname, games}) => ({
        id,
        nickname,
        games,
      }));
      expect(console.table).toHaveBeenCalledWith(list);
    });
  });
});

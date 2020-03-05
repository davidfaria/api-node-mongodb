import User from '../../app/models/User';

class UserSeeder {
  async run() {
    console.log('Truncate collection users');
    await User.remove({});
    const users = [
      {
        name: 'David Faria',
        email: 'davidfaria89@gmail.com',
        password: '123456',
      },
    ];
    await User.insertMany(users);
    console.log('Populate collection users');
  }
}

export default new UserSeeder();

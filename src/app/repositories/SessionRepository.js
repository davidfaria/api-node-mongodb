import User from '@models/User';

class SessionRepository {
  async findOne({ ...query }) {
    const user = await User.findOne({ ...query })
      .populate('plan', 'name period price')
      .populate('file', 'name url');

    return user;
  }
}

export default new SessionRepository();

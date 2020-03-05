import User from '@models/User';

class ConfirmEmailController {
  async store(req, res) {
    const { hash } = req.body;

    const email = Buffer.from(hash, 'base64').toString('ascii');
    // console.log(email);

    const user = await User.findOne({ email });

    if (!user) return res.sendError('User not found', 401);

    const userUpdated = await User.findOneAndUpdate(
      {
        _id: user._id,
        status: { $nin: ['confirmed', 'canceled'] },
      },
      {
        $set: {
          status: 'confirmed',
          confirmedAt: new Date(),
        },
      },
      { useFindAndModify: false }
    );

    const isUpdated = userUpdated ? true : false;

    return res.json({ updated: isUpdated });
  }
}

export default new ConfirmEmailController();

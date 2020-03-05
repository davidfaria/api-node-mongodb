import SessionRespository from '@repositories/SessionRepository';
import SessionService from '@services/SessionService';
import { compareBcryptHash } from '@helpers/hash';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await SessionRespository.findOne({ email });

    if (!user) {
      return res.sendError('User not found', 401);
    }

    if (!(await compareBcryptHash(password, user.password))) {
      return res.sendError('Password does not match', 401);
    }

    const userSession = SessionService.getUserSession(user);
    return res.json(userSession);
  }
}

export default new SessionController();

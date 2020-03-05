import '@app/bootstrap';
import mongoose from 'mongoose';
import req from 'supertest';
import app from '@app/app';
import User from '@models/User';
import Plan from '@models/Plan';
import { randomHash, btoa, compareBcryptHash } from '@helpers/hash';
import { generateJwtToken } from '@helpers/jwt';

describe('Suit of test auth', () => {
  let planFree;
  let userAuth;
  let token;
  let bearerToken;
  beforeAll(async () => {
    await Plan.deleteMany();
    planFree = await Plan.create({
      name: 'Free',
      price: 0,
      period: 'mês',
      status: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    userAuth = await User.create({
      name: 'User default',
      email: `davidfaria89${new Date().getTime()}@gmail.com`,
      password: '123456',
      plan: planFree._id,
    });

    const { _id } = userAuth;
    token = await generateJwtToken({ _id });
    bearerToken = `Bearer ${token}`;
  });

  it('Should be register a new user', async () => {
    const email = 'davidfaria89@gmail.com';
    const emailBase64 = btoa(email);

    const payload = {
      name: 'David',
      password: '123456',
      email,
      link: `${process.env.APP_URL_FRONTEND}/confirmActive/${emailBase64}`,
    };

    const res = await req(app)
      .post('/register')
      .send(payload);
    expect(res.status).toBe(201);
    expect(res.body.exists).toBe(false);
    expect(res.body).toHaveProperty('user');
  });

  it('Should be authenticate session', async () => {
    await User.create({
      name: 'David Faria',
      email: 'davidfaria89@gmail.com',
      password: '123456',
      plan: planFree._id,
    });

    const payload = {
      email: 'davidfaria89@gmail.com',
      password: '123456',
    };

    const res = await req(app)
      .post('/sessions')
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('_id');
    expect(res.body.user).toHaveProperty('plan._id');
    expect(res.body).toHaveProperty('token');
  });

  it('Should be update status confirmed after confirm register email', async () => {
    const user = await User.create({
      name: 'David Faria',
      email: 'davidfaria89@gmail.com',
      password: '123456',
      plan: planFree._id,
      status: 'registred',
    });

    const payload = {
      hash: btoa(user.email),
    };

    const res = await req(app)
      .post('/confirmEmail')
      .send(payload);

    const userConfirmed = await User.findById(user._id);

    expect(res.status).toBe(200);
    expect(userConfirmed.status).toBe('confirmed');
    expect(userConfirmed.confirmedAt).not.toBe(null);
  });

  it('Should be create token and send mail to password reset', async () => {
    const user = await User.create({
      name: 'David Faria',
      email: 'davidfaria89@gmail.com',
      password: '123456',
      plan: planFree._id,
    });

    const payload = {
      email: user.email,
    };

    const res = await req(app)
      .post('/forget')
      .send(payload);

    expect(res.status).toBe(200);

    const userForgetPassword = await User.findById(user._id);

    expect(userForgetPassword.forget).not.toBe(null);
    expect(userForgetPassword.forgetAt).not.toBe(null);
  });

  it('Should be change password when reset password', async () => {
    const forget = randomHash();
    const forgetAt = new Date();

    const user = await User.create({
      name: 'David Faria',
      email: 'davidfaria89@gmail.com',
      password: '123456',
      plan: planFree._id,
      forget,
      forgetAt,
    });

    const payload = {
      forget,
      password: '123456_ALTERADO',
      password_confirmation: '123456_ALTERADO',
    };

    const res = await req(app)
      .put('/forgetResetPassword')
      .send(payload);

    expect(res.status).toBe(200);

    const userForgetPassword = await User.findById(user._id);

    expect(
      await compareBcryptHash(payload.password, userForgetPassword.password)
    ).toBe(true);
    expect(userForgetPassword.forget).toBe(null);
    expect(userForgetPassword.forgetAt).toBe(null);
  });

  it('Should be return 401 with try autenticate user not exists', async () => {
    const payload = {
      email: 'davidfaria89@gmail.com',
      password: '123456',
    };

    const res = await req(app)
      .post('/sessions')
      .send(payload);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('User not found');
  });

  it('Should be return 401 with password does not match', async () => {
    await User.create({
      name: 'David Faria',
      email: 'davidfaria89@gmail.com',
      password: '123456',
      plan: planFree._id,
    });

    const payload = {
      email: 'davidfaria89@gmail.com',
      password: 'OUTRA_SENHA',
    };

    const res = await req(app)
      .post('/sessions')
      .send(payload);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Password does not match');
  });

  it('Should be return 401 when try confirm user not exists', async () => {
    const payload = {
      hash: btoa('davidfaria89@gmail.com'),
    };

    const res = await req(app)
      .post('/confirmEmail')
      .send(payload);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('User not found');
  });

  it('Should be return 401 when try reset password user not exists', async () => {
    /**
     *  generate a fake token will used for update user
     */
    const forget = randomHash();
    /**
     *  update user set forget token
     */
    await User.updateOne(
      { _id: userAuth._id },
      { $set: { forget, forgetAt: new Date() } }
    );

    const payload = {
      forget: 'USER_PASSOU_UM_TOKE_QUE_NAO_EXISTE',
      password: 'NOVA_SENHA',
      password_confirmation: 'NOVA_SENHA',
    };

    const res = await req(app)
      .put('/forgetResetPassword')
      .send(payload)
      .set('Authorization', bearerToken);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Token forget invalid');
  });

  it('Should be return 401 when try send mail reset password user not exist', async () => {
    const payload = {
      email: 'emailnotexist@gmail.com',
    };

    const res = await req(app)
      .post('/forget')
      .send(payload);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('User not found');
  });
});

import '@app/bootstrap';

import mongoose from 'mongoose';
import req from 'supertest';
import app from '@app/app';
import User from '@models/User';
import Plan from '@models/Plan';
import { makeUser } from '@lib/Factory';
import { generateJwtToken } from '@helpers/jwt';

describe('Suit of Test Users', () => {
  let token;
  let userAuth;
  let bearerToken;
  let planDefault;

  beforeAll(async () => {
    await Plan.deleteMany();
    planDefault = await Plan.create({
      name: 'Pro',
      price: 14.5,
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
      name: 'David Faria',
      email: 'davidfaria89@gmail.com',
      password: '123456',
      plan: planDefault._id,
    });

    const { _id } = userAuth;
    token = await generateJwtToken({ _id });
    bearerToken = `Bearer ${token}`;
  });

  it('Should be list all users', async () => {
    const users = makeUser(2);

    const usersWithPlan = users.map(user => {
      return {
        ...user,
        plan: planDefault._id,
      };
    });

    await User.insertMany([...usersWithPlan]);

    const res = await req(app)
      .get('/users')
      .set('Authorization', bearerToken);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
  });
});

const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'Mike',
  email: 'mike@example.com',
  password: '56What!!',
  tokens: [{
    token: jwt.sign({ _id: userOneId }, 'myprivatekey')
  }]
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});
describe('POST /users', () => {
  it('Should signup a new user', async () => {
    await request(app)
      .post('/users')
      .send({name: 'Tyler',
            email: 'tyler@example.com',
            password: 'MyPass777!'
      }).expect(201);
  });

  it('Should login existing user', async () => {
    await request(app).post('/users/login').send({
      email: userOne.email,
      password: userOne.password
    }).expect(200);
  });

  it('Should not login nonexistent user', async() =>{
    await request(app).post('/users').send({
      email: 'tylernotfound@example.com',
      password: userOne.password
    }).expect(400);
  });

  it('Should reject the new email', async ()=> {
    await request(app).post('/users').send({
      email: 'Now a valid email',
      password: userOne.password
    }).expect(400);
  });

  it('Should reject the password', async ()=> {
    await request(app).post('/users').send({
      email: userOne.email,
      password: '1'
    }).expect(400);
  });
});

describe('GET /users', () => {
  it('Should get profile for user', async ()=> {
    // await request(app).post('/users/login').send({
    //   email: userOne.email,
    //   password: userOne.password
    // }).expect(200);
    await request(app).get('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);
  });

  it('Should not get profile for unathenticated user', async () => {
    await request(app).get('/users/me')
      .send()
      .expect(401);
  });
});

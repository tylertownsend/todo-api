const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const userOne = {
  name: 'Mike',
  email: 'mike@example.com',
  password: '56What!!'
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
  it('Should get the users', async() =>{
    await request(app).get('/users').send().expect(200);
  });
});

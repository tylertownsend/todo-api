const expect = require('expect');
const request = require('supertest');

const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

describe('POST /users', () => {
  it('Should signup a new user', async () => {
    const response = await request(app) .post('/users')
      .send({name: 'Tyler',
            email: 'tyler@example.com',
            password: 'MyPass777!'
      }).expect(201);
    
      const user = await User.findById(response.body.user._id); 
      expect(user).not.toBeNull();

      expect(response.body).toMatchObject({
        user: {
          name: 'Tyler',
          email: 'tyler@example.com'
        },
        token: user.tokens[0].token
      });
      expect(user.password).not.toBe('MyPass777!');
  });

  it('Should login existing user', async () => {
    const response = await request(app).post('/users/login')
      .send({
        email: userOne.email,
        password: userOne.password
      }).expect(200);
    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
  });

  it('Should not login nonexistent user', async() => {
    await request(app).post('/users')
      .send({
        email: 'tylernotfound@example.com',
        password: userOne.password
      }).expect(400);
  });

  it('Should reject the new email', async () => {
    await request(app).post('/users')
      .send({
        email: 'Now a valid email',
        password: userOne.password
      }).expect(400);
  });

  it('Should reject the password', async () => {
    await request(app).post('/users')
      .send({
        email: userOne.email,
        password: '1'
      }).expect(400);
  });

  it('Should logout the user', async() => {
    await request(app).post('/users/logout')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .expect(200);
  });

  it('Should not logout the user when unauthorized', async() => {
    await request(app).post('/users/logout')
      .expect(401);
  });
});

describe('GET /users', () => {
  it('Should get profile for user', async ()=> {
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

describe('DELETE /users', () => {
  it('Should delete account for user', async ()=> {
    await request(app).delete('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);
    
    const user = await User.findById(userOneId);
    expect(user).toBe(null);
  });

  it('Should not delete account for unauthenticated user', async () => {
    await request(app).delete('/users/me')
      .send()
      .expect(401);
  });
});

describe('PATCH /users', ()=> {
  it('Should update user account information', async () => {
    await request(app).patch('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        'name': 'Elon',
        'email': 'spacex@mail.com',
        'password': 'TelsaBaby!!'
      })
      .expect(200);
  });

  it('Should not update an user when unauthorized', async () => {
    await request(app).patch('/users/me')
      .send({
        'name': 'Elon',
        'email': 'spacex@mail.com',
        'password': 'TelsaBaby!!'
      })
      .expect(401);
  });

  it('Should not update an invalid parameter', async () => {
    await request(app).patch('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        'favorite color': 'blue',
      })
      .expect(400);

  });
});

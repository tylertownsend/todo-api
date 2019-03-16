const expect = require('expect');
const request = require('supertest');

const app = require('../src/app');
const Task = require('../src/models/task');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

describe('POST /tasks', ()=> {
  beforeEach(setupDatabase);

  it('Should create task for user', async () => {
    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
          text: 'From my test'
      })
      .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
  });

  it('should not create task with invalid body data', (done) => {
    request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Task.find().then((tasks) => {
          expect(tasks.length).toBe(0);
          done();
        }).catch((e) => done(e));
      })
  });
});


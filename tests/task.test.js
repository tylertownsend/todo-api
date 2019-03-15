const expect = require('expect');
const request = require('supertest');

const app = require('../src/app');
const Task = require('../src/models/task');

const tasks = [{
  text: 'First test task'
}, {
  text: 'Second test task'
}];

beforeEach((done) => {
  Task.deleteMany({}).then(() => {
    return Task.insertMany(tasks);
  }).then(() => done());
});

describe('POST /tasks', ()=> {

  it('should create a new task', async () => {
   const text = 'Dwayne - the Rock - Johnson'; 
    const response = await request(app)
      .post('/tasks')
      .send({text})
      .expect(201)
    
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull()
    expect(task.text).toBe(text);
    expect(task.completed).toEqual(false);
  });

  it('should not create task with invalid body data', (done) => {
    request(app)
      .post('/tasks')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Task.find().then((tasks) => {
          expect(tasks.length).toBe(2);
          done();
        }).catch((e) => done(e));
      })
  });
});

describe('GET /tasks', () => {
  it('should get all tasks', (done) => {
    request(app)
      .get('/tasks')
      .expect(200)
      .expect((res) => {
        expect(res.body.tasks.length).toBe(2);
      })
      .end(done);
  });
}); 


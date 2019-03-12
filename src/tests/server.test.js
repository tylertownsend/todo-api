const expect = require('expect');
const request = require('supertest');

const app = require('./../app');
const Todo = require('./../models/todo');

const todos = [{
  text: 'First test todo'
}, {
  text: 'Second test todo'
}];

beforeEach((done) => {
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', ()=> {

  it('should create a new todo', async () => {
    const text = 'Dwayne - the Rock - Johnson'; 
    const response = await request(app)
      .post('/todos')
      .send({text})
      .expect(201)
    
    const task = await Todo.findById(response.body._id);
    expect(task).not.toBeNull()
    expect(task.text).toBe(text);
    expect(task.completed).toEqual(false);
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      })
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
}); 


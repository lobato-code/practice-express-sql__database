const supertest = require('supertest');
const app = require('../app');
const { initializePersonsDatabase, clearPersonDatabase } = require('./helper');

const api = supertest(app);
const url = '/api/v1/persons';

const model = {
  name: 'Ruffo Carcelen',
  birth_date: '1999-02-01',
  phone: '0341-021251',
};
const modelUpdate = {
  name: 'Julio Cesar',
};

// const badModel = {
//   naml: 'Julio Cesar',
// };

beforeEach(async () => {
  await initializePersonsDatabase();
});

describe('CRUD persons', () => {
  //   test('a specific note is within the returned notes', async () => {
  //   const response = await api.get('/api/notes')

  //   const contents = response.body.map(r => r.content)
  //   expect(contents).toContain(
  //     'Browser can execute only JavaScript'
  //   )
  // })
  test('persons are returned as json', async () => {
    const { body } = await api
      .get(url)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(body).toHaveLength(2);
  });

  test('get an specific person', async () => {
    const { body } = await api.get(`${url}/2`);
    const [data] = body;
    expect(data.name).toBe('Maria Viltriado');
  });

  test('update a person', async () => {
    await api.patch(`${url}/2`).send(modelUpdate).expect(201);

    const { body } = await api.get(`${url}/2`);
    const [data] = body;
    expect(data.name).toBe('Julio Cesar');
  });

  test('create a person', async () => {
    await api.post(url).send(model).expect(201);
    const response = await api.get(url);
    expect(response.body).toHaveLength(3);
  });
  test('delete one person', async () => {
    await api.delete(`${url}/2`);
    const response = await api.get(url);
    expect(response.body).toHaveLength(1);
  });
});

describe('Failure', () => {
  test('fails with 404 with a non exsting id', async () => {
    const non_existing_id = 99;
    await api.get(`${url}/${non_existing_id}`).expect(404);
    await api.delete(`${url}/${non_existing_id}`).expect(404);
    await api.patch(`${url}/${non_existing_id}`).send(model).expect(404);
  });

  test('fails with 400 with no content', async () => {
    await api.patch(`${url}/2`).expect(400);
    await api.post(url).expect(400);
  });
  // test('fails with 400 with bad model', async () => {
  //   const id = 'c96adfc2-ce21-4794-8cb2-460d29561b59';
  //   await api.patch(`${url}/${id}`).send(badModel).expect(400);
  //   await api.person(url).send(badModel).expect(400);
  // });
});

afterEach(async () => {
  await clearPersonDatabase();
});
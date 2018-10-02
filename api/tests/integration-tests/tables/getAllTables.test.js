const mongoose = require('mongoose');
const request = require('supertest');

const server = require('../../../../server');
const { loginAdmin } = require('../../helpers/loginAdmin');

let token;

jest.setTimeout(30000);

describe('getAllTables', () => {
  beforeAll(async (done) => {
    // register the admin
    await loginAdmin(server)
      .then((loginRes) => {
        token = loginRes;

        request(server)
          .post('/api/tables/add')
          .set('Authorization', `${token}`)
          .send(
            {
              x: 1,
              y: 1,
              number: 1
            }
          )
          .then(() => done())
          .catch(err => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  });

  afterAll((done) => {
    mongoose.connection.db.dropDatabase(done);
    mongoose.disconnect();
  });

  // [Authorized] Deactivates a table
  it('[Auth] DELETE: deletes a table in the DB', async () => {
    const res = await request(server)
      .get('/api/tables/all')
      .set('Authorization', `${token}`);

    expect(res.body.tables.length).toEqual(1);
    expect(res.status).toBe(200);
  });
});

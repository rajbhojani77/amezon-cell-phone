/* eslint-disable no-useless-escape */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const request = require('supertest');
const faker = require('faker');
const app = require('../../app');
const commonUtile = require('./commonUtil');

let Cookies;
let NewCookies;
let newUserId;

const newuser = {
  username: faker.internet.userName(),
  password: faker.internet.password(),
};
const adminuser = {
  username: 'Admin',
  password: 'admin',
};

describe('Test of users authentication API Error Handling:', () => {
  it('should create user', (done) => {
    request(app)
      .post('/users/add')
      .set('Accept', 'application/json')
      .send(newuser)
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        expect(res.body.message).toEqual('User registered');
        newUserId = res.body.data.id;
        done();
      });
  });
  it('should create user session for admin user', (done) => {
    commonUtile.login(adminuser)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        expect(res.body.data.username).toEqual('Admin');
        // Save the cookie to use it later to retrieve the session
        Cookies = res.headers['set-cookie'];
        done();
      });
  });
  it('should create user session for user', (done) => {
    commonUtile.login(newuser).end((err, res) => {
      expect(res.body.success).toEqual(true);
      // Save the cookie to use it later to retrieve the session
      NewCookies = res.headers['set-cookie'];
      done();
    });
  });

  it('should delete given users if current user is admin', (done) => {
    request(app)
      .delete(`/users/${newUserId}/delete`)
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(202)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        done();
      });
  });
  it('user should be unauthorized', (done) => {
    request(app).get('/users/profile')
      .set('Cookie', NewCookies)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.text).toEqual('Unauthorized');
        done();
      });
  });
});

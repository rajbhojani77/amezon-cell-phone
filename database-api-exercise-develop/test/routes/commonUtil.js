/* eslint-disable no-useless-escape */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const request = require('supertest');
const app = require('../../app');

let Cookies;

module.exports = {
  login(userdata) {
    return request(app)
      .post('/users/login')
      .set('Accept', 'application/json')
      .send(userdata)
      .expect('Content-Type', /json/)
      .expect(200);
  },
};

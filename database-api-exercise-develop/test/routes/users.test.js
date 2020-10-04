/* eslint-disable no-useless-escape */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const request = require('supertest');
const faker = require('faker');
const app = require('../../app');
const commonUtile = require('./commonUtil');

const adminuser = {
  username: 'Admin',
  password: 'admin',
};
let Cookies;

const newuser = {
  username: faker.internet.userName(),
  password: faker.internet.password(),
};

describe('Test of users API:', () => {
  it('should create user session for valid user', (done) => {
    commonUtile.login(adminuser).end((err, res) => {
      expect(res.body.success).toEqual(true);
      expect(res.body.data.username).toEqual('Admin');
      // Save the cookie to use it later to retrieve the session
      Cookies = res.headers['set-cookie'];
      done();
    });
  });
  it('should get user session for current user', (done) => {
    request(app).get('/users/profile')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        expect(res.body.data.username).toEqual('Admin');
        expect(res.body.data.id).toEqual(1);
        expect(res.body.data.role_id).toEqual(1);
        done();
      });
  });
  it('should destroy user session for current user', (done) => {
    request(app).get('/users/logout')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        expect(res.body.message).toEqual('successfully logged out');
        done();
      });
  });

  it('should get all users if current user is admin, with Page No.', (done) => {
    request(app).get('/users')
      .set('Cookie', Cookies)
      .query({ pageNo: 2 })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        done();
      });
  });

  it('should get users with id ', (done) => {
    request(app).get('/users/1')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        done();
      });
  });

  it('should get all users if current user is admin, without Page No.', (done) => {
    request(app).get('/users')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        // console.log(res);
        done();
      });
  });

  it('should update given users if current user is admin', (done) => {
    request(app)
      .put('/users/11/edit')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .send({
        username: faker.internet.userName(),
        password: faker.internet.password(),
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        done();
      });
  });

  it('should delete given users if current user is admin', (done) => {
    request(app)
      .delete('/users/67/delete')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(202)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        done();
      });
  });
});


describe('Functional Test without login :', () => {
  it('should not login using wrong password', (done) => {
    request(app)
      .post('/users/login')
      .set('Accept', 'application/json')
      .send({ username: 'Admin', password: 'wrongpassword' })
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('Wrong password');
        done();
      });
  });
  it('should not login using wrong username', (done) => {
    request(app)
      .post('/users/login')
      .set('Accept', 'application/json')
      .send({ username: 'nonuser', password: 'wrongpassword' })
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('User not found');
        done();
      });
  });
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
        done();
      });
  });
  it('should create user without username', (done) => {
    request(app)
      .post('/users/add')
      .set('Accept', 'application/json')
      .send({ password: newuser.password })
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('Username is required');
        done();
      });
  });
  it('should not create user without password', (done) => {
    request(app)
      .post('/users/add')
      .set('Accept', 'application/json')
      .send({ username: newuser.username })
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('Password is required');
        done();
      });
  });
});

describe('Test of users API Error Handling ', () => {
  it(' get error if users with id not exist ', (done) => {
    request(app).get('/users/644467')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.error).toEqual(true);
        expect(res.body.message).toEqual('Id Not Found');
        done();
      });
  });
  it('get error if column not exist', (done) => {
    request(app).get('/users')
      .set('Cookie', Cookies)
      .query({ orderby: 'non_column' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.error).toEqual(true);
        done();
      });
  });
  it('should not get users if given data is invalid', (done) => {
    request(app).get('/users')
      .set('Cookie', Cookies)
      .query({ page_no: 'value' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.error).toEqual(true);
        done();
      });
  });

  it('should not update user if given data is invalid', (done) => {
    request(app)
      .put('/users/7/edit')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .send({
        username: '474\e/\ea',
        password: "5443-034o7-=4369];].';.[.7",
      })
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.error).toEqual(true);
        done();
      });
  });

  it('delete reviewer should return error if id not found ', (done) => {
    request(app)
      .delete('/users/346478/delete')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.error).toEqual(true);
        done();
      });
  });
  it('should not create user with same username', (done) => {
    request(app)
      .post('/users/add')
      .set('Accept', 'application/json')
      .send(newuser)
      .expect('Content-Type', /json/)
      .expect(422)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.error).toEqual(true);
        done();
      });
  });
});

describe('Test of non users API:', () => {
  it('should create user session for non admin user', (done) => {
    commonUtile.login(newuser)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        expect(res.body.data.username).toEqual(newuser.username);
        // Save the cookie to use it later to retrieve the session
        Cookies = res.headers['set-cookie'];
        done();
      });
  });
  it('should not get users if current user is not admin', (done) => {
    request(app).get('/users')
      .set('Cookie', Cookies)
      .query({ pageNo: 2 })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('Required Admin Permission');
        done();
      });
  });
});

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

describe('Test of reviews API', () => {
  it('should create user session for valid user', (done) => {
    commonUtile.login(adminuser).end((err, res) => {
      expect(res.body.success).toEqual(true);
      expect(res.body.data.username).toEqual('Admin');
      // Save the cookie to use it later to retrieve the session
      Cookies = res.headers['set-cookie'];
      done();
    });
  });
  it('should get reviews list, without Page No.', (done) => {
    request(app).get('/reviews')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        expect(res.body.message).toEqual('Reviews fetched');
        done();
      });
  });
  it('should get reviews list of verified users, without Page No.', (done) => {
    request(app).get('/reviews')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .query({ isVerified: true })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        expect(res.body.message).toEqual('Reviews fetched');
        done();
      });
  });


  it('should get review, with givin id.', (done) => {
    request(app).get('/reviews/3646')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        expect(res.body.message).toEqual('Review fetched');
        done();
      });
  });

  it('should add given users if current user is admin', (done) => {
    request(app)
      .post('/reviews/add')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .send({
        item_id: 19,
        user_id: 747,
        rating: 5,
        date: '2018-06-20T18:30:00.000Z',
        verified: true,
        title: 'Still the best--Original Samsung Convoy Cell Phone from TargetWireless, refurbished',
        body: 'This purchase has been an outstanding experience. This is the same model phone that Consumer Reports rated a best buy at the time I bought it the first time 10 years ago or more. Customer reviews of subsequent models have said that this one is the best. I would recommend this to anyone who wants a rugged phone with great voice quality and a lit keypad with keys big enough for my big hands. By rugged I mean that I dropped my first one on the floor a number of times over the years without breaking it. I got Verizon on the phone and made sure my contacts were backed up and then activated the phone. Easy! As for TargetWireless, I started by asking them a question. I had an answer back within two hours. I ordered the phone. They shipped it the same day. It arrived earlier than promised, looking new in a small white box with places for the phone and charger, both in little plastic bags. It even has clear thin protective covers on the displays! It seems every bit as good as the one I bought new years ago. Thank you! Samsung Convoy SCH-U640 Cell Phone Ruggedized PTT 2+ megapixel Camera for Verizon',
        helpfulvotes: null,
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        done();
      });
  });

  it('should update given users if current user is admin', (done) => {
    request(app)
      .put('/reviews/466/edit')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .send({
        id: 466,
        item_id: 19,
        user_id: 747,
        rating: 5,
        date: '2018-06-20T18:30:00.000Z',
        verified: true,
        title: 'Still the best--Original Samsung Convoy Cell Phone from TargetWireless, refurbished',
        body: 'This purchase has been an outstanding experience. This is the same model phone that Consumer Reports rated a best buy at the time I bought it the first time 10 years ago or more. Customer reviews of subsequent models have said that this one is the best. I would recommend this to anyone who wants a rugged phone with great voice quality and a lit keypad with keys big enough for my big hands. By rugged I mean that I dropped my first one on the floor a number of times over the years without breaking it. I got Verizon on the phone and made sure my contacts were backed up and then activated the phone. Easy! As for TargetWireless, I started by asking them a question. I had an answer back within two hours. I ordered the phone. They shipped it the same day. It arrived earlier than promised, looking new in a small white box with places for the phone and charger, both in little plastic bags. It even has clear thin protective covers on the displays! It seems every bit as good as the one I bought new years ago. Thank you! Samsung Convoy SCH-U640 Cell Phone Ruggedized PTT 2+ megapixel Camera for Verizon',
        helpfulvotes: 2,
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        done();
      });
  });

  it('should delete given item if current user is admin', (done) => {
    request(app)
      .delete('/reviews/6/delete')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        done();
      });
  });
});

describe('Test of reviews API Error Handling ', () => {
  it('should not get reviews list', (done) => {
    request(app).get('/reviews')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .query({ orderby: 'non_column' })
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.error).toEqual(true);
        done();
      });
  });


  it('should not get review  if id not found.', (done) => {
    request(app).get('/reviews/767885')
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

  it('should not add review if data is invalid', (done) => {
    request(app)
      .post('/reviews/add')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .send({
        item_id: 3673,
        user_id: 747,
        rating: 5,
        date: '2018-06-20T18:30:00.000Z',
        verified: true,
        title: 'Still the best--Original Samsung Convoy Cell Phone from TargetWireless, refurbished',
        body: 'This purchase has been an outstanding experience. This is the same model phone that Consumer Reports rated a best buy at the time I bought it the first time 10 years ago or more. Customer reviews of subsequent models have said that this one is the best. I would recommend this to anyone who wants a rugged phone with great voice quality and a lit keypad with keys big enough for my big hands. By rugged I mean that I dropped my first one on the floor a number of times over the years without breaking it. I got Verizon on the phone and made sure my contacts were backed up and then activated the phone. Easy! As for TargetWireless, I started by asking them a question. I had an answer back within two hours. I ordered the phone. They shipped it the same day. It arrived earlier than promised, looking new in a small white box with places for the phone and charger, both in little plastic bags. It even has clear thin protective covers on the displays! It seems every bit as good as the one I bought new years ago. Thank you! Samsung Convoy SCH-U640 Cell Phone Ruggedized PTT 2+ megapixel Camera for Verizon',
        helpfulvotes: null,
      })
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.error).toEqual(true);
        done();
      });
  });

  it('should not update given review if data is invalid', (done) => {
    request(app)
      .put('/reviews/466/edit')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .send({
        id: 466,
        item_id: 3464,
        user_id: 747,
        rating: 5,
        date: '2018-06-20T18:30:00.000Z',
        verified: true,
        title: 'Still the best--Original Samsung Convoy Cell Phone from TargetWireless, refurbished',
        body: 'This purchase has been an outstanding experience. This is the same model phone that Consumer Reports rated a best buy at the time I bought it the first time 10 years ago or more. Customer reviews of subsequent models have said that this one is the best. I would recommend this to anyone who wants a rugged phone with great voice quality and a lit keypad with keys big enough for my big hands. By rugged I mean that I dropped my first one on the floor a number of times over the years without breaking it. I got Verizon on the phone and made sure my contacts were backed up and then activated the phone. Easy! As for TargetWireless, I started by asking them a question. I had an answer back within two hours. I ordered the phone. They shipped it the same day. It arrived earlier than promised, looking new in a small white box with places for the phone and charger, both in little plastic bags. It even has clear thin protective covers on the displays! It seems every bit as good as the one I bought new years ago. Thank you! Samsung Convoy SCH-U640 Cell Phone Ruggedized PTT 2+ megapixel Camera for Verizon',
        helpfulvotes: 2,
      })
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.error).toEqual(true);
        done();
      });
  });

  it('should get error if review id not found', (done) => {
    request(app)
      .delete('/reviews/88677409/delete')
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
});

describe('Test of non users API for reviews routes:', () => {
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
  it('should not delete given item if current user not admin', (done) => {
    request(app)
      .delete('/reviews/6/delete')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        done();
      });
  });
});

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

describe('Test of items API', () => {
  it('should create user session for valid user', (done) => {
    commonUtile.login(adminuser).end((err, res) => {
      expect(res.body.success).toEqual(true);
      expect(res.body.data.username).toEqual('Admin');
      // Save the cookie to use it later to retrieve the session
      Cookies = res.headers['set-cookie'];
      done();
    });
  });
  it('should get items list, with Page No.', (done) => {
    request(app).get('/items')
      .set('Cookie', Cookies)
      .query({ page_no: 3 })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        expect(res.body.message).toEqual('Items fetched');
        done();
      });
  });

  it('should get items list, without Page No.', (done) => {
    request(app).get('/items')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        expect(res.body.message).toEqual('Items fetched');
        done();
      });
  });

  it('should get item with review og given id', (done) => {
    request(app).get('/items/2')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        expect(res.body.message).toEqual('Item fetched');
        done();
      });
  });
  it('should get item with given id', (done) => {
    request(app).get('/items/2')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).toEqual(true);
        expect(res.body.message).toEqual('Item fetched');
        done();
      });
  });

  it('should add given users if current user is admin', (done) => {
    request(app)
      .post('/items/add')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .send({
        asin: 'B0000SX2UC',
        brand: 'Nokia',
        title: 'Dual-Band / Tri-Mode Sprint PCS Phone w/ Voice Activated Dialing & Bright White Backlit Screen',
        url: 'https://www.amazon.com/Dual-Band-Tri-Mode-Activated-Dialing-Backlit/dp/B0000SX2UC',
        image: 'https://m.media-amazon.com/images/I/2143EBQ210L._AC_UY218_SEARCH213888_FMwebp_QL75_.jpg',
        rating: 3,
        reviewurl: 'https://www.amazon.com/product-reviews/B0000SX2UC',
        totalreviews: 14,
        prices: '555',
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
      .put('/items/84/edit')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .send({
        id: 84,
        asin: 'B0000SX2UC',
        brand: 'Nokia',
        title: 'Dual-Band / Tri-Mode Sprint PCS Phone w/ Voice Activated Dialing & Bright White Backlit Screen',
        url: 'https://www.amazon.com/Dual-Band-Tri-Mode-Activated-Dialing-Backlit/dp/B0000SX2UC',
        image: 'https://m.media-amazon.com/images/I/2143EBQ210L._AC_UY218_SEARCH213888_FMwebp_QL75_.jpg',
        rating: 3,
        reviewurl: 'https://www.amazon.com/product-reviews/B0000SX2UC',
        totalreviews: 14,
        prices: '555',
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
      .delete('/items/70/delete')
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


describe('Test of items API Error Handling ', () => {
  it('should get error if column not found for orderby', (done) => {
    request(app).get('/items')
      .set('Cookie', Cookies)
      .query({ orderby: 'non_column' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.error).toEqual(true);
        expect(res.body.message).toEqual('column "non_column" does not exist');
        done();
      });
  });
  it('should get error if id of item not found', (done) => {
    request(app).get('/items/0')
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
  it('should not add item with invalid data', (done) => {
    request(app)
      .post('/items/add')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .send({
        asin: 'B0000SX2UC',
        brand: 'Nokia',
        title: 'Dual-Band / Tri-Mode Sprint PCS Phone w/ Voice Activated Dialing & Bright White Backlit Screen',
        url: 'https://www.amazon.com/Dual-Band-Tri-Mode-Activated-Dialing-Backlit/dp/B0000SX2UC',
        image: 'https://m.media-amazon.com/images/I/2143EBQ210L._AC_UY218_SEARCH213888_FMwebp_QL75_.jpg',
        rating: 'five',
        reviewurl: 'https://www.amazon.com/product-reviews/B0000SX2UC',
        totalreviews: 14,
        prices: '555',
      })
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.error).toEqual(true);
        done();
      });
  });

  it('should not update if data is invalid', (done) => {
    request(app)
      .put('/items/84/edit')
      .set('Cookie', Cookies)
      .set('Accept', 'application/json')
      .send({
        asin: 'B0000SX2UC',
        brand: 'Nokia',
        title: 'Dual-Band / Tri-Mode Sprint PCS Phone w/ Voice Activated Dialing & Bright White Backlit Screen',
        url: 'https://www.amazon.com/Dual-Band-Tri-Mode-Activated-Dialing-Backlit/dp/B0000SX2UC',
        image: 'https://m.media-amazon.com/images/I/2143EBQ210L._AC_UY218_SEARCH213888_FMwebp_QL75_.jpg',
        rating: 'seven',
        reviewurl: 'https://www.amazon.com/product-reviews/B0000SX2UC',
        totalreviews: 14,
        prices: '555',
      })
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.error).toEqual(true);
        done();
      });
  });

  it('should generate error if id not found', (done) => {
    request(app)
      .delete('/items/0/delete')
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

describe('Test of non users API for items routes:', () => {
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
    commonUtile.login(newuser).end((err, res) => {
      expect(res.body.success).toEqual(true);
      expect(res.body.data.username).toEqual(newuser.username);
      // Save the cookie to use it later to retrieve the session
      Cookies = res.headers['set-cookie'];
      done();
    });
  });

  it('should not delete given item if current user is not admin', (done) => {
    request(app)
      .delete('/items/709658/delete')
      .set('Cookie', Cookies)
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

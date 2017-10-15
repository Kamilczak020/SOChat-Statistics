import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET /rooms route', () => {
    it('should be JSON', () => {
        return chai.request(app).get('/rooms')
            .then(res => {
                expect(res.type).to.eql('application/json');
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body).to.have.property('message');

                expect(res.body.data).to.be.a('array');               
            });
    })
})
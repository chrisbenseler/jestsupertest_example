const request = require('supertest');
let app;

describe('User Authenticaton Endpoints', () => {

    beforeAll(async () => {
        app = require('../../app')
    })

    afterAll(async () => {
        await app.close()
    })

    it('should try to do login with valid credentials and success', async () => {
        const res = await request(app)
                .post('/users/signin')
                .send({ email: 'fake@fake.com', password: 'fake' })
        
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('token')
    })

    it('should try to do login with invalid credentials and fail', async () => {
        const res = await request(app)
                .post('/users/signin')
                .send({ email: 'fakefail@fake.com', password: 'fake' })
        
        expect(res.statusCode).toEqual(401)
    })

})
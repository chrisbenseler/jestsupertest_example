const request = require('supertest');
let app;

describe('User Authenticaton Endpoints', () => {

    beforeAll(async () => {
        app = require('../../app')
    })

    afterAll(async () => {
        await app.close()
    })

    it('should try to get user profile with valid token and success', async () => {
        const res = await request(app)
                .post('/users/signin')
                .send({ email: 'fake@fake.com', password: 'fake' })
        
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('token')
    })

})
const request = require('supertest')
const mongoose = require('mongoose')

let app

describe('User Authentication Endpoints', () => {

    beforeAll(async () => {
        app = require('../../app') 
    })

    afterAll(async () => {
        await app.close()
        await mongoose.connection.close()
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

    it('should try to create user with valid credentials and success', async () => {
        const res = await request(app)
                .post('/users/signup')
                .send({ email: 'newfake@fake.com', password: 'fake', confirmPassword: 'fake' })
        
        expect(res.statusCode).toEqual(200)
    })

    it('should try to create user with invalid credentials and fail', async () => {
        const res = await request(app)
                .post('/users/signup')
                .send({ email: 'newfake2@fake.com', password: 'fake', confirmPassword: 'fakeerror' })
        
        expect(res.statusCode).toEqual(403)
    })

    it('should try to create user that already exists and fail', async () => {
        const res = await request(app)
                .post('/users/signup')
                .send({ email: 'fake@fake.com', password: 'fake', confirmPassword: 'fakeerror' })
        
        expect(res.statusCode).toEqual(403)
    })

})

describe('User Authenticated Endpoints', () => {

    let token;

    beforeAll(async () => {
        app = require('../../app')
        const res = await request(app)
                .post('/users/signin')
                .send({ email: 'fake@fake.com', password: 'fake' })
        token = res.body.token
    })

    afterAll(async () => {
        await app.close()
    })

    it('should try to get user profile', async () => {
        const res = await request(app)
            .get('/profile')
            .set({ Authorization: 'Bearer ' + token })
        expect(res.statusCode).toEqual(200)
    })

})
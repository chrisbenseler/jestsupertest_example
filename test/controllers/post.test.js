const request = require('supertest')
const Post = require('../../models/Post')

let app

describe('Post model Endpoints', () => {

    let token
    let post

    beforeAll(async () => {
        app = require('../../app')
        const res = await request(app)
                .post('/users/signin')
                .send({ email: 'fake@fake.com', password: 'fake' })
        token = res.body.token
        post = await Post.findOne({ title: 'test edit post title' })
    })

    afterAll(async () => {
        await app.close()
    })

    it('should try to get all posts', async () => {
        const res = await request(app)
                .get('/posts/' )
        
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('posts')
        expect(res.body.posts).toHaveLength(2)
    })

    it('should try to get post', async () => {
        const res = await request(app)
                .get('/posts/' + post._id)
        
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('title')
        expect(res.body.title).toEqual(post.title)
    })

    it('should try to edit post and success', async () => {
        const res = await request(app)
                .put('/posts/' + post._id)
                .set({ Authorization: 'Bearer ' + token })
                .send({
                    title: 'new title'
                })

        expect(res.statusCode).toEqual(200)
        expect(res.body.title).toEqual('new title')
    })

    it('should try to edit post without bearer token and fail', async () => {
        const res = await request(app)
                .put('/posts/' + post._id)
                .send({
                    title: 'new title'
                })

        expect(res.statusCode).toEqual(401)
    })

    it('should try to create post and success', async () => {
        const res = await request(app)
                .post('/posts')
                .set({ Authorization: 'Bearer ' + token })
                .send({
                    title: 'new title'
                })

        expect(res.statusCode).toEqual(200)
    })

    it('should try to create post without params and fail', async () => {
        const res = await request(app)
                .post('/posts')
                .set({ Authorization: 'Bearer ' + token })
                .send()
        expect(res.statusCode).not.toEqual(200)
    })

    it('should try to delete post and success', async () => {
        const postDelete = await Post.findOne({ title: 'test delete post title' })
        const res = await request(app)
                .delete('/posts/' + postDelete._id)
                .set({ Authorization: 'Bearer ' + token })

        expect(res.statusCode).toEqual(200)
    })


})

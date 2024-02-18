const { default: mongoose } = require('mongoose')
const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('..//models/db')
const helper = require('../utils/list_helper')

beforeEach(async () => {
    await Blog.deleteMany({})

    for(let blog of helper.initialBlogs){
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

test('blogs are returned as json',async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})
test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 2)
})
test('id', async () => {
    const response = await api.get('/api/blogs')
    const result = Object.keys(response.body[0])
    assert(result.includes('id'))
})
test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'my github profile',
        author: 'kolibri0509',
        url: 'https://github.com/kolibri0509',
        likes: 888
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const title = response.body.map(b => b.title)
    assert.strictEqual(title.length, helper.initialBlogs.length+1)
    assert(title.includes('my github profile'))
})

after(async () => {
    await mongoose.connection.close()
})
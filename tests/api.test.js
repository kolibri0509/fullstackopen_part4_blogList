const { default: mongoose } = require('mongoose')
const { test, after, beforeEach, describe } = require('node:test')
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
test('blog without title is not added', async () => {
    const newBlog = {
        author:'Henri Miller',
        url:'https://miller.com',
        likes: 2
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})
test('blog without url is not added', async () => {
    const newBlog = {
        author:'Henri Miller',
        title:'superMann',
        likes: 122
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
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
test('no likes change to 0', async () => {
    const newBlog = {
        title: 'no likes change to 0',
        author: 'kolibri0509',
        url: 'https://github.com/kolibri0509',
        likes:'',
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const like = response.body.filter(b => b.title === 'no likes change to 0')
    assert.strictEqual(like[0].likes, 0)
})
describe('deleting', () => {
    test('deleting one blog', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const deleteBlog = blogsAtStart[0]
        await api
            .delete(`/api/blogs/${deleteBlog.id}`)
            .expect(204)
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length-1)

        const titles = blogsAtEnd.map(bl => bl.title)
        assert(!titles.includes(deleteBlog.title))
    })
})
test('updating blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const likesStart = blogsAtStart[0].likes
    const updateBlog = {
        title: blogsAtStart[0].title,
        author:blogsAtStart[0].author,
        url:blogsAtStart[0].url,
        likes:blogsAtStart[0].likes + 1
    }
    await api
        .put(`/api/blogs/${blogsAtStart[0].id}`)
        .send(updateBlog)
        .expect(200)
    const blogsAtEnd = await helper.blogsInDb()
    const likesEnd = blogsAtEnd[0].likes
    assert.strictEqual(likesEnd-likesStart, 1)
})

after(async () => {
    await mongoose.connection.close()
})
const blogsRouter = require('express').Router()
const { request } = require('express')
const Blog = require('../models/db')
const Author =require('../models/author')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const findId = (await Author.find({})).map(a => a._id)
    const user = await Author.findById(findId[1])

    if(!body.likes){
        body.likes=0
    }
    if(!body.title || !body.url){
        response.status(400).end()
    }else{
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user.id
        })
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog)
    }
})
blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})
blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    const updateBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new:true })
    try{
        response.json(updateBlog)
    }catch(exception){
        next(exception)
    }
})
module.exports = blogsRouter
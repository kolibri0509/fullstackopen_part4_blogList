const blogsRouter = require('express').Router()
const { request } = require('express')
const Blog = require('../models/db')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

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
            likes: body.likes
        })
        const saveBlog = await blog.save()
        response.status(201).json(saveBlog)
    }
})
blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})
module.exports = blogsRouter
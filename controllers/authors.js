const bcrypt = require('bcrypt')
const authorsRouter = require('express').Router()
const Author = require('../models/author')

authorsRouter.get('/', async (request, response) => {
    const users = await Author.find({}).populate('blogs')
    response.json(users)
})

authorsRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (password.length < 3) {
        return response.status(400).json({ error: 'Too short password' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const author = new Author({
        username,
        name,
        passwordHash,
    })
    try{
        const savedAuthor = await author.save()
        response.status(201).json(savedAuthor)
    }catch{
        response.status(400).json({ error: 'The username must be unique and at least 3 characters long' })
    }
})

module.exports = authorsRouter
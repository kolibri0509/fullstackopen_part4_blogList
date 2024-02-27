const bcrypt = require('bcrypt')
const authorsRouter = require('express').Router()
const Author = require('../models/author')

authorsRouter.get('/', async (request, response) => {
    const users = await Author.find({})
    response.json(users)
})

authorsRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const author = new Author({
        username,
        name,
        passwordHash,
    })

    const savedAuthor = await author.save()

    response.status(201).json(savedAuthor)
})

module.exports = authorsRouter
const logger = require('./logger')
const Author =require('../models/author')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const tokenUserExtractor = async (request, response, next) => {
    try{
        const authorization = request.get('authorization')
        if(authorization && authorization.startsWith('Bearer ')){
            const token = authorization.replace('Bearer ', '')
            const decodedToken = jwt.verify(token, process.env.SECRET)
            const user = await Author.findById(decodedToken.id)
            if (!user) {
                return response.status(401).json({ error: 'token invalid' })
            }
            request.token = token
            request.user = user
        }
        next()
    }catch (err) {
        response.status(401).send({ error: 'Please authenticate' })
    }
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    if (error.name ===  'JsonWebTokenError') {
        return response.status(400).json({ error: 'token missing or invalid' })
    }else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        })
    }
    next(error)
}

module.exports= {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenUserExtractor
}
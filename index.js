#!/usr/bin/env node

'use strict'

const micro = require('micro')
const upload = require('./upload')
const remove = require('./delete')
const download = require('./download')

const config = require('./config')

micro(async (req, res) => {
    console.log(req.method, req.url)

    res.setHeader('Server', 'ImgBed')
    res.setHeader('Version', '1.0')

    if (req.method === 'PUT') return await upload(req, res)
    if (req.method === 'DELETE') return await remove(req, res)
    if (req.method === 'GET') return await download(req, res)

    return micro.sendError(req, res, {
        status: 404, message: 'Not Found'
    })
}).listen(+config.port, () => {
    console.log(`Server start on ${config.port}`)
    console.log(`Secret key: ${config.secret}`)
})
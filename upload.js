'use strict'

const { buffer, sendError } = require('micro')
const { md5, hmac256 } = require('./utils')
const { join, dirname } = require('path')
const mkdirs = require('mkdirs')
const { writeFile } = require('fs').promises
const { authorize, parsePath } = require('./utils')
const config = require('./config')

module.exports = async function (req, res) {
    let message = authorize(req.headers)
    if (message) {
        return sendError(req, res, { status: 400, message })
    }
    let buf = await buffer(req, { limit: config.limit })
    let hash = md5(buf)
    let file = parsePath(hash)

    try {
        await mkdirs(dirname(file))
        await writeFile(file, buf)
        return { url: config.hostname + hash.slice(0, 12) }
    } catch (err) {
        return sendError(req, res, {
            status: 500, message: err.message
        })
    }
}
'use strict'

const { sendError, send } = require('micro')
const { parse } = require('url')
const { join } = require('path')
const { parsePath } = require('./utils')
const imageType = require('image-type')
const { createReadStream } = require('fs')
const thumbnail = require('image-thumbnail')

module.exports = async function (req, res) {
    let { pathname, query } = parse(req.url)
    if (!/^\/[0-9a-z]{12}$/.test(pathname)) {
        return sendError(req, res, {
            status: 404, message: 'Not Found'
        })
    }

    let src = parsePath(pathname.slice(1))
    let stream = createReadStream(src)

    stream.on('readable', async () => {
        const chunk = stream.read(imageType.minimumBytes)
        stream.destroy()
        let { mime } = imageType(chunk)
        res.setHeader('Content-Type', mime)

        if (query) {
            /**
             * thumbnail
             */
            return send(res, 200, await thumbnail(src, {
                percentage: parseInt(query)
            }))
        } else {
            /**
             * origin
             */
            createReadStream(src).pipe(res)
        }
    })
}
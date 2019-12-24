'use strict'

const { sendError } = require('micro')
const { parse } = require('url')
const { unlink, stat } = require('fs').promises
const { join } = require('path')
const { authorize, parsePath } = require('./utils')

module.exports = async function (req, res) {
    let message = authorize(req.headers)
    if (message) {
        return sendError(req, res, { status: 400, message })
    }
    /**
     * @type {string}
     * @example '/a0287a839c01'
     */
    let filepath = parse(req.url).pathname
    let file = parsePath(filepath.slice(1))

    try {
        let st = await stat(file)
        if (st.isFile()) {
            await unlink(file)
            return { message: 'ok' }
        } else {
            return sendError(req, res, {
                status: 403, message: 'Forbidden'
            })
        }
    } catch (err) {
        return sendError(req, res, {
            status: 404, message: 'Not Found'
        })
    }
}
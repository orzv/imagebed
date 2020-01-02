'use strict'

const { createHash, createHmac } = require('crypto')
const { join } = require('path')
const config = require('./config')

exports.md5 = function (src) {
    return createHash('md5').update(src).digest('hex')
}

exports.hmac256 = function (src, key) {
    return createHmac('sha256', key).update(src).digest('hex')
}

/**
 * 获取文件真实地址
 * @param {string} path 文件hash
 * @return {string}
 * @example 'aa/bb/ccddeeff'
 */
exports.parsePath = function (path) {
    let prefix = path.slice(0, 2)
    let subfolder = path.slice(2, 4)
    let name = path.slice(4, 12)
    let file = join(config.base, prefix, subfolder, name)
    return file.slice(0, 1) !== '/' ? './' + file : file
}

/**
 * 检查操作权限
 * @param {object} header 请求header
 * @return {string | null} 如果没有权限，返回非null
 */
exports.authorize = function (header) {
    if (/localhost/.test(header.host)) return null
    let { authorization, date } = header
    if (!authorization || !date) return 'Invalid params'
    date = parseInt(date)
    let now = parseInt(Date.now() / 1000)
    if (now < date) return 'Invalid date'
    if (now - date > parseInt(config.expire)) return 'Date expired'
    let hash = exports.hmac256(date.toString(), config.secret)
    if (hash !== authorization) return 'Authorize fail'
    return null
}
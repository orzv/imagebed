'use strict'

const args = process.argv.slice(2)

const params = {
    base: './uploads',
    port: '23888',
    limit: '5mb',
    secret: parseInt(Math.random() * 100000).toString(),
    hostname: 'http://localhost:23888/',
    expire: '10'
}

args.length > 0 && args.forEach(item => {
    let [key, val] = item.split('=')
    key = key.match(/[^-]+$/)[0]
    params[key] = val
})

if (params.hostname.slice(-1) !== '/') {
    params.hostname += '/'
}

module.exports = params
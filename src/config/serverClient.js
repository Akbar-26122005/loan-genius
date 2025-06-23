require('dotenv')

const server = {
    protocol: process.env.SERVER_PROTOCOL || 'http',
    domain: process.env.SERVER_ADDRESS || 'localhost:5000',
}

const getPath = (path = '') =>`${server.protocol}://${server.domain}${path}`

export const getDateFromTimestamp = (timestamp) => new Date(timestamp).toISOString().split('T')[0]

export default getPath
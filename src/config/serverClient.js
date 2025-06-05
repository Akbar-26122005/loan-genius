const server = {
    protocol: 'http',
    domain: 'localhost:5000',
}

const getPath = (path = '') =>`${server.protocol}://${server.domain}${path}`

export default getPath
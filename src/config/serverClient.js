const server_address = process.env.SERVER_ADDRESS

const getPath = (path = '') =>`${server_address}${path}`

export const getDateFromTimestamp = (timestamp) => new Date(timestamp).toISOString().split('T')[0]

export default getPath
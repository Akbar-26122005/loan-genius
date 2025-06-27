const server_address = process.env.REACT_APP_SERVER_ADDRESS

const getPath = (path = '') => {
    const full_path = `${server_address}${path}`   
    console.log({
        server_address: server_address
        ,path: path
        ,full_address: full_path
    })
    return full_path
}

export const getDateFromTimestamp = (timestamp) => new Date(timestamp).toISOString().split('T')[0]

export default getPath
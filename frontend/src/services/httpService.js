import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'production'
    ? '/api/'
    : 'http://localhost:3030/api/'

var Axios = axios.create({});

export default {
    get(endpoint, data) {
        return ajax(endpoint, 'GET', data)
    },
    post(endpoint, data) {
        return ajax(endpoint, 'POST', data)
    },
    delete(endpoint, data) {
        return ajax(endpoint, 'DELETE', data)
    }
}

async function ajax(endpoint, method = 'get', data = null, dispatch) {
    try {
        const res = await Axios({
            url: `${BASE_URL}${endpoint}`,
            method,
            data,
        })
        return res.data;
    } catch (err) {
        console.error(`Had Issues ${method}ing to the backend, endpoint: ${endpoint},
        with data: ${data}`);
        console.dir(err);
        if (err.response && err.response.status === 401) {
            return (err)
        }
        throw err;
    }
}
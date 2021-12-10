import axios from 'axios';
const axiosClient = axios.create({
    baseURL: 'https://js-post-api.herokuapp.com/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});
// Add a request interceptor
axiosClient.interceptors.request.use(
    function(config) {
        // Do something before request is sent
        console.log(config);
        return config;
    },
    function(error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
    function(response) {
        return response.data;
    },
    function(error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        console.log('response err', error.response);
        if (!error.response) throw new Error('Network error ');
        if (error.response.status === 401) {
            // clear token logout
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
const axios = require('axios');

let domain = 'https://laravel-news.com';
let listPage = '/category/laravel-5.5';

axios.get(domain + listPage)
    .then(console.log)
    .catch(console.log);

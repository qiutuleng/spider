const axios = require('axios');
const cheerio = require('cheerio');
const watch = require('watchjs').watch;
const Article = require('./Models/Article');

let domain = 'https://laravel-news.com';
let articleListPage = '/category/laravel-5.5';

let articleListSelector = 'a.card';
let articleTitleSelector = 'h1.post__title';
let articleContentSelector = 'div.col.lg-col-9';

let data = {
    articles: {
        urls: [],
        list: []
    }
};

watch(data.articles, 'urls', (prop, action, value, old_value) => {
    getArticle(value[0]);
});

watch(data.articles, 'list', (prop, action, value, old_value) => {
    Article.create(value[0])
});

axios.get(domain + articleListPage)
    .then(response => {
        let $ = cheerio.load(response.data);
        let list = $(articleListSelector);
        for (let i = 0; i < list.length; i++) {
            data.articles.urls.push(domain + list.eq(i).attr('href'));
        }
    });

let getArticle = url => {
    axios.get(url)
        .then(response => {
            let $ = cheerio.load(response.data);
            let article = {
                title: $(articleTitleSelector).text(),
                content: $(articleContentSelector).html()
            };
            data.articles.list.push(article);
        });
};
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
    let article = value[0];
    Article.create(article)
        .then(result => {
            console.log('Saved the article: ' + article.title);
        });
});

let getArticleList = (url) => {
    console.log('Downloading article list: ' + url);
    axios.get(url)
        .then(response => {
            let $ = cheerio.load(response.data);
            let list = $(articleListSelector);
            for (let i = 0; i < list.length; i++) {
                let href = list.eq(i).attr('href');
                let url = href.indexOf('http') >= 0 ? href : domain + href;
                data.articles.urls.push(url);
            }
        });
};

const getArticle = url => {
    console.log('Downloading article: ' + url);
    axios.get(url)
        .then(response => {
            let $ = cheerio.load(response.data);
            let article = {
                title: $(articleTitleSelector).text(),
                content: $(articleContentSelector).html()
            };
            data.articles.list.push(article);
            console.log('Downloaded article: ' + article.title);
        });
};

getArticleList(domain + articleListPage);
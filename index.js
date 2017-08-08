const axios = require('axios');
const cheerio = require('cheerio');
const watch = require('watchjs').watch;
const Article = require('./Models/Article');

let domain = 'https://laravel-news.com';
let articleListPage = '/category/laravel-tutorials';

let articleListSelector = 'div.pb2 a.card';
let articleTitleSelector = 'h1.post__title';
let articleContentSelector = 'div.col.lg-col-9';
let nextPageSelector = 'nav.pagination>a.arrow--right';

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

const getCorrectUrl = url => {
    return url.indexOf('http') === 0 ? url : domain + url;
};

let getArticleList = (url) => {
    console.log('Downloading article list: ' + url);
    axios.get(url)
        .then(response => {
            let $ = cheerio.load(response.data);
            let list = $(articleListSelector);
            for (let i = 0; i < list.length; i++) {
                let url = getCorrectUrl(list.eq(i).attr('href'));
                data.articles.urls.push(url);
            }

            let nextPage = $(nextPageSelector);
            let nextPageHref = nextPage.attr('href');
            if (!!nextPageHref) {
                let nextPageUrl = getCorrectUrl(nextPageHref);
                getArticleList(nextPageUrl);
            }
        })
        .catch(error => {
            console.log('Article List Error URL: ' + url);
            throw error;
        });
};

const getArticle = url => {
    console.log('Downloading article: ' + url);
    axios.get(url)
        .then(response => {
            let $ = cheerio.load(response.data);
            let title = $(articleTitleSelector).text();
            let content = $(articleContentSelector).html();
            console.log('Downloaded article: ' + title);
            let article = {
                title,
                content
            };
            data.articles.list.push(article);
        })
        .catch(error => {
            console.log('Article Error URL: ' + url);
            throw error;
        });
};

getArticleList(domain + articleListPage);
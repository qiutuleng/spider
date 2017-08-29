require('./bootstrap.js');
const axios = require('axios');
const cheerio = require('cheerio');
const watch = require('watchjs').watch;
const Article = require('./Models/Article');

let domain = 'https://laravel-news.com'; // 要抓取的网站域名
let articleListPage = '/category/laravel-tutorials'; // 要抓取的网页地址，不带域名

/**
 * selector均使用JQuery的语法
 */

/**
 * 文章列表页的文章列表selector
 * example dom: <ul class="article_list"><li><a>文章标题1</a></li><li><a>文章标题2</a></li></ul>
 * example value: ul.article_list>li>a
 */
let articleListSelector = 'div.pb2 a.card';

/**
 * 文章列表页的文章列表分页,目前仅支持a链接
 * example dom: <ul class="article_paginate"><li><a>第一页</a><a>第二页</a></li></ul>
 * example value: ul.article_list>li>a
 */
let nextPageSelector = 'ul.article_paginate>li>a';

/**
 * 文章详情页的文章标题selector
 * example dom: <h1 class="article_title">文章标题1</h1>
 * example value: h1.article_title
 */
let articleTitleSelector = 'h1.post__title';

/**
 * 文章详情页的文章内容Selector,目前不支持单文章分页
 * example dom: <div class="article_content"><p>文章内容</p></ul>
 * example value: .article_content
 */
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
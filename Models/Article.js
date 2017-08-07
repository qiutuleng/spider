const BaseModel = require('./BaseModel.js');
const articles = {};

const table = 'articles';

articles.create = (object) => {
    console.log('Saving the article: ' + object.title);
    return BaseModel.create('articles', object);
};

articles.all = () => {
    return BaseModel.all(table);
};

module.exports = articles;
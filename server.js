// TODO: Refactoring
require('babel-register')({
  presets: ['env', 'react', 'stage-2', 'es2015', 'stage-0'],
});

const STATIC_VERSION = (new Date()).getTime();

const config = require('config');
const bodyParser = require('body-parser');
const axios = require('axios');
const xss = require('xss');
const path = require('path');
const ejs = require('ejs');
const { isString, isFunction } = require('lodash');
const express = require('express');
const renderStatic = require('./src/renderStatic').default;
const routes = require('./src/routes').default;
const { createStore } = require('./src/store');
const { escapeHtml } = require('./src/utils/text');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.disable('x-powered-by');

app.use(express.static('public'));

routes.forEach((route) => {
  app.get(route.path, async (req, res) => {
    let state;
    const store = createStore();
    const contentMetaTags = {
      type: 'website',
      title: 'U°Community',
      description: 'Social platform with a transparent dynamic reputation system',
      url: `${req.protocol}://${req.hostname}${req.originalUrl}`,
      image: `${req.protocol}://${req.hostname}/u.png`,
      imageWidth: '512',
      imageHeight: '512',
    };

    if (isFunction(route.getData)) {
      try {
        const data = await route.getData(store, req.params);

        if (data && data.contentMetaTags) {
          if (isString(data.contentMetaTags.title)) {
            contentMetaTags.title = escapeHtml(xss(data.contentMetaTags.title));
          }

          if (isString(data.contentMetaTags.description)) {
            contentMetaTags.description = escapeHtml(xss(data.contentMetaTags.description));
          }

          if (isString(data.contentMetaTags.image)) {
            contentMetaTags.image = escapeHtml(xss(data.contentMetaTags.image));
            contentMetaTags.imageWidth = undefined;
            contentMetaTags.imageHeight = undefined;
          }

          if (isString(data.contentMetaTags.imageWidth)) {
            contentMetaTags.imageWidth = escapeHtml(xss(data.contentMetaTags.imageWidth));
          }

          if (isString(data.contentMetaTags.imageHeight)) {
            contentMetaTags.imageHeight = escapeHtml(xss(data.contentMetaTags.imageHeight));
          }

          if (isString(data.contentMetaTags.path)) {
            contentMetaTags.url = xss(`${req.protocol}://${req.hostname}${data.contentMetaTags.path}`);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    try {
      state = xss(JSON.stringify(store.getState()).replace(/</g, '\\u003c'));
    } catch (err) {
      console.error(err);
    }

    const templateData = {
      contentMetaTags,
      state: state || {},
      staticVersion: STATIC_VERSION,
      content: renderStatic(store, req.url),
    };

    try {
      const html = await ejs.renderFile(path.resolve(__dirname, 'src/index.ejs'), templateData);
      res.send(html);
    } catch (e) {
      res.status(500).send(e);
    }
  });
});

app.post('/subscribe', async (req, res) => {
  try {
    await axios.post(
      'https://us3.api.mailchimp.com/3.0/lists/23512b5acd/members/',
      {
        email_address: req.body.email,
        status: 'subscribed',
      },
      {
        auth: {
          username: 'anystring',
          password: config.get('mailchimp.key'),
        },
      },
    );
    res.status(200).send();
  } catch (err) {
    res.status(err.response.status).send(err.response.data);
  }
});

app.listen(process.env.PORT || 3000);

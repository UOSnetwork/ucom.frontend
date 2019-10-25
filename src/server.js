const cookieParser = require('cookie-parser');
const config = require('config');
const bodyParser = require('body-parser');
const axios = require('axios');
const xss = require('xss');
const express = require('express');
const renderStatic = require('./renderStatic').default;
const routes = require('./routes').default;
const { createStore } = require('./store');
const i18nCommon = require('./i18n/common.json');

const STATIC_VERSION = (new Date()).getTime();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));


routes.forEach((route) => {
  app.get(route.path, async (req, res) => {
    let { lang } = req.cookies;

    if (!i18nCommon[lang]) {
      lang = 'en';
    }

    let state = {};
    const store = createStore();
    const baseUrl = `${req.protocol}://${req.hostname}`;
    const currentUrl = `${req.protocol}://${req.hostname}${req.originalUrl}`;
    let contentMetaTags = {
      url: currentUrl,
    };

    if (typeof route.getData === 'function') {
      try {
        const data = await route.getData(store, req.params);

        if (data && data.contentMetaTags) {
          contentMetaTags = {
            ...contentMetaTags,
            ...data.contentMetaTags,
          };
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

    try {
      res.send(renderStatic(store, req.url, state, STATIC_VERSION, contentMetaTags, baseUrl, lang));
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
    console.error(err);
    res.status(err.response.status).send(err.response.data);
  }
});

app.listen(process.env.PORT || 3000);

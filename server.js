// TODO: Refactoring
require('babel-register')({
  presets: ['env', 'react', 'stage-2', 'es2015', 'stage-0'],
});

const STATIC_VERSION = (new Date()).getTime();

const xss = require('xss');
const path = require('path');
const ejs = require('ejs');
const express = require('express');
const renderStatic = require('./src/renderStatic').default;
const routes = require('./src/routes').default;
const { createStore } = require('./src/store');

const app = express();

app.disable('x-powered-by');
app.use(express.static('public'));

routes.forEach((route) => {
  app.get(route.path, async (req, res) => {
    const store = createStore();
    let contentMetaTags;
    let state;

    if (typeof route.getData === 'function') {
      try {
        const data = await route.getData(store, req.params);

        // TODO: Refactoring contentMetaTags, get every prop separately
        if (data && data.contentMetaTags) {
          contentMetaTags = JSON.parse(xss(JSON.stringify(data.contentMetaTags)));
          if (contentMetaTags.path) {
            contentMetaTags.url = `${req.protocol}://${req.hostname}${contentMetaTags.path}`;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (!contentMetaTags) {
      contentMetaTags = {
        type: 'website',
        title: 'U°Community',
        description: 'Social platform with a transparent dynamic reputation system',
        url: `${req.protocol}://${req.hostname}${req.originalUrl}`,
        image: `${req.protocol}://${req.hostname}/u.png`,
        imageWidth: '512',
        imageHeight: '512',
      };
    }

    try {
      state = xss(JSON.stringify(store.getState()).replace(/</g, '\\u003c'));
    } catch (err) {
      console.error(err);
    }

    const templateData = {
      contentMetaTags,
      content: renderStatic(store, req.url),
      staticVersion: STATIC_VERSION,
      state: state || {},
    };

    try {
      const html = await ejs.renderFile(path.resolve(__dirname, 'src/index.ejs'), templateData);
      res.send(html);
    } catch (e) {
      res.status(500).send(e);
    }
  });
});

app.listen(process.env.PORT || 3000);

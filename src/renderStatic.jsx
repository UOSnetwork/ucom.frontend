import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './components/App';
import i18n from './i18n';

export default (store, location, state, staticVersion, contentMetaTags = {}, baseUrl, lang) => {
  i18n(lang);

  const title = contentMetaTags.title || 'U°Community';
  const url = contentMetaTags.url || `${baseUrl}/`;
  const type = contentMetaTags.type || 'website';
  const description = contentMetaTags.description || 'Social platform with a transparent dynamic reputation system';
  const { image } = contentMetaTags;
  const imageWidth = contentMetaTags.image ? contentMetaTags.imageWidth : 512;
  const imageHeight = contentMetaTags.image ? contentMetaTags.imageHeight : 512;
  const defaultImage = `${baseUrl}/u.png`;

  return renderToString((
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0" />
        <meta name="google-site-verification" content="mhqdpp_Xwfs-HeZvF6fQ1OR-pq3wNylaet4dVvUeLPk" />
        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,400i,600,700,700i,900" rel="stylesheet" />
        <link href="https://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />

        <title>{title}</title>
        <meta property="og:title" content={title} />
        {!contentMetaTags.isSmallCardImage && image && <meta name="twitter:card" content="summary_large_image" />}
        <meta property="og:site_name" content="U°Community" />
        <meta property="og:url" content={url} />
        <meta property="og:type" content={type} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image || defaultImage} />
        {imageWidth && <meta property="og:image:width" content={imageWidth} />}
        {imageHeight && <meta property="og:image:width" content={imageHeight} />}
        {contentMetaTags.keywords && <meta name="keywords" content={contentMetaTags.keywords} />}
      </head>
      <body style={{ display: 'none' }}>
        <div id="app">
          <Provider store={store}>
            <StaticRouter location={location} context={{}}>
              <App />
            </StaticRouter>
          </Provider>
        </div>
        <div id="portal-root" />

        <noscript>
          <iframe title="googletagmanager" src="https://www.googletagmanager.com/ns.html?id=GTM-WGSSH3Q" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
        </noscript>

        <script src="https://www.google.com/recaptcha/api.js" defer />

        <script dangerouslySetInnerHTML={{ __html: `window.APP_STATE = ${state};` }} />

        <script type="text/javascript" src={`/app.js?${staticVersion}`} async />
      </body>
    </html>
  ));
};

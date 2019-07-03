import ReactDOM from 'react-dom';
import React from 'react';
import xss from 'xss';
import humps from 'lodash-humps';
import axios from 'axios';
import { truncate } from 'lodash';
import config from '../../package.json';
import { extractHostname, validUrl } from './url';
import Embed from '../components/Embed';
import { getEmbedByUrl } from './entityImages';

export default class EmbedService {
  static async getDataAndRenderEmbed(url) {
    try {
      const data = await EmbedService.getDataFromUrl(url);
      return data.videoUrl
        ? EmbedService.renderEmbedVideo(data)
        : EmbedService.renderEmbedCard(data);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async getDataFromUrl(url) {
    if (!validUrl(url)) {
      throw new Error('Url is not valid');
    }

    const truncateContent = str => truncate(str, {
      length: 140,
      separator: ' ',
    });

    try {
      let videoUrl;
      let videoAspectRatio;
      let imageUrl;
      const response = humps(await axios.get(config.iframely.httpEndpoint, { params: { url, autoplay: 1, mute: 1 } }));
      const { data: { links: { player, thumbnail }, meta } } = response;

      if (player && player.length) {
        const validPlayers = player.filter(({ rel }) => (
          rel.includes('oembed') || rel.includes('html5')
        ));

        const sortedPlayers = validPlayers.sort((playerA, playerB) => {
          const a = Number(playerA.rel.includes('autoplay'));
          const b = Number(playerB.rel.includes('autoplay'));
          return b - a;
        });

        const validPlayer = sortedPlayers[0];

        if (validPlayer && config.allowedVideoHosts.includes(extractHostname(validPlayer.href))) {
          videoUrl = validPlayer.href;
          videoAspectRatio = validPlayer.media.aspectRatio;
        }
      }

      if (thumbnail && thumbnail.length) {
        const validTypes = ['twitter', 'thumbnail', 'image'];
        (() => {
          for (let i = 0; i < validTypes.length; i++) {
            for (let j = 0; j < thumbnail.length; j++) {
              if (thumbnail[j].rel.includes(validTypes[i])) {
                imageUrl = thumbnail[j].href;
                return;
              }
            }
          }
        })();
      }

      return {
        videoUrl,
        videoAspectRatio,
        imageUrl,
        url: meta.canonical,
        title: truncateContent(meta.title),
        description: truncateContent(meta.description),
      };
    } catch (err) {
      throw err;
    }
  }

  static renderEmbedLink(url) {
    return xss(`
      <a href="${url}" class="js-embed" target="_blank">${url}</a>
    `, {
      whiteList: {
        a: ['class', 'href', 'target'],
      },
    });
  }

  static renderEmbeds(el, entityImages) {
    el.querySelectorAll('.js-embed').forEach((el) => {
      const url = el.href;
      const embedData = getEmbedByUrl(entityImages, url);

      if (embedData) {
        ReactDOM.render(React.createElement(Embed, embedData, null), el.parentNode);
      }
    });
  }
}

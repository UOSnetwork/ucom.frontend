import xss from 'xss';
import humps from 'lodash-humps';
import axios from 'axios';
import { truncate } from 'lodash';
import config from '../../package.json';
import { sanitizeEmbedContent } from './text';
import { extractHostname, validUrl } from './url';

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

    const replaceSymbols = (str) => {
      let result = str.replace(/@/g, '@&zwnj;');
      result = result.replace(/#/g, '#&zwnj;');
      return result;
    };

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
        title: replaceSymbols(truncateContent(meta.title)),
        description: replaceSymbols(truncateContent(meta.description)),
      };
    } catch (err) {
      throw err;
    }
  }

  static renderEmbedCard({
    url,
    title,
    description,
    imageUrl,
  }) {
    return `
      <div class="medium-embed">
        ${xss(`<a href="${url}" target="_blank">`)}
          ${imageUrl ? `
            <span class="medium-embed-img">
              ${xss(`<img src="${imageUrl}" alt="" />`)}
            </span>
          ` : ''}

          <span class="medium-embed-content">
            ${title ? `
              <span class="medium-embed-title">
                ${xss(sanitizeEmbedContent(title))}
              </span>
            ` : ''}

            ${description ? `
              <span class="medium-embed-text">
                ${xss(sanitizeEmbedContent(description))}
              </span>
            ` : ''}

            <span class="medium-embed-link">
              ${xss(extractHostname(url))}
            </span>
          </span>
        </a>
      </div>
    `;
  }

  static renderEmbedVideo({
    videoUrl,
    videoAspectRatio,
  }) {
    const paddingBottom = 100 / videoAspectRatio;
    const xssOptions = {
      whiteList: {
        iframe: ['src'],
      },
    };

    return `
      <div class="iframe-video-v2" ${paddingBottom ? `style="padding-bottom: ${paddingBottom}%"` : ''}>
        ${xss(`
          <iframe
            src="${videoUrl}"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        `, xssOptions)}
      </div>
    `;
  }
}

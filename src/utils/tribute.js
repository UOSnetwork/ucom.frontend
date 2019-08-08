import { renderToStaticMarkup } from 'react-dom/server';
import api from '../api';
import urls from './urls';
import withLoader from './withLoader';
import { getUserName } from './user';
import { EntryCardComponent } from '../components/EntryCard';

export const defaultTributeConfig = {
  fillAttr: 'accountName',

  lookup: item => (
    `${item.accountName} ${item.firstName} ${item.lastName}`
  ),

  values: async (text, cb) => {
    try {
      const data = await withLoader(api.searchUsers(text.toLocaleLowerCase()));
      cb(data.slice(0, 20));
    } catch (err) {
      console.error(err);
    }
  },

  menuItemTemplate: item => (
    renderToStaticMarkup(EntryCardComponent({
      disableRate: true,
      avatarSrc: urls.getFileUrl(item.original.avatarFilename),
      title: getUserName(item.original),
      nickname: item.original.accountName,
    }))
  ),
};

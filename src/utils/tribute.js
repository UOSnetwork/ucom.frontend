import { renderToStaticMarkup } from 'react-dom/server';
import api from '../api';
import urls from '../utils/urls';
import { getUserName } from '../utils/user';
import EntryCard from '../components/EntryCard';

export const defaultTributeConfig = {
  fillAttr: 'accountName',

  lookup: item => (
    `${item.accountName} ${item.firstName} ${item.lastName}`
  ),

  values: async (text, cb) => {
    if (text.length < 3) {
      return;
    }

    try {
      const data = await api.searchUsers(text.toLocaleLowerCase());
      cb(data.slice(0, 20));
    } catch (err) {
      console.error(err);
    }
  },

  menuItemTemplate: item => (
    renderToStaticMarkup(EntryCard({
      disableRate: true,
      avatarSrc: urls.getFileUrl(item.original.avatarFilename),
      title: getUserName(item.original),
      nickname: item.original.accountName,
    }))
  ),
};

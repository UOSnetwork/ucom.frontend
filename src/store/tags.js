import { compact } from 'lodash';

const getInitialState = () => ({
  data: {},
});

const tags = (state = getInitialState(), action) => {
  switch (action.type) {
    case 'ADD_TAGS':
      return {
        ...state,
        data: {
          ...state.data,
          ...(action.payload.reduce((obj, i) => ({
            ...obj,
            [i.title]: {
              ...state.data[i.title],
              ...i,
            },
          }), {})),
        },
      };

    default: {
      return state;
    }
  }
};

export const getTagsByTitle = (tags, titles) =>
  compact(titles.map(title => tags.data[title]));

export default tags;

import merge from '../../../utils/merge';
import { POST_TYPE_MEDIA_ID } from '../../../utils/constants';

const getInitialState = () => ({
  data: {
    id: null,
    organizationId: null,
    entityImages: {},
    postTypeId: POST_TYPE_MEDIA_ID,
    title: '',
    leadingText: '',
    description: '',
  },
  loading: false,
  loaded: false,
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'EDIT_POST_PAGE_RESET':
      return getInitialState();

    case 'EDIT_POST_PAGE_SET_DATA':
      return merge({}, state, action.payload);

    default:
      return state;
  }
};

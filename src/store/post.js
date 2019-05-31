import Validator from '../utils/validator';
import { POST_TYPE_MEDIA_ID } from '../utils/posts';

const getInitialState = () => ({
  data: {
    id: null,
    entityImages: {},
    postTypeId: POST_TYPE_MEDIA_ID,
    title: '',
    leadingText: '',
    description: '',
  },
  errors: {},
  isValid: false,
  saved: false,
});

const rules = {
  title: 'required',
  leadingText: 'required',
  description: 'required',
};

const post = (state = getInitialState(), action) => {
  switch (action.type) {
    case 'RESET_POST':
      return getInitialState();

    case 'SET_POST_DATA': {
      const data = Object.assign({}, state.data, action.payload);
      const validation = new Validator(data, rules);

      return Object.assign({}, state, {
        data,
        isValid: validation.passes(),
      });
    }

    case 'VALIDATE_POST': {
      const validation = new Validator(state.data, rules);

      validation.passes();

      return Object.assign({}, state, {
        errors: validation.errors.all(),
      });
    }

    case 'VALIDATE_POST_FIELD': {
      const validation = new Validator(state.data, rules);

      validation.passes();

      return Object.assign({}, state, {
        errors: Object.assign({}, state.errors, {
          [action.payload]: validation.errors.get(action.payload),
        }),
      });
    }

    case 'POST_SET_SAVED':
      return { ...state, saved: action.payload };

    default:
      return state;
  }
};

export default post;

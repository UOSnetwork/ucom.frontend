import { validateFields } from '../utils/validateFields';

const getInitialState = () => ({
  redirectUrl: undefined,
  visibility: false,
  loading: false,
  errors: {},
  serverErrors: [],
  form: {
    brainkey: '',
    accountName: '',
  },
  rules: {
    brainkey: 'required',
    accountName: 'required',
  },
});

const auth = (state = getInitialState(), action) => {
  switch (action.type) {
    case 'AUTH_RESET':
      return getInitialState();

    case 'AUTH_SET_FORM': {
      const fields = Object.keys(action.payload);
      const form = { ...state.form, ...action.payload };
      const validation = validateFields(form, fields, state.rules);
      const errors = { ...state.errors, ...validation.errors };
      const { isValid } = validation;

      return {
        ...state, form, errors, isValid,
      };
    }

    case 'AUTH_SET_DATA':
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default auth;

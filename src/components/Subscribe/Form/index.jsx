import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import TextInput from '../../TextInput';
import Button from '../../Button/index';
import Validate from '../../../utils/validate';
import withLoader from '../../../utils/withLoader';
import { addValidationErrorNotification } from '../../../actions/notifications';
import * as subscribeActions from '../../../actions/subscribe';
import styles from './styles.css';

const Form = ({ onSuccess }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState();
  const [isValid, setIsValid] = useState(false);

  const validate = (data) => {
    const { errors, isValid } = Validate.validateSubscribe(data);

    setIsValid(isValid);
    setErrors(errors);

    return isValid;
  };

  const setDataAndValidate = (data) => {
    setData(data);
    validate(data);
  };

  const submit = async (data) => {
    if (loading) {
      return;
    }

    const isValid = validate(data);
    setSubmited(true);

    if (!isValid) {
      dispatch(addValidationErrorNotification());
      return;
    }

    setLoading(true);

    try {
      await withLoader(dispatch(subscribeActions.submit(data.email)));
      onSuccess();
    } catch (err) {
      const { response } = err;
      const message = (response && response.data && response.data.title) || err.message;
      setErrors({ email: message });
      setIsValid(false);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(data);
      }}
    >
      <div className={styles.field}>
        <TextInput
          autoFocus
          label={t('Email')}
          submited={submited}
          error={errors && errors.email}
          value={data.email}
          onChange={email => setDataAndValidate({ ...data, email })}
        />
      </div>
      <div className={styles.action}>
        <Button
          red
          strech
          big
          cap
          type="submit"
          disabled={!isValid}
        >
          {t('Subscribe')}
        </Button>
      </div>
    </form>
  );
};

Form.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default Form;

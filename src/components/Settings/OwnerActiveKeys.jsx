import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import React, { useState, Fragment } from 'react';
import styles from './styles.css';
import Button from '../Button/index';
import TextInput from '../TextInput';
import IconEnter from '../Icons/Enter';
import {
  isBrainkeySymbolsValid,
  isBrainkeyLengthValid,
} from '../../utils/brainkey';
import { ERROR_WRONG_BRAINKEY } from '../../utils/constants';
import { removeMultipleSpaces } from '../../utils/text';
import { parseResponseError } from '../../utils/errors';
import { checkBrainkey } from '../../actions/auth';
import IconInputError from '../Icons/InputError';
import CopyPanel from '../CopyPanel';
import withLoader from '../../utils/withLoader';
import Worker from '../../worker';

const OwnerActiveKeys = () => {
  const { t } = useTranslation();
  const [brainkey, setBrainkey] = useState('');
  const [keys, setKeys] = useState({});
  const [formActive, setFormActive] = useState(false);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState('');
  const dispatch = useDispatch();

  return (
    <Fragment>
      <h4 className={styles.title}>{t('Get Owner and Active key pairs with Brainkey')}</h4>
      <p>{t('hereYouGenerateBrainkey')}</p>

      {keys.ownerKey && keys.ownerPublicKey && keys.activeKey && keys.activePublicKey ? (
        <div className="ym-hide-conten">
          <h4 className={styles.title}>{t('Active')}</h4>
          <p>{t('needActiveKeySign')}</p>
          <div className={styles.copy}>
            <CopyPanel
              label={t('Private')}
              value={keys.activeKey}
            />
          </div>
          <div className={styles.copy}>
            <CopyPanel
              label={t('Public')}
              value={keys.activePublicKey}
            />
          </div>
          <h4 className={styles.title}>{t('Owner')}</h4>
          <p>{t('canResetKeys')}</p>
          <div className={styles.copy}>
            <CopyPanel
              label={t('Private')}
              value={keys.ownerKey}
            />
          </div>
          <div className={styles.copy}>
            <CopyPanel
              label={t('Public')}
              value={keys.ownerPublicKey}
            />
          </div>
        </div>
      ) : (
        <Fragment>
          {formActive ? (
            <form
              className={styles.brainkeyForm}
              onSubmit={async (e) => {
                e.preventDefault();

                if (loading) {
                  return;
                }

                const trimedBrainkey = brainkey.trim();
                if (!isBrainkeySymbolsValid(trimedBrainkey) || !isBrainkeyLengthValid(trimedBrainkey)) {
                  setFormError(t(ERROR_WRONG_BRAINKEY));
                  return;
                }

                setLoading(true);

                try {
                  await withLoader(dispatch(checkBrainkey(trimedBrainkey)));
                } catch (err) {
                  const { message } = parseResponseError(err)[0];
                  setFormError(message);
                  setLoading(false);
                  return;
                }

                setFormError('');

                try {
                  const ownerKey = await Worker.getOwnerKeyByBrainkey(brainkey);
                  const activeKey = await Worker.getActiveKeyByBrainKey(brainkey);
                  const ownerPublicKey = await Worker.getPublicKeyByPrivateKey(ownerKey);
                  const activePublicKey = await Worker.getPublicKeyByPrivateKey(activeKey);

                  setKeys({
                    ownerKey, ownerPublicKey, activeKey, activePublicKey,
                  });
                } catch (e) {
                  setKeys({});
                  setFormError(e.message);
                }

                setLoading(false);
              }}
            >
              <TextInput
                autoFocus
                ymDisableKeys
                placeholder={t('Brainkey')}
                value={brainkey}
                onChange={(value) => {
                  value = removeMultipleSpaces(value);
                  setBrainkey(value);
                  if (!isBrainkeySymbolsValid(value)) {
                    setFormError(t(ERROR_WRONG_BRAINKEY));
                  } else {
                    setFormError('');
                  }
                }}
              />
              {formError &&
                <div className={styles.error}>
                  <IconInputError />
                  <span className={styles.text}>{formError}</span>
                </div>
              }
              <button
                className={styles.button}
                disabled={!!formError || loading}
              >
                <IconEnter />
              </button>
            </form>
          ) : (
            <div className={styles.action}>
              <Button
                strech
                small
                onClick={() => setFormActive(true)}
              >
                {t('Show')}
              </Button>
            </div>
          )}
        </Fragment>
      )}

    </Fragment>
  );
};

export default OwnerActiveKeys;

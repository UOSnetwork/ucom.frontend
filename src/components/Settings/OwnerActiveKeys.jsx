import { useDispatch } from 'react-redux';
import React, { useState, Fragment } from 'react';
import styles from './styles.css';
import Button from '../Button/index';
import TextInput from '../TextInput';
import IconEnter from '../Icons/Enter';
import {
  isBrainkeySymbolsValid,
  isBrainkeyLengthValid,
  ERROR_WRONG_BRAINKEY,
} from '../../utils/brainkey';
import { removeMultipleSpaces } from '../../utils/text';
import { parseResponseError } from '../../utils/errors';
import { checkBrainkey } from '../../actions/auth';
import IconInputError from '../Icons/InputError';
import {
  getOwnerPrivateKey,
  getActivePrivateKey,
  getOwnerPublicKeyByBrainkey,
  getActivePublicKeyByBrainkey,
} from '../../utils/keys';
import CopyPanel from '../CopyPanel';
import withLoader from '../../utils/withLoader';

const OwnerActiveKeys = () => {
  const [brainkey, setBrainkey] = useState('');
  const [keys, setKeys] = useState({});
  const [formActive, setFormActive] = useState(false);
  const [formError, setFormError] = useState('');
  const dispatch = useDispatch();

  return (
    <Fragment>
      <h4 className={styles.title}>Get Owner and Active key pairs with Brainkey</h4>
      <p>Here you can generate your keys from Brainkey.</p>

      {keys.ownerKey && keys.ownerPublicKey && keys.activeKey && keys.activePublicKey ? (
        <div className="ym-hide-conten">
          <h4 className={styles.title}>Active</h4>
          <p>You need your Active Key to sign financial transactions</p>
          <div className={styles.copy}>
            <CopyPanel
              label="Private"
              value={keys.activeKey}
            />
          </div>
          <div className={styles.copy}>
            <CopyPanel
              label="Public"
              value={keys.activePublicKey}
            />
          </div>
          <h4 className={styles.title}>Owner</h4>
          <p>You can reset your Active and Social Keys using your Owner Key.</p>
          <div className={styles.copy}>
            <CopyPanel
              label="Private"
              value={keys.ownerKey}
            />
          </div>
          <div className={styles.copy}>
            <CopyPanel
              label="Public"
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

                const trimedBrainkey = brainkey.trim();
                if (!isBrainkeySymbolsValid(trimedBrainkey) || !isBrainkeyLengthValid(trimedBrainkey)) {
                  setFormError(ERROR_WRONG_BRAINKEY);
                  return;
                }

                try {
                  await withLoader(dispatch(checkBrainkey(trimedBrainkey)));
                } catch (err) {
                  const { message } = parseResponseError(err)[0];
                  setFormError(message);
                  return;
                }

                setFormError('');
                try {
                  setKeys({
                    ownerKey: getOwnerPrivateKey(brainkey),
                    ownerPublicKey: getOwnerPublicKeyByBrainkey(brainkey),
                    activeKey: getActivePrivateKey(brainkey),
                    activePublicKey: getActivePublicKeyByBrainkey(brainkey),
                  });
                } catch (e) {
                  setKeys({});
                  setFormError(e.message);
                }
              }}
            >
              <TextInput
                autoFocus
                touched
                ymDisableKeys
                placeholder="Brainkey"
                value={brainkey}
                onChange={(value) => {
                  value = removeMultipleSpaces(value);
                  setBrainkey(value);
                  if (!isBrainkeySymbolsValid(value)) {
                    setFormError(ERROR_WRONG_BRAINKEY);
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
                disabled={!!formError}
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
                Show
              </Button>
            </div>
          )}
        </Fragment>
      )}

    </Fragment>
  );
};

export default OwnerActiveKeys;

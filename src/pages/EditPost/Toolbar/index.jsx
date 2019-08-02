import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { Fragment, memo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import CreateBy from '../CreateBy';
import Button from '../../../components/Button/index';
import Close from '../../../components/Icons/Close';

import SubmitPopup from '../SubmitPopup';
import styles from './styles.css';

const Toolbar = ({
  showTitle, showClose, history,
}) => {
  const state = useSelector(state => state.pages.editPost, (prev, next) => (
    prev.data.id === next.data.id &&
    prev.loaded === next.loaded
  ));
  const [submitPopupVisible, setSubmitPopupVisible] = useState();

  const hideSubmitPopup = useCallback(() => {
    setSubmitPopupVisible(false);
  }, []);

  const showSubmitPopup = useCallback(() => {
    setSubmitPopupVisible(true);
  }, []);

  return (
    <Fragment>
      {submitPopupVisible &&
        <SubmitPopup onClickClose={hideSubmitPopup} />
      }

      <div className={styles.toolbar}>
        <div className={styles.inner}>
          <div className={styles.title}>
            {state.loaded && showTitle &&
              <Fragment>
                {state.data.id ? 'Edit Media Post' : 'Create Media Post'}
              </Fragment>
            }
          </div>
          <div className={styles.createBy}>
            {state.loaded &&
              <CreateBy />
            }
          </div>
          <div className={styles.action}>
            <Button
              red
              small
              onClick={showSubmitPopup}
              disabled={!state.loaded}
            >
              Publish
            </Button>
          </div>
        </div>
        {showClose &&
          <div
            role="presentation"
            className={styles.close}
            onClick={() => {
              history.goBack();
            }}
          >
            Close <Close />
          </div>
        }
      </div>
    </Fragment>
  );
};

Toolbar.propTypes = {
  showClose: PropTypes.bool,
  showTitle: PropTypes.bool,
};

Toolbar.defaultProps = {
  showClose: true,
  showTitle: true,
};

export default withRouter(memo(Toolbar));

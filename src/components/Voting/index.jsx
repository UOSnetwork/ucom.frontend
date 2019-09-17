import { isEqual } from 'lodash';
import Tippy from '@tippy.js/react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import React, { memo, useRef, useCallback, Fragment } from 'react';
import Details from './Details';
import UsersPopup from './UsersPopup';
import { formatRate } from '../../utils/rate';
import Inner from './Inner';

const Votin = ({
  rate, count, selfVote, details, usersPopup, onClick, onClickUp, onClickDown, onShow, loading, onClickTouchDevice,
}) => {
  const tippyInstance = useRef();
  const mediaQuery = useSelector(s => s.mediaQuery);
  const hideTooltip = useCallback(() => {
    if (tippyInstance.current) {
      tippyInstance.current.hide();
    }
  }, [tippyInstance, onClick]);

  return (
    <Fragment>
      <UsersPopup {...usersPopup} />

      {mediaQuery.hover ? (
        <Tippy
          arrow
          interactive
          placement="top-center"
          theme="dropdown-dark"
          trigger="mouseenter"
          content={(
            <Details
              {...details}
              selfVote={selfVote}
              hideTooltip={hideTooltip}
              onClick={() => {
                hideTooltip();

                if (onClick) {
                  onClick();
                }
              }}
            />
          )}
          onCreate={(instance) => {
            tippyInstance.current = instance;
          }}
          onShow={onShow}
        >
          <Inner
            loading={loading}
            onClick={onClick}
            onClickUp={onClickUp}
            onClickDown={onClickDown}
            selfVote={selfVote}
            count={count}
            rate={rate}
          />
        </Tippy>
      ) : (
        <Inner
          loading={loading}
          onClick={onClickTouchDevice}
          onClickUp={onClickUp}
          onClickDown={onClickDown}
          selfVote={selfVote}
          count={count}
          rate={rate}
        />
      )}

    </Fragment>
  );
};

Votin.propTypes = {
  rate: PropTypes.string,
  count: PropTypes.number,
  selfVote: PropTypes.string,
  popupVisible: PropTypes.bool,
  details: PropTypes.shape(Details.propTypes),
  usersPopup: PropTypes.shape(UsersPopup.propTypes),
  onClickUp: PropTypes.func,
  onClickDown: PropTypes.func,
  onShow: PropTypes.func,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  onClickTouchDevice: PropTypes.func,
};

Votin.defaultProps = {
  rate: formatRate(0, true),
  count: 0,
  selfVote: undefined,
  popupVisible: false,
  details: Details.defaultProps,
  usersPopup: UsersPopup.defaultProps,
  onClickUp: undefined,
  onClickDown: undefined,
  onShow: undefined,
  onClick: undefined,
  loading: false,
  onClickTouchDevice: undefined,
};

export * from './Wrappers';
export default memo(Votin, isEqual);

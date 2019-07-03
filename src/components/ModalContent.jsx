import classNames from 'classnames';
import React, { useRef } from 'react';
import CloseIcon from './Icons/Close';
import { getClassNames } from '../utils/bem';

// TODO: (Refactoring) Remove and replace this with Popup/Content
export default (props) => {
  const el = useRef(null);

  return (
    <div
      ref={el}
      role="presentation"
      className={classNames(getClassNames('modal-content', props.mod))}
      onClick={(e) => {
        if (props.onClickClose && e.target === el.current) {
          props.onClickClose();
        }
      }}
    >
      {props.onClickClose &&
        <div
          role="presentation"
          className="modal-content__close"
          onClick={() => props.onClickClose()}
        >
          <CloseIcon />
        </div>
      }

      <div className="modal-content__inner">
        {props.children}
      </div>
    </div>
  );
};

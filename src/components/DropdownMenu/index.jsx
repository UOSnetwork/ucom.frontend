import Tippy from '@tippy.js/react';
import { isEqual } from 'lodash';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { useRef, memo } from 'react';
import Icon from './Icon';
import styles from './styles.css';

export const DROPDOWN_MENU_ITEM_TYPE_TITLE = 1;
export const DROPDOWN_MENU_ITEM_TYPE_ENTRY = 2;
export const DROPDOWN_MENU_ITEM_TYPE_LOGOUT = 3;

const DropdownMenu = (props) => {
  const tippyInstance = useRef();

  return (
    <Tippy
      arrow
      interactive
      isEnabled={!props.disabled}
      theme="dropdown"
      distance={props.distance}
      placement={props.position}
      trigger={props.trigger}
      onCreate={(instance) => {
        tippyInstance.current = instance;
      }}
      onHidden={() => {
        if (props.onHidden) {
          props.onHidden();
        }
      }}
      onShow={() => {
        if (props.onShow) {
          props.onShow();
        }
      }}
      onHide={() => {
        if (props.onHide) {
          props.onHide();
        }
      }}
      content={(
        <div className={styles.tooltipMenu}>
          {props.items.map((item, id) => {
            let LinkTag = 'div';

            if (item.url && item.url[0] === '#') {
              LinkTag = 'a';
            }

            return (
              <LinkTag
                key={id}
                href={item.url}
                className={classNames({
                  [styles.item]: true,
                  [styles.title]: item.type === DROPDOWN_MENU_ITEM_TYPE_TITLE,
                  [styles.entry]: item.type === DROPDOWN_MENU_ITEM_TYPE_ENTRY,
                  [styles.logout]: item.type === DROPDOWN_MENU_ITEM_TYPE_LOGOUT,
                  [styles.disabled]: item.disabled,
                })}
                onClick={() => {
                  if (tippyInstance.current) {
                    tippyInstance.current.hide();
                  }

                  if (item.url && item.url[0] !== '#') {
                    props.history.push(item.url);
                  }

                  if (item.onClick) {
                    item.onClick();
                  }
                }}
              >
                {item.avatar}
                <span className={styles.title}>
                  <span className={styles.titleInner}>
                    {item.title}
                  </span>
                </span>
              </LinkTag>
            );
          })}
        </div>
      )}
    >
      {props.children || <Icon />}
    </Tippy>
  );
};

DropdownMenu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    type: PropTypes.oneOf([
      DROPDOWN_MENU_ITEM_TYPE_TITLE,
      DROPDOWN_MENU_ITEM_TYPE_ENTRY,
      DROPDOWN_MENU_ITEM_TYPE_LOGOUT,
    ]),
    avatar: PropTypes.node,
  })).isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  trigger: PropTypes.string,
  position: PropTypes.string,
  distance: PropTypes.number,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  onHidden: PropTypes.func,
  onShow: PropTypes.func,
  onHide: PropTypes.func,
};

DropdownMenu.defaultProps = {
  disabled: false,
  children: null,
  trigger: 'click',
  position: 'bottom-center',
  distance: 10,
  onHidden: undefined,
  onShow: undefined,
  onHide: undefined,
};

export { default as DropdownMenuIcon } from './Icon';
export default withRouter(memo(DropdownMenu, isEqual));

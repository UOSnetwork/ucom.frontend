import { isEqual } from 'lodash';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tippy';
import PropTypes from 'prop-types';
import React, { createRef, memo } from 'react';
import IconDots from '../Icons/Dots';
import styles from './styles.css';

export const DROPDOWN_MENU_ITEM_TYPE_TITLE = 1;
export const DROPDOWN_MENU_ITEM_TYPE_ENTRY = 2;
export const DROPDOWN_MENU_ITEM_TYPE_LOGOUT = 3;

const DropdownMenu = (props) => {
  const tooltipRef = createRef();

  return (
    <Tooltip
      ref={tooltipRef}
      arrow
      useContext
      interactive
      disabled={props.disabled}
      theme="dropdown"
      distance={props.distance}
      position={props.position}
      trigger={props.trigger}
      html={(
        <div className={styles.tooltipMenu}>
          {props.items.map((item, id) => {
            const LinkTag = item.url ? Link : 'button';

            return (
              <LinkTag
                key={id}
                to={item.url}
                className={classNames({
                  [styles.item]: true,
                  [styles.title]: item.type === DROPDOWN_MENU_ITEM_TYPE_TITLE,
                  [styles.entry]: item.type === DROPDOWN_MENU_ITEM_TYPE_ENTRY,
                  [styles.logout]: item.type === DROPDOWN_MENU_ITEM_TYPE_LOGOUT,
                  [styles.disabled]: item.disabled,
                })}
                onClick={() => {
                  if (tooltipRef.current) {
                    tooltipRef.current.hideTooltip();
                  }

                  if (item.onClick) {
                    item.onClick();
                  }
                }}
              >
                {item.avatar}
                <span className={styles.title}>
                  {item.title}
                </span>
              </LinkTag>
            );
          })}
        </div>
      )}
    >
      {props.children ||
        <div className={styles.icon}>
          <button
            onClick={props.onClickButton}
            className={styles.button}
          >
            <IconDots />
          </button>
        </div>
      }
    </Tooltip>
  );
};

DropdownMenu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string.isRequired,
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
  onClickButton: PropTypes.func,
};

DropdownMenu.defaultProps = {
  disabled: false,
  children: null,
  onClickButton: null,
  trigger: 'click',
  position: 'bottom-center',
  distance: 10,
};

export default memo(DropdownMenu, (perv, next) => (
  isEqual(perv.items, next.items)
));

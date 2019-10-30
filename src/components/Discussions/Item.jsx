import { useTranslation, Trans } from 'react-i18next';
import { SortableElement } from 'react-sortable-hoc';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import React from 'react';
import CommentIcon from '../Icons/Comment';
import styles from './styles.css';
import DropdownMenu from '../DropdownMenu';
import utilsActions from '../../actions/utils';
import { sanitizeText } from '../../utils/text';

const Item = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <div>
      <div
        className={classNames({
          [styles.item]: true,
          [styles.hidden]: props.hidden,
          [styles.editable]: props.editable,
        })}
      >
        <div className={styles.main}>
          <div className={styles.title}>
            <Link
              to={props.url}
              className="link red-hover"
              dangerouslySetInnerHTML={{ __html: sanitizeText(props.title) }}
            />
          </div>
          <div className={styles.author}>
            <Trans i18nKey="By author" author={props.author}>
              by <Link to={props.authorUrl} className="link red-hover">{{ author: props.author }}</Link>
            </Trans>
          </div>
        </div>
        <div className={styles.count}>
          {props.commentCount} <CommentIcon />
        </div>
        {props.editable &&
          <div className={styles.itemMenu}>
            <DropdownMenu
              items={[{
                title: t('Remove'),
                onClick: () => props.onClickRemove(props.id),
              }, {
                title: t('Copy Link'),
                onClick: () => dispatch(utilsActions.copyToClipboard(`${document.location.origin}${props.url}`)),
              }]}
            />
          </div>
        }
      </div>
    </div>
  );
};

Item.propTypes = {
  id: PropTypes.number.isRequired,
  hidden: PropTypes.bool,
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  authorUrl: PropTypes.string.isRequired,
  commentCount: PropTypes.number,
  onClickRemove: PropTypes.func.isRequired,
  editable: PropTypes.bool,
};

Item.defaultProps = {
  hidden: false,
  commentCount: 0,
  editable: false,
};

export { Item };
export default SortableElement(Item);

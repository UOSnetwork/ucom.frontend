import { useTranslation, Trans } from 'react-i18next';
import Tippy from '@tippy.js/react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import sectionStyles from '../Section/styles.css';
import styles from './styles.css';
import DropdownMenu, { DropdownMenuIcon } from '../DropdownMenu';
import Form from './Form';
import List from './List';

const DISCUSSIONS_LIMIT = 10;

const Discussions = (props) => {
  const { t } = useTranslation();
  const [itemsLimit, setItemsLimit] = useState(4);
  const [formVisible, setFormVisible] = useState(false);
  const visibleItems = props.items.slice(0, itemsLimit);

  if (!props.items.length && !props.editable) {
    return null;
  }

  return (

    <div className={`${sectionStyles.section} ${styles.discussions}`}>
      <div className={`${sectionStyles.title} ${sectionStyles.withIcon} ${sectionStyles.forText}`}>
        {t('Discussion Board')}

        {props.editable &&
          <div className={styles.menu}>
            {props.items.length >= DISCUSSIONS_LIMIT ? (
              <Tippy
                arrow
                content={t('Maximum Discussions', { limit: DISCUSSIONS_LIMIT })}
              >
                <DropdownMenuIcon />
              </Tippy>
            ) : (
              <DropdownMenu
                items={[{
                  title: t('New Discussion'),
                  url: props.newDiscussionUrl,
                }, {
                  title: t('Add Discussion'),
                  onClick: () => setFormVisible(true),
                }]}
              />
            )}
          </div>
        }
      </div>

      <div className={styles.content}>
        {!formVisible && !visibleItems.length &&
          <div className={styles.empty}>
            <Trans i18nKey="nothingHereYet">
              Nothing here yet. <button onClick={() => setFormVisible(true)} className="link red-hover active">Add existing community article</button> or <Link className="red-hover active" to={props.newDiscussionUrl}>create new article.</Link>
            </Trans>
          </div>
        }

        {formVisible &&
          <Form
            placeholder={props.placeholder || t('Link to article')}
            validatePostUrlFn={props.validatePostUrlFn}
            onReset={() => setFormVisible(false)}
            onSubmit={(value) => {
              props.onSubmit(value);
              setFormVisible(false);
            }}
          />
        }

        <List
          helperClass={styles.dragged}
          disabled={!props.editable || visibleItems.length === 1}
          editable={props.editable}
          pressDelay={150}
          onSortEnd={props.onSortEnd}
          items={visibleItems.map((item, index) => ({
            ...item,
            hidden: visibleItems.length === index + 1 && visibleItems.length !== props.items.length,
          }))}
        />

        {props.items.length > visibleItems.length &&
          <button
            className={`link red-hover ${styles.more}`}
            onClick={() => setItemsLimit(props.items.length)}
          >
            {t('Show more', { count: props.items.length - visibleItems.length })}
          </button>
        }
      </div>
    </div>
  );
};

Discussions.propTypes = {
  editable: PropTypes.bool,
  placeholder: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    authorUrl: PropTypes.string.isRequired,
    commentCount: PropTypes.number,
    onClickRemove: PropTypes.func.isRequired,
  })),
  onSubmit: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  validatePostUrlFn: PropTypes.func.isRequired,
  newDiscussionUrl: PropTypes.string.isRequired,
};

Discussions.defaultProps = {
  placeholder: undefined,
  editable: false,
  items: [],
};

export default Discussions;

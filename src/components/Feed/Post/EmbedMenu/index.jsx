import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styles from './styles.css';
import IconPhoto from '../../../Icons/Photo';
import IconPlus from '../../../Icons/Plus';
import IconEmbed from '../../../Icons/Embed';
import DropZone from '../../../DropZone';
import EmbedService from '../../../../utils/embedService';
import { addErrorNotification } from '../../../../actions/notifications';
import loader from '../../../../utils/loader';

const EmbedMenu = (props) => {
  const [active, setActive] = useState(false);
  const { t } = useTranslation();

  return (
    <div className={styles.embedMenu}>
      <div className={styles.mainItem}>
        <button
          title={t('Toggle menu')}
          type="button"
          className={classNames({
            [styles.trigger]: true,
            [styles.triggerActive]: active,
          })}
          onClick={() => {
            setActive(!active);
          }}
          disabled={props.disabled}
        >
          <IconPlus />
        </button>
      </div>
      <div
        className={classNames({
          [styles.item]: true,
          [styles.active]: active,
        })}
      >
        <div className={styles.iconImage}>
          <IconPhoto />
          <DropZone
            className="drop-zone_clip"
            multiple
            onDrop={(files) => {
              props.onImage(files);
              setActive(false);
            }}
          />
        </div>
      </div>
      {!props.disabledEmbed &&
        <div
          className={classNames({
            [styles.item]: true,
            [styles.active]: active,
          })}
        >
          <div
            role="presentation"
            className={`${styles.iconImage} ${styles.iconEmbed}`}
            onClick={async () => {
              loader.start();
              try {
                const url = prompt(t('pasteLink')); // eslint-disable-line
                const data = await EmbedService.getDataFromUrl(url);
                props.onEmbed(data);
              } catch (err) {
                props.addErrorNotification(err.message);
              }
              setActive(false);
              loader.done();
            }}
          >
            <IconEmbed />
          </div>
        </div>
      }
    </div>
  );
};

EmbedMenu.propTypes = {
  onImage: PropTypes.func.isRequired,
  onEmbed: PropTypes.func.isRequired,
  addErrorNotification: PropTypes.func.isRequired,
  disabledEmbed: PropTypes.bool,
  disabled: PropTypes.bool,
};

EmbedMenu.defaultProps = {
  disabledEmbed: false,
  disabled: false,
};

export default connect(null, {
  addErrorNotification,
})(EmbedMenu);

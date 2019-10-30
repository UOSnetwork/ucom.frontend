import { useTranslation, Trans } from 'react-i18next';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import IconTick from '../../../components/Icons/Tick';
import Button from '../../../components/Button/index';
import { TableNodes } from '../../../components/Table';
import Pagination from '../../../components/Pagination';
import styles from './styles.css';

const VoteSection = ({
  active, onToggle, title, blurb, description, votes, table, pagination, votingUrl,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.voteSection}>
      <div className={styles.inner}>
        <div
          role="presentation"
          className={styles.title}
          onClick={onToggle}
        >
          <span
            className={classNames({
              [styles.toggler]: true,
              [styles.active]: active,
            })}
          >
            <IconTick />
          </span>
          {title}
        </div>
        <div className={styles.blurb}>{blurb}</div>
        <div className={styles.description}>{description}</div>
        <div className={styles.vote}>
          {votes > 0 ? (
            <Trans i18nKey="You casted votes" votes={votes}>
              You casted <strong>{{ votes }} votes</strong>
            </Trans>
          ) : (
            <Fragment>{t('YouDidntVote')}</Fragment>
          )}
        </div>

        {active &&
          <Fragment>
            <div className={styles.action}>
              <Button
                red
                small
                url={votingUrl}
              >
                {t('Go to Voting')}
              </Button>
            </div>

            {table &&
              <div className={styles.table}>
                <TableNodes {...table} />
              </div>
            }

            {pagination &&
              <Pagination {...pagination} />
            }
          </Fragment>
        }
      </div>
    </div>
  );
};


VoteSection.propTypes = {
  active: PropTypes.bool,
  onToggle: PropTypes.func,
  title: PropTypes.string.isRequired,
  blurb: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  votes: PropTypes.number,
  table: PropTypes.shape(TableNodes.propTypes),
  pagination: PropTypes.shape(Pagination.propTypes),
  votingUrl: PropTypes.string.isRequired,
};

VoteSection.defaultProps = {
  active: false,
  onToggle: undefined,
  votes: 0,
  table: undefined,
  pagination: undefined,
};

export default VoteSection;

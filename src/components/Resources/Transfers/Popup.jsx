import React, { useState } from 'react';
import moment from 'moment';
import { WalletCommentIcon } from '../../Icons/WalletIcons';
import Panel from '../../Panel/Panel';

// TODO: Less to css modules
// TODO: PropTypes

const WalletActivityPopup = (props) => {
  const [active, setActive] = useState(false);

  return (
    <div className="wallet-activity-popup">
      <div className="wallet-activity-popup__header">
        <div className="wallet-activity-popup__time">
          {moment(props.updatedAt).format('DD MMMM YYYY HH:mm:ss')}
        </div>
        <div className="wallet-activity-popup__type">
          {props.trType}
        </div>
      </div>

      <div className="wallet-activity-popup__info">
        {props.walletAvatar}
        <div className="wallet-activity-popup__action">
          {props.action}
        </div>
        <div className="wallet-activity-popup__amount title_small">
          <strong>{props.amount}</strong>
        </div>
      </div>
      <div className="wallet-activity-popup__footer">
        {props.memo ?
          <div className="wallet-activity-popup__memo">
            <div className="wallet-activity-popup__memo-caption">
              <WalletCommentIcon />
              <div className="wallet-activity-popup__memo-caption-text">Memo</div>
            </div>
            <div className="wallet-activity-popup__memo-text">
              {props.memo}
            </div>
          </div> : null
        }
        {props.rawTrData &&
          <Panel
            title="Detailed info"
            active={active}
            onClickToggler={() => setActive(!active)}
          >
            <pre className="wallet-activity-popup__detailed-info">{JSON.stringify(props.rawTrData, null, 4)}</pre>
          </Panel>
        }
      </div>
    </div>
  );
};
export default WalletActivityPopup;

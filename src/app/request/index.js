import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './index.css';

const TABS = ['Active', 'Completed'];

export default class Request extends Component {
  static propTypes = {
  };

  state = {
    activeTab: 0,
  };

  renderInput({ type = 'text', label, placeholder }) {
    return (
      <div className="upload__input-row">
        <div className="upload__input-label">{label}</div>
        <div className="upload__input-wrapper">
          <input type={type} placeholder={placeholder} />
        </div>
      </div>
    );
  }
        // <div className="upload">
        //   <div className="upload__header">Request New Use Case</div>
        //   <div className="upload__content">
        //     {this.renderInput({
        //       label: 'Subject',
        //       placeholder: 'e.g. Restaurant Identifier',
        //     })}
        //     {this.renderInput({
        //       label: 'Reward (DML)',
        //       placeholder: 'e.g. 35 DML',
        //       type: 'number',
        //     })}
        //     <div className="upload__textbox-row">
        //       <div className="upload__textbox-label">Description</div>
        //       <div className="upload__textbox-wrapper">
        //         <textarea placeholder="e.g. I want to be able to detect popular restaurants from pictures" />
        //       </div>
        //     </div>
        //   </div>
        //   <div className="upload__footer">
        //     <button disabled>Coming Soon!</button>
        //   </div>
        // </div>

  render() {
    return (
      <div className="bounty">
        <div className="bounty__header">
          <div className="bounty__header__tabs">
            {TABS.map((name, i) => (
              <div
                key={name}
                className={classnames('bounty__header__tab', {
                  'bounty__header__tab--active': this.state.activeTab === i,
                })}
                onClick={() => this.setState({ activeTab: i })}
              >
                {name}
              </div>
            ))}
          </div>
          <div className="bounty__header__actions">
            <button className="bounty__create-btn">Create New Bounty</button>
          </div>
        </div>
        <div className="bounty__content">
          <div className="bounty__bounty-row">
            <div
              className="bounty__bounty-row__thumbnail"
              style={{
                backgroundImage: 'url(https://kaggle2.blob.core.windows.net/competitions/kaggle/8540/logos/thumb76_76.png?t=2018-02-13-18-59-39)',
              }}
            />
            <div className="bounty__bounty-row__body">
              <div className="bounty__bounty-row__title">
                TalkingData AdTracking Fraud Detection Challenge
              </div>
              <div className="bounty__bounty-row__description">
                Can you detect fraudulent click traffic for mobile app ads?
              </div>
            </div>
            <div className="bounty__bounty-row__footer">
              <div className="bounty__bounty-row__prize">
                2,500 DML
              </div>
              <div className="bounty__bounty-row__participants">
                168 participants
              </div>
            </div>
          </div>
          <div className="bounty__bounty-row">
            <div
              className="bounty__bounty-row__thumbnail"
              style={{
                backgroundImage: 'url(https://kaggle2.blob.core.windows.net/competitions/kaggle/8540/logos/thumb76_76.png?t=2018-02-13-18-59-39)',
              }}
            />
            <div className="bounty__bounty-row__body">
              <div className="bounty__bounty-row__title">
                TalkingData AdTracking Fraud Detection Challenge
              </div>
              <div className="bounty__bounty-row__description">
                Can you detect fraudulent click traffic for mobile app ads?
              </div>
            </div>
            <div className="bounty__bounty-row__footer">
              <div className="bounty__bounty-row__prize">
                2,500 DML
              </div>
              <div className="bounty__bounty-row__participants">
                168 participants
              </div>
            </div>
          </div>
          <div className="bounty__bounty-row">
            <div
              className="bounty__bounty-row__thumbnail"
              style={{
                backgroundImage: 'url(https://kaggle2.blob.core.windows.net/competitions/kaggle/8540/logos/thumb76_76.png?t=2018-02-13-18-59-39)',
              }}
            />
            <div className="bounty__bounty-row__body">
              <div className="bounty__bounty-row__title">
                TalkingData AdTracking Fraud Detection Challenge
              </div>
              <div className="bounty__bounty-row__description">
                Can you detect fraudulent click traffic for mobile app ads?
              </div>
            </div>
            <div className="bounty__bounty-row__footer">
              <div className="bounty__bounty-row__prize">
                2,500 DML
              </div>
              <div className="bounty__bounty-row__participants">
                168 participants
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
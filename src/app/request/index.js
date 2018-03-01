import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './index.css';

export default class Request extends Component {
  static propTypes = {
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

  render() {
    return (
      <div>
        <div className="upload">
          <div className="upload__header">Request New Use Case</div>
          <div className="upload__content">
            {this.renderInput({
              label: 'Subject',
              placeholder: 'e.g. Restaurant Identifier',
            })}
            {this.renderInput({
              label: 'Reward (DML)',
              placeholder: 'e.g. 35 DML',
              type: 'number',
            })}
            <div className="upload__textbox-row">
              <div className="upload__textbox-label">Description</div>
              <div className="upload__textbox-wrapper">
                <textarea placeholder="e.g. I want to be able to detect popular restaurants from pictures" />
              </div>
            </div>
          </div>
          <div className="upload__footer">
            <button disabled>Coming Soon!</button>
          </div>
        </div>
        <div className="upload">
          <div className="upload__header">My Requests</div>
          <div className="upload__content">
            <div className="upload__jobs-header">
              <div className="upload__jobs-header-name">Name</div>
              <div className="upload__jobs-header-status">Status</div>
            </div>
            <div className="upload__jobs-row">
              <div className="upload__jobs-name">Restaurant Identifier</div>
              <div className="upload__jobs-status">Unclaimed</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
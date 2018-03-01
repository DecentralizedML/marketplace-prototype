import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './index.css';

export default class Upload extends Component {
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
          <div className="upload__header">Upload New Algorithmn</div>
          <div className="upload__content">
            {this.renderInput({
              label: 'Name',
              placeholder: 'e.g. Fashion Trend Analysis',
            })}
            {this.renderInput({
              label: 'Description',
              placeholder: 'e.g. Detect fashion items...',
            })}
            {this.renderInput({
              label: 'Price (DML)',
              placeholder: 'e.g. 35 DML',
              type: 'number',
            })}
            {this.renderInput({
              label: 'Weight Model',
              type: 'file',
            })}
          </div>
          <div className="upload__footer">
            <button>Submit</button>
          </div>
        </div>
        <div className="upload">
          <div className="upload__header">My Algorithms</div>
          <div className="upload__content">
            <div className="upload__jobs-header">
              <div className="upload__jobs-header-name">Name</div>
              <div className="upload__jobs-header-status">Status</div>
            </div>
            <div className="upload__jobs-row">
              <div className="upload__jobs-name">Twitter Analysis</div>
              <div className="upload__jobs-status">Pending Review</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
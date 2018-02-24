import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class AlgoTabs extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
  };

  state = {
    activeTab: 0,
  };

  onClick = activeTab => {
    this.setState({ activeTab })
    this.props.onChange(activeTab);
  }

  renderTab = (name, i) => {
    const { activeTab } = this.state;
    return (
      <div
        key={name}
        className={classnames('algo-modal__content-header-item', {
          'algo-modal__content-header-item--active': activeTab === i,
        })}
        onClick={() => this.onClick(i)}
      >
        {name}
      </div>
    );
  }

  render() {
    return (
      <div className="algo-modal__content-header">
        {['Demo', 'Create Job', 'Jobs History'].map(this.renderTab)}
      </div>
    );
  }
};

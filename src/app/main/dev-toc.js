import React, { Component } from 'react';
import Markdown from 'react-markdown';
import { DEV_TOC } from '../../utils/constants';

export default class DevToc extends Component {
  render() {
    return (
      <div className="dev_toc">
        <Markdown
          source={DEV_TOC}
        />
      </div>
    );
  }
};

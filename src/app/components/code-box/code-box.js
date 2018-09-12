/* TODO (in priority order):
  1. improve object output (`console.log(console)`): https://github.com/remy/jsconsole/blob/master/src/core/components/types/ObjectType.js
  2. refactor so that we don't store the console component in state
  3. native postMessage: https://medium.com/@ebakhtarov/handling-of-iframes-in-react-f038be46ac24
  4. implement jsconsole (requires a lot of work to componentize from JSBin's specific use case)
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CodeEditor from '../code-editor';
import Iframe from '../iframe';

import generateSource from './generateSource';

import './code-box.css';

const iframeHeight = 100;

class CodeBox extends Component {
  constructor (props) {
    super(props);

    this.state = {
      console: null,
    }

    this.runButton = React.createRef();
  }

  generateConsole = () => {
    const source = generateSource({
      beforeCode : this.props.beforeCode,
      code       : this.props.code,
      afterCode  : this.props.afterCode,
      height     : iframeHeight
    });

    return (
      <Iframe
        srcdoc={source}
        sandbox="allow-modals allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts"
        frameborder="0"
        width="100%"
        height={`${iframeHeight}px`}
      />
    );
  }

  runCode =() => {
    this.setState({
      console: this.generateConsole(),
    });
  }

  render () {
    return (
      <div>
        <div className="code-box-header">
          <span>Code Editor</span>
          <button
            className="code-box-run-button"
            ref={this.runButton}
            onClick={this.runCode}
          >
            Run Code
          </button>
        </div>
        <CodeEditor
          name={this.props.name}
          onChange={this.props.onChange}
          code={this.props.code}
          height={this.props.editorHeight}
          width={this.props.editorWidth}
        />
        <div className="code-box-header">
          <span>Console</span>
        </div>
        <div className="code-box-console">
          {this.state.console}
        </div>
      </div>
    );
  }
}

CodeBox.defaultProps = {
  editorHeight : '250px',
  editorWidth  : '100%',
  beforeCode   : '',
  afterCode    : '',
};

CodeBox.propTypes = {
  name         : PropTypes.string.isRequired,
  onChange     : PropTypes.func.isRequired,
  beforeCode   : PropTypes.string,
  code         : PropTypes.string.isRequired,
  afterCode    : PropTypes.string,
  editorHeight : PropTypes.string,
  editorWidth  : PropTypes.string,
};

export default CodeBox;

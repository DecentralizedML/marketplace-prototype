import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import brace from 'brace'; // eslint-disable-line no-unused-vars

import 'brace/mode/javascript';
import 'brace/theme/tomorrow';

const CodeEditor = (props) => {
  return (
    <AceEditor
      name={props.name}
      height={props.height}
      width={props.width}
      fontSize={14}
      tabSize={2}
      theme="tomorrow"
      mode="javascript"

      enableBasicAutocompletion={false}
      enableLiveAutocompletion={false}
      highlightActiveLine
      showGutter
      showPrintMargin

      onChange={props.onChange}
      value={props.code}
    />
  );
}

CodeEditor.defaultProps = {
  width   : '100%',
  height  : '250px',
};

CodeEditor.propTypes = {
  name     : PropTypes.string.isRequired,
  onChange : PropTypes.func.isRequired,
  code     : PropTypes.string.isRequired,
  width    : PropTypes.string,
  height   : PropTypes.string,
};

export default CodeEditor;

import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import brace from 'brace'; // eslint-disable-line no-unused-vars

// import 'brace/mode/python';
import 'brace/mode/javascript';
import 'brace/theme/github';

const CodeEditor = (props) => (
    <AceEditor
      name={props.name}
      height="250px"
      width="100%"
      fontSize={14}
      // tabSize={4} // Python convention
      tabSize={2}
      theme="github"
      // mode="python"
      mode="javascript"

      enableBasicAutocompletion={false}
      enableLiveAutocompletion={false}
      highlightActiveLine
      showGutter
      showPrintMargin

      onChange={props.onChange}
      value={props.value}
    />
);

CodeEditor.propTypes = {
  name     : PropTypes.string.isRequired,
  onChange : PropTypes.func.isRequired,
  value    : PropTypes.string.isRequired,
};

export default CodeEditor;

import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import brace from 'brace'; // eslint-disable-line no-unused-vars

// import 'brace/mode/python';
import 'brace/mode/javascript';
import 'brace/theme/github';

const noop = () => {};

const CodeEditor = (props) => (
    <AceEditor
      fontSize={14}
      highlightActiveLine={true}
      // mode="python"
      mode="javascript"
      setOptions={{
        enableBasicAutocompletion : false,
        enableLiveAutocompletion  : false,
        enableSnippets            : false,
        showLineNumbers           : true,
        // tabSize                   : 4 // Python convention
        tabSize                   : 2 // Javascript convention
      }}
      showGutter={true}
      showPrintMargin={true}
      theme="github"
      width="100%"
      height="250px"

      name={props.name}
      onLoad={props.onLoad}
      value={props.value}
    />
);

CodeEditor.defaultProps = {
  onLoad   : noop,
};

CodeEditor.propTypes = {
  name     : PropTypes.string.isRequired,
  onLoad   : PropTypes.func,
  value    : PropTypes.string.isRequired,
};

export default CodeEditor;

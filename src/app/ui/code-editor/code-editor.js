import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import brace from 'brace';

import 'brace/mode/python';
import 'brace/theme/monokai';

const noop = () => {};

const CodeEditor = (props) => (
    <AceEditor
      fontSize={14}
      highlightActiveLine={true}
      mode="python"
      setOptions={{
        enableBasicAutocompletion : false,
        enableLiveAutocompletion  : false,
        enableSnippets            : false,
        showLineNumbers           : true,
        tabSize                   : 4 // Python convention
      }}
      showGutter={true}
      showPrintMargin={true}
      theme="monokai"
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

import React from 'react';
import PropTypes from 'prop-types';

const Iframe = (props) => {
  return (
    <iframe
      title={props.name}
      srcDoc={props.srcdoc}
      height={props.height}
      width={props.width}
      sandbox={props.sandbox}
      frameBorder={props.frameborder}
    />
  );
};

Iframe.propTypes = {
  name        : PropTypes.string,
  srcdoc      : PropTypes.string,
  height      : PropTypes.string,
  width       : PropTypes.string,
  sandbox     : PropTypes.string,
  frameborder : PropTypes.string,
}

export default Iframe;

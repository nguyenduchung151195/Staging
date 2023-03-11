import React from 'react';
import { Tabs, withStyles } from '@material-ui/core';
// import PropTypes from 'prop-types';

const styles = () => ({
  root: {
    textTransform: 'none',
    color: '#1d1d1f !important',
  },
});

function LtTabs({ indicatorColor, ...rest }) {
  return <Tabs indicatorColor="primary" {...rest} />;
}
export default withStyles(styles)(LtTabs);

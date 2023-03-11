import React from 'react';
import { Tab, withStyles } from '@material-ui/core';
// import PropTypes from 'prop-types';

const styles = theme => ({
  root: {
    textTransform: 'none',
    // padding: `${theme.spacing.unit}px 0px `,
    // margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px `,
    color: '#1d1d1f !important',
  },
});

function LtTab(props) {
  return <Tab classes={{ root: props.classes.root }} {...props} />;
}
export default withStyles(styles)(LtTab);

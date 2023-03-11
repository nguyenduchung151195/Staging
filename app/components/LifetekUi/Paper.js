import React from 'react';
import { Paper as PaperUi, withStyles } from '@material-ui/core';

const styles = theme => ({
  root: {
    padding: `10px ${theme.spacing.unit * 2}px 0px ${theme.spacing.unit * 2}px `,
  },
  color: '#1d1d1f',
});

function Paper({ classes, ...rest }) {
  return <PaperUi classes={classes} {...rest} />;
}

export default withStyles(styles)(Paper);

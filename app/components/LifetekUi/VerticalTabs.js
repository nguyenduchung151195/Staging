import React from 'react';
import { withStyles, Tabs } from '@material-ui/core';

const VerticalTabs = withStyles(() => ({
  flexContainer: {
    flexDirection: 'column',
    '& div': {
      '& div': {
        padding: '5px 4px 0 4px',
      },
    },
    '& > button': {
      // color: '#1d1d1f',
      textAlign: 'left',
      textTransform: 'none',
    },
  },
  indicator: {
    display: 'none',
  },
}))(Tabs);

export default VerticalTabs;

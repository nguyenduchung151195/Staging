// ##############################
// // // Header styles
// #############################

import {
  containerFluid,
  defaultFont,
  primaryColor,
  defaultBoxShadow,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
} from 'assets/jss/material-dashboard-pro-react';

const headerStyle = theme => ({
  appBar: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    borderBottom: '0',
    marginBottom: '0',
    position: 'absolute',
    width: '100%',
    paddingTop: '0px',
    zIndex: '1300',
    color: '#1d1d1f !important',
    border: '0',
    borderRadius: '3px',
    transition: 'all 150ms ease 0s',
    minHeight: '50px',
    display: 'block',
  },
  container: {
    ...containerFluid,
    minHeight: '50px',
  },
  flex: {
    flex: 1,
  },
  title: {
    ...defaultFont,
    lineHeight: '30px',
    fontSize: '18px',
    borderRadius: '3px',
    textTransform: 'none',
    color: 'inherit',
    '&:hover,&:focus': {
      background: 'transparent',
    },
  },
  primary: {
    backgroundColor: primaryColor,
    color: '#FFFFFF',
    ...defaultBoxShadow,
  },
  info: {
    backgroundColor: infoColor,
    color: '#FFFFFF',
    ...defaultBoxShadow,
  },
  success: {
    backgroundColor: successColor,
    color: '#FFFFFF',
    ...defaultBoxShadow,
  },
  warning: {
    backgroundColor: warningColor,
    color: '#FFFFFF',
    ...defaultBoxShadow,
  },
  danger: {
    backgroundColor: dangerColor,
    color: '#FFFFFF',
    ...defaultBoxShadow,
  },
  sidebarMinimize: {
    float: 'left',
    padding: '0 0 0 0px',
    display: 'block',
    color: '#1d1d1f',
  },
  sidebarMinimizeRTL: {
    padding: '0 0 0 0 !important',
  },
  sidebarMiniIcon: {
    width: '20px',
    height: '17px',
  },
});

export default headerStyle;

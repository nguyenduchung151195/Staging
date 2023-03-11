import React, { useEffect, memo } from 'react';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import { Close } from '@material-ui/icons';
import { Typography, Button, IconButton, AppBar, Toolbar } from '@material-ui/core';
import styles from './styles';
import makeSelectDashboardPage, { makeSelectMiniActive } from '../../containers/Dashboard/selectors';
import { mergeData } from '../../containers/Dashboard/actions';
function MyAppBar(props) {
  const { classes, miniActive = true, onMergeData, dashboardPage, disableClose } = props;
  const { hiddenHeader } = dashboardPage;
  useEffect(
    () => {
      onMergeData({ hiddenHeader: true });
    },
    [dashboardPage.hiddenHeader],
  );
  // useEffect(() => {
  //   setTimeout(() => {
  //     onMergeData({ hiddenHeader: true });
  //   });
  // }, []);
  const handleClose = async () => {
    await onMergeData({ hiddenHeader: false });
    props.onGoBack();
  };

  return (
    <>
      {hiddenHeader === true ? (
        <AppBar
          className={
            miniActive
              ? props.isTask
                ? classes.AppBarMinimizeActiveProjectTask
                : props.className
                  ? classes.AppBarMinimizeActiveProject
                  : classes.AppBarMinimizeActive
              : props.isTask
                ? classes.AppBarMinimizeInActiveProjectTask
                : props.className
                  ? classes.AppBarMinimizeInActiveProject
                  : classes.AppBarMinimizeInActive
          }
        >
          <Toolbar className={miniActive ? classes.ToolBarMinimizeActive : classes.ToolBarMinimizeInActive}>
            {!disableClose && <IconButton color="inherit" variant="contained" onClick={() => handleClose()} aria-label="Close">
              <Close />
            </IconButton>}
            <Typography variant="h6" color="inherit" className="flex" style={{ flex: 1 }}>
              {props.title}
            </Typography>
            {props.frontBtn ? props.frontBtn : null}
            {props.onChangePass && props.id !== 'add' ? (
              <Button variant="outlined" color="inherit" onClick={props.onChangePass} style={{ marginRight: 20 }}>
                Đổi mật khẩu
              </Button>
            ) : null}
            {props.onScan ? (
              <Button variant="outlined" color="inherit" onClick={props.onScan} style={{ marginRight: 20 }}>
                Nhập liệu
              </Button>
            ):null}
            {props.disableAdd ? null : (
              <Button variant="outlined" color="inherit" onClick={props.onSubmit}>
                Lưu
              </Button>
            )}
            
            {props.moreButtons && props.moreButtons}
          </Toolbar>
        </AppBar>
      ) : null}
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  miniActive: makeSelectMiniActive(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onMergeData: data => dispatch(mergeData(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  memo,
  withConnect,
  withStyles(styles),
)(MyAppBar);

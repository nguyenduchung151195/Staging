/**
 *
 * PropertiesPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import { withSnackbar } from 'notistack';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Paper, Typography, Tabs, Tab, Grid, Badge } from '@material-ui/core';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import SwipeableViews from 'react-swipeable-views';
import PropertiesSet from './tabs/PropertiesSet';
import PropertiesGroup from './tabs/PropertiesGroup';
import ListOfProperties from './tabs/listOfProperties';
import makeSelectPropertiesPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import { fetchPropertiesSetAct, resetNoti, deletePropertieAct, deletePropertiesGroupAct, deletePropertiesSetAct } from './actions';
// import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
export class PropertiesPage extends React.Component {
  state = {
    valueForTabs: 0,
    propertiesSetCount: 0,
    propertiesGroupCount: 0,
    propertiesListCount: 0,
    propertiesSet: [],
    propertiesList: [],
    propertiesGroup: [],
  };

  componentWillMount() {
    this.props.onGetPropertiesSet();
  }

  componentWillReceiveProps(props) {
    const { history } = props;
    // console.log(history);
    if (history.value) {
      this.state.valueForTabs = history.value;
    }
  }

  componentDidMount() {
    this.props.onResetNoti();
    const { propertiesPage } = this.props;
    const propertiesSet = propertiesPage.propertiesSet || [];
    const propertiesGroup = propertiesPage.propertiesGroup || [];
    const propertiesList = propertiesPage.propertiesList || [];
    if (propertiesPage.success) {
      this.setState({
        propertiesSetCount: propertiesSet.length,
        propertiesGroupCount: propertiesGroup.length,
        propertiesListCount: propertiesList.length,
        propertiesSet,
        propertiesGroup,
        propertiesList,
      });
      this.props.onResetNoti();
    }
  }
  /* eslint-disable */
  componentDidUpdate() {
    const { propertiesPage } = this.props;
    const propertiesSet = propertiesPage.propertiesSet || [];
    const propertiesGroup = propertiesPage.propertiesGroup || [];
    const propertiesList = propertiesPage.propertiesList || [];
    if (propertiesPage.success) {
      this.setState({
        propertiesSetCount: propertiesSet.length,
        propertiesGroupCount: propertiesGroup.length,
        propertiesListCount: propertiesList.length,
        propertiesSet,
        propertiesGroup,
        propertiesList,
      });
      this.props.onResetNoti();
    }
    if (propertiesPage.successDelete) {
      this.props.enqueueSnackbar('Thao tác thành công!', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      this.props.onResetNoti();
      // console.log(this.props);
    }
    if (propertiesPage.errorDelete) {
      this.props.enqueueSnackbar('Thao tác thất bại!', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      this.props.onResetNoti();
    }
  }
  /* eslint-enable */

  render() {
    const { classes } = this.props;
    const { valueForTabs } = this.state;
    // console.log(this.state);
    return (
      <div>
        <Helmet>
          <title>Thuộc tính</title>
          <meta name="description" content="Description of PropertiesPage" />
        </Helmet>
        {/* <FormattedMessage {...messages.header} /> */}
        <Paper className={classes.breadcrumbs}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Typography color="textPrimary">Thuộc tính</Typography>
          </Breadcrumbs>
        </Paper>
        <Paper className={classes.paper}>
          <Tabs value={this.state.valueForTabs} onChange={this.handleChangeTab} indicatorColor="primary" variant="scrollable" scrollButtons="on">
            <Tab
              disableRipple
              classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
              label={
                <Badge color="primary" badgeContent={this.state.propertiesSetCount}>
                  <Typography className={classes.padding}>Quản lí bộ thuộc tính</Typography>
                </Badge>
              }
            />
            <Tab
              disableRipple
              classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
              label={
                <Badge color="primary" badgeContent={this.state.propertiesGroupCount}>
                  <Typography className={classes.padding}>Quản lí nhóm thuộc tính</Typography>
                </Badge>
              }
            />
            <Tab
              disableRipple
              classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
              label={
                <Badge color="primary" badgeContent={this.state.propertiesListCount}>
                  <Typography className={classes.padding}>Quản lí thuộc tính</Typography>
                </Badge>
              }
            />
          </Tabs>
          <SwipeableViews
            index={valueForTabs}
            style={{ overflowX: 'scroll !important' }}
            onChangeIndex={this.handleChangeIndex}
            width={window.innerWidth - 260}
          >
            <TabContainer style={{ maxHeight: 200 }}>
              {/* <CustomerDashboard classes={classes} /> */}
              <PropertiesSet
                classes={classes}
                history={this.props.history}
                propertiesSet={this.state.propertiesSet}
                onResetNoti={this.props.onResetNoti}
                enqueueSnackbar={this.props.enqueueSnackbar}
                successDelete={this.props.propertiesPage.successDelete}
                onDeletePropertiesSet={this.props.onDeletePropertiesSet}
                errorDelete={this.props.propertiesPage.errorDelete}
                changeCountAuto={this.changeCountAuto}
              />
            </TabContainer>
            <TabContainer style={{ maxHeight: 200 }}>
              {/* <ListOfCustomer classes={classes} /> */}
              <PropertiesGroup
                classes={classes}
                history={this.props.history}
                propertiesGroup={this.state.propertiesGroup}
                onDeletePropertiesGroup={this.props.onDeletePropertiesGroup}
                success={this.props.propertiesPage.success}
                onResetNoti={this.props.onResetNoti}
                enqueueSnackbar={this.props.enqueueSnackbar}
                successDelete={this.props.propertiesPage.successDelete}
                errorDelete={this.props.propertiesPage.errorDelete}
                changeCountAuto={this.changeCountAuto}
              />
            </TabContainer>
            <TabContainer style={{ maxHeight: 200 }}>
              {/* <ListOfCustomer classes={classes} /> */}
              <ListOfProperties
                classes={classes}
                history={this.props.history}
                propertiesList={this.state.propertiesList}
                onDeletePropertie={this.props.onDeletePropertie}
                successDelete={this.props.propertiesPage.successDelete}
                errorDelete={this.props.propertiesPage.errorDelete}
                onResetNoti={this.props.onResetNoti}
                enqueueSnackbar={this.props.enqueueSnackbar}
                changeCountAuto={this.changeCountAuto}
              />
            </TabContainer>
          </SwipeableViews>
        </Paper>
      </div>
    );
  }

  handleChangeTab = (event, value) => {
    this.setState({ valueForTabs: value });
  };

  handleChangeIndex = index => {
    this.setState({ valueForTabs: index });
  };

  changeCountAuto = id => {
    const { propertiesGroupCount, propertiesListCount, propertiesSetCount } = this.state;
    switch (id) {
      case 0:
        this.setState({ propertiesSetCount: propertiesSetCount - 1 });
        break;
      case 1:
        this.setState({ propertiesGroupCount: propertiesGroupCount - 1 });
        break;
      case 2:
        this.setState({ propertiesListCount: propertiesListCount - 1 });
        break;
    }
  };
}

PropertiesPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

function TabContainer({ children }) {
  return (
    <Grid item container md={12} sm={12} style={{ padding: 50 }}>
      {children}
    </Grid>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const mapStateToProps = createStructuredSelector({
  propertiesPage: makeSelectPropertiesPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetPropertiesSet: () => {
      dispatch(fetchPropertiesSetAct());
    },
    onDeletePropertie: data => {
      dispatch(deletePropertieAct(data));
    },
    onDeletePropertiesGroup: data => {
      dispatch(deletePropertiesGroupAct(data));
    },
    onDeletePropertiesSet: data => {
      dispatch(deletePropertiesSetAct(data));
    },
    onResetNoti: () => {
      dispatch(resetNoti());
    },
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'propertiesPage', reducer });
const withSaga = injectSaga({ key: 'propertiesPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
  withSnackbar,
)(PropertiesPage);

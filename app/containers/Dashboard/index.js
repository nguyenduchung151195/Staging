/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
// creates a beautiful scrollbar
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';

// material-ui components
import { withStyles } from '@material-ui/core';
import { compose } from 'redux';

// core components
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import Sidebar from 'components/Sidebar/Sidebar';
import Snackbar from 'components/Snackbar';
import io from 'socket.io-client';
import dashRoutes from 'routes/dashboard';
import { Extends, Loading } from 'components/LifetekUi';
import appStyle from 'assets/jss/material-dashboard-pro-react/layouts/dashboardStyle';

import image from 'assets/img/sidebar-2.jpg';
import logo from 'assets/img/logo-white.svg';
import _ from 'lodash';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// eslint-disable-next-line no-unused-vars
import { PowerSettingsNew, AccountCircle, Search, Close } from '@material-ui/icons';
import { APP_URL } from '../../config/urlConfig';
import Approve from '../ApprovePage';
import { getToken, onMessageListener } from '../../firebase';
import makeSelectDashboardPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import HOCReducer from '../HocTable/reducer';
import HOCSaga from '../HocTable/saga';
import {
  closeSnackbar,
  fetchAllViewConfigsAction,
  getSysConfAct,
  changeStockAct,
  mergeData,
  getCodeConfig,
  changeWorkingOrganization,
  getAllHrmTimekeeping,
  getProfileAct,
  docUpdated,
  newComment,
} from './actions';

// import { getSuppliers, deleteSuppliers } from './actions';

// export const AppContext = React.createContext();

const switchRoutes = listRole => (
  <Switch>
    {dashRoutes.map(prop => {
      const listPath = prop.path.split('/');
      const x = _.intersectionWith(listPath, listRole, _.isEqual);
      if (
        prop.name === 'dashboard' ||
        prop.path === '/import' ||
        prop.path === '/admin/profile' ||
        prop.path === '/crm/add'
        ||
        prop.name === 'Người dùng'
      ) {
        if (prop.redirect) return <Redirect from={prop.path} to={prop.pathTo} key={prop.path} />;
        if (prop.collapse) {
          const menu = [<Route exact path={prop.path} component={prop.component} key={prop.path} />];
          const submenu = prop.views.map(prop => <Route exact path={prop.path} component={prop.component} key={prop.path} />);
          menu.push(submenu);
          return menu;
        }
        return <Route exact path={prop.path} component={prop.component} key={prop.path} />;
      }
      if (prop.dynamicNode || (x.length === 1 && x[0] !== '') || (x.length !== 1 && x[1])) {
        if (prop.redirect) return <Redirect from={prop.path} to={prop.pathTo} key={prop.path} />;
        if (prop.collapse) {
          const menu = [<Route exact path={prop.path} component={prop.component} key={prop.path} />];
          const submenu = prop.views.map(prop => <Route exact path={prop.path} component={prop.component} key={prop.path} />);
          menu.push(submenu);
          return menu;
        }
        return <Route exact path={prop.path} component={prop.component} key={prop.path} />;
      }
    })}
    <Route exact path="/approve" component={Approve} />
    <Route exact path="/approve/:id" component={Approve} />
  </Switch>
);

let ps;

class Dashboard extends React.Component {
  state = {
    mobileOpen: false,
    miniActive: false,
    name: 'LIFETEK.VN',
    displayName: 'Lifetek.vn',
    profile: {},
    logo: '',
    website: '#',
    allStock: [],
    currentStock: '',
    notifications: [],
    notAcceptRecord: 0,
    socket: io(APP_URL, { query: { token: localStorage.getItem('token') }, transports: ['websocket', 'polling'] }),
    time: 0,
  };
  /* eslint-disable */
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  getRoute() {
    return this.props.location.pathname !== '/maps/full-screen-maps';
  }

  increment() {
    this.setState((prevState, props) => ({
      time: prevState.time + 1,
    }));
  }

  successDashboard(dashboardPage) {
    const { sysConf, profile } = dashboardPage;
    if (sysConf && Object.keys(sysConf).length > 0) {
      this.setState({ name: sysConf.name, displayName: sysConf.displayName, logo: sysConf.logo, website: sysConf.website });
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = sysConf.logo;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    if (profile && Object.keys(profile).length > 0) {
      this.setState({ profile });
    }
  }

  componentWillMount() {
    const socket = this.state.socket;
    socket.on('connect', () => {

      socket.on(socket.id, data => {
        this.setState({ notifications: data });
      });
      socket.on('newComment', data => {
        // console.log('newComment', data);
        this.props.onNewComment(data);
      });
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    socket.on('docUpdated', data => {
      this.props.onDocUpdated(data);
    });

    socket.emit('notification', {
      command: 1001,
      data: {
        skip: 0,
        limit: 10,
      },
    });
  }

  componentDidMount() {
    // this.props.onGetApprove();
    // getToken();

    onMessageListener()
      .then(payload => {
        // setShow(true);
        // setNotification({title: payload.notification.title, body: payload.notification.body})
        console.log(payload);
      })
      .catch(err => console.log('failed: ', err));
    this.props.onGetProfile();
    this.props.onGetSysConf();
    this.props.onGetViewConfig();
    this.props.onGetCodeConfig();
    this.props.getAllHrmTimekeeping();
    const { dashboardPage } = this.props;
    if (dashboardPage.success) {
      this.successDashboard(dashboardPage);
    }
    if (navigator.platform.indexOf('Win') > -1) {
      // eslint-disable-next-line
      ps = new PerfectScrollbar(this.refs.mainPanel, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      const { dashboardPage = {} } = props;
      const { currentUser = {} } = dashboardPage;
      const { workingOrganization = {} } = currentUser;
      const { organizationUnit = {} } = workingOrganization;
      const workingOrganizationId = workingOrganization._id || organizationUnit.organizationUnitId;
      if (!this.state.currentStock) {
        this.state.currentStock = workingOrganizationId;
      }
      if (!!dashboardPage.approveRequest && !!dashboardPage.profile && dashboardPage.profile.userId) {
        let notAccept = 0;
        dashboardPage.approveRequest.forEach(item => {
          const user = item.groupInfo.find(d => d.person === dashboardPage.profile.userId);
          if (user && (user.approve === 2 || user.approve === 0)) {
            notAccept++;
          }
        });
        this.setState({ notAcceptRecord: notAccept });
      }

      if (dashboardPage.success) {
        this.successDashboard(dashboardPage);
      }
      this.state.allStock = dashboardPage.allStock || [];
    }
  }

  handleChangeStock = e => {
    const allStock = this.props.dashboardPage.allStock || [];
    const stockChoose = allStock.find(value => value.id === e.target.value);
    this.setState({ currentStock: e.target.value });
    this.props.onChangeStock(stockChoose.id, stockChoose.type);
    this.props.changeWorkingOrganization(e.target.value);
  };

  componentWillUnmount() {

    if (navigator.platform.indexOf('Win') > -1) {
      ps && ps.destroy();
    }
  }

  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      setTimeout(f => {
        this.props.mergeData({ hiddenHeader: false })
      }, 50)

    }


    if (e.dashboardPage.profile && e.dashboardPage.profile._id !== this.props.dashboardPage.profile._id) {
      this.state.socket.emit('room', { room: this.props.dashboardPage.profile._id, Authorization: localStorage.getItem('token') });
      getToken(this.props.dashboardPage.profile.userId);
    }
  }

  sidebarMinimize() {
    this.setState({ miniActive: !this.state.miniActive });
    this.props.mergeData({ miniActive: !this.state.miniActive });
  }

  render() {
    const { classes, dashboardPage, location, ...rest } = this.props;
    const { listChat, employees, search, chatWindows, role, approveRequest, loading, hiddenHeader, loadingSatus } = dashboardPage;
    const { notAcceptRecord } = this.state;
    const codeModleFunctionAllowForFunction = [];

    if (role.roles) {
      role.roles.forEach(item => {
        if (item.methods.find(method => method.name === 'GET').allow) {
          codeModleFunctionAllowForFunction.push(item.codeModleFunction);
        }
      });
    }
    const listPath = location.pathname.split('/');
    const x = _.intersectionWith(listPath, codeModleFunctionAllowForFunction, _.isEqual);
    if (
      x.length === 1 &&
      x[0] === '' &&
      location.pathname !== '/' &&
      location.pathname !== '/admin/profile' &&
      location.pathname !== '/Task/invite' &&
      location.pathname !== '/crm/add' &&
      !listPath.includes('userprofile') &&
      !listPath.includes('approve') &&
      !listPath.includes('import')
    ) {
      this.props.history.push('/');
    }

    const mainPanel = `${classes.mainPanel} ${cx({
      [classes.mainPanelSidebarMini]: this.state.miniActive,
      [classes.mainPanelWithPerfectScrollbar]: navigator.platform.indexOf('Win') > -1,
    })}`;
    return (
      <>
        {loadingSatus && <Loading zIndex={1} />}
        <div className={classes.wrapper} style={(loadingSatus) ? { opacity: '0.5', zIndex: '0' } : {}}>
          <Extends profile={this.state.profile} socket={this.state.socket} />
          <Helmet titleTemplate={`%s${this.state.displayName ? ` - ${this.state.displayName}` : ''}`} defaultTitle={`${this.state.displayName || ''}`}>
            <meta name="description" content={`${this.state.name}`} />
          </Helmet>
          <Snackbar
            onClose={() => this.props.closeSnackbar()}
            open={dashboardPage.status}
            variant={dashboardPage.variant}
            message={dashboardPage.message}
          />
          <Sidebar
            routes={_.cloneDeep(dashRoutes)}
            logoText={this.state.name}
            companyWebsite={this.state.website}
            logo={this.state.logo === '' ? logo : this.state.logo}
            image={image}
            profile={this.state.profile}
            handleDrawerToggle={this.handleDrawerToggle}
            open={this.state.mobileOpen}
            color="blue"
            bgColor="black"
            location={this.props.location}
            miniActive={this.state.miniActive}
            codeModleFunctionAllowForFunction={codeModleFunctionAllowForFunction}
            {...rest}
          />
          <div className={mainPanel} ref="mainPanel">
            {!hiddenHeader ? (
              <Header
                {...this.props}
                socket={this.state.socket}
                notifications={this.state.notifications}
                sidebarMinimize={() => this.sidebarMinimize()}
                miniActive={this.state.miniActive}
                routes={dashRoutes}
                handleChangeStock={this.handleChangeStock}
                allStock={this.state.allStock}
                currentStock={this.state.currentStock}
                handleDrawerToggle={this.handleDrawerToggle}
                notAcceptRecord={notAcceptRecord}
                color="#90a4ae"
              />
            ) : null}
            {this.getRoute() ? (
              <div className={classes.content}>
                <div className={classes.container}>{switchRoutes(codeModleFunctionAllowForFunction)}</div>
              </div>
            ) : (
              <div className={classes.map}>{switchRoutes(codeModleFunctionAllowForFunction)}</div>
            )}
            {this.getRoute() ? <Footer fluid /> : null}
          </div>
        </div>
      </>
    );
  }
  /* eslint-enable */
}

const mapStateToProps = createStructuredSelector({
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    closeSnackbar: () => dispatch(closeSnackbar()),
    mergeData: data => dispatch(mergeData(data)),
    onGetViewConfig: () => {
      dispatch(fetchAllViewConfigsAction());
    },
    onGetSysConf: () => {
      dispatch(getSysConfAct());
    },
    onChangeStock: (body, name) => {
      dispatch(changeStockAct(body, name));
    },
    onGetCodeConfig: () => {
      dispatch(getCodeConfig());
    },
    changeWorkingOrganization: id => {
      dispatch(changeWorkingOrganization(id));
    },
    getAllHrmTimekeeping: () => {
      dispatch(getAllHrmTimekeeping());
    },
    onGetProfile: () => dispatch(getProfileAct()),
    onDocUpdated: data => dispatch(docUpdated(data)),
    onNewComment: data => dispatch(newComment(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'dashboardPage', reducer });
const withSaga = injectSaga({ key: 'dashboardPage', saga });
const withHOCTableReducer = injectReducer({ key: 'hocTable', reducer: HOCReducer });
const withHOCTablewithSaga = injectSaga({ key: 'hocTable', saga: HOCSaga });
Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withReducer,
  withSaga,
  withHOCTableReducer,
  withHOCTablewithSaga,
  withConnect,
  withStyles(appStyle),
)(Dashboard);

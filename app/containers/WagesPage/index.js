/**
 *
 * WagesPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ListPage from 'components/List';
import { compose } from 'redux';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { injectIntl } from 'react-intl';
import messages from './messages';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectWagesPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { API_RECRUITMENT } from '../../config/urlConfig';
import { Paper, TextField, Tabs, Tab } from '../../components/LifetekUi';

import { mergeData, postData, getData, getDefault, getCurrent, putData } from './actions';
import WagesManagement from '../HRM/HrmWages/WagesManagement/Loadable';
import TimekeepingPage from '../HRM/HrmWages/TimekeepingPage/Loadable';
import OverTimeManager from '../HRM/HrmWages/OverTimeManager';
import WagesSalary from '../HRM/HrmWages/WagesSalary';
import TakeLeaveManager from '../HRM/HrmWages/TakeLeaveManager';
import makeSelectDashboardPage, { makeSelectProfile, makeSelectMiniActive } from '../Dashboard/selectors';
/* eslint-disable react/prefer-stateless-function */
export class WagesPage extends React.Component {
  state = { tab: 0 };

  componentDidMount() {
    // this.props.getData();
  }

  addItem = () => (
    <Add style={{ color: 'white' }} onClick={() => this.handleAdditem()}>
      Open Menu
    </Add>
  );

  handleAdditem = () => {
    this.props.mergeData({ openDrawer: true, id: 'add' });
    // this.props.getDefault();
  };

  getLevel(arr, lvl) {
    arr.forEach(item => {
      item.level = lvl;
      if (item.child) {
        this.getLevel(item.child, lvl + 1);
      }
    });
  }

  findChildren(data) {
    const newData = data.filter(item => item.parent === null);
    this.getLevel(newData, 0);
    return newData;
  }

  mapItem(array, result = []) {
    array.forEach(item => {
      result.push(
        <MenuItem value={item._id} style={{ paddingLeft: 20 * item.level }}>
          {item.name}
        </MenuItem>,
      );
      if (item.child) this.mapItem(item.child, result);
    });
    return result;
  }

  mapFunction = item => ({
    ...item,
    branch: (
      <button onClick={() => this.handleDialog(item._id)} type="button" style={{ cursor: 'pointer', color: '#2196f3' }}>
        {item.branch}
      </button>
    ),
  });

  handleDialog = id => {
    // this.props.mergeData({ openDrawer: true, id });
    // this.props.getCurrent(id);
  };
  render() {
    const { tab } = this.state;
    const { wagesPage, intl, reload, dashboardPage, miniActive } = this.props;
    const roleCode0 = dashboardPage.role.roles && dashboardPage.role.roles.find(item => item.codeModleFunction === 'HrmTimekeepingTable');
    const roleCode1 = dashboardPage.role.roles && dashboardPage.role.roles.find(item => item.codeModleFunction === 'HrmOverTime');
    // const roleCode2 = dashboardPage.role.roles && dashboardPage.role.roles.find(item => item.codeModleFunction === 'TakeLeave');
    const roleCode2 = dashboardPage.role.roles && dashboardPage.role.roles.find(item => item.codeModleFunction === 'TakeLeaveManager');
    // const roleCode3 = this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === this.props.code);
    // const roleCode4 = this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === this.props.code);
    const roleModule0 = roleCode0 ? roleCode0.methods : [];
    const roleModule1 = roleCode1 ? roleCode1.methods : [];
    const roleModule2 = roleCode2 ? roleCode2.methods : [];
    // const roleModule3 = roleCode ? roleCode.methods : [];
    // const roleModule4 = roleCode ? roleCode.methods : [];
    return (
      <div>

        <Tabs value={tab} onChange={(e, tab) => this.setState({ tab })}>
          {(roleModule0.find(elm => elm.name === 'GET') || { allow: false }).allow ? (
            <Tab value={0} label={intl.formatMessage(messages.timekeeping)} />
          ) : null}
          {(roleModule1.find(elm => elm.name === 'GET') || { allow: false }).allow ? (
            <Tab value={3} label={intl.formatMessage(messages.ottime)} />
          ) : null}
          {(roleModule2.find(elm => elm.name === 'GET') || { allow: false }).allow ? (
            <Tab value={4} label={intl.formatMessage(messages.takeleave)} />
          ) : null}
          <Tab value={1} label={intl.formatMessage(messages.managesalary)} />
          <Tab value={2} label={intl.formatMessage(messages.salary)} />
        </Tabs>
        {tab === 0 ? <TimekeepingPage miniActive={this.props.miniActive} /> : null}
        {tab === 1 ? <WagesManagement miniActive={this.props.miniActive} /> : null}

        {tab === 2 && <WagesSalary />}

        {tab === 3 && <OverTimeManager miniActive={this.props.miniActive} />}

        {tab === 4 && <TakeLeaveManager />}

        <Dialog maxWidth="md" anchor="right" open={wagesPage.openDrawer} onClose={() => this.props.mergeData({ openDrawer: false, id: 'add' })}>
          <DialogTitle id="alert-dialog-title">Thông tin kiêm nhiệm</DialogTitle>
          <DialogContent>
            <TextField
              onChange={e => this.props.mergeData({ branch: e.target.value })}
              InputLabelProps={{ shrink: true }}
              label="Chi nhánh"
              value={wagesPage.branch}
              style={{ width: '49%' }}
              helperText={wagesPage.branch === '' ? 'Chi nhánh không được bỏ trống' : null}
              error={wagesPage.branch === ''}
            />
            <TextField
              onChange={e => this.props.mergeData({ pending: e.target.value })}
              value={wagesPage.pending}
              InputLabelProps={{ shrink: true }}
              label="Chờ duyệt"
              style={{ width: '49%', marginLeft: 5 }}
            />

            <TextField
              // value={wagesPage.file}
              label="File Upload"
              name="url"
              type="file"
              onChange={this.handleChangeInputFile}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ width: '99%' }}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={this.onSave} variant="outlined" color="primary" autoFocus style={{ marginRight: 5 }}>
              Lưu
            </Button>
            <Button
              onClick={() => this.props.mergeData({ openDrawer: false, id: 'add' })}
              variant="outlined"
              color="secondary"
              autoFocus
              style={{ marginRight: 25 }}
            >
              hủy
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  handleChangeInputFile = e => {
    // const urlAvt = URL.createObjectURL(e.target.files[0]);
    // this.props.mergeData({ url: urlAvt, file: e.target.files[0] });
  };

  onSave = () => {
    const {
      branch,
      pending,
      part,
      amount,
      needDate,
      location,
      startDate,
      organizatsionUnit,
      position,
      note,
      file,
      // url,
      id,
    } = this.props.wagesPage;
    if (branch === '' || needDate === '' || startDate === '' || organizatsionUnit === '') return;
    const data = {
      branch,
      pending,
      part,
      amount,
      needDate,
      location,
      startDate,
      organizatsionUnit,
      position,
      note,
      file,
    };

    if (id === 'add') {
      // this.props.postData(data);
    } else {
      // this.props.putData(id, data);
    }

    // this.props.mergeData({ openDrawer: false, reload: Math.random() });
  };
}

WagesPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  wagesPage: makeSelectWagesPage(),
  dashboardPage: makeSelectDashboardPage(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => {
      dispatch(mergeData(data));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'wagesPage', reducer });
const withSaga = injectSaga({ key: 'wagesPage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(WagesPage);

/**
 *
 * RecruitmentPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ListPage from 'components/List';
// import AddRecruitment from 'containers/AddRecruitment';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@material-ui/core';
// import { Paper } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import messages from './messages';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectRecruitmentPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { API_RECRUITMENT } from '../../config/urlConfig';
import { Paper, TextField, Tabs, Tab } from '../../components/LifetekUi';

import { mergeData, postData, getData, getDefault, getCurrent, putData } from './actions';
import HrmRecruitmentManagement from '../HRM/HrmRecruitment/HrmRecruitmentManagement';
import RecruitmentWavePage from '../HRM/HrmRecruitment/HrmRecruitmentWave';

import makeSelectDashboardPage from '../Dashboard/selectors';

/* eslint-disable react/prefer-stateless-function */
export class RecruitmentPage extends React.Component {
  state = { tab: 0 };

  componentDidMount() {
    this.props.getData();
  }

  addItem = () => (
    <Add style={{ color: 'white' }} onClick={() => this.handleAdditem()}>
      Open Menu
    </Add>
  );

  handleAdditem = () => {
    this.props.mergeData({ openDrawer: true, id: 'add' });
    this.props.getDefault();
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

  mapFunction = item => {
    return {
      ...item,
      branch: (
        <button onClick={() => this.handleDialog(item._id)} type="button" style={{ cursor: 'pointer', color: '#2196f3' }}>
          {item.branch}
        </button>
      ),
    };
  };

  handleDialog = id => {
    this.props.mergeData({ openDrawer: true, id });
    this.props.getCurrent(id);
  };

  render() {
    const { tab } = this.state;
    const { recruitmentPage, intl } = this.props;
    const roles = this.props.dashboardPage.role.roles;

    const roleHrmRecruitmentWave = roles && roles.find(item => item.codeModleFunction === 'HrmRecruitmentWave');
    const roleModuleHrmRecruitmentWave = roleHrmRecruitmentWave && roleHrmRecruitmentWave.methods ? roleHrmRecruitmentWave.methods : [];
    return (
      <div>
        <Tabs value={tab} onChange={(e, tab) => this.setState({ tab })}>
          <Tab value={0} label={intl.formatMessage(messages.managerecruitmentneeds || { id: 'managerecruitmentneeds' })} />

          {(roleModuleHrmRecruitmentWave.find(elm => elm.name === 'GET') || { allow: false }).allow === true ? (
            <Tab value={1} label={intl.formatMessage(messages.recruitment || { id: 'recruitment' })} />
          ) : null}
        </Tabs>
        {tab === 0 ? <HrmRecruitmentManagement /> : null}
        {tab === 1 && <RecruitmentWavePage history={this.props.history} />}
        <Dialog maxWidth="md" anchor="right" open={recruitmentPage.openDrawer} onClose={() => this.props.mergeData({ openDrawer: false, id: 'add' })}>
          <DialogTitle id="alert-dialog-title">Thông tin kiêm nhiệm</DialogTitle>
          <DialogContent>
            <TextField
              onChange={e => this.props.mergeData({ branch: e.target.value })}
              InputLabelProps={{ shrink: true }}
              label="Chi nhánh"
              value={recruitmentPage.branch}
              style={{ width: '49%' }}
              helperText={recruitmentPage.branch === '' ? 'Chi nhánh không được bỏ trống' : null}
              error={recruitmentPage.branch === ''}
            />
            <TextField
              onChange={e => this.props.mergeData({ pending: e.target.value })}
              value={recruitmentPage.pending}
              InputLabelProps={{ shrink: true }}
              label="Chờ duyệt"
              style={{ width: '49%', marginLeft: 5 }}
            />
            <TextField
              onChange={e => this.props.mergeData({ part: e.target.value })}
              value={recruitmentPage.part}
              label="Bộ phận"
              style={{ width: '99%' }}
            />
            <TextField
              onChange={e => this.props.mergeData({ location: e.target.value })}
              value={recruitmentPage.location}
              label="Vị trí cần tuyển"
              style={{ width: '99%' }}
            />
            <TextField
              onChange={e => this.props.mergeData({ amount: e.target.value })}
              value={recruitmentPage.amount}
              InputLabelProps={{ shrink: true }}
              type="number"
              label="Số lượng"
              style={{ width: '49%' }}
            />
            <TextField
              onChange={e => this.props.mergeData({ startDate: e.target.value })}
              value={recruitmentPage.startDate}
              type="date"
              label="Ngày Lập"
              InputLabelProps={{ shrink: true }}
              style={{ width: '49%', marginLeft: 5 }}
              helperText={recruitmentPage.startDate === '' ? 'Ngày Lập không được bỏ trống' : null}
              error={recruitmentPage.startDate === ''}
            />
            <TextField
              onChange={e => this.props.mergeData({ needDate: e.target.value })}
              value={recruitmentPage.needDate}
              type="date"
              label="Ngày Cần"
              InputLabelProps={{ shrink: true }}
              style={{ width: '49%' }}
              helperText={recruitmentPage.needDate === '' ? 'Ngày Cần không được bỏ trống' : null}
              error={recruitmentPage.needDate === ''}
            />
            <TextField
              value={recruitmentPage.organizatsionUnit}
              onChange={e => this.props.mergeData({ organizatsionUnit: e.target.value })}
              label="Phòng ban"
              select
              style={{ width: '99%' }}
              InputLabelProps={{ shrink: true }}
              helperText={recruitmentPage.organizatsionUnit === '' ? 'Phòng ban không được bỏ trống' : null}
              error={recruitmentPage.organizatsionUnit === ''}
            >
              {this.mapItem(this.findChildren(recruitmentPage.departments))}
            </TextField>
            <TextField
              onChange={e => this.props.mergeData({ position: e.target.value })}
              value={recruitmentPage.position}
              rows={4}
              label="Chức vụ kiêm nhiệm"
              style={{ width: '99%' }}
            />
            <TextField
              onChange={e => this.props.mergeData({ note: e.target.value })}
              value={recruitmentPage.note}
              rows={4}
              label="Ghi chú"
              style={{ width: '99%' }}
            />
            <TextField
              // value={recruitmentPage.file}
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
            <Button onClick={this.onSaveFile} variant="outlined" color="secondary" autoFocus style={{ marginRight: 25 }}>
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  handleChangeInputFile = e => {
    const urlAvt = URL.createObjectURL(e.target.files[0]);
    this.props.mergeData({ url: urlAvt, file: e.target.files[0] });
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
    } = this.props.recruitmentPage;
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
      this.props.postData(data);
    } else {
      this.props.putData(id, data);
    }

    this.props.mergeData({ openDrawer: false, reload: Math.random() });
  };
}

RecruitmentPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  recruitmentPage: makeSelectRecruitmentPage(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => {
      dispatch(mergeData(data));
    },
    postData: data => dispatch(postData(data)),
    getData: () => dispatch(getData()),
    getDefault: () => dispatch(getDefault()),
    getCurrent: id => dispatch(getCurrent(id)),
    putData: (id, data) => dispatch(putData(id, data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'recruitmentPage', reducer });
const withSaga = injectSaga({ key: 'recruitmentPage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(RecruitmentPage);

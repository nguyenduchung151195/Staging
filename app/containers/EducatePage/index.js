/**
 *
 * EducatePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import messages from './messages';

import ListPage from 'components/List';
import { Add } from '@material-ui/icons';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectEducatePage from './selectors';
import { SwipeableDrawer } from 'components/LifetekUi';
import reducer from './reducer';
import saga from './saga';
import { API_SALE_POLICY, API_HRM_EDUCATE, API_HRM_educate, API_EDUCATE_PLAN, API_EDUCATE_ROUND } from '../../config/urlConfig';
import AddEducation from '../HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/EducationsPage/components/AddEducation/index';
import AddTraining from '../HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/EducationsPage/components/AddTraining/index';
import { Tabs, Tab, Paper, TextField } from '../../components/LifetekUi';
import { makeSelectProfile } from '../Dashboard/selectors';
import { createEducate, updateEducate, deleteEducate, createEducateRound, updateEducateRound, deleteEducateRound } from './actions';
import makeSelectDashboardPage from '../Dashboard/selectors';

export class EducatePage extends React.Component {
  state = {
    openDrawer: false,
    tab: 0,
    selectedEducate: null,
    openDialog: false,
    selectedTraining: null,
    openDialogTraining: false,
  };

  addItem = () => (
    <Add
      onClick={() => {
        this.setState({ openDialog: true, selectedEducate: null });
      }}
    >
      Open Menu
    </Add>
  );

  addItemTraining = () => (
    <Add
      onClick={() => {
        this.setState({ openDialogTraining: true, selectedTraining: null });
      }}
    >
      Open Menu
    </Add>
  );
  handleDelete = ids => {
    if (this.state.tab === 0) this.props.deleteEducate(ids);
    else if (this.state.tab === 1) this.props.deleteEducateRound(ids);
  };
  onSave = data => {
    if (this.state.tab === 0) {
      const { _id: educateId } = data;
      if (!educateId) {
        this.props.createEducate(data);
      } else {
        this.props.updateEducate(educateId, data);
      }
    } else if (this.state.tab === 1) {
      if (!data._id) {
        this.props.createEducateRound(data);
      } else {
        this.props.updateEducateRound(data._id, data);
      }
    }
  };
  componentDidUpdate(prevProps) {
    const { createEducateRoundSuccess, createEducateSuccess, updateEducateSuccess } = this.props.educatePage;
    if (prevProps.educatePage.createEducateRoundSuccess !== createEducateRoundSuccess && createEducateRoundSuccess === true) {
      this.setState({ openDialogTraining: false });
    }
    if (prevProps.educatePage.createEducateSuccess !== createEducateSuccess && createEducateSuccess === true) {
      this.setState({ openDialog: false });
    }
    if (prevProps.educatePage.updateEducateSuccess !== updateEducateSuccess && updateEducateSuccess === true) {
      this.setState({ openDialog: false });
    }
  }
  mapFunction = item => (
    // console.log(item, 2),
    {
      ...item,
      hrmEmployeeId: item['name'],
      userNeed: item['userNeed.name']
    });
  mapFunctionRound = item => {
    return {
      ...item,
      hrmEmployeeId: item['name'],
      degree: item['degree.title'],
      educateCenter: item['educateCenter.title'],
      educatePlan: item['educatePlan.name'],
      educateMethod: item['educateMethod.title'],
    };
  };
  render() {
    const { tab, openDialog, selectedEducate, openDialogTraining, selectedTraining } = this.state;
    const { intl, educationPage, onCreateEducate, onUpdateEducate, onDeleteEducate, id: hrmEmployeeId, educatePage, dashboardPage } = this.props;
    const { reload } = educatePage;
    // const {intl, educationPage, onCreateEducate, onUpdateEducate, onDeleteEducate, id: hrmEmployeeId } = this.props;
    // const { createEducateSuccess, updateEducateSuccess, deleteEducateSuccess } = educationPage;

    const roles = dashboardPage.role.roles;
    const roleHrmEducatePlan = roles.find(item => item.codeModleFunction === 'EducatePlan');
    const roleModuleHrmEducatePlan = roleHrmEducatePlan && roleHrmEducatePlan.methods ? roleHrmEducatePlan.methods : [];
    const roleHrmEducateRound = roles.find(item => item.codeModleFunction === 'EducateRound');
    const roleModuleHrmEducateRound = roleHrmEducateRound && roleHrmEducateRound.methods ? roleHrmEducateRound.methods : [];

    return (
      <div>
        <Tabs value={tab} onChange={(e, tab) => this.setState({ tab })}>
          {(roleModuleHrmEducatePlan.find(elm => elm.name === 'GET') || { allow: false }).allow === true ? (
            <Tab value={0} label={'Kế hoạch đào tạo'} />
          ) : null}
          {(roleModuleHrmEducateRound.find(elm => elm.name === 'GET') || { allow: false }).allow === true ? (
            <Tab value={1} label={intl.formatMessage(messages.training || { id: messages.training })} />
          ) : null}
        </Tabs>
        {tab === 0 ? (
          <Paper style={{ paddingTop: 10 }}>
            <ListPage
              height="655px"
              code="EducatePlan"
              parentCode="hrm"
              onEdit={row => {
                this.setState({ openDialog: true, selectedEducate: row });
              }}
              onDelete={this.handleDelete}
              reload={reload}
              apiUrl={API_EDUCATE_PLAN}
              settingBar={[this.addItem()]}
              mapFunction={this.mapFunction}
              disableAdd
              profile={this.props.profile}
              disableSeenMail={true}
              disableSMS={true}
              disableExport={true}
            />
          </Paper>
        ) : null}
        {tab === 1 && (
          <Paper style={{ paddingTop: 10 }}>
            <ListPage
              height="655px"
              code="EducateRound"
              parentCode="hrm"
              onEdit={row => {
                this.setState({ openDialogTraining: true, selectedTraining: { ...row, userNeed: row.userNeedId || "" } });
              }}
              onDelete={this.handleDelete}
              reload={reload}
              apiUrl={API_EDUCATE_ROUND}
              settingBar={[this.addItemTraining()]}
              mapFunction={this.mapFunctionRound}
              disableAdd
              profile={this.props.profile}
              disableSeenMail={true}
              disableSMS={true}
              disableExport={true}
            />
          </Paper>
        )}

        <Dialog maxWidth="md" scroll="body" open={this.state.openDrawer} onClose={() => this.setState({ openDrawer: false })}>
          <DialogTitle id="alert-dialog-title">Thông tin nhu cầu tuyển dụng</DialogTitle>

          <DialogContent>
            <TextField select InputLabelProps={{ shrink: true }} label="Chi nhánh" style={{ width: '49%' }} />
            <TextField select InputLabelProps={{ shrink: true }} label="Chờ duyệt" style={{ width: '49%', marginLeft: 5 }} />
            <TextField label="Bộ phận" style={{ width: '99%' }} />
            <TextField label="Vị trí cần tuyển" style={{ width: '99%' }} />
            <TextField select type="number" InputLabelProps={{ shrink: true }} label="Số lượng" style={{ width: '49%' }} />
            <div>
              <TextField type="date" label="Ngày Lập" InputLabelProps={{ shrink: true }} style={{ width: '49%' }} />
              <TextField type="date" label="Ngày Cần" InputLabelProps={{ shrink: true }} style={{ width: '49%', marginLeft: 5 }} />
              <TextField label="Độ tuổi" InputLabelProps={{ shrink: true }} style={{ width: '49%' }} />
              <TextField select label="Giới tính" InputLabelProps={{ shrink: true }} style={{ width: '49%', marginLeft: 5 }}>
                {' '}
                <MenuItem key="0" value={0}>
                  Nam
                </MenuItem>
                <MenuItem key="1" value={1}>
                  Nữ
                </MenuItem>
              </TextField>
              <TextField select type="number" label="Năm kinh nghiệm" InputLabelProps={{ shrink: true }} style={{ width: '49%' }} />
              <TextField label="Mức lương" InputLabelProps={{ shrink: true }} style={{ width: '49%', marginLeft: 5 }} />
              <TextField select label="Trình độ" style={{ width: '99%' }} />
              <TextField label="Ngành học" style={{ width: '99%' }} />
              <TextField label="Lý do tuyển dụng" style={{ width: '99%' }} />
              <TextField rows={4} label="Ghi chú" style={{ width: '99%' }} />
              <TextField
                label="File Upload"
                name="url"
                type="file"
                onChange={this.handleChangeInputFile}
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ width: '99%' }}
              />
            </div>
          </DialogContent>

          <DialogActions>
            <Button onClick={this.onSaveFile} variant="outlined" color="primary" autoFocus style={{ marginRight: 5 }}>
              Lưu
            </Button>
            <Button onClick={this.onSaveFile} variant="outlined" color="secondary" autoFocus style={{ marginRight: 25 }}>
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openDialog: true, selectedEducate: null })}
          open={openDialog}
          width={window.innerWidth - 260}
        >
          <div>
            <AddEducation
              // hrmEmployeeId={hrmEmployeeId}
              {...this.props}
              code="EducatePlan"
              educate={selectedEducate}
              onSave={this.onSave}
              onClose={() => {
                this.setState({ openDialog: false, selectedEducate: null });
              }}
              profile={this.props.profile}
            />
          </div>
        </SwipeableDrawer>
        {/* khóa đào tạo */}
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openDialogTraining: false, selectedTraining: null })}
          open={openDialogTraining}
          width={window.innerWidth - 260}
        >
          <div>
            <AddTraining
              // hrmEmployeeId={hrmEmployeeId}
              {...this.props}
              code="EducateRound"
              training={selectedTraining}
              onSave={this.onSave}
              onClose={() => {
                this.setState({ openDialogTraining: false, selectedTraining: null });
              }}
              profile={this.props.profile}
            />
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

EducatePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  educatePage: makeSelectEducatePage(),
  profile: makeSelectProfile(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch, props) {
  return {
    dispatch,
    createEducate: data => dispatch(createEducate(data)),
    updateEducate: (hrmEmployeeId, data) => dispatch(updateEducate(hrmEmployeeId, data)),
    deleteEducate: ids => dispatch(deleteEducate(ids)),
    deleteEducateRound: ids => dispatch(deleteEducateRound(ids)),
    createEducateRound: data => dispatch(createEducateRound(data)),
    updateEducateRound: (id, data) => dispatch(updateEducateRound(id, data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'educatePage', reducer });
const withSaga = injectSaga({ key: 'educatePage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(EducatePage);

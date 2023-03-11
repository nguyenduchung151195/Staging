/**
 *
 * AddPersonnel
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import Buttons from 'components/CustomButtons/Button';
import { MenuItem, Checkbox, Button, Tab, Tabs, AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Edit, Person, Close } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import injectSaga from 'utils/injectSaga';
import { injectIntl } from 'react-intl';
import messages from './messages';
import injectReducer from 'utils/injectReducer';
import SalaryPage from '../HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/SalaryLogs';
import SocialPage from '../HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/SocialPage';
import ExperiencePage from '../HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/ExperiencePage';
import ProcessPage from '../HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/ProcessPage';
import MaternityPage from '../HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/MaternityPage';
import IndenturePage from '../HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/IndenturePage';
import EducationsPage from '../HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/EducationsPage';
import BonusPage from '../HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/BonusPage';
import DisciplinePage from '../HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/DisciplineProcess';
import SabbaticalPage from '../HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/SabbaticalPage';
import RelationsPage from '../HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/RelationsPage';
import DismissedPage from '../HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeOtherHistory/DismissedPage';
import PraisePage from '../HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeOtherHistory/PraisePage';
import CollaboratePage from '../HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeOtherHistory/CollaboratePage';
import { changeTabAct } from './actions';

// import { API_SOURCE_HRMCONFIG } from '../../config/urlConfig';
import makeSelectAddPersonnel from './selectors';
import reducer from './reducer';
import { Paper, Grid, TextField, Typography, SwipeableDrawer, Autocomplete, FileUpload } from '../../components/LifetekUi';
import saga from './saga';
// eslint-disable-next-line import/no-unresolved
import avatarA from '../../images/default-avatar.png';
import {
  mergeData,
  getData,
  getDepartment,
  getDefault,
  postPersonnel,
  getPersonnelCurent,
  putPersonnel,
  changeImage,
  getAllEquipmentOfEmployee,
} from './actions';
import styles from './styles';
import CustomInputBase from '../../components/Input/CustomInputBase';
import MainInfor from '../HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeMainInfor';
import ContractInsuranceTimeKeep from '../HRM/HrmEmployee/HrmEmployeeProfile/HrmEmployeeContractInsuranceTimeKeepHistory';
import { changeSnackbar } from '../Dashboard/actions';
import CustomAppBar from 'components/CustomAppBar';
import { makeSelectProfile, makeSelectMiniActive } from '../Dashboard/selectors';
import ScanFileByH from '../../components/ScanFileByH';
import { Dialog as DialogLifetek } from '../../components/LifetekUi';

const VerticalTabs = withStyles(() => ({
  flexContainer: {
    flexDirection: 'column',
  },
  indicator: {
    display: 'none',
  },
}))(Tabs);

const VerticalTab = withStyles(() => ({
  selected: {
    color: 'white',
    backgroundColor: `#2196F3`,
    borderRadius: '5px',
    boxShadow: '3px 5.5px 7px rgba(0, 0, 0, 0.15)',
  },
  root: {},
}))(Tab);
/* eslint-disable react/prefer-stateless-function */
export class AddPersonnel extends React.Component {
  state = {
    tab: 0,
    user: null,
    messages: {},
    reload: new Date() * 1,
    openDialogScan: false,
    localData: null,
    disableAdd: false,
  };

  componentDidMount = () => {
    this.props.getDepartment();
    this.props.getData();
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    if (id !== 'add') {
      this.props.getPersonnelCurent(id);
      this.props.getAllEquipmentOfEmployee(id);
    } else this.props.getDefault();
    if (this.props.history && this.props.history.newData) {
      const allData = this.props.history.newData;
      this.props.mergeData({
        name: allData.name || '',
        gender: allData.gender === 'Nam' ? 0 : 1,
        email: allData.email || '',
        code: allData.code || '',
        organizationUnit: allData.organizationUnit || '',
        phoneNumber: allData.phoneNumber || '',
        identityCardNumber: allData.identityCardNumber || '',
      });
    }
  };

  handleChangeInputFile = e => {
    const avtURL = URL.createObjectURL(e.target.files[0]);
    this.props.mergeData({ url: avtURL, file: e.target.files[0] });
  };

  onSelectImg = e => {
    const avtURL = URL.createObjectURL(e.target.files[0]);
    this.props.changeImage({ avatarURL: avtURL, avatar: e.target.files[0] });
  };

  handleTab(tab) {
    // this.setState({ tab });
    this.props.onChangeTab(tab);
  }

  handleDiscount = (name, checked) => {
    this.props.mergeData({ [name]: checked });
  };

  findChildren(data) {
    data.forEach(item => {
      const child = data.filter(ele => ele.parent === item._id);
      if (child.length) {
        item.child = child;
      }
    });
    const newData = data.filter(item => item.parent === null);
    this.getLevel(newData, 0);
    return newData;
  }

  getLevel(arr, lv) {
    arr.forEach(item => {
      item.level = lv;
      if (item.child) {
        this.getLevel(item.child, lv + 1);
      }
    });
  }

  mapItem(rows, result = []) {
    rows.forEach(item => {
      result.push(
        <MenuItem value={item._id} style={{ paddingLeft: 20 * item.level }}>
          {item.name}
        </MenuItem>,
      );
      if (item.child) {
        this.mapItem(item.child, result);
      }
    });
    return result;
  }

  // eslint-disable-next-line consistent-return
  mapChild(data, r = [], last = false) {
    data.forEach(item => {
      r.push(item);
      if (item.child) {
        this.mapChild(item.child, r);
      }
    });
    if (last) return r;
  }

  handleChangeInput = (name, value) => {
    this.props.mergeData({ [name]: value });
  };

  handleMessages = messages => {
    this.setState({ messages });
  };

  hanhdleClick = () => {
    this.props.id !== undefined ? this.props.onClose() : this.props && this.props.history && this.props.history.goBack();
  };
  handleScan = () => {
    this.setState({
      openDialogScan: true,
    });
  };
  onSaveDataScan = data => {
    this.props.mergeData(data);
  };
  handleCloseDialogScan = () => {
    this.setState({
      openDialogScan: false,
    });
  };
  render() {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { addPersonnel, classes, intl, miniActive } = this.props;
    const {
      automatic,
      departments,
      openDrawer,
      openDialog,
      openSocial,
      openProcess,
      openMaternity,
      openContract,
      openEducate,
      openBonus,
      openDiscipline,
      openSabbatical,
      openRelations,
      openDismissed,
      openPraise,
      openCollaborate,
      laborStatuss,
      marriages,
      contractTypes,
      titles,
      educateSystems,
      specializes,
      degrees,
      informaticss,
      language1s,
      language2s,
      nations,
      religions,
      shifts,
      graduateSchools,
      bloodGroups,
    } = addPersonnel;
    // const { tab } = this.state;
    const { tab } = addPersonnel;

    const Bt = props => (
      <Buttons onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'}>
        {props.children}
      </Buttons>
    );
    // const child = this.mapChild(departments, [], true);
    return (
      <div className={classes.root}>
        <CustomAppBar
          title={
            id === 'add'
              ? `${intl && intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới Hồ sơ nhân sự' })}`
              : `${intl && intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật Hồ sơ nhân sự' })}`
          }
          disableAdd={this.state.disableAdd}
          onGoBack={this.hanhdleClick}
          onSubmit={this.onSubmit}
          onScan={this.handleScan}
        />
        <Helmet>
          {id === 'add' && <title>Thêm mới nhân sự</title>}
          {id !== 'add' && <title>Cật nhật nhân sự</title>}
          <meta name="description" content="Description of AddPersonnel" />
        </Helmet>

        {/* <Paper style={{ marginBottom: 20, padding: '0px 16px' }}>
          {this.props.id ? null : (
            <Breadcrumbs aria-label="Breadcrumb">
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
                Dashboard
              </Link>
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/hrm">
                HRM
              </Link>
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/hrm/personnel">
                Nhân sự
              </Link>
              <Typography color="textPrimary">{id === 'add' ? 'Thêm mới nhân sự' : 'Sửa nhân sự'}</Typography>
            </Breadcrumbs>
          )}
        </Paper> */}

        <Grid container>
          <Bt tab={0} style={{ marginLeft: 30 }}>
            Thông tin chính
          </Bt>
          <Bt tab={1}>Hợp đồng & BHXH & Chấm công</Bt>
          <Bt tab={2}>Quá trình nhân sự</Bt>
          <Bt tab={3}>Quá trình khác</Bt>
        </Grid>
        <DialogLifetek title="Tải file" onClose={this.handleCloseDialogScan} open={this.state.openDialogScan}>
          <ScanFileByH onSaveDataScan={this.onSaveDataScan} onCloseDialogScan={this.handleCloseDialogScan} code="hrm" />
        </DialogLifetek>
        {tab === 0 ? (
          <MainInfor
            addPersonnel={addPersonnel}
            mergeData={this.props.mergeData}
            handleDiscount={this.handleDiscount}
            handleChangeInput={this.handleChangeInput}
            handleChangeInputFile={this.handleChangeInputFile}
            id={id}
            handleChangeImage={this.props.changeImage}
            messages={this.handleMessages}
            code="hrm"
          />
        ) : null}
        {tab === 1 ? (
          <ContractInsuranceTimeKeep
            addPersonnel={addPersonnel}
            mergeData={this.props.mergeData}
            handleDiscount={this.handleDiscount}
            handleChangeInput={this.handleChangeInput}
            messages={this.handleMessages}
            code="hrm"
          />
        ) : null}
        {/* {(tab === 0 || tab === 1) && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', margin: 20 }}>
            <Button variant="contained" color="primary" style={{ marginRight: 25 }} type="submit" onClick={this.onSubmit}>
              {id === 'add' ? 'Lưu' : 'Cập nhật'}
            </Button>
            <Button variant="contained" color="secondary" onClick={this.goBack}>
              Huỷ
            </Button>
          </div>
        )} */}
        {tab === 2 ? (
          <Paper>
            <VerticalTabs style={{ marginLeft: 30 }}>
              <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Diễn biến lương" onClick={this.openDrawer} />
              {/* <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Đóng BHXH" onClick={this.openDialog} /> */}
              <VerticalTab
                style={{ textAlign: 'left', textTransform: 'none' }}
                label="Đóng BHXH"
                onClick={() => {
                  this.props.onChangeSnackbar &&
                    this.props.onChangeSnackbar({
                      status: true,
                      message: 'Bạn cần nâng cấp phiên bản để sử dụng tính năng này!',
                      variant: 'warning',
                    });
                  this.setState({ reload: new Date() * 1 });
                }}
              />

              <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Kinh nghiệm làm việc" onClick={this.openSocial} />
              <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Quá trình làm việc" onClick={this.openProcess} />
              <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Thai sản" onClick={this.openMaternity} />
              <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Hợp đồng" onClick={this.openContract} />
              <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Đào tạo" onClick={this.openEducate} />
              <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Khen thưởng" onClick={this.openBonus} />
              <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Kỷ luật" onClick={this.openDiscipline} />
              <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Nghỉ phép" onClick={this.openSabbatical} />
              <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Quan hệ nhân thân" onClick={this.openRelations} />
            </VerticalTabs>
            <SwipeableDrawer
              anchor="right"
              onClose={() => this.props.mergeData({ openDrawer: false })}
              open={openDrawer}
              width={!miniActive ? window.innerWidth - 260 : window.innerWidth - 80}
            >
              <SalaryPage id={id} onClose={() => this.props.mergeData({ openDrawer: false })} />
            </SwipeableDrawer>
            <SwipeableDrawer
              anchor="right"
              onClose={() => this.props.mergeData({ openDialog: false })}
              open={openDialog}
              width={!miniActive ? window.innerWidth - 260 : window.innerWidth - 80}
            >
              <SocialPage id={id} onClose={() => this.props.mergeData({ openDialog: false })} />
            </SwipeableDrawer>
            <SwipeableDrawer
              anchor="right"
              onClose={() => this.props.mergeData({ openSocial: false })}
              open={openSocial}
              width={!miniActive ? window.innerWidth - 260 : window.innerWidth - 80}
            >
              <ExperiencePage id={id} onClose={() => this.props.mergeData({ openSocial: false })} />
            </SwipeableDrawer>
            <SwipeableDrawer
              anchor="right"
              onClose={() => this.props.mergeData({ openProcess: false })}
              open={openProcess}
              width={!miniActive ? window.innerWidth - 260 : window.innerWidth - 80}
            >
              <ProcessPage id={id} onClose={() => this.props.mergeData({ openProcess: false })} />
            </SwipeableDrawer>
            <SwipeableDrawer
              anchor="right"
              onClose={() => this.props.mergeData({ openMaternity: false })}
              open={openMaternity}
              width={!miniActive ? window.innerWidth - 260 : window.innerWidth - 80}
            >
              <MaternityPage id={id} onClose={() => this.props.mergeData({ openMaternity: false })} />
            </SwipeableDrawer>
            <SwipeableDrawer
              anchor="right"
              onClose={() => this.props.mergeData({ openContract: false })}
              open={openContract}
              width={!miniActive ? window.innerWidth - 260 : window.innerWidth - 80}
            >
              <IndenturePage
                id={id}
                codeContract={`${addPersonnel.name}_${addPersonnel.code}`}
                onClose={() => this.props.mergeData({ openContract: false })}
              />
            </SwipeableDrawer>
            <SwipeableDrawer
              anchor="right"
              onClose={() => this.props.mergeData({ openEducate: false })}
              open={openEducate}
              width={!miniActive ? window.innerWidth - 260 : window.innerWidth - 80}
            >
              <EducationsPage id={id} onClose={() => this.props.mergeData({ openEducate: false })} />
            </SwipeableDrawer>
            <SwipeableDrawer
              anchor="right"
              onClose={() => this.props.mergeData({ openBonus: false })}
              open={openBonus}
              width={!miniActive ? window.innerWidth - 260 : window.innerWidth - 80}
            >
              <BonusPage id={id} onClose={() => this.props.mergeData({ openBonus: false })} />
            </SwipeableDrawer>
            <SwipeableDrawer
              anchor="right"
              onClose={() => this.props.mergeData({ openDiscipline: false })}
              open={openDiscipline}
              width={!miniActive ? window.innerWidth - 260 : window.innerWidth - 80}
            >
              <DisciplinePage id={id} onClose={() => this.props.mergeData({ openDiscipline: false })} />
            </SwipeableDrawer>
            <SwipeableDrawer
              anchor="right"
              onClose={() => this.props.mergeData({ openSabbatical: false })}
              open={openSabbatical}
              width={!miniActive ? window.innerWidth - 260 : window.innerWidth - 80}
            >
              <SabbaticalPage
                id={id}
                fileName={`${addPersonnel.name}_${addPersonnel.code}`}
                onClose={() => this.props.mergeData({ openSabbatical: false })}
              />
              {}
            </SwipeableDrawer>
            <SwipeableDrawer
              anchor="right"
              onClose={() => this.props.mergeData({ openRelations: false })}
              open={openRelations}
              width={!miniActive ? window.innerWidth - 260 : window.innerWidth - 80}
            >
              <RelationsPage id={id} onClose={() => this.props.mergeData({ openRelations: false })} />
            </SwipeableDrawer>
          </Paper>
        ) : null}
        {tab === 3 ? (
          <Paper>
            <VerticalTabs style={{ marginLeft: 30 }}>
              <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Kiêm nhiệm" onClick={this.openDismissed} />
              <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Khen thưởng con" onClick={this.openPraise} />
              <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Công tác" onClick={this.openCollaborate} />
              <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Import điểm đánh giá" onClick={this.openImport} />
            </VerticalTabs>
            <SwipeableDrawer
              anchor="right"
              onClose={() => this.props.mergeData({ openDismissed: false })}
              open={openDismissed}
              width={!miniActive ? window.innerWidth - 260 : window.innerWidth - 80}
            >
              <DismissedPage
                id={id}
                fileName={`${addPersonnel.name}_${addPersonnel.code}`}
                onClose={() => this.props.mergeData({ openDismissed: false })}
              />
            </SwipeableDrawer>
            <SwipeableDrawer
              anchor="right"
              onClose={() => this.props.mergeData({ openPraise: false })}
              open={openPraise}
              width={!miniActive ? window.innerWidth - 260 : window.innerWidth - 80}
            >
              <PraisePage id={id} onClose={() => this.props.mergeData({ openPraise: false })} />
            </SwipeableDrawer>
            <SwipeableDrawer
              anchor="right"
              onClose={() => this.props.mergeData({ openCollaborate: false })}
              open={openCollaborate}
              width={!miniActive ? window.innerWidth - 260 : window.innerWidth - 80}
            >
              <CollaboratePage id={id} onClose={() => this.props.mergeData({ openCollaborate: false })} />
            </SwipeableDrawer>
          </Paper>
        ) : null}
      </div>
    );
  }

  openDrawer = openDrawer => {
    this.props.mergeData({ openDrawer });
  };

  openDialog = openDialog => {
    this.props.mergeData({ openDialog });
  };

  openSocial = openSocial => {
    this.props.mergeData({ openSocial });
  };

  openProcess = openProcess => {
    this.props.mergeData({ openProcess });
  };

  openMaternity = openMaternity => {
    this.props.mergeData({ openMaternity });
  };

  openContract = openContract => {
    this.props.mergeData({ openContract });
  };

  openEducate = openEducate => {
    this.props.mergeData({ openEducate });
  };

  openBonus = openBonus => {
    this.props.mergeData({ openBonus });
  };

  openDiscipline = openDiscipline => {
    this.props.mergeData({ openDiscipline });
  };

  openSabbatical = openSabbatical => {
    this.props.mergeData({ openSabbatical });
  };

  openRelations = openRelations => {
    this.props.mergeData({ openRelations });
  };

  openDismissed = openDismissed => {
    this.props.mergeData({ openDismissed });
  };

  openPraise = openPraise => {
    this.props.mergeData({ openPraise });
  };

  openCollaborate = openCollaborate => {
    this.props.mergeData({ openCollaborate });
  };

  goBack = () => {
    this.state.user = null;
    localStorage.removeItem('user');
    this.props.history.goBack();
  };

  onSubmit = () => {
    this.setState({ disableAdd: true });
    setTimeout(() => {
      this.setState({ disableAdd: false });
    }, 3000);
    const { addPersonnel } = this.props;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const data = {
      name: addPersonnel.name,
      code: addPersonnel.code,
      gender: addPersonnel.gender,
      email: addPersonnel.email,
      birthday: addPersonnel.birthday,
      phoneNumber: addPersonnel.phoneNumber,
      address: addPersonnel.address,
      note: addPersonnel.note,
      identityCardNumber: addPersonnel.identityCardNumber,
      beginWork: addPersonnel.beginWork,
      locationProvide: addPersonnel.locationProvide,
      marriage: addPersonnel.marriage,
      automatic: addPersonnel.automatic,
      dateProvide: addPersonnel.dateProvide,
      dateOfficial: addPersonnel.dateOfficial,
      laborStatus: addPersonnel.laborStatus,
      decisionNumber: addPersonnel.decisionNumber,
      decisionDay: addPersonnel.decisionDay,
      organizationUnit: addPersonnel.organizationUnit,
      position: addPersonnel.position,
      title: addPersonnel.title,
      contractNumber: addPersonnel.contractNumber,
      contractType: addPersonnel.contractType,
      contractStartDate: addPersonnel.contractStartDate,
      contractEndDate: addPersonnel.contractEndDate,
      bankAccount: addPersonnel.bankAccount,
      bank: addPersonnel.bank,
      taxCode: addPersonnel.taxCode,
      educateSystem: addPersonnel.educateSystem,
      specialize: addPersonnel.specialize,
      degree: addPersonnel.degree,
      informatics: addPersonnel.informatics,
      language1: addPersonnel.language1,
      language2: addPersonnel.language2,
      nation: addPersonnel.nation,
      religion: addPersonnel.religion,
      file: addPersonnel.file,
      avatar: addPersonnel.avatar,
      avatarURL: addPersonnel.avatarURL,
      rank: addPersonnel.rank,
      role: addPersonnel.role,
      restStatus: addPersonnel.restStatus,
      inactivityDate: addPersonnel.inactivityDate,
      insuranceNumber: addPersonnel.insuranceNumber,
      insuranceCode: addPersonnel.insuranceCode,
      graduateSchool: addPersonnel.graduateSchool,
      graduateYear: addPersonnel.graduateYear,
      bloodGroup: addPersonnel.bloodGroup,
      healthStatus: addPersonnel.healthStatus,
      relationship: addPersonnel.relationship,
      passport: addPersonnel.passport,
      passportDate: addPersonnel.passportDate,
      facebook: addPersonnel.facebook,
      skype: addPersonnel.skype,
      yahoo: addPersonnel.yahoo,
      twitter: addPersonnel.twitter,
      kanbanStatus: addPersonnel.kanbanStatus ? addPersonnel.kanbanStatus : 0,
      workingInformation: addPersonnel.workingInformation,
      portal: addPersonnel.portal,
      codeShift: addPersonnel.codeShift ? addPersonnel.codeShift.map(item => item._id) : [],
      others: addPersonnel.others,
    };
    if (addPersonnel.kanbanStatus && addPersonnel.kanbanStatus !== 0) {
      if (Object.keys(this.state.messages).length === 0) {
        if (id === 'add') this.props.postPersonnel(data);
        else this.props.putPersonnel(data, id);
      } else {
        this.props.onChangeSnackbar({ status: true, message: 'Thêm dữ liệu thất bại', variant: 'error' });
      }
    } else {
      this.props.onChangeSnackbar({ status: true, message: 'Vui lòng chọn trạng thái Kanban', variant: 'error' });
    }
  };
}

AddPersonnel.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  postPersonnel: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addPersonnel: makeSelectAddPersonnel(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getDepartment: () => dispatch(getDepartment()),
    getData: () => dispatch(getData()),
    getDefault: () => dispatch(getDefault()),
    getPersonnelCurent: id => dispatch(getPersonnelCurent(id)),
    postPersonnel: data => dispatch(postPersonnel(data)),
    putPersonnel: (data, id) => dispatch(putPersonnel(data, id)),
    changeImage: data => dispatch(changeImage(data)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    getAllEquipmentOfEmployee: id => dispatch(getAllEquipmentOfEmployee(id)),
    onChangeTab: val => {
      dispatch(changeTabAct(val));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addPersonnel', reducer });
const withSaga = injectSaga({ key: 'addPersonnel', saga });

export default compose(
  injectIntl,
  memo,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddPersonnel);

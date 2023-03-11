/**
 *
 * SocialInsurancePage
 *
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes, { func } from 'prop-types';
import { connect } from 'react-redux';
import { Edit, Add, Archive, Send } from '@material-ui/icons';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ListPage from 'components/List';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Paper, Typography, SwipeableDrawer } from '../../../components/LifetekUi';
import makeSelectSocialInsurancePage from './selectors';
import { API_HRM_SOCIAL, API_HRM_SOCIAL_NEW, API_INSURANCE_INFOMATION_HISTORY } from '../../../config/urlConfig';
import reducer from './reducer';
import makeSelectDashboardPage, { makeSelectMiniActive , makeSelectProfile} from '../../../containers/Dashboard/selectors';
import saga from './saga';
import AddSocialInsurance from './components/AddSocialInsurance';
import { createSocialInsurance, updateSocialInsurance, deleteSocialInsurance, mergeData, shareInsurance, getInsuranceData } from './actions';
import { FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, Tooltip } from '@material-ui/core';
import Buttons from 'components/CustomButtons/Button';
import AddSocial from '../HrmEmployee/HrmEmployeeProfile/HrmEmployeeHistory/SocialPage/components/AddSocial';
//import { Kanban } from '../../KanbanPlugin';
import Kanban from 'components/LifetekUi/Planner/PlanDemo';
import { changeSnackbar } from '../../Dashboard/actions';
import { tableToExcel } from '../../../helper';
import { mergeData as MergeData } from '../../Dashboard/actions';
import { Dialog as DialogUI, Loading } from 'components/LifetekUi';
import moment from 'moment';
import { serialize } from '../../../utils/common';
import { fetchData, printTemplteExcel } from '../../../helper';
import CustomizedSnackbars from '../../../components/Snackbar/index';
import { useHistory } from 'react-router-dom';
/* eslint-disable react/prefer-stateless-function */
function Bt(props) {
  return (
    <Buttons
      // color={props.tab === tab ? 'gradient' : 'simple'}
      color={props.color}
      right
      round
      size="sm"
      onClick={props.onClick}
    >
      {props.children}
    </Buttons>
  );
}
function SocialInsurancePage(props) {
  const {
    mergeData,
    socialInsurancePage,
    onChangeSnackbar,
    onCreateSocialInsurance,
    onUpdateSocialInsurance,
    onDeleteSocialInsurance,
    id: hrmEmployeeId,
    onMergeData,
    onShareInsurance,
    dashboardPage,
    history,
    profile,
  } = props;

  const { createSocialInsuranceSuccess, updateSocialInsuranceSuccess, tab, reload } = socialInsurancePage;
  const [openDialog, setOpenDialog] = useState(false);
  const [dataExport, setDataExport] = useState();
  const [openExport, setOpenExport] = useState('PDF');
  const [html, setHtml] = useState([]);
  const [listKanbanStatus, setListKanbanStatus] = useState();
  const [selectedSocialInsurance, setSelectedSocialInsurance] = useState(null);
  const [selectInsurance, setSelectInsurance] = useState({
    data: [],
    type: null,
  });
  const [openConfirm, setOpenConfirm] = useState({
    dialog: false,
    confirm: false,
    reRender: false,
    openExcel: false,
    template: null,
  });
  const [option, setOption] = useState(null);
  const [count, setCount] = useState(false);
  const [localState, setLocalState] = useState({
    tabs: 0,
    checkPreview: false,
    checkSelect: false,
  });
  const [countt, setCountt] = useState(0);

  useEffect(
    () => {
      if (createSocialInsuranceSuccess === true) {
        handleCloseSocialInsuranceDialog();
      }
      if (!createSocialInsuranceSuccess) {
      }
    },
    [createSocialInsuranceSuccess],
  );

  useEffect(
    () => {
      if (updateSocialInsuranceSuccess === true) {
        handleCloseSocialInsuranceDialog();
      }
      if (!updateSocialInsuranceSuccess) {
      }
    },
    [updateSocialInsuranceSuccess],
  );

  const handleSave = useCallback(data => {
  
    const { _id: socialInsuranceId } = data;
    if (!socialInsuranceId) {
      onCreateSocialInsurance(data);
    } else {
      onUpdateSocialInsurance(socialInsuranceId, data);
    }
  }, []);

  const onSave = () => {
    setSelectInsurance({ ...selectInsurance, data: [] });
    setOption(0);
    if (selectInsurance.data.length === 0) {
      onShareInsurance({ all: true, filter: '', type: selectInsurance.type });
      setOpenConfirm({ ...openConfirm, confirm: false, reRender: true });
    } else {
      let newArr = [];
      selectInsurance.data.forEach(el => {
        newArr.push(el._id);
      });
      onShareInsurance({ all: false, ids: newArr, type: selectInsurance.type });
      setOpenConfirm({ ...openConfirm, confirm: false, reRender: true });
    }
  };

  useEffect(
    () => {
      setCount(true);
      setOpenConfirm({ ...openConfirm, reRender: false });
      setTimeout(() => {
        setCount(false);
      }, 1000);
    },
    [openConfirm.reRender],
  );

  const handleSelectInsurance = e => {
    setSelectInsurance({ ...selectInsurance, data: e });
  };

  const handleCloseSocialInsuranceDialog = useCallback(() => {
    setTimeout(() => {
      onMergeData({ hiddenHeader: false });
    }, 1);
    setOpenDialog(false);
  }, []);

  const addItem = () => (
    <Tooltip title="Gửi">
      <Send onClick={() => handleDialogTemplate('InsuranceInformation')} />
    </Tooltip>
  );

  const addItemKanban = () => {
    setOpenDialog(true);
  };

  const ItemComponent = data => (
    <div
      style={{
        padding: '20px 5px',
        margin: '20px 5px',
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
      }}
    >
      <p className="kanban-planner">
        Tên công văn: <b> {data.name}</b>
      </p>
      <p className="kanban-planner">
        Người gửi: <b> {data.fromUsers ? data.fromUsers.map(item => item.name).join(', ') : ''}</b>
      </p>
      <p className="kanban-planner">
        Người ký: <b> {data.receiverSign ? data.receiverSign.name : ''}</b>
      </p>

      <div className="footer-kanban-item">
        <button type="button" className="footer-kanban-item-time">
          <Notifications style={{ fontSize: '1rem' }} /> {new Date(data.receiveTime).toLocaleDateString('vi-VN', { month: 'long', day: 'numeric' })}
        </button>
        <InsertCommentOutlined style={{ cursor: 'pointer' }} />
      </div>
    </div>
  );

  const handleDelete = data => onDeleteSocialInsurance(hrmEmployeeId, data);

  const mapFunction = item => {
   
    return {
      
      ...item,
      hrmEmployeeId: item['name'],
      position: item['position.title'],
      title: item['title.title'],
      allowance: new Intl.NumberFormat('vi-VN', { maximumSignificantDigits: 3 }).format(item['allowance']),
      salary: new Intl.NumberFormat('vi-VN', { maximumSignificantDigits: 3 }).format(item['salary']),
      cccd: item['identityCardNumber'],
      role: ['role.roleName'],
      gender: item['gender'],
    };
  };

  const customDataExport = data => {
    let dataa=[]
    data.map((el)=>{
      dataa.push({
        ...el,
        hrmEmployeeId: el.name ||'',
        "organizationUnit.name": el.organizationUnit && el.organizationUnit.name ||"",
        identityCardNumber: el.identityCardNumber,
        birthday: el.birthday && moment(el.birthday).format('DD/MM/YYYY') || '',
        gender: el.gender && (el.gender === '0' ? 'Nam' : 'Nữ') || '',
        'position.title': el.position && el.position.title ||"",
        'title.title': el.title && el.title.title ||"",
        'role.title': el.role && el.role.title ||"",
        salary: el.salary ||'',
        allowance: el.allowance ||'',
        contractStartDateIndefinite: el.contractStartDateIndefinite && moment(el.contractStartDateIndefinite).format('DD/MM/YYYY') || '',
        'contractType.title': el.contractType && el.contractType.title ||"",
        contractStartDate: el.contractStartDate && moment(el.contractStartDate).format('DD/MM/YYYY') || '',
        contractEndDate: el.contractEndDate && moment(el.contractEndDate).format('DD/MM/YYYY') || '',
        insuranceStartDate: el.insuranceStartDate && moment(el.insuranceStartDate).format('DD/MM/YYYY') || '',
        insuranceEndDate: el.insuranceEndDate && moment(el.insuranceEndDate).format('DD/MM/YYYY') || '',
        startTimeToxic: el.startTimeToxic && moment(el.startTimeToxic).format('DD/MM/YYYY') || '',
        endTimeToxic: el.endTimeToxic && moment(el.endTimeToxic).format('DD/MM/YYYY') || '',
        note: el.note ||'',
      })
       
    })
    return dataa || []
  };

  const mapFunctionHistory = item => {
    return {
      ...item,
      ['hrmEmployeeId.gender']: item['hrmEmployeeId.gender'] === 0 ? 'Nam' : 'Nữ',
      result: item['result'] === 0 ? 'Đã nộp' : item['result'] === 1 ? 'Đã duyệt' : 'Từ chối',
      type: item['type'] === 0 ? 'Báo giảm lao động' : 'Báo tăng lao động',
      ['hrmEmployeeId.role.title']: item['hrmEmployeeId.role.roleName'],
    };
  };

  function handleDialogTemplate(code) {
    setOpenConfirm({ ...openConfirm, dialog: true });
    const { allTemplates } = dashboardPage;
    if (code) {
      const templatesItem = allTemplates ? allTemplates.filter(elm => elm.moduleCode === code) : null;
      let template = [];
      templatesItem.forEach(element => {
        if (element.code === 'GLD' || element.code === 'TLD') {
          template.push(element);
        }
      });
      setOpenConfirm(openConfirm => ({ ...openConfirm, template: template }));
    }
    // handleClose();
  }

  function sendFuntion() {
    if (option !== null) {
      setOpenConfirm({ ...openConfirm, confirm: true, dialog: false });
    } else {
      setLocalState({ ...localState, checkSelect: true });
    }
  }

  function handleTemplate() {
    if (option !== null) {
      setLocalState({ ...localState, checkPreview: true });
      setOpenConfirm({ ...openConfirm, dialog: false });
      setOption(null);
      printTemplteExcel(option, '61dc08354050f24f2f7d40ae', 'InsuranceInformation', false, selectInsurance);
    } else {
      setLocalState({ ...localState, checkSelect: true });
    }
  }

  const handleSelect = e => {
    setOption(openConfirm.template[e.target.value]._id);
    setSelectInsurance({ ...selectInsurance, type: e.target.value });
    props.onGetInsuranceDataToSend(e.target.value);
  };

  const handleCloseExportTable = payload => {
    if (payload && payload.lastPage) setOpenExport(null);

    if (payload && payload.error) {
      if (payload.res && payload.res.message) {
        const { message } = payload.res;
        onChangeSnackbar({ status: true, message, variant: 'error' });
      } else onChangeSnackbar({ status: true, message: 'Có lỗi xảy ra', variant: 'error' });
      return;
    }

    tableToExcel('InsuranceInformation', 'W3C Example Table', 'InsuranceInformation');
  };
  return (
    <div>
      <Paper>
        <Grid container>
          <Grid item md={12}>
            <Bt
              onClick={() => {
                mergeData({ tab: 1 });
                setLocalState({ ...localState, tabs: 1 });
              }}
              color={localState.tabs === 1 ? 'gradient' : 'simple'}
            >
              Kanban
            </Bt>
            <Bt
              onClick={() => {
                mergeData({ tab: 2 });
                setLocalState({ ...localState, tabs: 2 });
              }}
              color={localState.tabs === 2 ? 'gradient' : 'simple'}
            >
              Tra cứu
            </Bt>
            <Bt
              onClick={() => {
                mergeData({ tab: 0 });
                setLocalState({ ...localState, tabs: 0 });
              }}
              color={localState.tabs === 0 ? 'gradient' : 'simple'}
            >
              Danh sách
            </Bt>
          </Grid>
        </Grid>

        {localState.tabs === 0 && (
          <React.Fragment>
            
            {!count && (
              <ListPage
                height="650px"
                code="InsuranceInformation"
                parentCode="hrm"
                onEdit={row => {
                  setSelectedSocialInsurance(row);
                  setOpenDialog(true);
                }}
                exportExcel
                kanbanKey="_id"
                perPage={10}
                // filter={filter}
                onDelete={handleDelete}
                reload={reload}
                apiUrl={API_HRM_SOCIAL_NEW}
                settingBar={[addItem()]}
                disableAdd
                mapFunction={mapFunction}
                onSelectInsurance={e => handleSelectInsurance(e)}
                showDepartmentAndEmployeeFilter
                organizationUnitFilterKey="unitId"
                profile={profile}
                disableEmployee
                noExportInExport
                customDataExport={customDataExport}
                md={2}
              />
            )}
          </React.Fragment>
        )}
        {tab === 1 || localState.tabs === 1 ? (
          <Kanban
            module="hrmStatus"
            code="ST06"
            apiUrl={API_HRM_SOCIAL_NEW}
            addItem={addItemKanban}
            itemComponent={ItemComponent}
          // statusType="hrmStatus"
          // enableTotal
          // titleField="name" // tên trường sẽ lấy làm title trong kanban
          // //callBack={callBack} // sự kiện trả về kanban
          // // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
          // // data={bos} // list dữ liệu
          // path={API_HRM_SOCIAL}
          // code="ST06" // code của danh sách trạng thái kanban
          // customContent={[
          //   {
          //     title: 'Giám sát',
          //     fieldName: 'supervisor.name',
          //     type: 'string',
          //   },
          //   {
          //     title: 'Khách hàng',
          //     fieldName: 'customer.name',
          //     type: 'string',
          //   },
          //   {
          //     title: 'Giá trị',
          //     fieldName: 'value.amount',
          //     type: 'number',
          //   },
          //   {
          //     title: 'Tạo ngày',
          //     fieldName: 'createdAt',
          //     type: 'date',
          //   },
          // ]}
          // customActions={[
          //   {
          //     action: 'email',
          //     params: 'typeLine=4',
          //   },
          //   {
          //     action: 'sms',
          //     params: 'typeLine=3',
          //   },
          //   {
          //     action: 'call',
          //     params: 'typeLine=2',
          //   },
          // ]}
          // history={props.history}
          />
        ) : null}
        {tab === 2 ||
          (localState.tabs === 2 && (
            <React.Fragment>
              {!count && (
                <ListPage
                  code="insuranceInformationHistory"
                  parentCode="hrm"
                  exportExcel
                  kanbanKey="_id"
                  perPage={10}
                  onDelete={handleDelete}
                  reload={reload}
                  apiUrl={API_INSURANCE_INFOMATION_HISTORY}
                  mapFunction={mapFunctionHistory}
                />
              )}
            </React.Fragment>
          ))}
      </Paper>
      <SwipeableDrawer anchor="right" onClose={handleCloseSocialInsuranceDialog} open={openDialog}>
        <div
        // style={{ width: window.innerWidth - 260 }}
        >
          {/* <AddSocialInsurance
             hrmEmployeeId={hrmEmployeeId}
             code="HrmRecruitment"
             socialInsurance={selectedSocialInsurance}
             onSave={handleSave}
             onClose={handleCloseSocialInsuranceDialog}
           /> */}
          <AddSocial
            miniActive={props.miniActive}
            code="InsuranceInformation"
            hrmEmployeeId={hrmEmployeeId}
            social={selectedSocialInsurance}
            onSave={handleSave}
            profile={profile}
            onClose={handleCloseSocialInsuranceDialog}
          />
        </div>
      </SwipeableDrawer>
      <CustomizedSnackbars
        open={localState.checkSelect}
        onClose={() => setLocalState({ ...localState, checkSelect: false })}
        variant="error"
        message="Vui lòng chọn loại bảo hiểm!"
      />
      <DialogUI
        open={openConfirm.dialog}
        onClose={() => setOpenConfirm({ ...openConfirm, dialog: false })}
        saveText="Tải file"
        onSave={() => handleTemplate()}
        extraText="Gửi"
        onExtra={() => sendFuntion()}
      >
        <FormControl variant="outlined">
          <InputLabel id="demo-simple-select-outlined-label">Loại bảo hiểm lao động</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            input={<OutlinedInput label="Loại bảo hiểm lao động" labelWidth={165} />}
            value={selectInsurance.type}
            onChange={e => {
              handleSelect(e);
            }}
          >
            {openConfirm.template &&
              openConfirm.template.length > 0 &&
              openConfirm.template.map((tem, index) => {
                return <MenuItem value={index}>{tem.title}</MenuItem>;
              })}
          </Select>
        </FormControl>
      </DialogUI>
      <DialogUI
        open={openConfirm.confirm}
        onClose={() => setOpenConfirm({ ...openConfirm, confirm: false })}
        saveText="Đồng ý"
        onSave={() => onSave()}
      >
        {!localState.checkPreview && (
          <Typography variant="h6">
            {`Bạn chưa kiểm tra biểu mẫu, có chắc chắn muốn gửi ${selectInsurance.data.length === 0 ? 'toàn bộ danh sách nhân viên' : `${selectInsurance.data.length} nhân viên`
              }?`}
          </Typography>
        )}
        {localState.checkPreview && (
          <Typography variant="h6">
            {`Bạn có chắc chắn muốn gửi ${selectInsurance.data.length === 0 ? 'toàn bộ danh sách nhân viên' : `${selectInsurance.data.length} nhân viên`
              }?`}
          </Typography>
        )}
      </DialogUI>
    </div>
  );
}

SocialInsurancePage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  socialInsurancePage: makeSelectSocialInsurancePage(),
  miniActive: makeSelectMiniActive(),
  profile: makeSelectProfile(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onMergeData: data => dispatch(MergeData(data)),
    mergeData: data => dispatch(mergeData(data)),
    onCreateSocialInsurance: data => dispatch(createSocialInsurance(data)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    onUpdateSocialInsurance: (hrmEmployeeId, data) => dispatch(updateSocialInsurance(hrmEmployeeId, data)),
    onDeleteSocialInsurance: (hrmEmployeeId, ids) => dispatch(deleteSocialInsurance(hrmEmployeeId, ids)),
    onShareInsurance: data => dispatch(shareInsurance(data)),
    onGetInsuranceDataToSend: data => dispatch(getInsuranceData(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'socialInsurancePage', reducer });
const withSaga = injectSaga({ key: 'socialInsurancePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SocialInsurancePage);

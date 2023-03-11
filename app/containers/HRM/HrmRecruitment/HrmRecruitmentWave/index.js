/**
 *
 * RecruitmentWavePage
 *
 */

import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Kanban from 'components/LifetekUi/Planner/PlanDemo';
import { API_RECRUITMENT } from '../../../../config/urlConfig';
import { Notifications, Comment as InsertCommentOutlined } from '@material-ui/icons';
import Buttons from 'components/CustomButtons/Button';
import { connect } from 'react-redux';
import { Edit, Add, FileCopy } from '@material-ui/icons';
import { createStructuredSelector } from 'reselect';
import messages from './messages';
import { compose } from 'redux';
import ListPage from 'components/List';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Paper, Typography, SwipeableDrawer, TextField, Tabs, Tab, Dialog } from 'components/LifetekUi';
import makeSelectRecruitmentWavePage from './selectors';
import { API_RECRUITMENT_WAVE, APP_URL } from '../../../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import AddRecruitmentWave from './components/AddRecruitmentWave';
import { makeSelectProfile, makeSelectMiniActive } from '../../../Dashboard/selectors';
import { changeSnackbar } from '../../../Dashboard/actions';
import DemoDialog from 'components/LifetekUi/Planner/DemoDialog';

import {
  createRecruitmentWave,
  updateRecruitmentWave,
  deleteRecruitmentWave,
  createRoundRecruitment,
  updateRoundRecruitment,
  deleteRoundRecruitment,
  createSubjectRecruiment,
  updateSubjectRecruiment,
  deleteSubjectRecruiment,
  createApplicantRecruitment,
  updateApplicantRecruitment,
  deleteApplicantRecruitment,
  createTestApplicantRecruitment,
  updateTestApplicantRecruitment,
  deleteTestApplicantRecruitment,
  getHumanResource,
  getRoleGroupAction,
  postSwitchCandidate,
  createApplicantRecruitmentAgency,
  updateApplicantRecruitmentAgency,
  deleteApplicantRecruitmentAgency,
  mergeData,
} from './actions';
import { Button, Grid, IconButton, Tooltip } from '@material-ui/core';

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

function RecruitmentWavePage(props) {
  const {
    recruitmentWavePage,
    onCreateRecruitmentWave,
    onUpdateRecruitmentWave,
    onDeleteRecruitmentWave,
    id: hrmEmployeeId,
    onChangeSnackbar,
    mergeData,
  } = props;
  const {
    createRecruitmentWaveSuccess,
    updateRecruitmentWaveSuccess,
    deleteRecruitmentWaveSuccess,
    createApplicantRecruitment,
    createTestApplicantRecruitment,
    tab,
    // createTestApplicantRecruitmentSuccess,
  } = recruitmentWavePage;
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogDetail, setOpenDialogDetail] = useState(false);
  const [selectedRecruitmentWave, setSelectedRecruitmentWave] = useState(null);
  const [reload, setReload] = useState(false);
  const [idComment, setIdComment] = useState(null);
  const [openKanbanDialog, setOpenKanbanDialog] = useState(false);

  const [tabsState, setTabsState] = useState(3);
  const code = 'HrmRecruitmentWave';

  useEffect(
    () => {
      if (createRecruitmentWaveSuccess === true) {
        setReload(true);
        handleCloseRecruitmentWaveDialog();
      }
      if (!createRecruitmentWaveSuccess) {
        setReload(false);
      }
    },
    [createRecruitmentWaveSuccess],
  );
  useEffect(
    () => {
      if (createApplicantRecruitment === true) {
        setReload(true);
        handleCloseRecruitmentWaveDialog();
      }
      if (createApplicantRecruitment === false) {
        setReload(false);
      }
    },
    [createApplicantRecruitment],
  );
  useEffect(
    () => {
      if (createTestApplicantRecruitment === true) {
        setReload(true);
        handleCloseRecruitmentWaveDialog();
      }
      if (!createTestApplicantRecruitment) {
        setReload(false);
      }
    },
    [createTestApplicantRecruitment],
  );
  // useEffect(
  //   () => {
  //     if (createTestApplicantRecruitmentSuccess === true) {
  //       setReload(true);
  //       handleCloseRecruitmentWaveDialog();
  //     }
  //     if (!createTestApplicantRecruitmentSuccess) {
  //       setReload(false);
  //     }
  //   },
  //   [createTestApplicantRecruitmentSuccess],
  // );

  useEffect(
    () => {
      if (updateRecruitmentWaveSuccess === true) {
        setReload(true);
        handleCloseRecruitmentWaveDialog();
      }
      if (!updateRecruitmentWaveSuccess) {
        setReload(false);
      }
    },
    [updateRecruitmentWaveSuccess],
  );
  useEffect(
    () => {
      if (createRecruitmentWaveSuccess === true) {
        setReload(true);
        handleCloseRecruitmentWaveDialog();
      }
      if (!createRecruitmentWaveSuccess) {
        setReload(false);
      }
    },
    [createRecruitmentWaveSuccess],
  );

  // useEffect(
  //   () => {
  //     if (updateApplicantRecruitmentAgencySuccess === true) {
  //       setReload(true);
  //       handleCloseRecruitmentWaveDialog();
  //     }
  //     if (!updateApplicantRecruitmentAgencySuccess) {
  //       setReload(false);
  //     }

  //   },
  //   [updateApplicantRecruitmentAgencySuccess],
  // );

  useEffect(
    () => {
      if (deleteRecruitmentWaveSuccess === true) {
        setReload(true);
      }
      if (!deleteRecruitmentWaveSuccess) {
        setReload(false);
      }
    },
    [deleteRecruitmentWaveSuccess],
  );
  const handleSave = data => {

    const { _id: RecruitmentWaveId } = data;
    if (!RecruitmentWaveId) {
      onCreateRecruitmentWave(data);
    } else {
      onUpdateRecruitmentWave(RecruitmentWaveId, data);
    }
  };

  const handleOpenRecruitmentWaveDialog = () => {
    setSelectedRecruitmentWave(null);
    setOpenDialog(true);
  };

  const handleCloseRecruitmentWaveDialog = useCallback(() => {
    setOpenDialog(false);
    setOpenDialogDetail(false);
  }, []);

  const addItem = () => <Add onClick={handleOpenRecruitmentWaveDialog}>Open Menu</Add>;

  const handleCopyToClipBoard = item => {
    navigator.clipboard.writeText(`${APP_URL}/application_form/listwave?code=${item.code}`);
  };
  const addItemKanban = () => {
    setOpenDialog(true);
  };
  const handleDelete = data => onDeleteRecruitmentWave(hrmEmployeeId, data);
  const customFunction = items => {
    const newItem = items.map(it => (

      {
        ...it,
        unitId: it['unitId.name'],
        proponent: it['proponent.name'],
        certificate: it['certificate.title'],
        specialized: it['specialized.title'],
        age: it['age.title'],
        positionVacation: it.vacanciesName,
        levelLanguage: it['levelLanguage.title'],
        marriage: it['marriage.title'],
        hrmRecruitmentId: it['hrmRecruitmentId.name'],
        informatics: it['informatics.title'],
        link: (
          <>
            <Grid container>
              <Grid item xs={9}>
                <Typography style={{ color: '#2196f3', textDecoration: 'underline', cursor: 'pointer ' }} noWrap>
                  <a href={`${APP_URL}/application_form/listwave?code=${it.code}`} target="_blank">{`${APP_URL}/application_form/listwave?code=${it.code
                    }`}</a>
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <IconButton style={{ marginRight: 5 }} onClick={() => handleCopyToClipBoard(it)}>
                  <Tooltip title="Copy">
                    <FileCopy style={{ fontSize: 15 }} />
                  </Tooltip>
                </IconButton>
              </Grid>
            </Grid>
          </>
        ),
      }));
    return newItem;
  };
  const handleMeetingDialog = id => {
    console.log("jdfnjnv")
    // this.setState({ id, openKanbanDialog: true });
  };
  return (
    <>
      <Grid container>
        <Grid item md={12}>
          <Bt onClick={() => setTabsState(3)} color={tabsState === 3 ? 'gradient' : 'simple'}>
            Danh sách
          </Bt>
          {/* <Bt onClick={() => setTabsState(2)} color={tabsState === 2 ? 'gradient' : 'simple'}>
            Automationrule
          </Bt> */}
          <Bt onClick={() => setTabsState(1)} color={tabsState === 1 ? 'gradient' : 'simple'}>
            Kanban
          </Bt>
        </Grid>
      </Grid>
      {tabsState === 3 && (
        <div style={{ marginTop: '10px' }}>
          <Paper>
            <ListPage
              height="600px"
              exportExcel
              code={code}
              onEdit={row => {
                setSelectedRecruitmentWave(row);
                setOpenDialog(true);
              }}
              pointerCursor="pointer"
              onDelete={handleDelete}
              reload={reload}
              apiUrl={API_RECRUITMENT_WAVE}
              settingBar={[addItem()]}
              disableAdd
              customFunction={customFunction}
              status="hrmStatus"
              kanban="ST09"
              kanbanKey="_id"
            />
          </Paper>
        </div>
      )}
      {tabsState === 2 && <div>Chưa có thiết kế</div>}
      {tabsState === 1 ? (
        <Kanban module="hrmStatus" code="ST09" apiUrl={API_RECRUITMENT_WAVE} addItem={addItemKanban} itemComponent={
          (data) => ItemComponent(data, setOpenKanbanDialog, setIdComment)
        } reload={reload} />
      ) : null}
      <SwipeableDrawer anchor="right" onClose={handleCloseRecruitmentWaveDialog} open={openDialog}>
        <div style={{ marginTop: 60, width: props.miniActive ? window.innerWidth - 80 : window.innerWidth - 260 }}>
          <AddRecruitmentWave
            {...props}
            profile={props.profile}
            hrmEmployeeId={hrmEmployeeId}
            code={code}
            recruitmentWave={selectedRecruitmentWave}
            onSave={handleSave}
            onClose={handleCloseRecruitmentWaveDialog}
            onChangeSnackbar={onChangeSnackbar}
          />
        </div>
      </SwipeableDrawer>

      <Dialog dialogAction={false} onClose={() => {
        setOpenKanbanDialog(false)
        setIdComment(null)
      }} open={openKanbanDialog}>
        {
          openKanbanDialog && <DemoDialog profile={props.profile} taskId={idComment && idComment._id}
            //  data={this.state.dataTask} 
            data={{}}
          />
        }
      </Dialog>
    </>
  );
}
const ItemComponent = (data, setOpenKanbanDialog, setIdComment) => (
  <div
    style={{
      padding: '20px 5px',
      margin: '20px 5px',
      display: 'flex',
      justifyContent: 'flex-start',
      flexDirection: 'column',
      boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
    }}
  >
    <p className="kanban-planner">
      Nhu cầu tuyển dụng: <b> {data.name}</b>
    </p>
    <p className="kanban-planner">
      Vị trí tuyển dụng: <b />
    </p>
    <p className="kanban-planner">
      Số lượng: <b> {data.amount}</b>
    </p>
    <div className="footer-kanban-item">
      <button type="button" className="footer-kanban-item-time">
        <Notifications style={{ fontSize: '1rem' }} /> {new Date(data.createdAt).toLocaleDateString('vi-VN', { month: 'long', day: 'numeric' })}
      </button>
      <InsertCommentOutlined style={{ cursor: 'pointer' }} onClick={() => {
        console.log(data, 'bhdfbvhfdv')
        // handleOpenDialog(data)
        setOpenKanbanDialog(true)
        setIdComment(data)
        // handleMeetingDialog(data)
      }}

      />
    </div>
  </div>
);
const handleOpenDialog = data => {
  console.log("handleOpenDialog")
  setOpenKanbanDialog(true)
  setIdComment(data)
};
RecruitmentWavePage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  recruitmentWavePage: makeSelectRecruitmentWavePage(),
  miniActive: makeSelectMiniActive(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    mergeData: data => dispatch(mergeData(data)),
    onCreateRecruitmentWave: data => dispatch(createRecruitmentWave(data)),
    onUpdateRecruitmentWave: (hrmEmployeeId, data) => dispatch(updateRecruitmentWave(hrmEmployeeId, data)),
    onDeleteRecruitmentWave: (hrmEmployeeId, ids) => dispatch(deleteRecruitmentWave(hrmEmployeeId, ids)),
    onCreateRoundRecruitment: action => dispatch(createRoundRecruitment(action)),
    onUpdateRoundRecruitment: action => dispatch(updateRoundRecruitment(action)),
    onDeleteRoundRecruitment: action => dispatch(deleteRoundRecruitment(action)),
    onCreateSubjectRecruiment: action => dispatch(createSubjectRecruiment(action)),
    onUpdateSubjectRecruiment: action => dispatch(updateSubjectRecruiment(action)),
    onDeleteSubjectRecruiment: action => dispatch(deleteSubjectRecruiment(action)),
    onPostSwitchCandidate: action => dispatch(postSwitchCandidate(action)),
    onCreateApplicantRecruitment: action => dispatch(createApplicantRecruitment(action)),
    onCreateApplicantRecruitmentAgency: action => dispatch(createApplicantRecruitmentAgency(action)),
    onUpdateApplicantRecruitmentAgency: action => dispatch(updateApplicantRecruitmentAgency(action)),
    onDeleteApplicantRecruitmentAgency: id => dispatch(deleteApplicantRecruitmentAgency(id)),

    onUpdateApplicantRecruitment: action => dispatch(updateApplicantRecruitment(action)),
    onDeleteApplicantRecruitment: action => dispatch(deleteApplicantRecruitment(action)),
    onCreateTestApplicantRecruitment: action => dispatch(createTestApplicantRecruitment(action)),
    onUpdateTestApplicantRecruitment: (action, id) => dispatch(updateTestApplicantRecruitment(action, id)),
    onDeleteTestApplicantRecruitment: ids => dispatch(deleteTestApplicantRecruitment(ids)),
    getHumanResource: () => dispatch(getHumanResource()),
    onGetRoleGroup: () => dispatch(getRoleGroupAction()),
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'recruitmentWavePage', reducer });
const withSaga = injectSaga({ key: 'recruitmentWavePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(RecruitmentWavePage);

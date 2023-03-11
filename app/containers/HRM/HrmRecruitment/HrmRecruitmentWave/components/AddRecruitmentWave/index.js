/**
 *
 * AddRecruitmentWave
 *
 */

import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes, { func } from 'prop-types';
import { Info, Add, SwapHoriz, FileCopy } from '@material-ui/icons';
import { Grid, Typography, SwipeableDrawer } from '../../../../../../components/LifetekUi';
import CustomInputBase from '../../../../../../components/Input/CustomInputBase';
import CustomButton from '../../../../../../components/Button/CustomButton';
import CustomGroupInputField from '../../../../../../components/Input/CustomGroupInputField';
import Department from '../../../../../../components/Filter/DepartmentAndEmployee';
import { viewConfigName2Title, viewConfigCheckForm } from '../../../../../../utils/common';
import moment from 'moment';
import Buttons from 'components/CustomButtons/Button';
import { Helmet } from 'react-helmet';
import {
  API_HRM_RECRUIMENTWAVE,
  API_VANCANCIES,
  API_CANDIDATE,
  API_ADD_CANDIDATE,
  API_ROUND_EXAM,
  API_QUESTION,
  API_HRM_RECRUIT,
  API_CANDIDATE_LINK,
} from 'config/urlConfig';
import AddRecruitment from '../AddRecruitment';
import AddRecruit from '../AddRecruit';
import AddRoundRecruitment from '../AddRoundRecruitment';
import AddApplicantRecruitment from '../AddApplicantRecruitment';
import AddTestApplicantRecruitment from '../AddTestApplicantRecruitment';
import ListPage from 'components/List';
import SwicthCandidate from '../SwicthCandidate';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Tooltip } from '@material-ui/core';
import CustomAppBar from 'components/CustomAppBar';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import makeSelectDashboardPage, { makeSelectProfile, makeSelectMiniActive } from '../../../../../Dashboard/selectors';
import makeSelectAddRecruitmentWave from './selectors';
import { postSwitchCandidate, changeImage } from './actions';
import { APP_URL } from '../../../../../../config/urlConfig';

/* eslint-disable react/prefer-stateless-function */

function Bts(props) {
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

function AddRecruitmentWave(props) {
  const [tab, setTab] = useState(0);
  const [showBtn, setShowBtn] = useState(0);

  const [selectedRoundRecruitmentWave, setSelectedRoundRecruitmentWave] = useState(null);
  const [isOpenRoundRecruitmentWave, setIsOpenRoundRecruitmentWave] = useState(null);
  const [isOpenSwitchCandidate, setIsOpenSwitchCandidate] = useState(null);
  const [id, setId] = useState(null);
  const [nextRound, setNextRound] = useState(null);
  const [recruitmentWaveId, setRecruitmentWaveId] = useState(null);
  const [recruitmentWaveCode, setRecruitmentWaveCode] = useState(null);
  const [round, setRound] = useState([]);
  const [idRound, setIdRound] = useState([]);
  const [dataRound, setDataRound] = useState([]);
  const [localState, setLocalState] = useState(null);
  // const [localState]
  const [dataExam, setDataExam] = useState([]);
  const [dataEmployee, setDataEmployee] = useState(null);

  const [selectedApplicantRecruitmentWave, setSelectedApplicantRecruitmentWave] = useState(null);
  const [selectedTestApplicantRecruitmentWave, setSelectedTestApplicantRecruitmentWave] = useState(null);
  const [selectedTestApplicantRecruitmentAgency, setSelectedTestApplicantRecruitmentAgency] = useState(null);
  const [isOpenApplicantRecruitmentWave, setIsOpenApplicantRecruitmentWave] = useState(null);
  const [isOpenResult, setIsOpenResult] = useState(null);
  const [urlApi, setUrlApi] = useState(null);
  const [hrmEmployeeResultId, setHrmEmployeeResultId] = useState(null);
  const [isOpenApplicantRecruitmentAgency, setIsOpenApplicantRecruitmentAgency] = useState(null);
  const [tabsEmployee, setTabsEmployee] = useState(0);
  const [isOpenTestApplicantRecruitmentWave, setIsOpenTestApplicantRecruitmentWave] = useState(null);
  const [dataPage, setDataPage] = useState({
    type: null,
    id: null,
    listId: [],
    id_hrm: null,
  });
  const [position, setPosition] = useState(null);

  const {
    onClose,
    code,
    apiUrl,
    recruitmentWavePage,
    recruitmentWave,
    onCreateRoundRecruitment,
    onUpdateRoundRecruitment,
    onDeleteRoundRecruitment,
    onCreateSubjectRecruiment,
    onUpdateSubjectRecruiment,
    onDeleteSubjectRecruiment,
    onCreateApplicantRecruitment,
    onUpdateApplicantRecruitment,
    onDeleteApplicantRecruitment,
    onCreateTestApplicantRecruitment,
    onUpdateTestApplicantRecruitment,
    onDeleteTestApplicantRecruitment,
    onPostSwitchCandidate,
    onSwitchCandidate,
    onCreateApplicantRecruitmentAgency,
    onUpdateApplicantRecruitmentAgency,
    onDeleteApplicantRecruitmentAgency,
    addRecruitmentWave,
    dashboardPage,
    onChangeSnackbar,
  } = props;

  const {
    updateRoundSuccess,
    updateApplicantSuccess,
    postSwitchCandidateSuccess,
    createApplicantRecruitmentSuccess,
    createTestApplicantRecruitmentSuccess,
    createApplicantRecruitmentAgencySuccess,
    updateApplicantRecruitmentAgencySuccess,
    onDeleteTestApplicantRecruitmentSuccess,
  } = recruitmentWavePage;
  const getId = id => {
    setId(id);
  };
  const getRecruitmentWaveId = id => {
    setRecruitmentWaveId(id);
  };
  const getRecruitmentWaveCode = id => {
    setRecruitmentWaveCode(id);
  };
  const Bt = props => (
    <Buttons
      onClick={() => {
        setTab(props.tab);
        setNextRound(props.nextRound), setIdRound(props.idRound);
      }}
      {...props}
      color={props.tab === tab ? 'gradient' : 'simple'}
    >
      {props.children}
    </Buttons>
  );
  useEffect(
    () => {
      const api = `${API_VANCANCIES}/${id}`;
      if (api && id) {
        fetch(`${api}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            if (data && data.data && data.data.name) setPosition(data.data.name)
            else setPosition("")
            setRound(data.data.roundExams);
          }).catch(() => {
            setPosition("")
            setRound([])
          })
      }
      else {
        console.log("k có api")
        setPosition("")
        setRound([])
      }

    },
    [id],
  );

  useEffect(() => {
    const { recruitmentWave } = props;
    setRecruitmentWaveCode(recruitmentWave && recruitmentWave.code)
    setRecruitmentWaveId(recruitmentWave && recruitmentWave._id)
  }, [props])

  useEffect(
    () => {
      const api = `${API_VANCANCIES}/exams/${id}`;
      if (api && id)
        fetch(`${api}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            setDataExam(data.roundExams);
          });
    },
    [id],
  );
  useEffect(
    () => {
      setUrlApi(`${API_CANDIDATE_LINK}?roundExamId=${idRound}&recruitmentWaveId=${recruitmentWaveId}`);
    },
    [tab],
  );

  useEffect(
    () => {
      const api = `${API_ROUND_EXAM}/${idRound}`;
      if (api && id !== null && idRound !== undefined)
        fetch(`${api}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            setDataRound(data.data.exams);
          });
    },
    [idRound],
  );

  useEffect(
    () => {
      let score = 0;
      dataRound.forEach(item => {
        score += item.scored;
        return score;
      });
      setLocalState({ scores: score });
    },
    [dataRound],
  );

  useEffect(
    () => {
      setShowBtn(recruitmentWave && recruitmentWave.originItem);
    },
    [recruitmentWave],
  );

  useEffect(
    () => {
      setIsOpenRoundRecruitmentWave(false);
    },
    [updateRoundSuccess],
  );
  useEffect(
    () => {
      handleCloseDialog(false);
    },
    [postSwitchCandidateSuccess],
  );
  useEffect(
    () => {
      setIsOpenApplicantRecruitmentWave(false);
    },
    [createApplicantRecruitmentSuccess],
  );

  useEffect(
    () => {
      setIsOpenTestApplicantRecruitmentWave(false);
    },
    [createTestApplicantRecruitmentSuccess],
  );

  useEffect(
    () => {
      setIsOpenApplicantRecruitmentAgency(false);
    },
    [createApplicantRecruitmentAgencySuccess],
  );
  useEffect(
    () => {
      setIsOpenApplicantRecruitmentAgency(false);
    },
    [updateApplicantRecruitmentAgencySuccess],
  );

  const handleSaveRoundRecruitmentWave = e => {
    if (e._id) onUpdateRoundRecruitment(e);
    else onCreateRoundRecruitment(data);
  };
  const handleCloseDialog = () => {
    setIsOpenSwitchCandidate(false);
  };

  useEffect(
    () => {
      if (addRecruitmentWave.error === false) {
        setIsOpenSwitchCandidate(false);
        setTab(0);
        setDataPage({ ...dataPage, listId: [] });
        setTimeout(() => {
          setTab(4);
        }, 100);
      }
    },
    [addRecruitmentWave.error],
  );

  const handleOpenDialog = code => {
    setIsOpenSwitchCandidate(true);
    setDataPage({ ...dataPage, moduleCode: code });
    const { allTemplates } = dashboardPage;
    if (code) {
      const templatesItem = allTemplates ? allTemplates.filter(elm => elm.moduleCode === code) : null;
      setDataPage(dataPage => ({ ...dataPage, template: templatesItem }));
    }
  };
  // const handleOpenDialog = () => {
  //   setIsOpenDialog(true);
  //   setLocalState({});
  // };

  // const handleOpenDialogOnEdit = e => {
  //   setIsOpenDialog(true);
  //   setLocalState(e);
  // };
  const handleSaveApplicantRecruitmentWave = e => {
    const data = {
      ...e,
      recruitmentWave: recruitmentWaveCode,
      organizationUnit: '5f101eab3d3f3a09bbf319d9',
    };
    if (e._id) onUpdateApplicantRecruitment(e);
    else onCreateApplicantRecruitment(data);
  };
  const handleSaveApplicantRecruitmentAgency = e => {
    const data = {
      ...e,
      recruitmentWave: recruitmentWaveCode,
    };
    if (e._id) onUpdateApplicantRecruitmentAgency(e);
    else onCreateApplicantRecruitmentAgency(data);
  };
  const handleSaveTestApplicantRecruitmentWave = (local, data, id) => {
    if (local.employee === null) {
      onChangeSnackbar({ status: true, message: 'Không được để trống ứng viên', variant: 'error' });
    } else {
      const dataUpdate = {
        hrmEmployeeId: local.employee || dataPage.id_hrm,
        data: data,
        roundExamId: idRound,
        vacanciesId: id,
        recruitmentWaveId: recruitmentWaveId,
      };
      const dataUp = {
        ...dataUpdate,
        // recruitmentWave: recruitmentWaveCode,
        // organizationUnit: '5f101eab3d3f3a09bbf319d9',
      };
      if (dataPage.type === 'edit') onUpdateTestApplicantRecruitment(dataUpdate, id, dataPage.id_hrm);
      else onCreateTestApplicantRecruitment(dataUp);
    }
  };
  const handleSaveSwitchCandidate = e => {
    if (dataPage.listId.length === 0) {
      const data = e.scores
        ? {
          count: parseInt(e.count),
          scores: parseInt(e.scores),
          recruitmentWaveId: recruitmentWaveId,
          roundExamId: nextRound,
        }
        : {
          count: parseInt(e.count),
          recruitmentWaveId: recruitmentWaveId,
          roundExamId: nextRound,
        };

      onPostSwitchCandidate(data);
    } else {
      let data;
      if (dataPage.typeExams === 0) {
        data = {
          ids: dataPage.listId,
          recruitmentWaveId: recruitmentWaveId,
          roundExamId: nextRound,
          type: dataPage.typeExams,
        };
      } else {
        data = {
          ids: dataPage.listId,
          recruitmentWaveId: recruitmentWaveId,
          roundExamId: nextRound,
          meetingDate: dataPage.dateExams,
          inChargeUsers: Array.isArray(dataPage.inChargeUsers) ? dataPage.inChargeUsers.map(u => u._id) : [],
          address: dataPage.address,
          type: dataPage.typeExams,
          content: dataPage.template && dataPage.template[0] ? dataPage.template[0].content : '',
        };
      }
      onSwitchCandidate(data);
    }
  };

  function handleChangeSelect(e) {
    setDataPage({ ...dataPage, [e.target.name]: e.target.value });
  }

  function handleChangeDate(e) {
    setDataPage({ ...dataPage, dateExams: e });
  }

  function handleChangeInchargeUsers(inChargeUsers) {
    setDataPage({ ...dataPage, inChargeUsers });
  }
  const handleCopyToClipBoard = item => {
    navigator.clipboard.writeText(`${item.link}`);
  };

  function mapFunction(item) {
    return {
      ...item,
      link: (
        <>
          <Grid container>
            <Grid item xs={9}>
              <Typography style={{ color: '#2196f3', textDecoration: 'underline', cursor: 'pointer ' }} noWrap>
                <a href={`${item.link}`} target="_blank">{`${item.link}`}</a>
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <IconButton style={{ marginRight: 5 }} onClick={() => handleCopyToClipBoard(item)}>
                <Tooltip title="Copy">
                  <FileCopy style={{ fontSize: 15 }} />
                </Tooltip>
              </IconButton>
            </Grid>
          </Grid>
        </>
      ),
    };
  }
  const filterCanStart = {
    vacanciesId: id,
    recruitmentWaveId: recruitmentWaveId,
  };
  const filterCan = {
    // examId: null,
    // roundExamId: round.length > 0 ? round[0]._id : null,
    // vacanciesId: id,
    recruitmentWave: recruitmentWaveId,
  };
  const filterCan1 = {
    examId: null,
    roundExamId: round.length > 1 ? round[1]._id : null,
    vacanciesId: id,
    recruitmentWaveId: recruitmentWaveId,
  };
  const filterCan2 = {
    examId: null,
    roundExamId: round.length > 2 ? round[2]._id : null,
    vacanciesId: id,
    recruitmentWaveId: recruitmentWaveId,
  };
  // const handleSave = data => {
  //   console.log(data);
  // };
  const handleAddEmployee = () => {
    if (dataEmployee && dataEmployee._id) {
      props.history.push(`/hrm/personnel/${dataEmployee._id}`);
    }
    // props.history.newData = dataEmployee;
    // const handleSave = data => {
    //   console.log(data);
    // };
  };
  const getSelection = e => {
    setDataEmployee(e[0]);
  };

  const handleDelete = id => {
    onDeleteApplicantRecruitmentAgency(id);
  };
  const onDeleteTestApp = ids => {
    onDeleteTestApplicantRecruitment(ids);
  };

  function handleGetDataPicker(e) {
    let ids = [];
    let name = [];
    e.forEach(element => {
      ids.push(element._id);
      name.push(element.name);
    });
    setDataPage({ ...dataPage, listId: ids, name: name });
  }

  function hanldeSelecteCandidate(e) {
    let ids = [];
    let name = [];
    e.forEach(element => {
      ids.push(element['hrmEmployeeId._id']);
      name.push(element['hrmEmployeeId.name']);
    });
    setDataPage({ ...dataPage, listId: ids, name: name });
  }
  return (
    <>
      <Grid item xs={12} container style={{ maxHeight: 'calc(100vh - 80px)', overflow: 'auto', marginTop: 70 }}>
        <Grid container>
          <Bt tab={0} style={{ marginLeft: 30 }}>
            Thông tin chung
          </Bt>
          {showBtn && (
            <Bt tab={100} style={{ marginLeft: 30 }}>
              Đăng tuyển
            </Bt>
          )}
          {showBtn && (
            <Bt tab={4} nextRound={round[0] ? round[0]._id : null}>
              Danh sách ứng viên
            </Bt>
          )}
          {round.length > 0
            ? round.map((item, index) => {
              return (
                <>
                  {
                    <Bt tab={index + 5} nextRound={round[index + 1] ? round[index + 1]._id : null} idRound={round[index]._id}>
                      {item.name}
                    </Bt>
                  }
                </>
              );
            })
            : null}
          {showBtn && <Bt tab={3}>Kết quả thi tuyển</Bt>}
        </Grid>
        {tab === 0 && (
          <AddRecruitment {...props} getId={getId} getRecruitmentWaveId={getRecruitmentWaveId} getRecruitmentWaveCode={getRecruitmentWaveCode} position={position} />
        )}

        {tab === 1 && (
          <>
            <CustomAppBar title={'Thiết lập phòng thi'} onGoBack={e => onClose()} disableAdd className isTask />
            <ListPage
              apiUrl={`${API_CANDIDATE}`}
              code={code}
              parentCode="hrm"
              onEdit={row => {
                setSelectedRoundRecruitmentWave(row);
                setIsOpenRoundRecruitmentWave(true);
              }}
              onDelete={row => onDelete(row)}
              reload={updateRoundSuccess}
              settingBar={[
                <Add
                  style={{ color: 'white' }}
                  onClick={() => {
                    setIsOpenRoundRecruitmentWave(true);
                    setSelectedRoundRecruitmentWave({});
                  }}
                >
                  Open Menu
                </Add>,
              ]}
              disableAdd
            />

            <Dialog maxWidth={'lg'} fullwidth open={isOpenRoundRecruitmentWave} onClose={() => setIsOpenRoundRecruitmentWave(false)}>
              <DialogTitle>THIẾT LẬP VÒNG THI</DialogTitle>
              <DialogContent>
                <AddRoundRecruitment
                  {...props}
                  selectedData={selectedRoundRecruitmentWave}
                  onClose={() => setIsOpenRoundRecruitmentWave(false)}
                  onSave={handleSaveRoundRecruitmentWave}
                />
              </DialogContent>
            </Dialog>
          </>
        )}

        {tab === 4 && (
          <>
            {/* {console.log(111111, props)} */}
            <CustomAppBar title={'Danh sách ứng viên ban đầu'} onGoBack={e => onClose()} disableAdd className isTask />
            <ListPage
              apiUrl={`${API_CANDIDATE}?recruitmentWaveCode=${recruitmentWaveCode}&noExam=true`}
              code="HrmCandidate"
              // filterCan={filterCanStart}
              filterQuery
              noFilter
              parentCode="hrm"
              onEdit={row => {
                setIsOpenApplicantRecruitmentWave(true);
                setDataPage({
                  ...dataPage,
                  type: 'edit',
                  id_hrm: row && row.originItem && row.originItem.hrmEmployeeId && row.originItem.hrmEmployeeId._id,
                  id: row && row.originItem && row.originItem._id,
                  recruitmentWaveId: recruitmentWaveId,
                  roundExamId: nextRound,
                });
                // handleOpenDialogOnEdit()
              }}
              onDelete={row => onDelete(row)}
              reload={createApplicantRecruitmentSuccess}
              onSelectCustomers={e => handleGetDataPicker(e)}
              settingBar={
                dataPage.listId.length !== 0
                  ? [
                    <Tooltip title="Chuyển ứng viên">
                      <SwapHoriz onClick={() => handleOpenDialog('HrmCandidateLink')} />
                    </Tooltip>,
                    <Tooltip title="Thêm mới">
                      <Add
                        onClick={() => {
                          setIsOpenApplicantRecruitmentWave(true);
                          setDataPage({ ...dataPage, type: 'add' });
                        }}
                      />
                    </Tooltip>,
                  ]
                  : [
                    <Tooltip title="Thêm mới">
                      <Add
                        onClick={() => {
                          setIsOpenApplicantRecruitmentWave(true);
                          setDataPage({ ...dataPage, type: 'add' });
                        }}
                      />
                    </Tooltip>,
                  ]
              }
              disableAdd
            />

            <SwipeableDrawer
              anchor="right"
              onClose={() => setIsOpenApplicantRecruitmentWave(false)}
              open={isOpenApplicantRecruitmentWave}
              // style={{ width: '100vh  - 20px' }}
              width={window.innerWidth - 260}
            >
              <div style={{ width: 'calc(100vw - 260px)' }}>
                <AddApplicantRecruitment
                  {...props}
                  handleChangeImage={props.changeImage}
                  code={'HrmCandidate'}
                  module={recruitmentWaveCode}
                  recruitmentWaveCode={recruitmentWaveCode}
                  dataPage={dataPage}
                  isOpenApplicantRecruitmentWave={isOpenApplicantRecruitmentWave}
                  selectedData={selectedApplicantRecruitmentWave}
                  onClose={() => setIsOpenApplicantRecruitmentWave(false)}
                  onSave={handleSaveApplicantRecruitmentWave}
                />
              </div>
            </SwipeableDrawer>
            <Dialog fullWidth maxWidth={'md'} open={isOpenSwitchCandidate} onClose={handleCloseDialog}>
              {dataPage.listId.length === 0 ? (
                <DialogTitle>Chuyển ứng viên sang vòng sau</DialogTitle>
              ) : (
                <DialogTitle>{`Bạn có chắc muốn gửi ${dataPage.listId.length} ứng viên sang vòng sau`}</DialogTitle>
              )}
              <DialogContent>
                <SwicthCandidate
                  onSave={handleSaveSwitchCandidate}
                  disableScores
                  ids={dataPage.listId}
                  nextRound={nextRound}
                  typeExams={dataPage.typeExams}
                  idTemplate={dataPage.idTemplate}
                  address={dataPage.address}
                  dateExams={dataPage.dateExams}
                  onClose={handleCloseDialog}
                  onChangeSelect={e => handleChangeSelect(e)}
                  onChangeDate={e => handleChangeDate(e)}
                  handleChangeInchargeUsers={handleChangeInchargeUsers}
                  template={dataPage.template}
                />
              </DialogContent>
            </Dialog>
          </>
        )}
        {tab === 5 ? (
          <>
            <CustomAppBar title={`VÒng ${tab - 4}`} onGoBack={e => onClose()} disableAdd className isTask />
            <ListPage
              apiUrl={urlApi}
              code={'HrmCandidateLink'}
              // filterCan={filterCan}
              filterQuery
              // disableEdit
              onEdit={row => {
                setIsOpenTestApplicantRecruitmentWave(true);
                // handleOpenDialogOnEdit()
                console.log(row, 'rowrow');
                setDataPage({ ...dataPage, type: 'edit', id: row.originItem._id, id_hrm: row.originItem.hrmEmployeeId._id, });
              }}
              onSelectCustomers={e => hanldeSelecteCandidate(e)}
              onDelete={onDeleteTestApp}
              reload={createTestApplicantRecruitmentSuccess}
              mapFunction={mapFunction}
              settingBar={
                tab === (round.length + 4) ? [
                  <Tooltip title="Thêm mới">
                    <Add
                      onClick={() => {
                        setIsOpenTestApplicantRecruitmentWave(true);
                        setDataPage({ ...dataPage, type: 'add' });
                      }}
                    />
                  </Tooltip>
                ] :
                  [
                    <Tooltip title="Chuyển ứng viên">
                      <SwapHoriz onClick={() => handleOpenDialog('HrmCandidateLink')} />
                    </Tooltip>,
                    <Tooltip title="Thêm mới">
                      <Add
                        onClick={() => {
                          setIsOpenTestApplicantRecruitmentWave(true);
                          setDataPage({ ...dataPage, type: 'add' });
                        }}
                      />
                    </Tooltip>,
                  ]}
              disableAdd
            />
            <SwipeableDrawer
              id={id}
              anchor="right"
              onClose={() => setIsOpenTestApplicantRecruitmentWave(false)}
              open={isOpenTestApplicantRecruitmentWave}
              // style={{ width: '100vh  - 20px' }}
              width={window.innerWidth - 260}
            >
              <div style={{ width: 'calc(100vw - 260px)' }}>
                <AddTestApplicantRecruitment
                  dataExam={dataExam}
                  tab={tab}
                  module={recruitmentWaveCode}
                  dataPage={dataPage}
                  {...props}
                  // onSave={handleSave}
                  isOpenTestApplicantRecruitmentWave={isOpenTestApplicantRecruitmentWave}
                  selectedData={selectedTestApplicantRecruitmentWave}
                  onClose={() => setIsOpenTestApplicantRecruitmentWave(false)}
                  onSave={handleSaveTestApplicantRecruitmentWave}
                  recruitmentWaveId={recruitmentWaveId}
                  idRound={idRound}
                />
              </div>
            </SwipeableDrawer>
            <Dialog fullWidth maxWidth={'md'} open={isOpenSwitchCandidate} onClose={handleCloseDialog}>
              <DialogTitle>Chuyển ứng viên sang vòng sau</DialogTitle>
              <DialogContent>
                <SwicthCandidate
                  onSave={handleSaveSwitchCandidate}
                  ids={dataPage.listId}
                  nextRound={nextRound}
                  typeExams={dataPage.typeExams}
                  idTemplete={dataPage.idTemplete}
                  address={dataPage.address}
                  dateExams={dataPage.dateExams}
                  inChargeUsers={dataPage.inChargeUsers}
                  onClose={handleCloseDialog}
                  onChangeSelect={e => handleChangeSelect(e)}
                  onChangeDate={e => handleChangeDate(e)}
                  template={dataPage.template}
                />
              </DialogContent>
            </Dialog>
          </>
        ) : null}
        {tab === 6 ? (
          <>
            <CustomAppBar title={`VÒng ${tab - 4}`} onGoBack={e => onClose()} disableAdd className isTask />
            <ListPage
              apiUrl={urlApi}
              code={'HrmCandidateLink'}
              // filterCan={filterCan}
              filterQuery
              // disableEdit
              onEdit={row => {
                setIsOpenTestApplicantRecruitmentWave(true);
                // handleOpenDialogOnEdit()
                setDataPage({ ...dataPage, type: 'edit', id: row.originItem._id, id_hrm: row.originItem.hrmEmployeeId._id, });
              }}
              onSelectCustomers={e => hanldeSelecteCandidate(e)}
              onDelete={onDeleteTestApp}
              reload={createTestApplicantRecruitmentSuccess}
              mapFunction={mapFunction}
              settingBar={
                tab === (round.length + 4) ? [
                  <Tooltip title="Thêm mới">
                    <Add
                      onClick={() => {
                        setIsOpenTestApplicantRecruitmentWave(true);
                        setDataPage({ ...dataPage, type: 'add' });
                      }}
                    />
                  </Tooltip>
                ] : [
                  <Tooltip title="Chuyển ứng viên">
                    <SwapHoriz onClick={() => handleOpenDialog('HrmCandidateLink')} />
                  </Tooltip>,
                  <Tooltip title="Thêm mới">
                    <Add
                      onClick={() => {
                        setIsOpenTestApplicantRecruitmentWave(true);
                        setDataPage({ ...dataPage, type: 'add' });
                      }}
                    />
                  </Tooltip>,
                ]}
              disableAdd
            />
            <SwipeableDrawer
              id={id}
              anchor="right"
              onClose={() => setIsOpenTestApplicantRecruitmentWave(false)}
              open={isOpenTestApplicantRecruitmentWave}
              // style={{ width: '100vh  - 20px' }}
              width={window.innerWidth - 260}
            >
              <div style={{ width: 'calc(100vw - 260px)' }}>
                <AddTestApplicantRecruitment
                  dataExam={dataExam}
                  module={recruitmentWaveCode}
                  dataPage={dataPage}
                  tab={tab}
                  {...props}
                  // onSave={handleSave}
                  isOpenTestApplicantRecruitmentWave={isOpenTestApplicantRecruitmentWave}
                  selectedData={selectedTestApplicantRecruitmentWave}
                  onClose={() => setIsOpenTestApplicantRecruitmentWave(false)}
                  onSave={handleSaveTestApplicantRecruitmentWave}
                  recruitmentWaveId={recruitmentWaveId}
                  idRound={idRound}
                />
              </div>
            </SwipeableDrawer>
            <Dialog fullWidth maxWidth={'md'} open={isOpenSwitchCandidate} onClose={handleCloseDialog}>
              <DialogTitle>Chuyển ứng viên sang vòng sau</DialogTitle>
              <DialogContent>
                <SwicthCandidate
                  onSave={handleSaveSwitchCandidate}
                  ids={dataPage.listId}
                  nextRound={nextRound}
                  typeExams={dataPage.typeExams}
                  idTemplete={dataPage.idTemplete}
                  address={dataPage.address}
                  dateExams={dataPage.dateExams}
                  inChargeUsers={dataPage.inChargeUsers}
                  onClose={handleCloseDialog}
                  onChangeSelect={e => handleChangeSelect(e)}
                  onChangeDate={e => handleChangeDate(e)}
                  template={dataPage.template}
                />
              </DialogContent>
            </Dialog>
          </>
        ) : null}
        {tab === 7 ? (
          <>
            <CustomAppBar title={`VÒng ${tab - 4}`} onGoBack={e => onClose()} disableAdd className isTask />
            <ListPage
              apiUrl={urlApi}
              code={'HrmCandidateLink'}
              // filterCan={filterCan}
              filterQuery
              // disableEdit
              onEdit={row => {
                setIsOpenTestApplicantRecruitmentWave(true);
                // handleOpenDialogOnEdit()
                setDataPage({ ...dataPage, type: 'edit', id: row.originItem._id, id_hrm: row.originItem.hrmEmployeeId._id, });
              }}
              onSelectCustomers={e => hanldeSelecteCandidate(e)}
              onDelete={onDeleteTestApp}
              reload={createTestApplicantRecruitmentSuccess}
              mapFunction={mapFunction}
              settingBar={
                tab === (round.length + 4) ? [
                  <Tooltip title="Thêm mới">
                    <Add
                      onClick={() => {
                        setIsOpenTestApplicantRecruitmentWave(true);
                        setDataPage({ ...dataPage, type: 'add' });
                      }}
                    />
                  </Tooltip>
                ] : [
                  <Tooltip title="Chuyển ứng viên">
                    <SwapHoriz onClick={() => handleOpenDialog('HrmCandidateLink')} />
                  </Tooltip>,
                  <Tooltip title="Thêm mới">
                    <Add
                      onClick={() => {
                        setIsOpenTestApplicantRecruitmentWave(true);
                        setDataPage({ ...dataPage, type: 'add' });
                      }}
                    />
                  </Tooltip>,
                ]}
              disableAdd
            />
            <SwipeableDrawer
              id={id}
              anchor="right"
              onClose={() => setIsOpenTestApplicantRecruitmentWave(false)}
              open={isOpenTestApplicantRecruitmentWave}
              // style={{ width: '100vh  - 20px' }}
              width={window.innerWidth - 260}
            >
              <div style={{ width: 'calc(100vw - 260px)' }}>
                <AddTestApplicantRecruitment
                  dataExam={dataExam}
                  tab={tab}
                  module={recruitmentWaveCode}
                  dataPage={dataPage}
                  {...props}
                  // onSave={handleSave}
                  isOpenTestApplicantRecruitmentWave={isOpenTestApplicantRecruitmentWave}
                  selectedData={selectedTestApplicantRecruitmentWave}
                  onClose={() => setIsOpenTestApplicantRecruitmentWave(false)}
                  onSave={handleSaveTestApplicantRecruitmentWave}
                  recruitmentWaveId={recruitmentWaveId}
                  idRound={idRound}
                />
              </div>
            </SwipeableDrawer>
            <Dialog fullWidth maxWidth={'md'} open={isOpenSwitchCandidate} onClose={handleCloseDialog}>
              <DialogTitle>Chuyển ứng viên sang vòng sau</DialogTitle>
              <DialogContent>
                <SwicthCandidate
                  onSave={handleSaveSwitchCandidate}
                  ids={dataPage.listId}
                  nextRound={nextRound}
                  typeExams={dataPage.typeExams}
                  idTemplete={dataPage.idTemplete}
                  address={dataPage.address}
                  dateExams={dataPage.dateExams}
                  inChargeUsers={dataPage.inChargeUsers}
                  onClose={handleCloseDialog}
                  onChangeSelect={e => handleChangeSelect(e)}
                  onChangeDate={e => handleChangeDate(e)}
                  template={dataPage.template}
                />
              </DialogContent>
            </Dialog>
          </>
        ) : null}
        {tab === 8 ? (
          <>
            <CustomAppBar title={`VÒng ${tab - 4}`} onGoBack={e => onClose()} disableAdd className isTask />
            <ListPage
              apiUrl={urlApi}
              code={'HrmCandidateLink'}
              // filterCan={filterCan}
              filterQuery
              // disableEdit
              onEdit={row => {
                setIsOpenTestApplicantRecruitmentWave(true);
                // handleOpenDialogOnEdit()
                setDataPage({ ...dataPage, type: 'edit', id: row.originItem._id, id_hrm: row.originItem.hrmEmployeeId._id, });
              }}
              onSelectCustomers={e => hanldeSelecteCandidate(e)}
              onDelete={onDeleteTestApp}
              reload={createTestApplicantRecruitmentSuccess}
              mapFunction={mapFunction}
              settingBar={
                tab === (round.length + 4) ? [
                  <Tooltip title="Thêm mới">
                    <Add
                      onClick={() => {
                        setIsOpenTestApplicantRecruitmentWave(true);
                        setDataPage({ ...dataPage, type: 'add' });
                      }}
                    />
                  </Tooltip>
                ] : [
                  <Tooltip title="Chuyển ứng viên">
                    <SwapHoriz onClick={() => handleOpenDialog('HrmCandidateLink')} />
                  </Tooltip>,
                  <Tooltip title="Thêm mới">
                    <Add
                      onClick={() => {
                        setIsOpenTestApplicantRecruitmentWave(true);
                        setDataPage({ ...dataPage, type: 'add' });
                      }}
                    />
                  </Tooltip>,
                ]}
              disableAdd
            />
            <SwipeableDrawer
              id={id}
              anchor="right"
              onClose={() => setIsOpenTestApplicantRecruitmentWave(false)}
              open={isOpenTestApplicantRecruitmentWave}
              // style={{ width: '100vh  - 20px' }}
              width={window.innerWidth - 260}
            >
              <div style={{ width: 'calc(100vw - 260px)' }}>
                <AddTestApplicantRecruitment
                  dataExam={dataExam}
                  module={recruitmentWaveCode}
                  dataPage={dataPage}
                  {...props}
                  tab={tab}
                  // onSave={handleSave}
                  isOpenTestApplicantRecruitmentWave={isOpenTestApplicantRecruitmentWave}
                  selectedData={selectedTestApplicantRecruitmentWave}
                  onClose={() => setIsOpenTestApplicantRecruitmentWave(false)}
                  onSave={handleSaveTestApplicantRecruitmentWave}
                  recruitmentWaveId={recruitmentWaveId}
                  idRound={idRound}
                />
              </div>
            </SwipeableDrawer>
            <Dialog fullWidth maxWidth={'md'} open={isOpenSwitchCandidate} onClose={handleCloseDialog}>
              <DialogTitle>Chuyển ứng viên sang vòng sau</DialogTitle>
              <DialogContent>
                <SwicthCandidate
                  onSave={handleSaveSwitchCandidate}
                  ids={dataPage.listId}
                  nextRound={nextRound}
                  typeExams={dataPage.typeExams}
                  idTemplete={dataPage.idTemplete}
                  address={dataPage.address}
                  dateExams={dataPage.dateExams}
                  inChargeUsers={dataPage.inChargeUsers}
                  onClose={handleCloseDialog}
                  onChangeSelect={e => handleChangeSelect(e)}
                  onChangeDate={e => handleChangeDate(e)}
                  template={dataPage.template}
                />
              </DialogContent>
            </Dialog>
          </>
        ) : null}
        {tab === 9 ? (
          <>
            <CustomAppBar title={`VÒng ${tab - 4}`} onGoBack={e => onClose()} disableAdd className isTask />
            <ListPage
              apiUrl={urlApi}
              code={'HrmCandidateLink'}
              // filterCan={filterCan}
              filterQuery
              // disableEdit
              onEdit={row => {
                setIsOpenTestApplicantRecruitmentWave(true);
                // handleOpenDialogOnEdit()
                setDataPage({ ...dataPage, type: 'edit', id: row.originItem._id, id_hrm: row.originItem.hrmEmployeeId._id, });
              }}
              onSelectCustomers={e => hanldeSelecteCandidate(e)}
              onDelete={onDeleteTestApp}
              reload={createTestApplicantRecruitmentSuccess}
              mapFunction={mapFunction}
              settingBar={
                tab === (round.length + 4) ? [
                  <Tooltip title="Thêm mới">
                    <Add
                      onClick={() => {
                        setIsOpenTestApplicantRecruitmentWave(true);
                        setDataPage({ ...dataPage, type: 'add' });
                      }}
                    />
                  </Tooltip>
                ] : [
                  <Tooltip title="Chuyển ứng viên">
                    <SwapHoriz onClick={() => handleOpenDialog('HrmCandidateLink')} />
                  </Tooltip>,
                  <Tooltip title="Thêm mới">
                    <Add
                      onClick={() => {
                        setIsOpenTestApplicantRecruitmentWave(true);
                        setDataPage({ ...dataPage, type: 'add' });
                      }}
                    />
                  </Tooltip>,
                ]}
              disableAdd
            />
            <SwipeableDrawer
              id={id}
              anchor="right"
              onClose={() => setIsOpenTestApplicantRecruitmentWave(false)}
              open={isOpenTestApplicantRecruitmentWave}
              // style={{ width: '100vh  - 20px' }}
              width={window.innerWidth - 260}
            >
              <div style={{ width: 'calc(100vw - 260px)' }}>
                <AddTestApplicantRecruitment
                  dataExam={dataExam}
                  module={recruitmentWaveCode}
                  dataPage={dataPage}
                  {...props}
                  tab={tab}
                  // onSave={handleSave}
                  isOpenTestApplicantRecruitmentWave={isOpenTestApplicantRecruitmentWave}
                  selectedData={selectedTestApplicantRecruitmentWave}
                  onClose={() => setIsOpenTestApplicantRecruitmentWave(false)}
                  onSave={handleSaveTestApplicantRecruitmentWave}
                  recruitmentWaveId={recruitmentWaveId}
                  idRound={idRound}
                />
              </div>
            </SwipeableDrawer>
            <Dialog fullWidth maxWidth={'md'} open={isOpenSwitchCandidate} onClose={handleCloseDialog}>
              <DialogTitle>Chuyển ứng viên sang vòng sau</DialogTitle>
              <DialogContent>
                <SwicthCandidate
                  onSave={handleSaveSwitchCandidate}
                  ids={dataPage.listId}
                  nextRound={nextRound}
                  typeExams={dataPage.typeExams}
                  idTemplete={dataPage.idTemplete}
                  address={dataPage.address}
                  dateExams={dataPage.dateExams}
                  inChargeUsers={dataPage.inChargeUsers}
                  onClose={handleCloseDialog}
                  onChangeSelect={e => handleChangeSelect(e)}
                  onChangeDate={e => handleChangeDate(e)}
                  template={dataPage.template}
                />
              </DialogContent>
            </Dialog>
          </>
        ) : null}
        {tab === 10 ? (
          <>
            <CustomAppBar title={`VÒng ${tab - 4}`} onGoBack={e => onClose()} disableAdd className isTask />
            <ListPage
              apiUrl={urlApi}
              code={'HrmCandidateLink'}
              // filterCan={filterCan}
              filterQuery
              // disableEdit
              onEdit={row => {
                setIsOpenTestApplicantRecruitmentWave(true);
                // handleOpenDialogOnEdit()
                setDataPage({ ...dataPage, type: 'edit', id: row.originItem._id, id_hrm: row.originItem.hrmEmployeeId._id, });
              }}
              onSelectCustomers={e => hanldeSelecteCandidate(e)}
              onDelete={onDeleteTestApp}
              reload={createTestApplicantRecruitmentSuccess}
              mapFunction={mapFunction}
              settingBar={
                tab === (round.length + 4) ? [
                  <Tooltip title="Thêm mới">
                    <Add
                      onClick={() => {
                        setIsOpenTestApplicantRecruitmentWave(true);
                        setDataPage({ ...dataPage, type: 'add' });
                      }}
                    />
                  </Tooltip>
                ] : [
                  <Tooltip title="Chuyển ứng viên">
                    <SwapHoriz onClick={() => handleOpenDialog('HrmCandidateLink')} />
                  </Tooltip>,
                  <Tooltip title="Thêm mới">
                    <Add
                      onClick={() => {
                        setIsOpenTestApplicantRecruitmentWave(true);
                        setDataPage({ ...dataPage, type: 'add' });
                      }}
                    />
                  </Tooltip>,
                ]}
              disableAdd
            />
            <SwipeableDrawer
              id={id}
              anchor="right"
              onClose={() => setIsOpenTestApplicantRecruitmentWave(false)}
              open={isOpenTestApplicantRecruitmentWave}
              // style={{ width: '100vh  - 20px' }}
              width={window.innerWidth - 260}
            >
              <div style={{ width: 'calc(100vw - 260px)' }}>
                <AddTestApplicantRecruitment
                  dataExam={dataExam}
                  module={recruitmentWaveCode}
                  dataPage={dataPage}
                  {...props}
                  tab={tab}
                  // onSave={handleSave}
                  isOpenTestApplicantRecruitmentWave={isOpenTestApplicantRecruitmentWave}
                  selectedData={selectedTestApplicantRecruitmentWave}
                  onClose={() => setIsOpenTestApplicantRecruitmentWave(false)}
                  onSave={handleSaveTestApplicantRecruitmentWave}
                  recruitmentWaveId={recruitmentWaveId}
                  idRound={idRound}
                />
              </div>
            </SwipeableDrawer>
            <Dialog fullWidth maxWidth={'md'} open={isOpenSwitchCandidate} onClose={handleCloseDialog}>
              <DialogTitle>Chuyển ứng viên sang vòng sau</DialogTitle>
              <DialogContent>
                <SwicthCandidate
                  onSave={handleSaveSwitchCandidate}
                  ids={dataPage.listId}
                  nextRound={nextRound}
                  typeExams={dataPage.typeExams}
                  idTemplete={dataPage.idTemplete}
                  address={dataPage.address}
                  dateExams={dataPage.dateExams}
                  inChargeUsers={dataPage.inChargeUsers}
                  onClose={handleCloseDialog}
                  onChangeSelect={e => handleChangeSelect(e)}
                  onChangeDate={e => handleChangeDate(e)}
                  template={dataPage.template}
                />
              </DialogContent>
            </Dialog>
          </>
        ) : null}
        {tab === 2 && (
          <>
            <CustomAppBar title={'Ứng viên'} onGoBack={e => onClose()} disableAdd className isTask />
            <ListPage
              code={code}
              parentCode="hrm"
              onEdit={row => {
                setIsOpenApplicantRecruitmentWave(true);
              }}
              onDelete={row => onDelete(row)}
              reload={updateApplicantSuccess}
              apiUrl={apiUrl}
              settingBar={[
                <Add style={{ color: 'white' }} onClick={() => setIsOpenApplicantRecruitmentWave(true)}>
                  Open Menu
                </Add>,
              ]}
              disableAdd
            />
            <SwipeableDrawer
              anchor="right"
              onClose={() => setIsOpenApplicantRecruitmentWave(false)}
              open={isOpenApplicantRecruitmentWave}
              style={{ width: '100vh  - 20px' }}
              width={window.innerWidth - 260}
            >
              <AddApplicantRecruitment
                {...props}
                isOpenApplicantRecruitmentWave={isOpenApplicantRecruitmentWave}
                selectedData={selectedApplicantRecruitmentWave}
                onClose={() => setIsOpenApplicantRecruitmentWave(false)}
                onSave={handleSaveApplicantRecruitmentWave}
              />
            </SwipeableDrawer>
          </>
        )}
        {tab === 3 && (
          <>
            <CustomAppBar title={'Kết quả thi tuyển'} onGoBack={e => onClose()} disableAdd className isTask />
            <ListPage
              apiUrl={`${API_CANDIDATE}?recruitmentWaveCode=${recruitmentWaveCode}`}
              apiExport={API_ADD_CANDIDATE}
              code="HrmCandidate"
              // filterCan={filterCanStart}
              filterQuery
              parentCode="hrm"
              onEdit={row => {
                setIsOpenResult(true);
                setHrmEmployeeResultId(row._id);
              }}
              filter={{ status: 2 }}
              exportExcel
              onSelectCustomers={e => getSelection(e)}
              selectMultiple={false}
              mapFunction={item => {
                const roundExams = item.originItem && item.originItem.roundExams && item.originItem.roundExams.length && item.originItem.roundExams[item.originItem.roundExams.length - 1] || {}
                console.log()
                return {
                  ...item,
                  name: (
                    <button
                      style={{ color: '#0b99e0', cursor: 'pointer' }}
                      onClick={() => {
                        setIsOpenApplicantRecruitmentWave(true);
                        setDataPage({ ...dataPage, type: 'edit', id: item.originItem._id, typePage: 'result', id_hrm: row.originItem.hrmEmployeeId._id, });
                      }}
                    >
                      {item.name}
                    </button>
                  ),
                  roundExams: roundExams.roundName

                };
              }}
              onDelete={row => onDelete(row)}
              reload={createApplicantRecruitmentSuccess}
              changeEmployee={[
                <Tooltip title="Chuyển thành nhân viên">
                  <SwapHoriz onClick={handleAddEmployee} />
                </Tooltip>,
                // <Tooltip title="Thêm mới">
                //   <Add
                //     style={{ color: 'white' }}
                //     onClick={() => {
                //       setIsOpenApplicantRecruitmentWave(true);
                //       setDataPage({ ...dataPage, type: 'add' });
                //     }}
                //   />
                // </Tooltip>,
              ]}
              disableAdd
            />
            <SwipeableDrawer
              anchor="right"
              onClose={() => setIsOpenApplicantRecruitmentWave(false)}
              open={isOpenApplicantRecruitmentWave}
              // style={{ width: '100vh  - 20px' }}
              width={window.innerWidth - 260}
            >
              <div style={{ width: 'calc(100vw - 260px)' }}>
                <AddApplicantRecruitment
                  {...props}
                  module={recruitmentWaveCode}
                  dataPage={dataPage}
                  isOpenApplicantRecruitmentWave={isOpenApplicantRecruitmentWave}
                  selectedData={selectedApplicantRecruitmentWave}
                  onClose={() => setIsOpenApplicantRecruitmentWave(false)}
                  onSave={handleSaveApplicantRecruitmentWave}
                />
              </div>
            </SwipeableDrawer>
            <SwipeableDrawer
              anchor="right"
              onClose={() => {
                setIsOpenResult(false);
                setHrmEmployeeResultId(null);
              }}
              open={isOpenResult}
              width={window.innerWidth - 260}
            >
              <div style={{ width: 'calc(100vw - 260px)' }}>
                <ListPage
                  apiUrl={`${API_CANDIDATE_LINK}?recruitmentWaveId=${recruitmentWaveId}&candidateId=${hrmEmployeeResultId}`}
                  code={'HrmCandidateLink'}
                  filterQuery
                  onEdit={row => {
                    setIsOpenTestApplicantRecruitmentWave(true);
                    setDataPage({ ...dataPage, type: 'edit', id: row.originItem && row.originItem._id, id_hrm: row.originItem.hrmEmployeeId._id, });
                  }}
                  onSelectCustomers={e => hanldeSelecteCandidate(e)}
                  onDelete={row => onDelete(row)}
                  reload={createTestApplicantRecruitmentSuccess}
                  mapFunction={mapFunction}
                  disableAdd
                  disableImport
                  disableExport
                />
              </div>
            </SwipeableDrawer>
          </>
        )}

        {/* đăng tuyển */}
        {tab === 100 && (
          <>
            <CustomAppBar title={'Danh sách đăng tuyển'} onGoBack={e => onClose()} disableAdd className isTask />
            <ListPage
              apiUrl={API_HRM_RECRUIT}
              code="HrmRecruit"
              // filterCan={filterCanStart}
              // noQuery
              parentCode="hrm"
              onEdit={row => {
                console.log(row, 'row');
                setIsOpenApplicantRecruitmentAgency(true);
                setDataPage({ ...dataPage, type: 'edit', id: row.originItem && row.originItem._id, 
                // id_hrm: row.originItem.hrmEmployeeId._id, 
              });
                // handleOpenDialogOnEdit()
              }}
              filter={{ recruitmentWave: recruitmentWaveCode }}
              settingBar={[
                <Tooltip title="Thêm mới">
                  <Add
                    onClick={() => {
                      setIsOpenApplicantRecruitmentAgency(true);
                      setDataPage({ ...dataPage, type: 'add' });
                    }}
                  />
                </Tooltip>,
              ]}
              onDelete={row => handleDelete(row)}
              reload={createApplicantRecruitmentAgencySuccess}
              disableAdd
            />
            <SwipeableDrawer
              anchor="right"
              onClose={() => setIsOpenApplicantRecruitmentAgency(false)}
              open={isOpenApplicantRecruitmentAgency}
              // style={{ width: '100vh  - 20px' }}
              width={window.innerWidth - 260}
            >
              <div style={{ width: 'calc(100vw - 260px)' }}>
                <AddRecruit
                  // {...props}
                  code="HrmRecruit"
                  module={recruitmentWaveCode}
                  dataPage={dataPage}
                  isOpenApplicantRecruitmentAgency={isOpenApplicantRecruitmentAgency}
                  selectedData={selectedTestApplicantRecruitmentAgency}
                  onClose={() => setIsOpenApplicantRecruitmentAgency(false)}
                  onSave={handleSaveApplicantRecruitmentAgency}
                  startSalary={recruitmentWave.startingSalary}
                />
              </div>
            </SwipeableDrawer>
          </>
        )}
      </Grid>
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  addRecruitmentWave: makeSelectAddRecruitmentWave(),
  miniActive: makeSelectMiniActive(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSwitchCandidate: action => dispatch(postSwitchCandidate(action)),
    changeImage: data => dispatch(changeImage(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addRecruitmentWave', reducer });
const withSaga = injectSaga({ key: 'addRecruitmentWave', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AddRecruitmentWave);

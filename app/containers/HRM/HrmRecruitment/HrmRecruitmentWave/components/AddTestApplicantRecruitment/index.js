/**
 *
 * AddTestApplicantRecruitment
 *
 */

import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomDatePicker from 'components/CustomDatePicker';
import CustomButton from 'components/Button/CustomButton';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import Department from 'components/Filter/DepartmentAndEmployee';
import { viewConfigName2Title, viewConfigCheckRequired, viewConfigCheckForm } from 'utils/common';
import moment from 'moment';
import ListPage from 'components/List';
import { Paper, Typography, Swipe, Grid, FileUpload, AsyncAutocomplete } from 'components/LifetekUi';
import KanbanStepper from 'components/KanbanStepper';
import { Person, Info } from '@material-ui/icons';
import { MenuItem, Button, Checkbox, Avatar, FormControlLabel, FormControl, FormLabel, RadioGroup, Radio } from '@material-ui/core';
import CustomInputField from 'components/Input/CustomInputField';
import CustomAppBar from 'components/CustomAppBar';
import _ from 'lodash';
import axios from 'axios';
import { API_CANDIDATE, API_PERSONNEL, API_QUESTION, API_VANCANCIES, API_CANDIDATE_LINK } from 'config/urlConfig';

/* eslint-disable react/prefer-stateless-function */
function AddTestApplicantRecruitment(props) {
  const { code, onClose, onSave, dataPage, employee, department, dataExam, recruitmentWaveCode, module, idRound, recruitmentWaveId } = props;
  const [localState, setLocalState] = useState({
    employee: employee || null,
    department: department || 0,
  });

  const [employeeFilter, setEmployeeFilter] = useState({});
  const [listUV, setListUV] = useState();
  const [data, setData] = useState(dataExam[props.tab ? props.tab - 5 : 0]);
  const dataClone = _.cloneDeep(data);

  // useEffect(() => {
  //   setName2Title(viewConfigName2Title(code));
  //   setLocalCheckRequired(viewConfigCheckRequired(code, 'required'));
  //   setLocalCheckShowForm(viewConfigCheckRequired(code, 'showForm'));
  //   setLocalMessages(viewConfigCheckForm(code, localState));

  //   const listCrmStatus = JSON.parse(localStorage.getItem('hrmStatus'));
  //   const crmStatus = listCrmStatus && listCrmStatus.find(element => String(element.code) === 'ST09');
  //   if (crmStatus) {
  //     setListKanbanStatus(crmStatus.data);
  //   }
  // }, []);

  // useEffect(
  //   () => {
  //     setLocalMessages(viewConfigCheckForm(code, localState));
  //   },
  //   [localState],
  // );
  useEffect(() => {
    dataPage.type === 'edit' &&
      fetch(`${API_CANDIDATE_LINK}/${dataPage.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(i => {
          setLocalState(i ? i.data : '');
          setData(i.data.data);
        });
  }, []);
  // useEffect(() => {
  //   dataPage.type === 'add' &&
  //     fetch(`${API_CANDIDATE}?recruitmentWaveCode=${module}`, {
  //       method: 'GET',
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //       .then(response => response.json())
  //       .then(i => {
  //         console.log('000', i.data);
  //         setListUV(i.data);
  //       });
  // }, []);
  // useEffect(() => {
  //   dataPage.type === 'add' &&
  //     fetch(`${API_CANDIDATE_LINK}?roundExamId=${idRound}&recruitmentWaveId=${recruitmentWaveId}`, {
  //       method: 'GET',
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //       .then(response => response.json())
  //       .then(i => {
  //         console.log('111', i.data.map(i => i.hrmEmployeeId));
  //       });
  // }, []);

  const handleInputChange = useCallback(
    e => {
      setLocalState({ ...localState, [e.target.name]: e.target.value });
    },
    [localState],
  );

  const handleEmployee = useCallback(
    newEmployee => {
      const newLocalState = {
        ...localState,
        employee: newEmployee,
      };
      setLocalState(newLocalState);
    },
    [localState],
  );
  // console.log(localState);
  // const getValueRole = value => {
  //   if (!value) return null;
  //   return listUV.find(it => it.code === value.roleCode);
  // };

  const handleChangeRadioGroup = (e, index, index1) => {
    const newData = dataClone;
    const value = e.target.value;
    const dataRadioGroup = newData.roundExamId.exams[index].question;
    dataRadioGroup[index1].answer = value;
    setData(newData);
    setLocalState({ ...localState });
  };
  const handleChangeRadio = (e, index, index1) => {
    const newData = dataClone;
    const value = e.target.value;
    const dataRadio = newData.roundExamId.exams[index].question;
    dataRadio[index1].answer = value;
    setData(newData);
    setLocalState({ ...localState });
  };
  const handleChangeText = (e, index, index1) => {
    const newData = dataClone;
    const value = e.target.value;
    const dataIndex = newData.roundExamId.exams[index].question;
    dataIndex[index1].answer = value;
    setData(newData);
    setLocalState({ ...localState });
  };
  const editRadioGroup = (e, index, index1) => {
    const newData = dataClone;
    const value = e.target.value;
    const dataRadioGroup = newData[index].question;
    dataRadioGroup[index1].answer = value;
    setData(newData);
    setLocalState({ ...localState });
  };
  const editRadio = (e, index, index1) => {
    const newData = dataClone;
    const value = e.target.value;
    const dataRadio = newData[index].question;
    dataRadio[index1].answer = value;
    setData(newData);
    setLocalState({ ...localState });
  };
  const editText = (e, index, index1) => {
    const newData = dataClone;
    const value = e.target.value;
    const dataIndex = newData[index].question;
    dataIndex[index1].answer = value;
    setData(newData);
    setLocalState({ ...localState });
  };
  return (
    <div>
      <CustomAppBar
        title={dataPage.type === 'add' ? 'THÊM MỚI HỎI ĐÁP' : 'CẬP NHẬT HỎI ĐÁP'}
        onGoBack={onClose}
        onSubmit={e => {
          onSave(localState, data, dataPage.id ? dataPage.id : null);
        }}
      />

      <Grid container style={{ padding: '25px' }}>
        <Grid item md={12} style={{ marginTop: 50 }}>
          <Grid item md={6} style={{ marginTop: 10 }}>
            {dataPage.type === 'edit' ? (
              <Typography component="p" style={{ fontWeight: 750, fontSize: '26px' }}>
                {localState.hrmEmployeeId && `Ứng viên: ${localState.hrmEmployeeId.name} `}
              </Typography>
            ) : (
              <Grid>
                <AsyncAutocomplete
                  value={localState.employee}
                  label="ỨNG VIÊN"
                  //   placeholder={intl.formatMessage(messages.seaching)}
                  onChange={handleEmployee}
                  // filter={employeeFilter}
                  noQuery
                  url={`${API_CANDIDATE}?recruitmentWaveCode=${module}&noExam=true`}
                  checkedShowForm={true}
                  filters={['name', 'code']}
                  customOptionLabel={option => `${option.name} - ${option.code}`}
                />
              </Grid>
            )}
          </Grid>
          <Grid item md={6} container justify="center">
            {/* <CustomInputBase label="ỨNG VIÊN" value={localState.employee} onChange={handleEmployee} select>
              {listUV && listUV.map(option => <MenuItem value={option}>{`${option.name} - ${option._id}`}</MenuItem>)}
            </CustomInputBase> */}
          </Grid>
        </Grid>
        <Grid container spacing={16} md={12}>
          {dataExam ? (
            <Grid md={12} style={{ marginTop: 20 }}>
              <Typography component="p" style={{ fontWeight: 700, fontSize: '25px' }}>
                {dataExam[props.tab ? props.tab - 5 : 0].roundExamId.name}
              </Typography>
            </Grid>
          ) : null}
          {dataPage.type === 'add' && dataClone && dataClone.roundExamId
            ? dataClone.roundExamId.exams.map((i, index) => (
                <>
                  <Grid md={12} alignItems="center">
                    <Typography component="p" style={{ fontWeight: 600, fontSize: '20px' }}>
                      Môn {index + 1}: {i.name}
                    </Typography>
                  </Grid>

                  {i.question.map((j, index1) => (
                    <Grid container md={12}>
                      <Grid md={12}>
                        <Typography component="p" style={{ fontWeight: 500, fontSize: '18px' }}>
                          Câu {index1 + 1}: {j.name}
                        </Typography>
                      </Grid>
                      <Grid container md={12}>
                        {j.type === 'checkbox' ? (
                          <FormControl component="fieldset" style={{ width: '100%' }}>
                            <RadioGroup
                              value={j.answer || ''}
                              onChange={e => {
                                handleChangeRadioGroup(e, index, index1);
                              }}
                              row
                              style={{ width: '100%', marginLeft: '1%' }}
                            >
                              {j.data.map(k => (
                                <FormControlLabel value={k.content} control={<Radio />} label={k.content} style={{ width: '24.5%' }} />
                              ))}
                            </RadioGroup>
                          </FormControl>
                        ) : j.type === 'radio' ? (
                          <FormControl component="fieldset" style={{ width: '100%', marginLeft: '1%' }}>
                            <RadioGroup
                              value={j.answer || ''}
                              onChange={e => {
                                handleChangeRadio(e, index, index1);
                              }}
                              row
                              style={{ width: '100%' }}
                            >
                              <FormControlLabel value="true" control={<Radio />} label="Đúng" style={{ width: '24.5%' }} />
                              <FormControlLabel value="false" control={<Radio />} label="Sai" style={{ width: '24.5%' }} />
                            </RadioGroup>
                          </FormControl>
                        ) : (
                          <Grid item md={12}>
                            <CustomInputBase
                              label="Trả lời"
                              name={j.name}
                              value={j.answer || ''}
                              onChange={e => {
                                handleChangeText(e, index, index1);
                              }}
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  ))}
                </>
              ))
            : null}
          {dataPage.type === 'edit' && !dataClone.roundExamId
            ? dataClone.map((i, index) => (
                <>
                  <Grid md={12} alignItems="center">
                    <Typography component="p" style={{ fontWeight: 600, fontSize: '20px' }}>
                      Môn {index + 1}: {i.exam.name}
                    </Typography>
                  </Grid>

                  {i.question.map((j, index1) => (
                    <Grid container md={12}>
                      <Grid md={12}>
                        <Typography component="p" style={{ fontWeight: 500, fontSize: '18px' }}>
                          Câu {index1 + 1}: {j.name}
                        </Typography>
                      </Grid>
                      <Grid container md={12}>
                        {j.type === 'checkbox' ? (
                          <FormControl component="fieldset" style={{ width: '100%' }}>
                            <RadioGroup
                              value={j.answer || ''}
                              onChange={e => {
                                editRadioGroup(e, index, index1);
                              }}
                              row
                              style={{ width: '100%', marginLeft: '1%' }}
                            >
                              {j.data.map(k => (
                                <FormControlLabel value={k.content} control={<Radio />} label={k.content} style={{ width: '24.5%' }} />
                              ))}
                            </RadioGroup>
                          </FormControl>
                        ) : j.type === 'radio' ? (
                          <FormControl component="fieldset" style={{ width: '100%', marginLeft: '1%' }}>
                            <RadioGroup
                              value={j.answer || ''}
                              onChange={e => {
                                editRadio(e, index, index1);
                              }}
                              row
                              style={{ width: '100%' }}
                            >
                              <FormControlLabel value="true" control={<Radio />} label="Đúng" style={{ width: '24.5%' }} />
                              <FormControlLabel value="false" control={<Radio />} label="Sai" style={{ width: '24.5%' }} />
                            </RadioGroup>
                          </FormControl>
                        ) : (
                          <Grid item md={12}>
                            <CustomInputBase
                              label="Trả lời"
                              name={j.name}
                              value={j.answer || ''}
                              onChange={e => {
                                editText(e, index, index1);
                              }}
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  ))}
                </>
              ))
            : null}
        </Grid>
      </Grid>
    </div>
  );
}

AddTestApplicantRecruitment.propTypes = {};

export default memo(AddTestApplicantRecruitment);

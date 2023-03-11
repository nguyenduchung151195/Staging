import React, { memo, useEffect, useState, useCallback } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Tooltip, Typography } from '@material-ui/core';
import CustomButton from 'components/Button/CustomButton';
import { compose } from 'redux';
import CustomInputBase from 'components/Input/CustomInputBase';
import { AsyncAutocomplete } from 'components/LifetekUi';
import { API_HRM_EMPLOYEE, API_TAKE_LEAVE_MANAGER, API_TAKE_LEAVE_MANAGER_LISTBYHRMEMPLOYEE } from 'config/urlConfig'
import _ from 'lodash'
import { fetchData, serialize } from '../../../../../helper';
function AddEditTakeLeave(props) {
    const { onSave, onClose, onUpdate, open, selectTakeLeave, isEdit, onChangeSnackbar, setSelectTakeLive } = props;
    const [localState, setLocalState] = useState({
        takeLeaveYear: 0,
        accumulation: 0,
        seniority: 0,
        numberDayOff: 0,
        // hrmEmployeeId: {},
    });
    const [chooseId, setChooseId] = useState('')
    const [isUpdate, setIsUpdate] = useState(isEdit)


    useEffect(
        () => {
            if (selectTakeLeave && selectTakeLeave !== null) {

                const localHrmEmployeeId = {
                    _id: '',
                    name: ''
                }
                localHrmEmployeeId._id = selectTakeLeave['hrmEmployeeId._id']
                localHrmEmployeeId.name = selectTakeLeave['hrmEmployeeId.name']

                setLocalState({
                    takeLeaveYear: selectTakeLeave.takeLeaveYear,
                    accumulation: selectTakeLeave.accumulation,
                    seniority: selectTakeLeave.seniority,
                    numberDayOff: selectTakeLeave.numberDayOff,
                    hrmEmployeeId: localHrmEmployeeId,
                });
                setChooseId(selectTakeLeave._id)
            }
        },
        [selectTakeLeave]
    )

    const handleInputChange = e => {
        const value = parseInt(e.target.value)
        setLocalState({ ...localState, [e.target.name]: value });
        // const messages = viewConfigHandleOnChange(code, localMessages, e.target.name, e.target.value);
        // setLocalMessages(messages);
    };
    const handleInputChangeEmp = e => {
        if (!!e) {
            setIsUpdate(e.isUpdate || false)
            if (e.isUpdate) {
                setChooseId(e.takeLeaveManagerId)
            }
            setLocalState({
                ...localState,
                hrmEmployeeId: e,
                takeLeaveYear: e.takeLeaveYear,
                accumulation: e.accumulation,
                seniority: e.seniority,
                numberDayOff: e.numberDayOff,
                // hrmEmployeeId: data["hrmEmployeeId._id"],
            });
        }
        else {
            setIsUpdate(false)
            setLocalState({ hrmEmployeeId: null });

        }

        // const messages = viewConfigHandleOnChange(code, localMessages, e.target.name, e.target.value);
        // setLocalMessages(messages);
    };
    // useEffect(() => {
    //     if (localState.hrmEmployeeId) {
    //         fetchData(`${API_TAKE_LEAVE_MANAGER}?${serialize({
    //             filter: {
    //                 hrmEmployeeId: localState.hrmEmployeeId._id,
    //                 status: 1,
    //                 name: localState.hrmEmployeeId.name
    //             }
    //         })}`).then((data) => {
    //             if (data.data && Array.isArray(data.data) && data.data.length > 0) {
    //                 setIsUpdate(true)
    //                 setLocalState({
    //                     ...localState,
    //                     takeLeaveYear: data.data[0].takeLeaveYear,
    //                     accumulation: data.data[0].accumulation,
    //                     seniority: data.data[0].seniority,
    //                     numberDayOff: data.data[0].numberDayOff,
    //                     // hrmEmployeeId: data["hrmEmployeeId._id"],
    //                 });
    //                 setChooseId(data.data[0]._id)
    //             }
    //         }).catch(() => {
    //             setIsUpdate(false)
    //         })
    //     } else {
    //         setIsUpdate(false)
    //     }
    // }, [localState.hrmEmployeeId])
    const handleClose = () => {
        setLocalState({
            takeLeaveYear: 0,
            accumulation: 0,
            seniority: 0,
            numberDayOff: 0,
            hrmEmployeeId: {},
        })
        onClose()
    }

    const handleSave = () => {
        if (!localState.hrmEmployeeId || _.isEmpty(localState.hrmEmployeeId)) {
            return onChangeSnackbar({ status: true, message: 'Không được để trống TÊN NHÂN VIÊN', variant: 'error' });

        }
        else {
            if (!isEdit && !isUpdate) {
                if (!localState.hrmEmployeeId || _.isEmpty(localState.hrmEmployeeId)) {
                    return onChangeSnackbar({ status: true, message: 'Không được để trống TÊN NHÂN VIÊN', variant: 'error' });
                }
                onSave(localState);
            } else {
                onUpdate(chooseId, localState)
            }
        }
    }

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id="alert-dialog-title">{((selectTakeLeave && selectTakeLeave !== null) || isUpdate) ? 'Sửa phép năm' : 'Thêm phép năm'}</DialogTitle>
                <DialogContent style={{ width: 600 }}>
                    <Grid container direction="row" justify="center" alignItems="flex-start" spacing={8}>
                        <Grid item xs={12}>
                            <AsyncAutocomplete
                                // isMulti
                                name="hrmEmployeeId"
                                style={{ width: '100%', height: '100%' }}
                                label="TÊN NHÂN VIÊN"
                                onChange={handleInputChangeEmp}
                                // disabled
                                url={API_TAKE_LEAVE_MANAGER_LISTBYHRMEMPLOYEE}
                                optionSearch={["name"]}
                                value={localState.hrmEmployeeId}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <CustomInputBase type="number" label={'Số nghỉ phép năm'} value={localState.takeLeaveYear} name="takeLeaveYear" onChange={handleInputChange}

                            />
                        </Grid>
                        <Grid item xs={6}>
                            <CustomInputBase type="number" label={'Tích lũy'} value={localState.accumulation} name="accumulation" onChange={handleInputChange}

                            />
                        </Grid>
                        <Grid item xs={6}>
                            <CustomInputBase type="number" label={'Thâm niên'} value={localState.seniority} name="seniority" onChange={handleInputChange}

                            />
                        </Grid>
                        <Grid item xs={6}>
                            <CustomInputBase type="number" label={'Số ngày nghỉ'} value={localState.numberDayOff} name="numberDayOff" onChange={handleInputChange}

                            />
                        </Grid>
                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Grid item xs={12}>
                        <Grid container spacing={8} justify="flex-end">
                            <Grid item>
                                <CustomButton
                                    color="primary"
                                    varian='outlined'
                                    // onClick={e => {
                                    //     if (!isEdit) {
                                    //         onSave(localState);
                                    //     } else {
                                    //         onUpdate(chooseId, localState)
                                    //     }
                                    // }}
                                    onClick={e => handleSave()}
                                >
                                    Lưu
                                </CustomButton>
                            </Grid>
                            <Grid item>
                                <CustomButton varian='outlined' color="secondary" onClick={e => handleClose()}>
                                    HỦY
                                </CustomButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default compose(memo)(AddEditTakeLeave);
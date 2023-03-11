import React, { memo, useCallback, useEffect, useState } from 'react';
import { compose } from 'redux';
import { Add, Delete, Edit, Details } from '@material-ui/icons';
import { DialogActions, DialogContent, DialogTitle, Fab, Grid, Dialog, InputLabel, Tabs, Tab } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import SortableTree from 'react-sortable-tree';
import { SwipeableDrawer } from 'components/LifetekUi';
import CustomTheme from 'components/ThemeSortBar/index';
import DialogAcceptRemove from 'components/DialogAcceptRemove';
import CustomInputBase from '../../../../../../components/Input/CustomInputBase';
import Department from 'components/Filter/DepartmentAndEmployee';
import GeneralDeclaration from './GeneralDeclaration'
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { makeSelectMiniActive, makeSelectProfile } from 'containers/Dashboard/selectors';
import DialogShiftPage from './DialogShiftPage/Loadable';

function ConfigShiftPage(props) {
  const { shifts, onSave, onDelete, addShiftSuccess, updateShiftSuccess, deleteShiftSuccess, symbols } = props;
  const [treeData, setTreeData] = useState([]);
  const [localData, setLocalData] = useState({ name: '', organizationUnit: '', data: [] });
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogRemove, setOpenDialogRemove] = useState(false);
  const [tab, setTab] = useState(0);
  const [workingDay, setWorkingDay] = useState([])

  useEffect(() => {
    if (shifts) {
      let newShifts = [...shifts];
      newShifts = newShifts.map(shift => ({ ...shift, title: shift.name }));
      setTreeData(newShifts);
    }
  }, [shifts])

  useEffect(() => {
    if (addShiftSuccess) {
      handleCloseDialog();
    }
  }, [addShiftSuccess])

  useEffect(() => {
    if (updateShiftSuccess) {
      handleCloseDialog();
    }
  }, [updateShiftSuccess])

  useEffect(() => {
    if (deleteShiftSuccess) {
      handleCloseDialogRemove();
    }
  }, [deleteShiftSuccess])

  const handleSave = (e) => {
    if (onSave) {
      onSave(localData)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(localData && localData._id)
    }
  }

  const handleDeleteShift = (item, index) => {
    if (localData) {
      const newLocalData = { ...localData };
      let { data } = newLocalData;
      data.splice(index, 1)
      setLocalData(newLocalData);
    }
  }

  const handleCloseDialog = () => {
    setLocalData({ name: '', organizationUnit: '', data: [] });
    setOpenDialog(false);
  }
  const handleCloseDialogRemove = () => {
    setOpenDialogRemove(false);
  }

  const handleAddShift = (e) => {
    const newLocalData = { ...localData };
    newLocalData.data.push({
      title: "", startTime: "", endTime: "", timeOutToDetermineTheWord: "", timeOutDetermineToCome: ""
    })
    setLocalData(newLocalData);
  }

  const handleChangeTime = (e, index) => {
    const { target: { value, name } } = e;
    const newData = [...localData.data];
    newData[index] = {
      ...newData[index],
      title: `Ca ${index + 1}`,
      [name]: value
    }
    setLocalData({
      ...localData,
      data: newData
    })
  }

  const handleChangeSymboyDay = (e, index) => {
    const newData = [...localData.data];
    newData[index] = {
      ...newData[index],
      symbol: e.target.value
    }
    setLocalData({
      ...localData,
      data: newData
    })
  }

  const handleChangeWorkingDay = (e, index) => {
    const newData = [...localData.data];
    newData[index] = {
      ...newData[index],
      workingDay: e
    }
    setLocalData({
      ...localData,
      data: newData
    })
  }

  const handleChange = (e) => {
    const { target: { value, name } } = e;
    if (e.target.checked) {
      setLocalData({ ...localData, [name]: e.target.checked })
    } else {
      setLocalData({ ...localData, [name]: value })
    }
  }

  const handeChangeDepartment = useCallback((result) => {
    const { department } = result;
    setLocalData({ ...localData, organizationUnit: department })
  }, [localData])

  const handleSetTab = (tab) => {
    setTab(tab)
  }

  return (
    <React.Fragment>
      <Grid style={{ height: '80%' }}>
        <div className="text-right">
          <Button
            color="primary"
            size="small"
            variant="outlined"
            round
            onClick={() => { setOpenDialog(true); setLocalData({ name: '', organizationUnit: '', data: [] }) }}
          >
            <Add /> Thêm mới
            </Button>
          <div style={{ width: '100%', height: '500px' }}>
            <SortableTree
              treeData={treeData}
              // onChange={treeData => {
              //   setTreeData({ treeData });
              // }}
              theme={CustomTheme}
              canDrag={({ node }) => !node.noDragging}
              isVirtualized
              // eslint-disable-next-line consistent-return
              generateNodeProps={rowInfo => {
                return {
                  buttons: [
                    <Fab
                      color="primary"
                      size="small"
                      onClick={(e) => {
                        setLocalData(rowInfo.node)
                        setOpenDialog(true)
                      }}
                      style={{ marginLeft: 10 , position: 'absolute', right: 50, top: 10}}
                    >
                      <Edit />
                    </Fab>,
                    <Fab
                      color="secondary"
                      size="small"
                      style={{ marginLeft: 10 , position: 'absolute', right: 5, top: 10}}
                      title="Xóa"
                      onClick={(e) => {
                        setLocalData(rowInfo.node)
                        setOpenDialogRemove(true);
                      }}
                    >
                      <Delete />
                    </Fab>,
                  ],
                  // };
                }
              }}
              style={{ fontFamily: 'Tahoma' }}
            />
          </div>
        </div>

      </Grid>
      <SwipeableDrawer anchor="right" onClose={() => setOpenDialog(false)} open={openDialog}  width={window.innerWidth - 260}>
        <div style={{ padding: '15px' }}>
          <DialogShiftPage localData={localData} handleChange={handleChange} handeChangeDepartment={handeChangeDepartment} handleSetTab={handleSetTab} tab={tab}
            handleAddShift={handleAddShift} handleChangeTime={handleChangeTime} handleSave={handleSave} handleCloseDialog={handleCloseDialog}
            symbols={symbols}
            profile={props.profile}
            handleDeleteShift={handleDeleteShift} handleChangeWorkingDay={handleChangeWorkingDay}
            handleChangeSymboyDay={handleChangeSymboyDay}
          />
        </div>
      </SwipeableDrawer>
      {/* <Dialog fullWidth open={openDialog} >
        <DialogTitle id="alert-dialog-title">{localData && localData._id ? 'Cập nhật ca làm việc' : 'Thêm mới ca làm việc'}</DialogTitle>
        <DialogContent style={{ width: 600 }}>
          <CustomInputBase
            label="Tên"
            type="text"
            value={localData.name}
            onChange={handleChange}
            name="name"
          />
          <Department disableEmployee onChange={handeChangeDepartment} department={localData.organizationUnit} />

          <Tabs value={tab} onChange={(e, value) => setTab(value)}>
            <Tab value={0} label="Khai báo chung" />
            <Tab value={1} label="Tham số tính giờ khác" />
          </Tabs>

          {tab === 0 && <GeneralDeclaration />}
          {tab === 1 && <OtherTimingParam />}

          {localData && localData.data.map((item, index) => (
            <Grid container direction="row"
              justify="space-between"
              alignItems="center">
              <Grid item xs={12}><InputLabel>{item.title ? item.title : `Ca ${index + 1}`}</InputLabel></Grid>
              <Grid item>
                <CustomInputBase label="Giờ vào" value={item.startTime} name="startTime" onChange={(e) => handleChangeTime(e, index)} />
              </Grid>
              <Grid item>
                <CustomInputBase label="Giờ ra" value={item.endTime} name="endTime" onChange={(e) => handleChangeTime(e, index)} />
              </Grid>
              <Grid item>
                <Fab
                  color="secondary"
                  size="small"
                  style={{ marginLeft: 10 }}
                  title="Xóa"
                  onClick={() => handleDeleteShift(item, index)}
                >
                  <Delete />
                </Fab>
              </Grid>

            </Grid>
          ))}

        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAddShift}
            variant="outlined"
            color="primary"
          >
            Thêm ca
          </Button>
          <Button
            onClick={handleSave}
            variant="outlined"
            color="primary"
          >
            {localData && localData._id ? 'Cập nhật' : 'Thêm mới'}
          </Button>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            color="default"
            autoFocus
          >
            Hủy bỏ
          </Button>
        </DialogActions>
      </Dialog> */}
      <DialogAcceptRemove
        title="Bạn có muốn xóa ca?"
        openDialogRemove={openDialogRemove}
        handleClose={() => setOpenDialogRemove(false)}
        handleDelete={handleDelete}
      />
    </React.Fragment>
  )
}
const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
});


const withConnect = connect(
  mapStateToProps,
);

export default compose(
  withConnect,
)(ConfigShiftPage)
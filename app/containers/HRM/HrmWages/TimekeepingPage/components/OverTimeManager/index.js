import React, { memo, useEffect, useState } from 'react';
import { compose } from 'redux';
import ListPage from 'components/List';
import { API_OVER_TIME } from 'config/urlConfig';
import { Add } from '@material-ui/icons';
import { SwipeableDrawer } from 'components/LifetekUi';
import { viewConfigName2Title } from 'utils/common';
import CustomInputBase from 'components/Input/CustomInputBase';
import { Grid, Paper, withStyles } from '@material-ui/core';
import styles from './styles';
import AddOverTimeManager from './components/AddEditOverTime'

function OverTimeManager(props) {
  const { reload, addOverTimeManager, updateOverTimeManager, deleteOverTimeManager, addUpdateOverTimeManagerSuccess, classes } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOverTimeManager, setSelectedOverTimeManager] = useState({});
  const [name2Title, setName2Title] = useState({});
  const [code] = useState('HrmOverTime');
  const [filter, setFilter] = useState({})
  const [localState, setLocalState] = useState({
   
  })

  useEffect(() => {
    const name2Title = viewConfigName2Title(code);
    setName2Title(name2Title);
  }, []);

    useEffect(
      () => {
        if (addUpdateOverTimeManagerSuccess) {
          handleCloseDialog();
        }
      },
      [addUpdateOverTimeManagerSuccess],
    );

  const handleDelete = ids => {
    deleteOverTimeManager(ids);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedOverTimeManager({});
    setOpenDialog(false);
  };
  const addItem = () => (
    <Add style={{ color: 'white' }} onClick={handleOpenDialog}>
      Open Menu
    </Add>
  );

  const handleSave = data => {
    if (data && data._id) {
      updateOverTimeManager(data);
    } else {
      addOverTimeManager(data);
    }
  };

  const mapFunction = (item) => ({
    ...item,
    hrmEmployeeId: item['hrmEmployeeId.name']
  })

  const handleFilter = e => {
    setLocalState({ ...localState, [e.target.name]: e.target.value });
    if (e.target.value === '') {
      delete filter[e.target.name]
    } else {
      setFilter({ ...filter, [e.target.name]: e.target.value })
    }
  }

  return (
    <React.Fragment>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        spacing={8}
        className={classes.searchField}
      >

        <Grid item xs={2}>
          <CustomInputBase
            type="number"
            label={'Tháng'}
            value={localState.month}
            name="month"
            onChange={handleFilter}

          />
        </Grid>
        <Grid item xs={2}>
          <CustomInputBase
            type="number"
            label={'Năm'}
            value={localState.year}
            name="year"
            onChange={handleFilter}

          />
        </Grid>
      </Grid>
      <ListPage
        code={code}
        parentCode="hrm"
        onEdit={row => {
          setSelectedOverTimeManager(row);
          setOpenDialog(true);
        }}
        onDelete={handleDelete}
        reload={reload}
        apiUrl={API_OVER_TIME}
        settingBar={[addItem()]}
        filter={filter}
        mapFunction={mapFunction}
        disableAdd
      />

      {openDialog && <AddOverTimeManager
        data={selectedOverTimeManager}
        onSave={handleSave}
        reload={reload}
        onClose={handleCloseDialog}
        code={code}
        // name2Title={name2Title}
        // vacationMode={vacationMode}
        open={openDialog}
      />}
    </React.Fragment>
  );
}

export default compose(
  memo,
  withStyles(styles),
)(OverTimeManager);

import React, { memo, useEffect, useState } from 'react';
import { compose } from 'redux';
import ListPage from 'components/List';
import { API_TAKE_LEAVE } from 'config/urlConfig';
import { Add } from '@material-ui/icons';
import { SwipeableDrawer } from 'components/LifetekUi';
import AddTakeLeaveManager from './AddTakeLeaveManager/Loadable';
import { viewConfigName2Title } from 'utils/common';

function TakeLeaveManager(props) {
  const { reload, addTakeLeaveManager, updateTakeLeaveManager, deleteTakeLeaveManager, addUpdateTakeleaveManagerSuccess, vacationMode } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTakeLeavemanager, setSelectedTakeLeaveManager] = useState({});
  const [name2Title, setName2Title] = useState({});
  // const [code] = useState('TakeLeave');
  const [code] = useState('TakeLeaveManager');



  useEffect(() => {
    const name2Title = viewConfigName2Title(code);
    setName2Title(name2Title);
  }, []);

  useEffect(
    () => {
      if (addUpdateTakeleaveManagerSuccess) {
        handleCloseDialog();
      }
    },
    [addUpdateTakeleaveManagerSuccess],
  );

  const handleDelete = ids => {
    deleteTakeLeaveManager(ids);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedTakeLeaveManager({});
    setOpenDialog(false);
  };
  const addItem = () => (
    <Add style={{ color: 'white' }} onClick={handleOpenDialog}>
      Open Menu
    </Add>
  );

  const handleSave = data => {
    if (data && data._id) {
      updateTakeLeaveManager(data);
    } else {
      addTakeLeaveManager(data);
    }
  };

  const mapFunction = (item) => ({
    ...item,
    hrmEmployeeId: item['hrmEmployeeId.name'],
  })

  return (
    <React.Fragment>
      <ListPage
        code={code}
        parentCode="hrm"
        onEdit={row => {
          setSelectedTakeLeaveManager(row);
          setOpenDialog(true);
        }}
        onDelete={handleDelete}
        reload={reload}
        apiUrl={API_TAKE_LEAVE}
        settingBar={[addItem()]}
        mapFunction={mapFunction}
        disableAdd
      />

      {openDialog && <AddTakeLeaveManager
        data={selectedTakeLeavemanager}
        onSave={handleSave}
        reload={reload}
        onClose={handleCloseDialog}
        code={code}
        name2Title={name2Title}
        vacationMode={vacationMode}
        open={openDialog}
      />}
    </React.Fragment>
  );
}

export default compose(memo)(TakeLeaveManager);

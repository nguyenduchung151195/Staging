import React, { useCallback, useState } from 'react';
import AddTimekeeping from './components/addTimekeeping/Loadable';

import { API_TIMEKEEPING_EQUIPMENT } from 'config/urlConfig';
import ListPage from 'components/List';
import { Grid } from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import { SwipeableDrawer } from 'components/LifetekUi';
import { configTimeKeeping } from 'variable';
import { Tooltip } from '@material-ui/core';

function ConfigHrmTimekeep(props) {
  const { onSave, onDelete, data, reload, profile } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [update, setUpdate] = useState(false);
  const [selectConfigTimekeeping, setSelectConfigTimekeeping] = useState(null);

  const handleOpenAddConfigDialog = () => {
    setSelectConfigTimekeeping(null);
    setOpenDialog(true);
    setUpdate(false);
  };

  const handleOpenEditConfigDialog = row => {
    setSelectConfigTimekeeping(row);
    setOpenDialog(true);
    setUpdate(true);
  };

  const handleCloseAddConfigDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const addItem = () => (
    <Tooltip title="Thêm mới ">
      <Add onClick={handleOpenAddConfigDialog}>Open Menu</Add>
    </Tooltip>
  );

  const handleTimekeepingDelete = data => {
    onDelete(data);
  };

  const handleUpdate = data => {
    setOpenDialog(false);
    onSave(data);
  };

  return (
    <React.Fragment>
      <ListPage
        disableImport
        // disableViewConfig
        // disable
        // columns={configTimeKeeping}
        onEdit={handleOpenEditConfigDialog}
        apiUrl={API_TIMEKEEPING_EQUIPMENT}
        // filter={filter}
        code="TimeKeepingEquipment"
        reload={reload}
        settingBar={[addItem()]}
        // forceShowSettingBar
        onDelete={handleTimekeepingDelete}
        disableAdd
      />

      <SwipeableDrawer anchor="right" onClose={handleCloseAddConfigDialog} open={openDialog}>
        <div style={{ width: props.miniActive ? window.innerWidth - 90 : window.innerWidth - 260 }}>
          <AddTimekeeping
            update={update}
            timekeeping={selectConfigTimekeeping}
            profile={profile}
            onClose={handleCloseAddConfigDialog}
            onUpdate={handleUpdate}
            propsAll={props}
          />
        </div>
      </SwipeableDrawer>
    </React.Fragment>
  );
}

export default ConfigHrmTimekeep;

import { Fab, Grid, Button } from '@material-ui/core';
import { Add, Delete, Edit } from '@material-ui/icons';
import CustomTheme from 'components/ThemeSortBar/index';
import React, { memo, useEffect, useState } from 'react';
import SortableTree from 'react-sortable-tree';
import AddBenifitProject from './AddBenifitProject/Loadable';
import DialogAcceptRemove from 'components/DialogAcceptRemove';

function HrmConfigBenifitProject(props) {
  const { projectBonus, addProjectBonus, updateProjectBonus, deleteProjectBonus } = props;
  const [treeData, setTreeData] = useState([]);
  const [localData, setLocalData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogRemove, setOpenDialogRemove] = useState(false);

  useEffect(() => {
    setTreeData(projectBonus);
  }, [projectBonus])

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setLocalData({});
  };

  const handleSave = () => {
    if (localData && localData._id) {
      updateProjectBonus(localData);
    } else {
      updateProjectBonus(localData);
    }
  };

  const handleDelete = () => {
    if (localData && localData._id) {
      deleteProjectBonus(_id);
    }
  }

  const handleChange = e => {
    const {
      target: { value, name },
    } = e;
    setLocalData({
      ...localData,
      [name]: value,
    });
  };

  return (
    <React.Fragment>
      {/* danh sach cong thuc luong */}
      <Grid>
        <Grid style={{ height: '80%' }}>
          <div className="text-right">
            <Button
              color="primary"
              size="small"
              variant="outlined"
              round
              onClick={() => {
                setLocalData({ name: '', coefficient: '', value: 0 });
                setOpenDialog(true);
              }}
            >
              <Add /> Thêm mới
            </Button>
            <div style={{ width: '100%', height: '500px' }}>
              <SortableTree
                treeData={treeData} // onChange={treeData => {
                //   setTreeData({ treeData });
                // }}
                theme={CustomTheme}
                canDrag={({ node }) => !node.noDragging}
                isVirtualized // eslint-disable-next-line consistent-return
                generateNodeProps={rowInfo => {
                  return {
                    buttons: [
                      <Fab
                        color="primary"
                        size="small"
                        onClick={e => {
                          setLocalData(rowInfo.node);
                          setOpenDialog(true);
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
                        onClick={e => {
                          setLocalData(rowInfo.node);
                          setOpenDialogRemove(true);
                        }}
                      >
                        <Delete />
                      </Fab>,
                    ],
                  };
                  // };
                }}
                style={{ fontFamily: 'Tahoma' }}
              />
            </div>
          </div>
        </Grid>

        {/*  */}
        <DialogAcceptRemove
          title="Bạn có muốn xóa thưởng dự án không?"
          openDialogRemove={openDialogRemove}
          handleClose={() => setOpenDialogRemove(false)}
          handleDelete={handleDelete}
        />
      </Grid>
      <AddBenifitProject
        data={localData}
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        onSave={handleSave}
        handleChange={handleChange}
      />
    </React.Fragment>
  );
}

export default memo(HrmConfigBenifitProject);

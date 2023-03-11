import { DialogContent, DialogTitle, Fab, Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Add, Delete, Edit, Details } from '@material-ui/icons';
import { SwipeableDrawer } from 'components/LifetekUi';
import CustomTheme from 'components/ThemeSortBar/index';
import React, { memo, useCallback, useEffect, useState } from 'react';
import SortableTree from 'react-sortable-tree';

import DetailSalaryFormula from './DetailSalaryFormula';
import AddSalaryFormula from './AddSalaryFormula/Loadable';
import DialogAcceptRemove from 'components/DialogAcceptRemove';

function ConfigSalaryFormula(props) {
  const {
    onDelete,
    salaryFormula,
    onSave,
    handleSelectSalaryFormula,
    attributeFormula,
    listAttributeFormula,
    addSalaryFormulaSuccess,
    updateSalaryFormulaSuccess,
    deleteSalaryFormulaSuccess,
    onUpdateAttribute,
    addAttributeFormulaSuccess,
    onChangeSnackbar,
    attributeFormulaId,
    addSingleAttributeFormula,
    updateSingleAttributeFormula,
  } = props;

  const [treeData, setTreeData] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [dialogFormula, setOpenDialogFormula] = useState(false);
  const [openDialogRemove, setOpenDialogRemove] = useState(false);
  const [localData, setLocalData] = useState({ name: '', code: '' });
  const [error, setError] = useState({});
  const [column, setColumn] = useState({ name: 'Tên công thức', code: 'Mã' });

  useEffect(
    () => {
      if (salaryFormula) {
        setTreeData(formatTreeData(salaryFormula));
      }
    },
    [salaryFormula],
  );

  useEffect(
    () => {
      if (addSalaryFormulaSuccess) {
        handleCloseDialog();
      }
    },
    [addSalaryFormulaSuccess],
  );

  useEffect(
    () => {
      if (updateSalaryFormulaSuccess) {
        handleCloseDialog();
      }
    },
    [updateSalaryFormulaSuccess],
  );

  useEffect(
    () => {
      if (deleteSalaryFormulaSuccess) {
        setOpenDialogRemove(false);
      }
    },
    [deleteSalaryFormulaSuccess],
  );

  useEffect(
    () => {
      if (addAttributeFormulaSuccess) {
        setDialog(false);
        handleSelectSalaryFormula(null);
      }
    },
    [addAttributeFormulaSuccess],
  );

  const formatTreeData = list => {
    let newList = [];
    list.length > 0 &&
      list.map(item =>
        newList.push({
          ...item,
          ...{ title: item.name },
        }),
      );
    return newList;
  };

  const handleSave = () => {
    if (onSave && Object.keys(error).length === 0) {
      onSave(localData);
    } else {
      onChangeSnackbar({ variant: 'error', status: true, message: 'Thêm dữ liệu thất bại' });
    }
  };

  const hanldeDeleteSalaryFormula = () => {
    if (localData && localData._id) {
      onDelete(localData);
    } else {
      //loi
    }
  };

  const handleChange = useCallback(
    e => {
      const { target } = e;
      const { value, name } = target;
      if (name === 'code') {
        // const foundFormula = treeData.filter(item => item.code === value);
        // if (foundFormula && foundFormula.length) {
        //   setLocalData({ ...localData, [name]: value }); setError({ ...error, [name]: `Không được trùng ${column[name]}` });
        // } else {
        //   delete error[name];
        // }

        let foundData = false;
        if (!localData._id) {
          foundData = Array.isArray(treeData) && treeData.find(item => item[name].trim() === value.trim()) ? true : false;
        } else {
          let newTree = [];
          newTree.push(...treeData);
          const index = newTree.findIndex(item => item._id === localData._id);
          if (index !== -1) {
            newTree.splice(index, 1);
            foundData = Array.isArray(newTree) && newTree.find(item => item[name].trim() === value.trim()) ? true : false;
          }
        }
        if (value.length > 0) {
          if (foundData) {
            setLocalData({ ...localData, [name]: value });
            setError({ ...error, [name]: `Không được trùng ${column[name]}` });
          } else {
            let newErrors = error;
            delete newErrors[name];
            setError(newErrors);
          }
        } else {
          setError({ ...error, [name]: `Không được để trống ${column[name]}` });
        }
      }
      setLocalData({
        ...localData,
        [name]: value,
      });
    },
    [localData],
  );

  const handleCloseDialog = () => {
    setOpenDialogFormula(false);
    setError({});
    setLocalData({ name: '', code: '' });
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
                setLocalData({ name: '', code: '' });
                setOpenDialogFormula(true);
              }}
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
                        onClick={e => {
                          setLocalData(rowInfo.node);
                          setOpenDialogFormula(true);
                        }}
                        style={{ marginLeft: 10, position: 'absolute', right: 100, top: 10 }}
                      >
                        <Edit />
                      </Fab>,
                      <Fab
                        color="primary"
                        size="small"
                        onClick={e => {
                          handleSelectSalaryFormula(rowInfo.node);
                          setDialog(true);
                        }}
                        style={{ marginLeft: 10, position: 'absolute', right: 50, top: 10 }}
                      >
                        <Details />
                      </Fab>,
                      <Fab
                        color="secondary"
                        size="small"
                        style={{ marginLeft: 10, position: 'absolute', right: 5, top: 10 }}
                        title="Xóa"
                        onClick={e => {
                          setLocalData(rowInfo.node);
                          setOpenDialogRemove(true);
                        }}
                      >
                        <Delete />
                      </Fab>,
                    ],
                    // };
                  };
                }}
                style={{ fontFamily: 'Tahoma' }}
              />
            </div>
          </div>
        </Grid>

        {/*  */}
        <DialogAcceptRemove
          title="Bạn có muốn xóa công thức tính?"
          openDialogRemove={openDialogRemove}
          handleClose={() => setOpenDialogRemove(false)}
          handleDelete={hanldeDeleteSalaryFormula}
        />
        <AddSalaryFormula
          data={localData}
          openDialog={dialogFormula}
          handleCloseDialog={handleCloseDialog}
          onSave={handleSave}
          handleChange={handleChange}
          error={error}
        />

        <SwipeableDrawer anchor="right" onClose={() => setDialog(false)} open={dialog} width={window.innerWidth - 260}>
          <div style={{ padding: '15px' }}>
            <DetailSalaryFormula
              attributeFormula={attributeFormula}
              onUpdateAttribute={onUpdateAttribute}
              listAttributeFormula={listAttributeFormula}
              attributeFormulaId={attributeFormulaId}
              addSingleAttributeFormula={addSingleAttributeFormula}
              updateSingleAttributeFormula={updateSingleAttributeFormula}
            />
          </div>
        </SwipeableDrawer>
      </Grid>
    </React.Fragment>
  );
}

export default memo(ConfigSalaryFormula);

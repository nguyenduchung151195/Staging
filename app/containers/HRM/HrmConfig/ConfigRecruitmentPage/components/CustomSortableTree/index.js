import SortableTree from 'react-sortable-tree';
import CustomTheme from 'components/ThemeSortBar/index';
import React, { useState, useEffect } from 'react';
import { Fab, Grid } from '@material-ui/core';
import { Edit, Person, Info, Add, Delete } from '@material-ui/icons';
import GridItem from 'components/Grid/ItemGrid';
import DialogAcceptRemove from 'components/DialogAcceptRemove';
import { Grid as Grids, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import {
  SortingState,
  SelectionState,
  PagingState,
  CustomPaging,
  SearchState,
  IntegratedPaging,
  IntegratedSelection,
  IntegratedFiltering,
  IntegratedSorting,
} from '@devexpress/dx-react-grid';

const CustomSortAbleTree = props => {
  const { apiUrl, onEdit, onDelete, onChange, reload, settingBar, code, data, createQuestionSuccess, success } = props;

  const [localState, setLocalState] = useState([]);
  const [count, setCount] = useState(0);
  const [localData, setLocalData] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDialogRemove, setOpenDialogRemove] = useState(false);
  const [pageSizes] = React.useState([5, 10, 15]);
  const [pageSize, setPageSize] = useState(10);
  const [columns] = React.useState([{ stt: 'STT', name: 'Tên' }]);
  const [currentPage, setCurrentPage] = useState(0);

  const changeCurrentPage = value => {
    // onPagingPanel({ limit: pageSize, page: value, tableId: data ? data._id : null, organizationId: data ? data.organizationUnitId._id : null });
    setCurrentPage(value);
  };

  const changePageSize = value => {
    // onPagingPanel({ limit: value, page: 1, tableId: data ? data._id : null, organizationId: data ? data.organizationUnitId._id : null });
    setPageSize(value);
    setCurrentPage(0);
  };

  useEffect(
    () => {
      if (apiUrl || reload)
        fetch(`${apiUrl}?limit=${pageSize}&skip=${currentPage * pageSize}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            setCount(data.count);
            setLocalState(data.data);
          });
    },
    [apiUrl, reload, currentPage, pageSize],
  );
  useEffect(
    () => {
      if (open === true) {
        setOpenDialogRemove(false);
      }
    },
    [open],
  );

  useEffect(
    () => {
      if (localState) {
        setTreeData(formatTreeData(localState));
      }
    },
    [localState],
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
  useEffect(
    () => {
      if (createQuestionSuccess) {
        handleCloseDialog();
      }
    },
    [createQuestionSuccess],
  );

  const hanldeDelete = () => {
    if (localData && localData._id) {
      onDelete(localData);
      setOpen(true);
      setOpenDialogRemove(false);
    } else {
      //loi
    }
  };

  return (
    <React.Fragment>
      <div>
        <Grid>
          <Grid  style={{ alignItems: 'center', display: 'flex', justifyContent: 'flex-end', paddingBottom: 10 }}>
            {settingBar && settingBar.map(item => item)}
          </Grid>
          <div style={{ height: 'calc(100vh - 310px)' }}>
            <SortableTree
              treeData={treeData}
              theme={CustomTheme}
              canDrag={({ node }) => !node.noDragging}
              isVirtualized
              style={{ fontFamily: 'Tahoma' }}
              onChange={onChange}
              generateNodeProps={rowInfo => {
                return {
                  buttons: [
                    <Fab
                      color="primary"
                      size="small"
                      onClick={() => onEdit(rowInfo.node)}
                      style={{ marginLeft: 10, position: 'absolute', right: 50, top: 10 }}
                    >
                      <Edit />
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
                };
              }}
            />
          </div>
        </Grid>
        <GridItem md={12} css={{ flexDirection: 'none', height: 10 }}>
          <Grids rows={localState} columns={columns}>
            <PagingState
              currentPage={currentPage}
              onCurrentPageChange={value => changeCurrentPage(value)}
              pageSize={pageSize}
              onPageSizeChange={value => changePageSize(value)}
            />
            <CustomPaging totalCount={count ? count : 5} />
            <PagingPanel messages={{ rowsPerPage: 'Số dòng hiển thị' }} pageSizes={pageSizes} />
          </Grids>
        </GridItem>
      </div>
      <DialogAcceptRemove
        title="Bạn có muốn xóa ?"
        openDialogRemove={openDialogRemove}
        handleClose={() => setOpenDialogRemove(false)}
        handleDelete={hanldeDelete}
      />
    </React.Fragment>
  );
};

export default CustomSortAbleTree;

/**
 *
 * WagesSalaryDetail
 *
 */

import React, { memo, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  TableHead,
  TableRow,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { Public, AccountCircle, ViewModule } from '@material-ui/icons';
import { Fab, Tabs, Tab } from 'components/LifetekUi';
import messages from './messages';
import { injectIntl } from 'react-intl';
import CustomInputBase from 'components/Input/CustomInputBase';
import { calAttributes, buildColumnBands } from 'utils/common';
import CustomButton from 'components/Button/CustomButton';
import { Edit, Add, Visibility, Dehaze, Close, Archive } from '@material-ui/icons';
import VerticalDepartmentTree from '../../../../components/Filter/VerticalDepartmentTree';
import DialogViewConfig from './components/DialogViewConfig';
import { getAllTemplate, getDetailWageSalary, sendMailWageSalary, putDataWage } from './actions';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import makeSelectWageSalaryDetail from './selectors';
import ModalSalaryCalculationDetails from './components/ModalSalaryCalculationDetails/Loadable';
import SendSalaryByEmail from './components/SendSalaryByEmail/Loadable';
import ListPage from '../../../../components/List/WageTable';
import { API_TIMEKEEPING_PAYCHECK, API_REPORT_STATISTICAL_BOS } from '../../../../config/urlConfig';
import FluctuationsMonth from '../../../../components/FluctuationsMonth';
import CustomAppBar from 'components/CustomAppBar';
import { makeSelectProfile, makeSelectMiniActive } from '../../../Dashboard/selectors';
import { mergeData as MergeData } from '../../../Dashboard/actions';
import ExportTable from './exportTable';
import {
  ExpandMore,
  ExpandLess,
  ArrowForward,
  ArrowBack,
  InsertInvitation,
  CreateNewFolder,
  Streetview,
  AccountBox,
  People,
  CalendarViewDay,
  AssignmentTurnedIn,
  AirplanemodeActive,
} from '@material-ui/icons';
import { tableToExcel, tableToPDF } from 'helper';
/* eslint-disable react/prefer-stateless-function */

const styles = theme => ({
  root: {
    width: '100%',
    overflow: 'auto',
    paddingBottom: 10,
    paddingRight: 5,
    paddingLeft: 5,
    height: 700,
  },
  tablecell: {
    border: '1px solid rgba(224, 224, 224, 1)',
    // width: '100%',
    textAlign: 'center',
    padding: '0px 16px',
  },
  table: {
    minWidth: 700,
  },
  fixRow: {
    position: 'sticky',
    top: 0,
    maxWidth: 100,
    border: '1px solid rgba(224, 224, 224, 1)',
    // width: '100%',
    textAlign: 'center',
    padding: '0px 5px',
    backgroundColor: '#FFFFFF',
    zIndex: 999,
    // whiteSpace: 'nowrap',
    // maxWidth: '50px',
    // overflow: 'hidden',
    // textOverflow: 'ellipsis',
  },
  fixRow2: {
    position: 'sticky',
    top: 54,
    border: '1px solid rgba(224, 224, 224, 1)',
    maxWidth: 100,
    // width: '100%',
    textAlign: 'center',
    padding: '0px 16px',
    backgroundColor: '#FFFFFF',
    zIndex: 999,
  },
  fixColumn: {
    position: 'sticky',
    left: 0,
    border: '1px solid rgba(224, 224, 224, 1)',
    width: '100%',
    textAlign: 'center',
    padding: '0px 16px',
    backgroundColor: '#FFFFFF',
  },
  name: {
    width: 150,
    textAlign: 'left',
  },
});

const TableCells = memo(props => {
  const { value, onMergeData, ...rest } = props;
  return <TableCell {...rest}>{value}</TableCell>;
});

const MenuAction = memo(({ handleClose, anchorEl, openSendSalary }) => {
  return (
    <div>
      <Menu open={Boolean(anchorEl)} onClose={handleClose} anchorEl={anchorEl} keepMounted>
        <MenuItem onClick={openSendSalary}>Gửi phiếu lương</MenuItem>
      </Menu>

      {/* <div style={{ width: '100vw' }} id="divToPrint" /> */}
    </div>
  );
});

function WagesSalaryDetail(props) {
  const {
    dashboardPage,
    classes,
    intl,
    organizationUnitId,
    formulaAttributes,
    selectedWageSalary,
    getDetail,
    wageSalaryDetailPage,
    sendEmailWagesSalary,
    getAllTemplate,
    onMergeData,
    putDataWage,
  } = props;
  const { detailWagesSalary, templates } = wageSalaryDetailPage;
  const [rows, setRows] = useState([]);
  const { allDepartment } = dashboardPage;
  const [openViewConfig, setOpenViewConfig] = useState(false);
  const [listTitle, setListTitle] = useState([]);
  const [listSubTitle, setListSubTitle] = useState([]);
  const [columns, setColumns] = useState([]);
  const [columnBands, setColumnBands] = useState([]);
  const [listPageRows, setListPageRows] = useState([]);
  const [query, setQuery] = useState({
    // tableId,
    hrmEmployeeId: null,
    organizationId: null,
  });
  const [openModalSalary, setOpenModalSalary] = useState(false);
  const [openSendSalary, setOpenSendSalary] = useState(false);
  const [selectSalaryDetail, setSelectSalaryDetail] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [tab, setTab] = useState(1);
  const [show, setShow] = useState(true);
  const [widthVertical, setWidthVertical] = useState(420);
  const [fakeData, setFakeData] = useState([
    {
      name: 'Nhân sự mới',
      color: 'green',
      icon: <CreateNewFolder style={{ fontSize: 50 }} />,
    },
    {
      name: 'Nhân sự nghỉ việc',
      color: 'blue',
      icon: <Streetview style={{ fontSize: 50 }} />,
    },
    {
      name: 'Nhân sự thử việc',
      color: 'blue',
      icon: <AccountBox style={{ fontSize: 50 }} />,
    },
    {
      name: 'Nhân sự chính thức',
      color: 'blue',
      icon: <People style={{ fontSize: 50 }} />,
    },
    {
      name: 'Đang thai sản',
      color: 'blue',
      icon: <CalendarViewDay style={{ fontSize: 50 }} />,
    },
    {
      name: 'Thay đổi hợp đồng',
      color: 'blue',
      icon: <AssignmentTurnedIn style={{ fontSize: 50 }} />,
    },
    {
      name: 'Đang nghỉ phép',
      color: 'blue',
      icon: <InsertInvitation style={{ fontSize: 50 }} />,
    },
    {
      name: 'Đang đi công tác',
      color: 'blue',
      icon: <AirplanemodeActive style={{ fontSize: 50 }} />,
    },
  ]);
  const [filter, setFilter] = useState({});
  const [exportAnchor, setExportAnchor] = useState(null);
  const [openExcel, setOpenExcel] = useState(null);
  const [html, setHtml] = useState([]);
  const [htmlTotal, setHtmlTotal] = useState(0);

  useEffect(
    () => {
      try {
        if ((html.length > 0) & (htmlTotal !== 0)) {
          if (html.length === htmlTotal) {
            for (let index = 0; index < htmlTotal; index++) {
              const win = window.open();
              win.document.write(html[index].content);
              win.document.close();
              win.print();
            }

            setHtml([]);
            setHtmlTotal(0);
          }
        }
      } catch (err) {
        console.log(err, 'errr');
      }
    },
    [html, htmlTotal],
  );

  useEffect(
    () => {
      if (Array.isArray(formulaAttributes)) {
        arrayProcessing(formulaAttributes.map(i => ({ ...i, checkShow: true })));
      }
    },
    [formulaAttributes, detailWagesSalary],
  );

  useEffect(() => {
    getAllTemplate();
  }, []);

  useEffect(
    () => {
      getDataDetail();
    },
    [selectedWageSalary],
  );

  const getDataDetail = () => {
    getDetail(selectedWageSalary);
  };

  const formatData = (sortedFormulaAttributes, newListPageColumns) => {
    const newListPageRows = [];
    const newDisplayData = detailWagesSalary.map((hrmData, index) => {
      const { dataSource: hrmDataSource } = hrmData;
      const dataSource = calAttributes(hrmDataSource, sortedFormulaAttributes);
      const defaultCellData = [index + 1, (hrmData.hrmEmployeeId && hrmData.hrmEmployeeId.name) || ''];
      const defaultCellDataItem = {
        ...(hrmData && hrmData.hrmEmployeeId),
        order: index + 1,
        month: hrmData.month,
        hrmName: (hrmData.hrmEmployeeId && hrmData.hrmEmployeeId.name) || '',
        year: hrmData.year,
      };
      const calCelsData = sortedFormulaAttributes.map(attr => {
        defaultCellDataItem[attr.code] = (dataSource[attr.code] || {}).value || 0;
        return dataSource[attr.code] || 0;
      });
      newListPageRows.push(defaultCellDataItem);
      const newDisplayRowData = [...defaultCellData, ...calCelsData];
      return {
        hrmData,
        displayRowData: newDisplayRowData,
      };
    });
    setListPageRows(newListPageRows);
    // setRows(newDisplayData);
    return;
  };

  const arrayProcessing = val => {
    const newList = [];
    const newColumns = [
      {
        checked: true,
        title: 'STT',
        name: 'order',
        order: 1,
        width: 80,
      },
      {
        checked: true,
        title: 'Tên',
        name: 'hrmName',
        order: 2,
        width: 150,
      },
    ];
    val.forEach((item, index) => {
      const newItem = {
        checked: true,
        title: item.name,
        name: item.code,
        order: index + 3,
        width: 150,
        // groupName: item.groupName
        groupName: item.groupName,
      };
      newColumns.push(newItem);
    });
    setColumns(newColumns);
    const newColumnBands = buildColumnBands(newColumns);
    // console.log('newColumnBands', newColumnBands);
    setColumnBands(newColumnBands);
    // val.map(item => {
    //   if (item.checkShow) {
    //     const data = newList.find(elem => elem.name === item.group);
    //     if (data) {
    //       newListSub.push({
    //         ...item,
    //         parent: data.groupNumber,
    //       });
    //     }
    //   }
    // });

    // newListSub.sort(function(a, b) {
    //   return a.parent - b.parent;
    // });
    formatData(val, newColumns);
    // setListSubTitle(newListSub);
    return;
  };

  const handleSelectDepart = useCallback(
    depart => {
      try {
        const { hrmEmployeeId, organizationId, ...rest } = query;
        const newQuery = {
          ...rest,
        };
        if (depart && depart._id) {
          if (depart.isHrm) {
            newQuery.hrmEmployeeId = depart._id;
          } else {
            newQuery.organizationId = depart._id;
          }
        }
        setQuery(newQuery);
        // onGetTimekeepingData(parseQuery(newQuery));
      } catch (error) {
        console.log('errr', error);
      }
    },
    [query],
  );

  const handleClickSalaryDetail = (rowItem, item, formulaAttributes) => {
    if (item) {
      setOpenModalSalary(true);
      setSelectSalaryDetail(item);
    }
  };

  const handleCloseModelSalary = () => {
    setSelectSalaryDetail([]);
    setOpenModalSalary(false);
  };

  const handleOpenSendSalary = () => {
    setOpenSendSalary(true);
    setAnchorEl(null);
  };

  const handleCloseSendSalary = () => {
    setOpenSendSalary(false);
  };

  const handleSendMail = data => {
    sendEmailWagesSalary(data);
  };

  const handleChangeVertical = () => {
    if (show) {
      setShow(false);
      setWidthVertical(92);
    } else {
      setShow(true);
      setWidthVertical(420);
    }
  };

  const handleClick = (e, item) => {
    const { _id } = item;
    if (item && item._id) {
      setFilter({ ...filter, _id });
    }
  };

  const handleClose = () => {
    props.callback('close');
  };

  const renderFluctuationsMonth = () => {
    return (
      <Grid item container spacing={16}>
        {fakeData.map(item => {
          return (
            <Grid item xs={6}>
              <FluctuationsMonth
                style={{ marginTop: 15 }}
                icon={item.icon || ''}
                // number={catagory.length ? catagory.length : 0}
                text={item.name}
                backColor={item.color}
                color={`linear-gradient(to right, #03A9F4, #03a9f4ad)`}
                openDetail={e => handleClick(e, item)}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  };
  useEffect(() => {
    return () => {
      onMergeData,
        setTimeout(() => {
          onMergeData({ hiddenHeader: false });
        }, 1);
    };
  }, []);
  const showButtonEx = (data, putDataWage, props, columns) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [type, setType] = useState(null);
    const clickButton = () => {
      setOpenDialog(true);
      // const afcnData = []
      // data.forEach(item => {
      //   let afcn = {}
      //   afcn.AFCN = item.AFCN || 0
      //   afcnData.push(afcn)
      // })
      // putDataWage(afcnData, props.selectedWageSalary._id)
    };
    const handleCloseDialog = () => {
      setOpenDialog(false);
    };
    const handleChange = e => {
      setType(e.target.value);
    };
    const handleSave = type => {
      const afcnData = [];
      data.forEach(item => {
        let afcn = {};
        afcn.wage = item[type] || 0;
        afcnData.push(afcn);
      });
      putDataWage(afcnData, props.selectedWageSalary._id);
      setOpenDialog(false);
    };
    return (
      <>
        <Button
          variant="outlined"
          color="inherit"
          className="mx-2"
          // component={
          //   <Link to={`/crm/trading/${this.state.dialogData._id}`}></Link>
          // }
          onClick={clickButton}
        >
          {'Chốt Lương'}
        </Button>
        <Dialog fullWidth maxWidth={'md'} open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Thiết lập chốt lương</DialogTitle>
          <DialogContent>
            <Grid container spacing={16}>
              <Grid item md={12}>
                <CustomInputBase select label="Chọn trường chốt lương" onChange={e => handleChange(e)} value={type}>
                  {Array.isArray(columns) && columns.map(item => <MenuItem value={item.name}>{item.title}</MenuItem>)}
                </CustomInputBase>
              </Grid>
              <Grid container spacing={8} justify="flex-end">
                <Grid item>
                  <CustomButton color="primary" onClick={e => handleSave(type)}>
                    Lưu
                  </CustomButton>
                </Grid>
                <Grid item>
                  <CustomButton color="secondary" onClick={handleCloseDialog}>
                    Hủy
                  </CustomButton>
                </Grid>
              </Grid>
            </Grid>
            {/* <AddVacation onSave={handleSaveVacation} onClose={handleCloseDialog} /> */}
          </DialogContent>
        </Dialog>
      </>
    );
  };
  const onExportExcel = e => {
    e.preventDefault();
    setOpenExcel('Excel');
  };
  const onExportPDF = e => {
    e.preventDefault();
    setOpenExcel('PDF');
  };
  const handleCloseExcel = () => {
    const type = openExcel;
    setOpenExcel(null);
    const title = `Chi tiết bảng lương ${selectedWageSalary && selectedWageSalary.organizationUnitId ? selectedWageSalary.organizationUnitId.name : ''
      } - Tháng ${listPageRows[0].month + 1}/${listPageRows[0].year}`;

    switch (type) {
      case 'PDF':
        const { totalPage = 1, pageNumber = 1 } = {};
        const content = tableToPDF('excelTableBosReport1', listPageRows[0].month + 1, 'PDF', title);
        setHtml(e => [...e, { content, pageNumber }]);
        setHtmlTotal(totalPage);
        break;
      default:
        tableToExcel('excelTableBosReport1', 'W3C Example Table', undefined, undefined, title);
    }
  };
  const handleExport = e => {
    e.preventDefault();
    setExportAnchor(e.currentTarget);
  };
  return (
    <div style={{ width: props.miniActive ? window.innerWidth - 80 : window.innerWidth - 260 }}>
      <CustomAppBar
        style={{ width: props.miniActive ? window.innerWidth - 80 : window.innerWidth - 260 }}
        title="Chi tiết bảng lương"
        isTask={true}
        className
        onGoBack={props.onClose}
        disableAdd
        frontBtn={props.selectedWageSalary.isClosed === false ? showButtonEx(listPageRows, putDataWage, props, columns) : null}
      />
      <div>
        <Grid container spacing={16} direction="row" justify="flex-start" alignItems="flex-start" style={{ paddingLeft: '10px', marginTop: '80px' }}>
          {/* {show ? ( */}
          <Grid item container style={{ width: `${widthVertical}px`, maxHeight: '700px', overflowY: 'auto', marginTop: '60px' }}>
            {/* <Grid item>
                <CustomButton
                  color="primary"
                  onClick={e => {
                    
                    handleChangeVertical();
                    
                  }}
                >
                  {show ? 'Thu gọn' : 'Mở rộng'}
                </CustomButton>
              </Grid> */}
            {/* <Tabs value={tab} onChange={(e, tab) => setTab(tab)}>
              <Tab value={0} label={'Biến động trong tháng'} />
              <Tab value={1} label={'Sơ đồ tổ chức'} />
            </Tabs> */}
            {/* {tab === 0 && renderFluctuationsMonth()} */}
            {/* {tab === 1 && ( */}
            <VerticalDepartmentTree
              addUser={false}
              addHrm={true}
              departments={allDepartment}
              onChange={handleSelectDepart}
              departmentId={organizationUnitId}
            />
            {/* )} */}
          </Grid>
          {/* ) : (
            <Grid item container style={{ marginTop: '60px' }}>
              <CustomButton
                color="primary"
                onClick={e => {
                  handleChangeVertical();
                }}
              >
                {show ? 'Thu gọn' : 'Mở rộng'}
              </CustomButton>
            </Grid>
          )} */}

          <Grid item style={{ width: `calc(100% - ${widthVertical}px)` }}>
            <Grid container direction="row" justify="flex-end">
              {/* <Fab onClick={() => setOpenViewConfig(true)}>
                <Visibility />
              </Fab> */}
              <Fab onClick={e => setExportAnchor(e.currentTarget)}>
                <Tooltip title="Xuất dữ liệu">
                  <Archive style={{ color: 'white' }} />
                </Tooltip>
              </Fab>

              <Fab onClick={e => setAnchorEl(e.currentTarget)}>
                <Dehaze style={{ color: 'white' }} />
              </Fab>
              <MenuAction handleClose={() => setAnchorEl(null)} anchorEl={anchorEl} openSendSalary={handleOpenSendSalary} />
            </Grid>
            <Grid className={classes.root}>
              <ListPage
                columns={columns}
                rows={listPageRows}
                onRowClick={item => {
                  handleClickSalaryDetail(listPageRows, item, formulaAttributes);
                }}
                onSelectSalary={handleClickSalaryDetail}
                formulaId={selectedWageSalary && selectedWageSalary.formula && selectedWageSalary.formula._id}
                columnBands={columnBands}
                client
                filter={filter}
              />
            </Grid>
          </Grid>
        </Grid>
      </div>

      {openViewConfig && <DialogViewConfig open={openViewConfig} onClose={() => setOpenViewConfig(false)} listTitle={listTitle} />}
      {openSendSalary && (
        <SendSalaryByEmail
          open={openSendSalary}
          onClose={handleCloseSendSalary}
          rows={listPageRows}
          onSendMail={handleSendMail}
          templates={templates}
          listTitle={listTitle}
          wageTable={selectedWageSalary && selectedWageSalary._id}
          formulaId={selectedWageSalary && selectedWageSalary.formula && selectedWageSalary.formula._id}
        />
      )}
      <Menu keepMounted open={Boolean(exportAnchor)} onClose={() => setExportAnchor(null)} anchorEl={exportAnchor}>
        <MenuItem onClick={e => onExportExcel(e)}>Excel</MenuItem>
        <MenuItem onClick={e => onExportPDF(e)}>PDF</MenuItem>
      </Menu>

      {openModalSalary && (
        <ModalSalaryCalculationDetails
          open={openModalSalary}
          onClose={handleCloseModelSalary}
          salaryDetail={selectSalaryDetail}
          formulaAttributes={formulaAttributes}
        />
      )}
      <ExportTable exportType={openExcel} open={openExcel} onClose={handleCloseExcel} row={listPageRows} col={columns} />
    </div>
  );
}

WagesSalaryDetail.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  // dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    onMergeData: data => dispatch(MergeData(data)),
    mergeData: data => dispatch(mergeData(data)),
    getDetail: data => dispatch(getDetailWageSalary(data)),

    getAllTemplate: () => dispatch(getAllTemplate()),
    sendEmailWagesSalary: data => dispatch(sendMailWageSalary(data)),
    putDataWage: (data, id) => dispatch(putDataWage(data, id)),
  };
}

const mapStateToProps = createStructuredSelector({
  wageSalaryDetailPage: makeSelectWageSalaryDetail(),
  miniActive: makeSelectMiniActive(),
});

const withReducer = injectReducer({ key: 'wageSalaryDetail', reducer });
const withSaga = injectSaga({ key: 'wageSalaryDetail', saga });

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withSaga,
  withReducer,
  memo,
  injectIntl,
  withStyles(styles),
  withConnect,
)(WagesSalaryDetail);

import React, { useState, useEffect, memo, useCallback } from 'react';
import ListPage from 'components/List';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Grid, TextField, MenuItem, Button, Menu, Tooltip, IconButton } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { API_REPORT_STATISTICAL_BOS } from '../../../../config/urlConfig';
import DepartmentAndEmployee from '../../../../components/Filter/DepartmentAndEmployee';
import { makeSelectProfile, makeSelectMiniActive } from '../../../Dashboard/selectors';
import { createStructuredSelector } from 'reselect';
import CustomInputBase from '../../../../components/Input/CustomInputBase';
import { Typography } from '../../../../components/LifetekUi';
import ExportTable from './exportTable';
import { tableToExcel, tableToPDF } from 'helper';
import { Archive } from '@material-ui/icons';

const FIX_COLUMNS = [
  { name: 'name', title: 'Tên', checked: true },
  { name: 'total', title: 'Tổng cộng', checked: true },
  { name: 'newTask', title: 'Công việc mới', checked: true },
  { name: 'doing', title: 'Công việc đang thực hiện', checked: true },
  { name: 'success', title: 'Công việc hoàn thành', checked: true },
];
function ReportBusinessOpportunities(props) {
  const { tab, profile, miniActive } = props;
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState({
    startDate: moment()
      .clone()
      .startOf('month')
      .format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  });
  const [employee, setEmployee] = useState(null);
  const [exportDate, setExportDate] = useState('');
  const [openExcel, setOpenExcel] = useState(null);
  const [reload, setReload] = useState(false);
  const [productGroup, setProductGroup] = useState(null);
  const [exportAnchor, setExportAnchor] = useState(null);
  // TT
  const [errorStartDateEndDate, setErrorStartDateEndDate] = useState(false);
  const [errorTextStartDate, setErrorTextStartDate] = useState('');
  const [errorTextEndDate, setErrorTextEndDate] = useState('');
  const [exportRole, setExportRole] = useState(false);
  const [maxLimit, setMaxLimit] = useState();
  const [totalRecord, setTotalRecord] = useState(0);
  const [totalCustomer, setTotalCustomer] = useState(0);

  useEffect(() => {
    const date = moment().format('YYYY-MM-DD');
    setExportDate(date);

    // get first day of month
    const firstDayOfMonth = moment()
      .clone()
      .startOf('month')
      .format('YYYY-MM-DD');
    // // get today
    const today = moment().format('YYYY-MM-DD');
    setFilter({ ...filter, startDate: firstDayOfMonth, endDate: today });
    setReload(true);
    return () => setReload(false);
  }, []);

  const handleChangeFilter = (e, isDate, isStartDate) => {
    const name = isDate ? (isStartDate ? 'startDate' : 'endDate') : 'typeEmp';
    const value = isDate ? (isStartDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD')) : e.target.value;
    const newFilter = { ...filter, [name]: value };
    // TT
    if (!newFilter.startDate && newFilter.endDate) {
      setErrorStartDateEndDate(true);
      setErrorTextStartDate('nhập thiếu: "Từ ngày"');
      setErrorTextEndDate('');
    } else if (newFilter.startDate && !newFilter.endDate) {
      setErrorStartDateEndDate(true);
      setErrorTextStartDate('');
      setErrorTextEndDate('nhập thiếu: "Đến ngày"');
    } else if (newFilter.startDate && newFilter.endDate && new Date(newFilter.endDate) < new Date(newFilter.startDate)) {
      setErrorStartDateEndDate(true);
      setErrorTextStartDate('"Từ ngày" phải nhỏ hơn "Đến ngày"');
      setErrorTextEndDate('"Đến ngày" phải lớn hơn "Từ ngày"');
    } else {
      setErrorStartDateEndDate(false);
      setErrorTextStartDate('');
      setErrorTextEndDate('');
    }

    setFilter(newFilter);
    setReload(true);
  };

  const handleChangeDepartmentAndEmployee = useCallback(
    result => {
      const { department, employee } = result;
      if (department) {
        const newFilter = { ...filter, organizationUnitId: department };
        delete newFilter.employeeId;
        setFilter(newFilter);
        setEmployee(null);
      }
      if (employee && employee._id) {
        setFilter({ ...filter, employeeId: employee && employee._id });
        setEmployee(employee);
      }
    },
    [filter],
  );
  const handleChangeShow = value => {
    setShow(value);
  };

  const customFunction = data =>
    data.map(item => ({
      ...item,
      totalBusinessOpportunities: item.total,
      newBusinessOpportunities: item.newTask,
      doingBusinessOpportunities: item.doing,
      successBusinessOpportunities: item.success,
    }));
  const getTotalRecord = count => {
    setTotalRecord(count);
  };
  const getTotalCustomer = count => {
    setTotalCustomer(count);
  };

  const onExportExcel = () => {
    if (!filter.startDate) {
      props.onChangeSnackbar({ status: true, message: `Nhập thiếu từ ngày!`, variant: 'error' });
      return;
    }
    if (!filter.endDate) {
      props.onChangeSnackbar({ status: true, message: `Nhập thiếu đến ngày!`, variant: 'error' });
      return;
    }
    if (!exportDate || moment(exportDate).isBefore(moment(filter.startDate))) {
      props.onChangeSnackbar({ status: true, message: 'Ngày xuất báo cáo không hợp lệ!', variant: 'error' });
      return;
    }
    setOpenExcel('Excel');
  };
  const onExportPDF = () => {
    if (!filter.startDate) {
      props.onChangeSnackbar({ status: true, message: `Nhập thiếu từ ngày!`, variant: 'error' });
      return;
    }
    if (!filter.endDate) {
      props.onChangeSnackbar({ status: true, message: `Nhập thiếu đến ngày!`, variant: 'error' });
      return;
    }
    if (!exportDate || moment(exportDate).isBefore(moment(filter.startDate))) {
      props.onChangeSnackbar({ status: true, message: 'Ngày xuất báo cáo không hợp lệ!', variant: 'error' });
      return;
    }
    setOpenExcel('PDF');
  };

  const [html, setHtml] = useState([]);
  const [htmlTotal, setHtmlTotal] = useState(0);

  useEffect(
    () => {
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
    },
    [html, htmlTotal],
  );

  const handleCloseExcel = payload => {
    const type = openExcel;
    setOpenExcel(null);

    if (payload && payload.error) {
      if (payload.res && payload.res.message) {
        const { message } = payload.res;
      } else console.log('message', '111111');
      return;
    }

    switch (type) {
      case 'PDF':
        const { totalPage = 1, pageNumber = 1 } = payload || {};
        const content = tableToPDF('excelTableBosReport');
        setHtml(e => [...e, { content, pageNumber }]);
        setHtmlTotal(totalPage);
        break;
      case 'Excel':
        tableToExcel('excelTableBosReport', 'W3C Example Table');
      default:
    }

    // setOpenExcel(null);
    // tableToExcel('excel-table-bos', 'W3C Example Table');
  };

  const handleChangeExportDate = e => {
    setExportDate(e);
  };

  const customChildRows = (row, rootRows) => {
    let childRows = [];

    if (!row) {
      let remainRow = [];
      rootRows.map(e => {
        if (!e.parent) childRows.push(e);
        else remainRow.push(e);
      });

      remainRow = remainRow.filter(e => !rootRows.find(remain => remain._id === e.parent));

      childRows = [...remainRow, ...childRows];
    } else childRows = rootRows.filter(r => r.parent === row._id);

    return childRows.length ? childRows : null;
  };
  const newFilter = { ...filter };
  if (newFilter.typeEmp === 0) {
    delete newFilter.typeEmp;
  }

  return (
    <React.Fragment>
      <Grid style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 80px)' }}>
        <Grid xs={12}>
          <Typography align="center" variant="h5" style={{ marginTop: 30 }}>
            Báo cáo thống kê cơ hội kinh doanh
          </Typography>
          <Grid item spacing={16} container direction="row" justify="flex-start" alignItems="center" style={{ paddingLeft: 50, paddingTop: 20 }}>
            <Grid item xs={4}>
              <DepartmentAndEmployee
                department={filter.organizationUnitId}
                employee={employee}
                onChange={handleChangeDepartmentAndEmployee}
                profile={props.profile}
                moduleCode="reportsBusinessOpportunities"
              />
            </Grid>
            {/* <Grid container style={{ paddingLeft: 15, marginBottom: 5 }} xs={4}> */}
            <Grid item xs={2} style={{ position: 'relative', marginBottom: 4 }}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  value={filter.startDate}
                  fullWidth
                  variant="outlined"
                  label="Từ ngày"
                  margin="dense"
                  required
                  name="startDate"
                  onChange={e => handleChangeFilter(e, true, true)}
                />
              </MuiPickersUtilsProvider>
              {errorStartDateEndDate ? (
                <p style={{ color: 'red', margin: '0px', position: 'absolute', top: '68px', left: '10px' }}>{errorTextStartDate}</p>
              ) : null}
            </Grid>
            <Grid item xs={2} style={{ position: 'relative', marginBottom: 4 }}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  inputVariant="outlined"
                  fullWidth
                  format="DD/MM/YYYY"
                  value={filter.endDate}
                  variant="outlined"
                  label="Đến ngày"
                  margin="dense"
                  required
                  name="endDate"
                  onChange={e => handleChangeFilter(e, true, false)}
                />
              </MuiPickersUtilsProvider>
              {errorStartDateEndDate ? (
                <p style={{ color: 'red', margin: '0px', position: 'absolute', top: '68px', left: '10px' }}>{errorTextEndDate}</p>
              ) : null}
            </Grid>
            <Grid item xs={2} style={{ position: 'relative', marginBottom: 4 }}>
              <Tooltip title="Xuất dữ liệu">
                <IconButton aria-label="Export" onClick={e => setExportAnchor(e.currentTarget)}>
                  <Archive style={{ width: '30px', height: '30px' }} />
                </IconButton>
              </Tooltip>
            </Grid>
            {/* </Grid> */}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {newFilter.startDate <= newFilter.endDate ? (
            <ListPage
              apiUrl={API_REPORT_STATISTICAL_BOS}
              code="reportsBusinessOpportunities"
              customFunction={customFunction}
              filter={newFilter}
              disableSearch
              disableAdd
              disableImport
              disableViewConfig
              disableSelect
              disableEdit
              filterType
              totalRecord={getTotalRecord}
              totalCustomer={getTotalCustomer}
              disableFieldName={[{ name: 'edit' }]}
              disabledRow
              tree
              customChildRows={customChildRows}
              getMaxLimit={setMaxLimit}
            />
          ) : (
            <ListPage
              code="reportsBusinessOpportunities"
              customFunction={
                customFunction // reload={reload} // null // apiUrl={API_REPORT_STATISTICAL_BOS}
              }
              disableSearch
              disableAdd
              disabledImport
              disableSelect
              disableEdit
              filterType
              reload={
                false // filter={filter}
              }
              noData
              disableFieldName={[{ name: 'edit' }]}
              disabledRow
              // tree
              // customChildRows={customChildRows}
            />
          )}
        </Grid>
        <ExportTable
          exportType={openExcel}
          filter={{ ...newFilter, endDate: moment(exportDate).isBefore(moment(filter.endDate)) ? exportDate : filter.endDate }}
          url={API_REPORT_STATISTICAL_BOS}
          open={openExcel}
          onClose={handleCloseExcel}
          exportDate={exportDate}
          startDate={filter.startDate}
          endDate={filter.endDate}
          employee={employee}
          department={filter.organizationUnitId}
          maxLimit={maxLimit}
        />
        <Grid item xs={12} spacing={4} container direction="row" alignItems="center">
          <Grid item xs={2} container direction="row" alignItems="flex-start" style={{ paddingLeft: 50 }}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DateTimePicker
                inputVariant="outlined"
                format="DD/MM/YYYY"
                value={exportDate}
                variant="outlined"
                label="Ngày xuất báo cáo"
                margin="dense"
                required
                name="exportDate"
                onChange={handleChangeExportDate}
                disableFuture
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={10} container direction="row" justify="flex-end" style={{ paddingRight: 50 }}>
            {/*  <Button variant="outlined" onClick={e => setExportAnchor(e.currentTarget)} style={styles.importBtn}>
              Xuất báo cáo
            </Button>

            <Menu keepMounted open={Boolean(exportAnchor)} onClose={() => setExportAnchor(null)} anchorEl={exportAnchor}>
              <MenuItem onClick={onExportExcel}>Excel</MenuItem>
              <MenuItem onClick={onExportPDF}>PDF</MenuItem>
            </Menu> */}
            {/* 
            <Button variant="outlined" color="primary" onClick={e => setExportAnchor(e.currentTarget)} style={styles.importBtn}>
              Xuất báo cáo
            </Button> */}
            {/* <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                console.log(props);
              }}
              style={styles.importBtn}
            >
              Thoát
            </Button> */}
            <Menu keepMounted open={Boolean(exportAnchor)} onClose={() => setExportAnchor(null)} anchorEl={exportAnchor}>
              <MenuItem onClick={onExportExcel} style={styles.menuItem}>
                Excel
              </MenuItem>
              <MenuItem onClick={onExportPDF} style={styles.menuItem}>
                PDF
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
// const mapStateToProps = createStructuredSelector({
//   stockPage: makeSelectStockPage(),
// });

// const withConnect = connect(
//   mapStateToProps,
// );
const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect)(ReportBusinessOpportunities);
const styles = {
  importBtn: {
    marginLeft: 10,
    width: 150,
  },
  menuItem: {
    width: 50,
    justifyContent: 'center',
  },
};

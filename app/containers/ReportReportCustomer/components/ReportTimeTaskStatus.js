import React, { useState, useEffect, memo, useCallback } from 'react';
import ListPage from 'components/List';
import { Grid, TextField, MenuItem, Button, Menu } from '@material-ui/core';
import moment from 'moment';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import { API_REPORT_TASK_STATUS, API_EXPORT_TASKSTATUS } from 'config/urlConfig';
import DepartmentAndEmployee from 'components/Filter/DepartmentAndEmployee';
import { Typography } from 'components/LifetekUi';
import { tableToExcel, tableToPDF } from 'helper';
import ExportTable from './exportExcel';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectProfile,makeSelectMiniActive } from '../../../Dashboard/selectors';

const FIX_COLUMNS = [
  { name: 'name', title: 'Tên', checked: true },
  { name: 'total', title: 'Tổng cộng', checked: true },
  { name: 'newTask', title: 'Công việc mới', checked: true },
  { name: 'doing', title: 'Công việc đang thực hiện', checked: true },
  { name: 'success', title: 'Công việc đang hoàn thành', checked: true },
  { name: 'pause', title: 'Công việc đang tạm dừng', checked: true },
  { name: 'failed', title: 'Công việc thất bại', checked: true },
];
function ReportTimeWorkStatus(props) {
  const [miniActive] = props;
  const [filter, setFilter] = useState({});
  const [employee, setEmployee] = useState(null);
  const [exportDate, setExportDate] = useState('');
  const [openExcel, setOpenExcel] = useState(null);
  const [dateExport, setDateExport] = useState('');
  const [reload, setReload] = useState(false);
  const [exportAnchor, setExportAnchor] = useState(null);

  // TT
  const [errorStartDateEndDate, setErrorStartDateEndDate] = useState(false);
  const [errorTextStartDate, setErrorTextStartDate] = useState('');
  const [errorTextEndDate, setErrorTextEndDate] = useState('');
  const [exportRole, setExportRole] = useState(false);
  const [maxLimit, setMaxLimit] = useState();

  useEffect(() => {
    const date = moment().format('YYYY-MM-DD');
    setExportDate(date);

    // get first day of month
    const firstDayOfMonth = moment()
      .clone()
      .startOf('month')
      .format('YYYY-MM-DD');
    // get today
    const today = moment().format('YYYY-MM-DD');
    setFilter({ ...filter, startDate: firstDayOfMonth, endDate: today });
    setReload(true);
    return () => setReload(false);
  }, []);

  // const handleChange = e => {
  //   const value = e.target.value;
  //   const name = e.target.name;
  //   setFilter({ ...filter, [name]: value });
  // };

  const handleChangeFilter = useCallback(
    (e, isDate, isStartDate) => {
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
    },
    [filter],
  );

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

  const handleChangeExportDate = e => {
    setExportDate(e);
  };

  const customFunction = data =>
    data.map(item => ({
      ...item,
      newTask: item.newTask,
      totalTask: item.total,
      doingTask: item.doing,
      successTask: item.success,
      pauseTask: item.pause,
      failedTask: item.failed,
    }));

  const onExportExcel = () => {
    if (!exportDate || moment(exportDate).isBefore(moment(filter.startDate))) {
      props.onChangeSnackbar({ status: true, message: 'Ngày xuất báo cáo không hợp lệ!', variant: 'error' });
      return;
    }

    setOpenExcel('Excel');
  };
  const onExportPDF = () => {
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
        props.onChangeSnackbar({ status: true, message, variant: 'error' });
      } else props.onChangeSnackbar({ status: true, message: 'Có lỗi xảy ra', variant: 'error' });
      return;
    }

    switch (type) {
      case 'PDF':
        const { totalPage = 1, pageNumber = 1 } = payload || {};
        const content = tableToPDF('excel-table-work-status');
        setHtml(e => [...e, { content, pageNumber }]);
        setHtmlTotal(totalPage);
        break;
      default:
        tableToExcel('excel-table-work-status', 'W3C Example Table');
    }

    // setOpenExcel(null);
    // tableToExcel('excel-table-work-status', 'W3C Example Table');
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
  return (
    <React.Fragment>
      <Grid style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 80px)' }}>
      <Grid style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 80px)' }}>
          <Typography align="center">BÁO CÁO TRẠNG THÁI CÔNG VIỆC</Typography>
          <Grid item spacing={16} container direction="row" justify="flex-end" alignItems="center">
            <Grid item xs={4}>
              <DepartmentAndEmployee
                department={filter.organizationUnitId}
                employee={employee}
                onChange={handleChangeDepartmentAndEmployee}
                profile={props.profile}
                moduleCode="reportsTaskStatus"
              />
            </Grid>
            <Grid item xs={2} style={{ position: 'relative' }}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  value={filter.startDate}
                  variant="outlined"
                  label="Từ ngày"
                  margin="dense"
                  required
                  name="startDate"
                  onChange={e => handleChangeFilter(e, true, true)}
                />
              </MuiPickersUtilsProvider>
              {/* <CustomInputBase label="Từ ngày" type="date" name="startDate" value={filter.startDate} onChange={handleChangeFilter} /> */}
              {errorStartDateEndDate ? (
                <p style={{ color: 'red', margin: '0px', position: 'absolute', top: '68px', left: '10px' }}>{errorTextStartDate}</p>
              ) : null}
            </Grid>
            <Grid item xs={2} style={{ position: 'relative' }}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  inputVariant="outlined"
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
              {/* <CustomInputBase label="Đến ngày" type="date" name="endDate" value={filter.endDate} onChange={handleChangeFilter} /> */}
              {errorStartDateEndDate ? (
                <p style={{ color: 'red', margin: '0px', position: 'absolute', top: '68px', left: '10px' }}>{errorTextEndDate}</p>
              ) : null}
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {filter.startDate && filter.endDate ? (
            <ListPage
              showDepartmentAndEmployeeFilter
              apiUrl={API_REPORT_TASK_STATUS}
              code="reportsTaskStatus"
              customFunction={customFunction}
              filter={filter}
              disableSearch
              disableAdd
              disabledImport
              disableSelect
              disableEdit
              filterType
              reload={reload}
              disableFieldName={[{ name: 'edit' }]}
              disabledRow
              tree
              customChildRows={customChildRows}
              getMaxLimit={setMaxLimit}
            />
          ) : (
            <ListPage // apiUrl={API_REPORT_TASK_STATUS}
              showDepartmentAndEmployeeFilter
              code="reportsTaskStatus"
              customFunction={customFunction} // filter={filter}
              disableSearch
              disableAdd
              disabledImport
              disableSelect
              disableEdit
              filterType
              reload={false}
              setNoDataReports
              disableFieldName={[{ name: 'edit' }]}
              disabledRow
              tree
              customChildRows={customChildRows}
            />
          )}

          {/* <ListReport disableSearch apiUrl={API_REPORT_TASK_STATUS} filter={filter} columns={FIX_COLUMNS} customFunction={customFunction} /> */}
        </Grid>
        <ExportTable
          exportType={openExcel}
          filter={{ ...filter, endDate: moment(exportDate).isBefore(moment(filter.endDate)) ? exportDate : filter.endDate }}
          url={API_EXPORT_TASKSTATUS}
          open={openExcel}
          onClose={handleCloseExcel}
          exportDate={moment(exportDate).isBefore(moment(filter.endDate)) ? exportDate : filter.endDate}
          startDate={filter.startDate}
          endDate={filter.endDate}
          employee={employee}
          department={filter.organizationUnitId}
          maxLimit={maxLimit}
        />
        <Grid item xs={12} style={{ padding: '8px' }} spacing={4} container direction="row" alignItems="center">
          <Grid item xs={2} container direction="row" alignItems="flex-start">
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
                onChange={e => handleChangeExportDate(e)}
                disableFuture
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={10} container direction="row" justify="flex-end">
            {/* <Button variant="outlined" onClick={onExportPDF} style={styles.importBtn}>
              Xuất PDF
            </Button>
            <Button variant="outlined" onClick={onExportExcel} style={styles.importBtn}>
              Xuất báo cáo
            </Button> */}

            <Button variant="outlined" onClick={e => setExportAnchor(e.currentTarget)} style={styles.importBtn}>
              Xuất báo cáo
            </Button>

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
        {/* <Grid item xs={12}>
          <CustomChartWrapper height='500px' >
            <StackColumnChart
              style={{ width: '100%', height: '50vh' }}
              // style={{ height: '100%' }}
              id="chart2"
              titleChart="Thống kê công việc"
              // data={dataChartStatisticJob}
              dataFieldsCategory="month"
              arrSeries={[
                { fieldSerie: 'newTask', displayNameSerie: 'Công việc mới' },
                { fieldSerie: 'doing', displayNameSerie: 'Đang thực hiện' },
                { fieldSerie: 'success', displayNameSerie: 'Hoàn thành' },
                { fieldSerie: 'pause', displayNameSerie: 'Tạm dừng' },
                { fieldSerie: 'failed', displayNameSerie: 'Thất bại' },
              ]}
            />
          </CustomChartWrapper>
        </Grid> */}
      </Grid>
    </React.Fragment>
  );
}
const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect)(ReportTimeWorkStatus);

const styles = {
  importBtn: {
    marginLeft: 10,
    width: 200,
  },
  menuItem: {
    width: 200,
    justifyContent: 'center',
  },
};

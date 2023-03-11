import React, { useState, useEffect, memo, useCallback } from 'react';
import ListPage from 'components/List';
import { Dialog, DialogContent, withStyles, Slide, AppBar, Tab, Tabs, Toolbar, Tooltip, IconButton } from '@material-ui/core';
import { Grid, TextField, MenuItem, Button, Menu } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import {
  API_REPORT_HRM_BY_SIGNED,
  API_REPORT_HRM_SENIORITY,
  API_REPORT_HRM_DEGREE,
  API_ADD_CANDIDATE,
  API_RECRUIMENT_WAVE,
  API_RECRUITMENT_AGENCY,
} from '../../../../config/urlConfig';
import DepartmentAndEmployee from '../../../../components/Filter/DepartmentAndEmployee';
import { Typography } from '../../../../components/LifetekUi';
import CustomChartWrapper from 'components/Charts/CustomChartWrapper';
import CustomInputBase from 'components/Input/CustomInputBase';
import ExportTable from './exportTable';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import { tableToExcel, tableToPDF, serialize, fetchData } from 'helper';
import HrmSignedChart from './hrmSignedChart';
// import HrmDegreeChart from './hrmDegreeChart';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import { Archive } from '@material-ui/icons';
am4core.useTheme(Am4themesAnimated);

function ColumnLineChart(props) {
  const { id, data, type = '', titleTex, dataAllName } = props;
  useEffect(
    () => {
      var chart = am4core.create(id, am4charts.XYChart);

      am4core.addLicense('ch-custom-attribution');
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 16;
      title.marginBottom = 20;
      title.fontWeight = '500';

      chart.data = data;
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'recruitmentUnit';
      categoryAxis.title.text = 'Sơ đô abc xyz';
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 20;

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = 'Số lượng hồ sơ';

      // Create series
      dataAllName.map(i => {
        var series = i.code;
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = i.code;
        series.dataFields.categoryX = 'recruitmentUnit';
        series.strokeWidth = 3;
        series.name = i.name;
        series.tooltipText = '{recruitmentUnit}: [bold]{valueY}[/]';
        var series = series.bullets.push(new am4charts.CircleBullet());
      });

      chart.cursor = new am4charts.XYCursor();

      chart.legend = new am4charts.Legend();
    },
    [data],
  );
  return <div {...props} style={{ height: 630, padding: '20px 0', marginTop: 20, width: '100%' }} id={id} />;
}

function ReportRecruitment(props) {
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState({
    recruitmentUnit: null,
    candidat: null,
    beginWorkStartDate: moment()
      .subtract(30, 'years')
      .format('YYYY-MM-DD'),
    beginWorkEndDate: moment().format('YYYY-MM-DD'),
  });
  const [employee, setEmployee] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [dataCharts, setDataCharts] = useState([]);
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
  const [reportSeniorityData, setReportSeniorityData] = useState([]);
  const [reportDegreeData, setReportDegreeData] = useState([]);
  const degree = JSON.parse(localStorage.getItem('hrmSource')).find(item => item.code === 'S07');
  const dataDegree = degree && degree.data;

  const [dataAllCharts, setDataAllCharts] = useState([]);
  const [dataAllName, setDataAllName] = useState([]);

  const [listRecruitment, setListRecruitment] = useState([]);

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
    setFilter({ ...filter, beginWorkEndDate: today });
    setReload(true);
    fetchReportSeniority();
    fetchReportDegree();
    return () => setReload(false);
  }, []);

  useEffect(() => {
    const datas = fetchData(`${API_RECRUITMENT_AGENCY}`, 'GET', null).then(res => {
      if (res.data) setListRecruitment(res.data);
    });
  }, []);

  useEffect(
    () => {
      const filters = {
        date: filter.date,
      };
      const dataFil = serialize(filters);
      fetch(`${API_ADD_CANDIDATE}/allByUnit`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          setDataAllName(data.noteArray);
          setDataAllCharts(data.data);
        });
    },
    [filter],
  );

  const viewConfig = JSON.parse(localStorage.getItem('hrmSource'));
  const listS30 = viewConfig.find(item => item.code === 'S30');

  const fetchReportSeniority = () => {
    fetch(`${API_REPORT_HRM_SENIORITY}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.status && data.data) {
          setReportSeniorityData([
            { name: '< 1 năm', value: data.data.underOneYear },
            { name: '1-2 năm', value: data.data.underTwoYear },
            { name: '2-3 năm', value: data.data.underThreeYear },
            { name: '3-4 năm', value: data.data.underFourYear },
            { name: '> 4 năm', value: data.data.aboveFourYear },
          ]);
        }
      })
      .catch(error => console.log('error', error));
  };

  const fetchReportDegree = () => {
    fetch(`${API_REPORT_HRM_DEGREE}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.status && data.data) {
          setReportDegreeData(data.data);
        }
      })
      .catch(error => console.log('error', error));
  };

  const handleChangeFilter = (e, isDate, isStartDate) => {
    let newFilter;
    if (isDate) {
      const name = isDate ? (isStartDate ? 'beginWorkStartDate' : 'beginWorkEndDate') : 'typeEmp';
      const value = isDate ? (isStartDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD')) : e.target.value;
      newFilter = { ...filter, [name]: value };
      // TT
      if (!newFilter.beginWorkStartDate && newFilter.beginWorkEndDate) {
        setErrorStartDateEndDate(true);
        setErrorTextStartDate('nhập thiếu: "Từ ngày"');
        setErrorTextEndDate('');
      } else if (newFilter.beginWorkStartDate && !newFilter.beginWorkEndDate) {
        setErrorStartDateEndDate(true);
        setErrorTextStartDate('');
        setErrorTextEndDate('nhập thiếu: "Đến ngày"');
      } else if (
        newFilter.beginWorkStartDate &&
        newFilter.beginWorkEndDate &&
        new Date(newFilter.beginWorkEndDate) < new Date(newFilter.beginWorkStartDate)
      ) {
        setErrorStartDateEndDate(true);
        setErrorTextStartDate('"Từ ngày" phải nhỏ hơn "Đến ngày"');
        setErrorTextEndDate('"Đến ngày" phải lớn hơn "Từ ngày"');
      } else {
        setErrorStartDateEndDate(false);
        setErrorTextStartDate('');
        setErrorTextEndDate('');
      }
    } else {
      const name = e.target.name;
      const value = e.target.value;
      newFilter = { ...filter, [name]: value };
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

  const customFunction = (data, curr) =>
    data.map((item, index) => ({
      ...item,
      order: index + 1 + curr * 10,
      birthday: item.birthday && moment(item.birthday).format('YYYY'),
      degree: item['degree.title'] ? item['degree.title'] : '',
    }));

  const getTotalRecord = count => {
    setTotalRecord(count);
  };
  const getTotalCustomer = count => {
    setTotalCustomer(count);
  };

  const onExportExcel = () => {
    if (!filter.beginWorkStartDate) {
      props.onChangeSnackbar({ status: true, message: `Nhập thiếu từ ngày!`, variant: 'error' });
      return;
    }
    if (!filter.beginWorkEndDate) {
      props.onChangeSnackbar({ status: true, message: `Nhập thiếu đến ngày!`, variant: 'error' });
      return;
    }
    if (!exportDate || moment(exportDate).isBefore(moment(filter.beginWorkStartDate))) {
      props.onChangeSnackbar({ status: true, message: 'Ngày xuất báo cáo không hợp lệ!', variant: 'error' });
      return;
    }
    setOpenExcel('Excel');
  };
  const onExportPDF = () => {
    if (!filter.beginWorkStartDate) {
      props.onChangeSnackbar({ status: true, message: `Nhập thiếu từ ngày!`, variant: 'error' });
      return;
    }
    if (!filter.beginWorkEndDate) {
      props.onChangeSnackbar({ status: true, message: `Nhập thiếu đến ngày!`, variant: 'error' });
      return;
    }
    if (!exportDate || moment(exportDate).isBefore(moment(filter.beginWorkStartDate))) {
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
        const content = tableToPDF('excelTableBySign');
        setHtml(e => [...e, { content, pageNumber }]);
        setHtmlTotal(totalPage);
        break;
      default:
        tableToExcel('excelTableBySign', 'W3C Example Table');
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
      <Tabs
        value={tabIndex}
        onChange={(event, tabIndex) => {
          setTabIndex(tabIndex);
        }}
        indicatorColor="primary"
        textColor="primary"
        style={{ width: 500 }}
      >
        <Tab value={0} label={'Báo cáo'} />
        <Tab value={1} label={'Biểu đồ'} />
      </Tabs>
      {tabIndex === 0 ? (
        <Grid container spacing={16} style={{ width: window.innerWidth - 250 }}>
          <Grid xs={12}>
            <Typography align="center" variant="h5" style={{ marginTop: 30 }}>
              Báo cáo tổng hợp hồ sơ tuyển dụng
            </Typography>
            <Grid item spacing={16} container direction="row" justify="flex-start" alignItems="center" style={{ paddingLeft: 50, paddingTop: 20 }}>
              <Grid item xs={2}>
                <DepartmentAndEmployee
                  department={filter.organizationUnitId}
                  employee={employee}
                  disableEmployee
                  onChange={handleChangeDepartmentAndEmployee}
                  profile={props.profile}
                  moduleCode="ReportTotalCandidate"
                />
              </Grid>
              <Grid item xs={2} style={{ position: 'relative', marginBottom: 4 }}>
                {/* <CustomInputBase label="Giới tính" select name="gender" value={filter.gender} onChange={e => handleChangeFilter(e)}>
                  <MenuItem value={'0'}>Nam</MenuItem>
                  <MenuItem value={'1'}>Nữ</MenuItem>
                </CustomInputBase> */}
                <CustomInputBase
                  label="Nguồn tuyển dụng"
                  select
                  name="recruitmentUnit"
                  value={filter.recruitmentUnit}
                  onChange={e => handleChangeFilter(e)}
                >
                  <MenuItem value={null}>-- CHỌN ĐƠN VỊ TUYỂN DỤNG --</MenuItem>
                  {listRecruitment && listRecruitment.length && listRecruitment.map(item => <MenuItem value={item._id}>{item.name}</MenuItem>)}
                </CustomInputBase>
              </Grid>
              <Grid item xs={2} style={{ position: 'relative', marginBottom: 4 }}>
                <CustomInputBase label="Vị trí tuyển dụng" select onChange={e => handleChangeFilter(e)} name="vacanciesId" value={filter.vacanciesId}>
                  <MenuItem value={null}>-- CHỌN VỊ TRÍ TUYỂN DỤNG --</MenuItem>
                  {listS30 && listS30.data.map(item => <MenuItem value={item._id}>{item.title}</MenuItem>)}
                </CustomInputBase>
              </Grid>
              <Grid item xs={2} style={{ position: 'relative', marginBottom: 4 }}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY"
                    value={filter.beginWorkStartDate}
                    fullWidth
                    variant="outlined"
                    label="Từ ngày vào làm"
                    margin="dense"
                    name="beginWorkStartDate"
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
                    value={filter.beginWorkEndDate}
                    variant="outlined"
                    label="Đến ngày vào làm"
                    margin="dense"
                    name="beginWorkEndDate"
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
            </Grid>
          </Grid>

          <Grid item xs={12}>
            {newFilter.beginWorkStartDate <= newFilter.beginWorkEndDate ? (
              <ListPage
                apiUrl={API_RECRUIMENT_WAVE}
                code="ReportTotalCandidate"
                customFunction={customFunction}
                filter={newFilter}
                disableSearch
                disableAdd
                disableImport
                disableViewConfig
                disableSelect
                disableEdit
                withPagination
                filterType
                //   totalRecord={getTotalRecord}
                //   totalCustomer={getTotalCustomer}
                //   disableFieldName={[{ name: 'edit' }]}
                //   disabledRow
                //   tree
                //   customChildRows={customChildRows}
                //   getMaxLimit={setMaxLimit}
              />
            ) : (
              <ListPage
                code="ReportTotalCandidate"
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
          {/* <Grid item xs={6} style={{marginTop: 20}}>
                    <CustomChartWrapper height={500}>
                        <ColumnPieChart
                            id="chartData"
                            data={dataCharts}
                            male={dataCharts.length > 0 ? dataCharts[0].value : 0}
                            feMale={dataCharts.length > 0 ? dataCharts[1].value : 0}
                            titleTex="BIỂU ĐỒ TỔNG NHÂN SỰ"
                        />
                    </CustomChartWrapper>
                </Grid> */}
          <ExportTable
            exportType={openExcel}
            filter={{ ...newFilter, endDate: moment(exportDate).isBefore(moment(filter.endDate)) ? exportDate : filter.endDate }}
            url={API_REPORT_HRM_BY_SIGNED}
            open={openExcel}
            onClose={handleCloseExcel}
            exportDate={exportDate}
            startDate={filter.beginWorkStartDate}
            endDate={filter.beginWorkEndDate}
            employee={employee}
            department={filter.organizationUnitId}
            //   maxLimit={maxLimit}
          />
          <Grid item xs={12} style={{ padding: '8px' }} spacing={4} container direction="row" alignItems="center">
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
              {/* <Button variant="outlined" color="primary" onClick={e => setExportAnchor(e.currentTarget)} style={styles.importBtn}>
                Xuất báo cáo
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
      ) : null}
      {tabIndex === 1 ? (
        <Grid container spacing={16} style={{ width: window.innerWidth - 260 }}>
          <Grid item xs={12} style={{ marginTop: 20 }}>
            <CustomChartWrapper height={650} disableReload disableExport>
              <ColumnLineChart
                id="chartLineData"
                data={dataAllCharts}
                dataAllName={dataAllName}
                titleTex="BIỂU ĐỒ TỔNG HỢP SỐ LƯỢNG HỒ SƠ TUYỂN DỤNG THEO NGUỒN"
              />
            </CustomChartWrapper>
          </Grid>
          {/* <ExportTable
          exportType={openExcel}
          filter={{ ...newFilter }}
          url={API_REPORT_HRM_WAGE_BY_ORG}
          open={openExcel}
          onClose={handleCloseExcel}
          // exportDate={exportDate}
          // startDate={filter.startDate}
          // endDate={filter.endDate}
          employee={employee}
          department={filter.organizationUnitId}
          //   maxLimit={maxLimit}
        /> */}
          {/* <Grid item xs={12} style={{ padding: '8px' }} spacing={4} container direction="row" alignItems="center">
          <Grid item xs={2} container direction="row" alignItems="flex-start" style={{ paddingLeft: 50 }}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DateTimePicker
                inputVariant="outlined"
                format="DD/MM/YYYY"
                value={exportDate}
                variant="outlined"
                label="Ngày xuất báo cáo"
                margin="dense"
                // required
                name="exportDate"
                onChange={handleChangeExportDate}
                disableFuture
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={10} container direction="row" justify="flex-end" style={{ paddingRight: 50 }}>
            <Button variant="outlined" color="primary" onClick={e => setExportAnchor(e.currentTarget)} style={styles.importBtn}>
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
        </Grid> */}
        </Grid>
      ) : null}
    </React.Fragment>
  );
}
// const mapStateToProps = createStructuredSelector({
//   stockPage: makeSelectStockPage(),
// });

// const withConnect = connect(
//   mapStateToProps,
// );

export default memo(ReportRecruitment);
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

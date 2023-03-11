import React, { useState, useEffect, memo, useCallback } from 'react';
import ListPage from 'components/List';
import { Grid, TextField, MenuItem, Button, Menu, Tab, Tabs } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { API_REPORT_HRM_WAGE_BY_ORG, API_ADD_CANDIDATE } from '../../../../config/urlConfig';
import DepartmentAndEmployee from '../../../../components/Filter/DepartmentAndEmployee';
import CustomInputBase from '../../../../components/Input/CustomInputBase';
import { Typography } from '../../../../components/LifetekUi';
import CustomChartWrapper from 'components/Charts/CustomChartWrapper';
import ExportTable from './exportTable';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import { tableToExcel, tableToPDF, serialize } from 'helper';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(Am4themesAnimated);

const FIX_COLUMNS = [
  { name: 'name', title: 'Tên', checked: true },
  { name: 'total', title: 'Tổng cộng', checked: true },
  { name: 'newTask', title: 'Công việc mới', checked: true },
  { name: 'doing', title: 'Công việc đang thực hiện', checked: true },
  { name: 'success', title: 'Công việc hoàn thành', checked: true },
];
function ColumnPieChart(props) {
  const { id, data, type = '', titleTex, isExport } = props;
  let circleChart1;

  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.PieChart3D);
      chart.depth = 30;
      chart.angle = 40;
      // remove logo am4chart
      am4core.addLicense('ch-custom-attribution');
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 16;
      title.marginBottom = 20;
      title.fontWeight = '500';

      // Add data
      chart.data = data;

      // Add and configure Series
      const pieSeries = chart.series.push(new am4charts.PieSeries3D());
      pieSeries.dataFields.value = 'wage';
      pieSeries.dataFields.category = 'name';
      pieSeries.ticks.template.disabled = true;
      pieSeries.labels.template.disabled = true;
      chart.legend = new am4charts.Legend();
      pieSeries.legendSettings.itemValueText = '{value}';
      chart.legend.width = 200;
      chart.legend.position = 'right';
      chart.legend.scrollable = true;
      circleChart1 = chart;
    },
    [data],
  );
  useEffect(
    () => () => {
      if (circleChart1) {
        circleChart1.dispose();
      }
    },
    [data],
  );

  return <div {...props} style={{ height: 630, padding: '20px 0', marginTop: 20, width: '100%' }} id={id} />;
}
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
function ColumnChart2(props) {
  const { id, data = [], titleTex, dataName = [] } = props;

  // eslint-disable-next-line no-unused-vars
  let ColumnChart;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.XYChart);
    const title = chart.titles.create();
    title.text = titleTex;
    title.fontSize = 25;
    title.marginBottom = 20;
    title.fontWeight = 'bold';
    chart.hiddenState.properties.opacity = 0;

    chart.data = data;
    //set color
    chart.colors.list = [am4core.color('green'), am4core.color('#D65DB1')];
    // add chart legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = 'bottom';
    chart.legend.paddingBottom = 0;
    chart.legend.labels.template.maxWidth = 150;

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = 'recruitmentUnit';
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.fontSize = 11;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    // valueAxis.max = 6000;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 30;

    function createSeries(value, name) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = 'recruitmentUnit';
      series.dataFields.valueY = value;
      series.name = name;
      series.columns.template.tooltipText = '{valueY.value}';
      series.columns.template.tooltipY = 0;
      //set width series
      series.columns.template.width = am4core.percent(60);
      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    }
    // createSeries('add', 'Tuyển dụng ngày 21-1  -  Nhân viên');
    // createSeries('123121', 'Đợt tuyển dụng 1  -  Marketting');
    // createSeries('323', 'Đợt tuyển dụng 2  -  Giám đốc sản xuất');
    // createSeries('dot4', 'Đợt 4');
    // createSeries('dot5', 'Đợt 5');
    dataName.map(i => {
      createSeries(i.code, i.name);
    });

    ColumnChart = chart;
  }, []);
  useEffect(
    () => () => {
      if (ColumnChart) {
        ColumnChart.dispose();
      }
    },
    [],
  );
  return <div {...props} id={id} />;
}
function ColumnChart3(props) {
  const { id, data, type = '', titleTex, isExport } = props;
  useEffect(
    () => {
      var chart = am4core.create(id, am4charts.XYChart);

      am4core.addLicense('ch-custom-attribution');
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 16;
      title.marginBottom = 20;
      title.fontWeight = '500';

      // chart.legend = new am4charts.Legend();
      // chart.legend.position = 'right';

      // Create axes
      chart.data = data;
      var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'name';
      categoryAxis.renderer.grid.template.opacity = 0;

      var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.renderer.grid.template.opacity = 0;
      valueAxis.renderer.ticks.template.strokeOpacity = 0.5;
      valueAxis.renderer.ticks.template.stroke = am4core.color('#495C43');
      valueAxis.renderer.ticks.template.length = 10;
      valueAxis.renderer.line.strokeOpacity = 0.5;
      // valueAxis.renderer.baseGrid.disabled = true;
      valueAxis.renderer.minGridDistance = 200;
      valueAxis.calculateTotals = true;

      // Create series
      function createSeries(field, name) {
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = field;
        series.dataFields.categoryY = 'name';
        series.stacked = true;
        series.name = name;

        var labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.locationX = 0.5;
        labelBullet.label.text = '{valueX}';
        labelBullet.label.fill = am4core.color('#fff');

        return series;
      }

      // some space needed for the total label
      categoryAxis.renderer.labels.template.marginRight = 40;
      // this is the total label series, it is invisible
      var series = createSeries('empty', 'empty');
      // hidden in legend
      series.hiddenInLegend = true;
      // bullets can't be masked
      series.maskBullets = false;

      var bullet = series.bullets.getIndex(0);
      bullet.label.text = "[bold]{valueX.total.formatNumber('#.#')}[/]";
      bullet.label.truncate = false;
      bullet.label.fill = new am4core.InterfaceColorSet().getFor('text');
      bullet.label.paddingRight = 10;
      bullet.label.horizontalCenter = 'right';

      // createSeries("europe", "Europe");
      // createSeries("namerica", "North America");
      // createSeries("asia", "Asia");
      // createSeries("lamerica", "Latin America");
      // createSeries("meast", "Middle East");
      createSeries('number', 'Number');
    },
    [data],
  );
  return <div {...props} style={{ height: 630, padding: '20px 0', marginTop: 20, width: '100%' }} id={id} />;
}

function ReportChartBySource(props) {
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState({
    date: moment().format('YYYY-MM-DD'),
  });
  const [employee, setEmployee] = useState(null);
  const [dataCharts, setDataCharts] = useState([]);
  const [dataAllCharts, setDataAllCharts] = useState([]);
  const [dataName, setDataName] = useState([]);
  const [dataAllName, setDataAllName] = useState([]);
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
  const [tabIndex, setTabIndex] = useState(1);

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
    setFilter({ ...filter, date: today });
    setReload(true);
    return () => setReload(false);
  }, []);
  useEffect(
    () => {
      const filters = {
        date: filter.date,
      };
      const dataFil = serialize(filters);
      fetch(`${API_ADD_CANDIDATE}/byUnit`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          setDataName(data.noteArray);
          setDataCharts(data.data);
        });
    },
    [filter],
  );
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

  const ChartData = [
    {
      wage: 12,
      name: 'Facebook',
    },
    {
      wage: 12,
      name: 'LinkenIn',
    },
    {
      wage: 5,
      name: 'itviec.com',
    },
    {
      wage: 6,
      name: 'tuyendung.vn',
    },
    {
      wage: 2,
      name: 'vieclamit.vn',
    },
    {
      wage: 3,
      name: 'diendanit.com',
    },
    {
      wage: 6,
      name: 'vietnamwork.com',
    },
    {
      wage: 1,
      name: 'careerlink.vn',
    },

    {
      wage: 4,
      name: 'topcv.com',
    },
    {
      wage: 7,
      name: 'timviecnhanh.com',
    },
    {
      wage: 8,
      name: 'vieclamtot.com',
    },
    {
      wage: 4,
      name: 'vieclam24h.vn',
    },
  ];
  const dataLineCharts = [
    {
      recruitmentUnit: 'TopCV',
      receive: 5,
      past1: 3,
      past2: 2,
    },
    {
      recruitmentUnit: 'T3H',
      receive: 3,
      past1: 5,
      past2: 2,
    },
    {
      recruitmentUnit: 'VietNamWork',
      receive: 4,
      past1: 3,
      past2: 1,
    },
    {
      recruitmentUnit: 'Carreert.ink',
      receive: 5,
      past1: 4,
      past2: 6,
    },
  ];
  const fakeData2 = [
    {
      id: 1,
      name: 'TopCV',
      dot1: 12,
      dot2: 11,
      dot3: 10,
      dot4: 9,
      dot5: 7,
    },
    {
      id: 2,
      name: 'T3H',
      dot1: 12,
      dot2: 11,
      dot3: 10,
      dot4: 9,
      dot5: 7,
    },
    {
      id: 3,
      name: 'VietNamWork',
      dot1: 12,
      dot2: 11,
      dot3: 10,
      dot4: 9,
      dot5: 7,
    },
    {
      id: 4,
      name: 'Careert.ink',
      dot1: 12,
      dot2: 11,
      dot3: 10,
      dot4: 9,
      dot5: 7,
    },
  ];
  const fakeData3 = [
    {
      name: '2016',
      number: 2,
    },
    {
      name: '2017',
      number: 4,
    },
    {
      name: '123dsa',
      number: 3,
    },
    {
      name: 'klfal',
      number: 5,
    },
  ];

  const handleChangeFilter = (e, isDate, isStartDate) => {
    const name = isDate ? 'date' : 'typeEmp';
    const value = isDate ? (isStartDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD')) : e.target.value;
    const newFilter = { ...filter, [name]: value };
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

  const customFunction = data => {
    return data.map((item, index) => ({
      ...item,
      order: index + 1,
    }));
  };

  const getTotalRecord = count => {
    setTotalRecord(count);
  };
  const getTotalCustomer = count => {
    setTotalCustomer(count);
  };

  const onExportExcel = () => {
    setOpenExcel('Excel');
  };
  const onExportPDF = () => {
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
        const content = tableToPDF('excelTableWageOrg');
        setHtml(e => [...e, { content, pageNumber }]);
        setHtmlTotal(totalPage);
        break;
      default:
        tableToExcel('excelTableWageOrg', 'W3C Example Table');
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
    <>
      <Tabs
        value={tabIndex}
        onChange={(event, tabIndex) => {
          setTabIndex(tabIndex);
        }}
        indicatorColor="primary"
        textColor="primary"
        style={{ width: 1000 }}
      >
        {/* <Tab value={0} label={'Biểu đồ ...1'} /> */}
        <Tab value={1} label={'Biểu đồ ...2'} />
        {/* <Tab value={2} label={'Biểu đồ ...3'} /> */}
        {/* <Tab value={3} label={'Biểu đồ ...4'} /> */}
        {/* <Tab value={4} label={'Biểu đồ ...5'} /> */}
      </Tabs>
      {/* {tabIndex === 0 ? (
        <Grid container spacing={16} style={{ width: window.innerWidth - 260 }}>
          <Grid xs={12}>
            <Typography align="center" variant="h5" style={{ marginTop: 30 }}>
              Báo cáo thống kê tuyển dụng nhân sự theo nguồn
            </Typography>
            <Grid item spacing={16} container direction="row" justify="flex-start" alignItems="center" style={{ paddingLeft: 50, paddingTop: 20 }}>
              <Grid item xs={2}>
                <DepartmentAndEmployee
                  department={filter.organizationUnitId}
                  employee={employee}
                  disableEmployee
                  onChange={handleChangeDepartmentAndEmployee}
                  profile={props.profile}
                  moduleCode="reportHrmCountByOrg"
                />
              </Grid>
              <Grid item xs={2} style={{ position: 'relative', marginBottom: 4 }}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    views={['year', 'month']}
                    inputVariant="outlined"
                    fullWidth
                    // format="DD/MM/YYYY"
                    value={filter.date}
                    variant="outlined"
                    label="Lọc theo tháng"
                    margin="dense"
                    // required
                    name="date"
                    onChange={e => handleChangeFilter(e, true, false)}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ marginTop: 20 }}>
            <CustomChartWrapper height={650} disableReload disableExport>
              <ColumnPieChart id="chartdiv" data={ChartData} titleTex="BIỂU ĐỒ TUYỂN DỤNG NHÂN SỰ" />
            </CustomChartWrapper>
          </Grid>
          <ExportTable
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
          </Grid>
        </Grid>
      ) : null} */}
      {tabIndex === 1 ? (
        <Grid container spacing={16} style={{ width: window.innerWidth - 260 }}>
          <Grid xs={12}>
            <Typography align="center" variant="h5" style={{ marginTop: 30 }}>
              BÁO CÁO TỔNG HỢP SỐ LƯỢNG HỒ SƠ TUYỂN DỤNG THEO NGUỒN
            </Typography>
          </Grid>
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
          <ExportTable
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
          </Grid>
        </Grid>
      ) : null}
      {/* {tabIndex === 2 ? (
        <Grid container spacing={16} style={{ width: window.innerWidth - 260 }}>
          <Grid xs={12}>
            <Typography align="center" variant="h5" style={{ marginTop: 30 }}>
              BÁO CÁO THỐNG KÊ SỐ LƯỢNG HỒ SƠ TUYỂN DỤNG THEO ĐỢT
            </Typography>
            <Grid item spacing={16} container direction="row" justify="flex-start" alignItems="center" style={{ paddingLeft: 50, paddingTop: 20 }}>
            <Grid item xs={2}>
              <DepartmentAndEmployee
                department={filter.organizationUnitId}
                employee={employee}
                disableEmployee
                onChange={handleChangeDepartmentAndEmployee}
                profile={props.profile}
                moduleCode="reportHrmCountByOrg"
              />
            </Grid>
            <Grid item xs={2} style={{ position: 'relative', marginBottom: 4 }}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  views={['year', 'month']}
                  inputVariant="outlined"
                  fullWidth
                  // format="DD/MM/YYYY"
                  value={filter.date}
                  variant="outlined"
                  label="Lọc theo tháng"
                  margin="dense"
                  // required
                  name="date"
                  onChange={e => handleChangeFilter(e, true, false)}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
          </Grid>
          <Grid item xs={12} style={{ marginTop: 20 }}>
            <CustomChartWrapper height={650} disableReload disableExport>
              <ColumnChart2
                id="chart4"
                data={dataCharts}
                dataName={dataName}
                titleTex="BIỂU ĐỒ SỐ LƯỢNG HỒ SƠ THEO ĐỢT TUYỂN DỤNG THEO ĐỢT"
                style={{ width: '100%', maxHeight: '100vh', height: '70vh' }}
              />
            </CustomChartWrapper>
          </Grid>
        </Grid>
      ) : null} */}
      {/* {tabIndex === 3 ? (
        <Grid container spacing={16} style={{ width: window.innerWidth - 260 }}>
          <Grid xs={12}>
            <Typography align="center" variant="h5" style={{ marginTop: 30 }}>
              Báo cáo thống kê tuyển dụng nhân sự theo nguồn
            </Typography>
          </Grid>
          <Grid item xs={12} style={{ marginTop: 20 }}>
            <CustomChartWrapper height={650} disableReload disableExport>
              <ColumnChart3
                id="chart5"
                data={fakeData3}
                titleTex="BIỂU ĐỒ SỐ LƯỢNG HỒ SƠ THEO ĐỢT TUYỂN DỤNG"
                style={{ width: '100%', maxHeight: '100vh', height: '70vh' }}
              />
            </CustomChartWrapper>
          </Grid>
          <ExportTable
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
          </Grid>
        </Grid>
      ) : null}
      {tabIndex === 4 ? (
        <Grid container spacing={16} style={{ width: window.innerWidth - 260 }}>
          <Grid xs={12}>
            <Typography align="center" variant="h5" style={{ marginTop: 30 }}>
              Báo cáo thống kê tuyển dụng nhân sự theo nguồn
            </Typography>
          </Grid>
        </Grid>
      ) : null} */}
    </>
  );
}
// const mapStateToProps = createStructuredSelector({
//   stockPage: makeSelectStockPage(),
// });

// const withConnect = connect(
//   mapStateToProps,
// );

export default memo(ReportChartBySource);
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

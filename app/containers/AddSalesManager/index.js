/**
 *
 * AddSalesManager
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TableBody, TableCell, Table, TableRow, TableHead, MenuItem } from '@material-ui/core';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import { TrendingFlat } from '@material-ui/icons';
import MomentUtils from '@date-io/moment';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ListPage from 'components/List';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import makeSelectAddSalesManager from './selectors';
import { productSalesColumns, detailProductColumns, CustomerGroupColumns } from '../../variable';
import { API_REPORT, API_TARGET_SALES_MONTH, API_SALES_MANAGEMENT, API_TOP_SALES_CUSTOMER, API_TOP_SALES_PRODUCTS } from '../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import { changeSnackbar } from '../Dashboard/actions';
import { Grid, TextField, Paper, SwipeableDrawer } from '../../components/LifetekUi';
import { mergeData, getData, getSaleManager } from './actions';
import LiabilitiesChart from '../LiabilitiesReport/LiabilitiesChart';
import { MENU_REPORTS } from '../../contants';
import CustomInputField from '../../components/Input/CustomInputField';
import axios from 'axios';
import SearchBox from './searchBox';
import { serialize } from '../../utils/common';
import moment from 'moment';
import request from '../../utils/request';
import { makeSelectProfile } from '../Dashboard/selectors';
import CustomChartWrapper from '../../components/Charts/CustomChartWrapper';
import './style.css';
am4core.useTheme(Am4themesAnimated);

function ColumnChart(props) {
  // eslint-disable-next-line no-unused-vars
  const { id, data, titleTex, isExport = false, onExportSuccess } = props;
  const [chartExport, setChartExport] = useState(null);
  let ColumnChart;
  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.XYChart);
      am4core.addLicense('ch-custom-attribution');
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      chart.data = data;

      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'name';
      categoryAxis.renderer.minGridDistance = 30;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      function createLine(field, name) {
        const lineSeries = chart.series.push(new am4charts.LineSeries());
        lineSeries.name = field === 'revenue' ? name : null;
        lineSeries.dataFields.valueY = 'revenue';
        lineSeries.dataFields.categoryX = 'name';

        lineSeries.stroke = am4core.color('#fdd400');
        lineSeries.strokeWidth = 3;
        lineSeries.propertyFields.strokeDasharray = 'lineDash';
        lineSeries.tooltip.label.textAlign = 'middle';

        const bullet = lineSeries.bullets.push(new am4charts.Bullet());
        bullet.fill = am4core.color('#fdd400'); // tooltips grab fill from parent by default
        bullet.tooltipText = '[#fff font-size: 15px]{name}';
        const circle = bullet.createChild(am4core.Circle);
        circle.radius = 4;
        circle.fill = am4core.color('#fff');
        circle.strokeWidth = 3;
      }
      function createSeries(field, name) {
        const columnSeries = chart.series.push(new am4charts.ColumnSeries());
        columnSeries.name = field !== 'revenue' ? name : null;
        columnSeries.dataFields.valueY = field;
        columnSeries.dataFields.categoryX = 'name';
        columnSeries.columns.template.tooltipText = '[#fff font-size: 15px]{name}[/]';
        // '[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]';
        columnSeries.columns.template.propertyFields.fillOpacity = 'fillOpacity';
        columnSeries.columns.template.propertyFields.stroke = 'stroke';
        columnSeries.columns.template.propertyFields.strokeWidth = 'strokeWidth';
        columnSeries.columns.template.propertyFields.strokeDasharray = 'columnDash';
        columnSeries.tooltip.label.textAlign = 'middle';

        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      }
      chart.legend = new am4charts.Legend();
      chart.legend.valign = 'bottom';

      createSeries('kpi', 'Kế hoạch');
      createSeries('sales', 'Doanh số');
      createSeries('preSales', 'Cùng kỳ');
      createLine('revenue', 'Tỷ lệ hoàn thành');

      setChartExport(chart);
      ColumnChart = chart;
    },
    [data],
  );
  useEffect(
    () => {
      if (chartExport && isExport === true) {
        chartExport.exporting.export('pdf');
        onExportSuccess();
      }
    },
    [data, isExport, chartExport],
  );
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

const findMax = array => {
  let max = 0;
  array &&
    array.map(i => {
      if (i.total > max) {
        max = i.total;
      }
    });
  return Number(max);
};

function ColumnChart2(props) {
  // eslint-disable-next-line no-unused-vars
  let { id, data = [], titleTex, isExport = false, onExportSuccess } = props;
  const [chartExport, setChartExport] = useState(null);
  let ColumnChart;
  let obj = {};
  obj.name = 'Doanh số';
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item) {
        const { name, total = 0 } = item;
        obj[name] = total;
      }
    });
  }
  let series = obj && Object.keys(obj).filter(f => f !== 'name');
  const newData = [obj];
  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.XYChart);
      am4core.addLicense('ch-custom-attribution');
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      chart.data = newData;

      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = 'name';
      categoryAxis.renderer.minGridDistance = 40;
      categoryAxis.fontSize = 11;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      // valueAxis.max = data && findMax(data);
      valueAxis.strictMinMax = true;
      valueAxis.renderer.minGridDistance = 30;

      // Add cursor
      // chart.cursor = new am4charts.XYCursor();

      // Add legend
      chart.legend = new am4charts.Legend();
      chart.legend.position = 'bottom';

      function createSeries(field) {
        const series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryX = 'name';
        series.dataFields.valueY = field;
        series.name = field;
        series.columns.template.tooltipText = field + ': ' + '{valueY.value}';
        series.columns.template.tooltipY = 0;
        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      }

      series.map(s => createSeries(s));
      setChartExport(chart);
      ColumnChart = chart;
    },
    [data],
  );

  useEffect(
    () => {
      if (chartExport && isExport === true) {
        chartExport.exporting.export('pdf');
        onExportSuccess();
      }
    },
    [data, isExport, chartExport],
  );

  useEffect(
    () => () => {
      if (ColumnChart) {
        ColumnChart.dispose();
      }
    },
    [data],
  );
  return <div {...props} id={id} />;
}
function ColumnChart4(props) {
  // eslint-disable-next-line no-unused-vars
  const { id, data, titleTex, isExport, onExportSuccess } = props;
  const [chartExport, setChartExport] = useState(null);
  let ColumnChart;
  let obj = {};

  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.XYChart);
      am4core.addLicense('ch-custom-attribution');
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      chart.data = data;
      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = 'name';
      categoryAxis.renderer.minGridDistance = 40;
      categoryAxis.fontSize = 11;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      // valueAxis.max = findMax(data) + 100;
      valueAxis.strictMinMax = true;
      valueAxis.renderer.minGridDistance = 30;

      // function createSeries(field) {
      //   const series = chart.series.push(new am4charts.ColumnSeries());
      //   series.dataFields.categoryX = 'name';
      //   series.dataFields.valueY = field;
      //   series.name = field;
      //   series.columns.template.tooltipText = field + ': ' + '{valueY.value}';
      //   series.columns.template.tooltipY = 0;
      //   // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      // }

      function createSeries(field, name) {
        const columnSeries = chart.series.push(new am4charts.ColumnSeries());
        columnSeries.name = field !== 'revenue' ? name : null;
        columnSeries.dataFields.valueY = field;
        columnSeries.dataFields.categoryX = 'name';
        columnSeries.columns.template.tooltipText = '[#fff font-size: 15px]{name}[/]';
        // '[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]';
        columnSeries.columns.template.propertyFields.fillOpacity = 'fillOpacity';
        columnSeries.columns.template.propertyFields.stroke = 'stroke';
        columnSeries.columns.template.propertyFields.strokeWidth = 'strokeWidth';
        columnSeries.columns.template.propertyFields.strokeDasharray = 'columnDash';
        columnSeries.tooltip.label.textAlign = 'middle';

        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      }
      // series.map(s => createSeries(s));

      chart.legend = new am4charts.Legend();
      chart.legend.valign = 'bottom';
      createSeries('plan', 'Chỉ tiêu');
      createSeries('total', 'Thực tế');
      setChartExport(chart);
      ColumnChart = chart;
    },
    [data],
  );

  useEffect(
    () => {
      if (chartExport && isExport === true) {
        chartExport.exporting.export('pdf');
        onExportSuccess();
      }
    },
    [data, isExport, chartExport],
  );
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
  // eslint-disable-next-line no-unused-vars
  const { id, data, titleTex, isExport, onExportSuccess } = props;
  const [chartExport, setChartExport] = useState(null);
  let ColumnChart;
  let obj = {};

  obj.name = 'Doanh số';
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item) {
        const { name, total = 0 } = item;
        obj[name] = total;
      }
    });
  }
  let series = obj && Object.keys(obj).filter(f => f !== 'name');
  const newData = [obj];

  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.XYChart);
      am4core.addLicense('ch-custom-attribution');
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      chart.data = newData;

      // Add legend
      chart.legend = new am4charts.Legend();
      chart.legend.position = 'bottom';

      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = 'name';
      categoryAxis.renderer.minGridDistance = 40;
      categoryAxis.fontSize = 11;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.max = findMax(data) + 100;
      valueAxis.strictMinMax = true;
      valueAxis.renderer.minGridDistance = 30;

      function createSeries(field) {
        const series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryX = 'name';
        series.dataFields.valueY = field;
        series.name = field;
        series.columns.template.tooltipText = field + ': ' + '{valueY.value}';
        series.columns.template.tooltipY = 0;
        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      }
      series.map(s => createSeries(s));
      setChartExport(chart);
      ColumnChart = chart;
    },
    [data],
  );

  useEffect(
    () => {
      if (chartExport && isExport === true) {
        chartExport.exporting.export('pdf');
        onExportSuccess();
      }
    },
    [data, isExport, chartExport],
  );
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

/* eslint-disable react/prefer-stateless-function */
export class AddSalesManager extends React.Component {
  state = {
    queryFilter: {
      year: 0,
      month: 0,
      deparment: '',
      startDate: moment()
        .startOf('year')
        .format('DD/MM/YYYY'),
      endDate: moment()
        .endOf('year')
        .format('DD/MM/YYYY'),
    },
    isExport: false,
    zoom: false,
    data: [],
  };
  getData = obj => {
    const { sale = '' } = this.props;

    let url;
    switch (Number(sale)) {
      case 0:
        url = API_TARGET_SALES_MONTH;
        break;
      case 1:
        url = API_SALES_MANAGEMENT;
        break;
      case 2:
        url = API_TOP_SALES_PRODUCTS;
        break;
      case 3:
        url = API_TOP_SALES_CUSTOMER;
        break;
    }
    // const organizationUnitId=obj.organizationUnitId;
    request(`${url}?${serialize(obj)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    }).then(res => {
      if (res.message) {
        this.props.onChangeSnackbar({ status: true, message: res.message, variant: 'error' });
      } else {
        switch (sale) {
          case 0:
            res && this.setState({ data: res.data.data });
            break;
          case 1:
            let { data: result = {} } = res || {};
            res && this.setState({ data: result.data });
            break;
          case 2:
            res && this.setState({ data: res.data });
            break;
          case 3:
            res && this.setState({ data: res.data });
            break;
        }
      }
    });
  };

  componentDidMount() {
    const { sale } = this.props;
    let obj;
    // if (sale !== 0) {
    //   obj = {
    //     startDate: moment().startOf('year').format('YYYY/MM/DD'),
    //     endDate: moment().endOf('year').format('YYYY/MM/DD'),
    //   };
    // }
    // if (sale === 0) {
    //   obj = {
    //     // year: 2021,
    //     year: this.state.defaultYear,
    //     organizationUnitId: '',
    //     employeeId: '',
    //     // skip: 0,
    //     // limit: 10,
    //     skipOrg: 0,
    //     limitOrg:5,
    //   };
    if (sale === 2 || sale == 3) {
      obj = {
        year: moment()
          .startOf('year')
          .format('YYYY'),
        organizationUnitId: '',
        employeeId: '',
        // skip: 0,
        // limit: 10,
        skipOrg: 0,
        limitOrg: 10,
      };
    } else {
      obj = {
        // startDate: moment().startOf('year').format('YYYY/MM/DD'),
        // endDate: moment().endOf('year').format('YYYY/MM/DD'),
        year: moment()
          .startOf('year')
          .format('YYYY'),
      };
    }
    this.getData(obj);
  }

  componentWillReceiveProps(props) {
    if (this.props.sale !== props.sale) {
      const { sale } = props;
      const foundSale = MENU_REPORTS.MENU_SALE_MANAGER.find(item => item.sale === sale);
      const { path } = foundSale;
      this.props.getSaleManager(path);
    }
  }
  onExportSuccess = () => {
    this.setState({ isExport: false });
  };

  mergeData = data => {
    this.props.mergeData(data);
  };

  handleMenu = e => {
    this.props.mergeData({ sale: e.target.value.sale });
  };

  getMenu = value => {
    if (!value && value !== 0) return null;
    return MENU_REPORTS.MENU_SALE_MANAGER.find(item => item.sale === value);
  };

  handleSearch = obj => {
    const { sale } = this.props;
    let objFilter;
    // if (sale !== 0) {
    //   objFilter = {
    //     startDate: moment(obj.startDate).format('YYYY/MM/DD'),
    //     endDate: moment(obj.endDate).format('YYYY/MM/DD'),
    //   };
    // }
    // if (sale === 0) {
    //   objFilter = {
    //     year: obj.year,
    //     organizationUnitId: obj.organizationUnitId,
    //     employeeId: obj.employeeId,
    //     skipOrg: 0,
    //     // limit: 10,
    //     limitOrg: 5,
    //   };
    // }
    if (sale === 2 || sale == 3) {
      objFilter = {
        year: obj.year,
        organizationUnitId: obj.organizationUnitId,
        employeeId: obj.employeeId,
        skipOrg: 0,
        // limit: 10,
        limitOrg: 10,
      };
    } else {
      objFilter = {
        year: obj.year,
        // startDate: moment(obj.startDate).format('YYYY/MM/DD'),
        // endDate: moment(obj.endDate).format('YYYY/MM/DD'),
      };
    }
    this.getData(objFilter);
  };

  handleClear = () => {
    const { sale } = this.props;
    let obj;
    if (sale !== 0) {
      obj = {
        // startDate: moment()
        //   .startOf('year')
        //   .format('DD/MM/YYYY'),
        // endDate: moment()
        //   .endOf('year')
        //   .format('DD/MM/YYYY'),
        year: moment()
          .startOf('year')
          .format('YYYY'),
      };
    }
    if (sale === 0) {
      obj = {
        // year: 2021,
        year: moment()
          .startOf('year')
          .format('YYYY'),
        organizationUnitId: '',
        employeeId: '',
        // skip: 0,
        // limit: 10,
        skipOrg: 0,
        limitOrg: 5,
      };
    }

    this.getData(obj);
  };
  render() {
    const { addSalesManager, profile, sale, miniActive } = this.props;
    const { queryFilter, data, isExport, zoom } = this.state;
    const { filterDetail } = addSalesManager;
    const myStyle = { fontWeight: 'bold', color: 'black' };
    console.log('data', data);
    return (
      <div>
        <Grid container spacing={16} style={{ width: !this.props.miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 65px)' }}>
          <Grid item md={12}>
            {/* <TextField
              select
              label="Quản lý bán hàng"
              style={{ width: '30%', marginLeft: 30 }}
              InputLabelProps={{ shrink: true }}
              value={this.getMenu(addSalesManager.sale)}
              name="sale"
              variant="outlined"
              onChange={e => this.handleMenu(e)}
            >
              {MENU_REPORTS.MENU_SALE_MANAGER.map(item => (
                <MenuItem value={item}>{item.text}</MenuItem>
              ))}
            </TextField> */}
            {sale === 0 ? (
              <div style={{marginTop: "50px"}}>
                <Grid style={{ width: '100%', height: '100vh', marginTop: 30 }} container>
                  <Grid item md={12}>
                    <CustomChartWrapper
                      onGetData={this.handleSearch}
                      profile={profile}
                      onZoom={z => this.setState({ zoom: z })}
                      onRefresh={this.handleClear}
                      isReport={true}
                      code="reportMonthlySalesTarget"
                      id="chart3"
                      show={false}
                      onExport={() => this.setState({ isExport: true })}
                    >
                      <ColumnChart4
                        data={data}
                        titleTex="Báo cáo tỷ lệ hoàn thành chỉ tiêu doanh số tháng"
                        id="chart1"
                        onExportSuccess={this.onExportSuccess}
                        isExport={isExport}
                        style={{ width: '100%', height: zoom ? '90vh' : '70vh', marginTop: 30 }}
                      />
                    </CustomChartWrapper>
                    {/* Bảng hiển thị dữ liệu */}
                  </Grid>
                </Grid>
              </div>
            ) : null}
            {sale === 1 ? (
              <div style={{marginTop: "50px"}}>
                <Grid style={{ width: '100%', height: '100vh', marginTop: 30 }} container>
                  <Grid item md={12}>
                    <CustomChartWrapper
                      onGetData={this.handleSearch}
                      profile={profile}
                      onZoom={z => this.setState({ zoom: z })}
                      onRefresh={this.handleClear}
                      isReport={true}
                      show={false}
                      code="reportkpiSales"
                      id="chart3"
                      onExport={() => this.setState({ isExport: true })}
                    >
                      <ColumnChart
                        data={data}
                        titleTex="Báo cáo thực hiện chỉ tiêu doanh số"
                        id="chart1"
                        onExportSuccess={this.onExportSuccess}
                        isExport={isExport}
                        style={{ width: '100%', height: zoom ? '90vh' : '70vh', marginTop: 30 }}
                      />
                    </CustomChartWrapper>
                  </Grid>
                </Grid>
              </div>
            ) : null}

            {sale === 3 ? (
              <div style={{marginTop: "50px"}}>
                {/* <SearchBox onGetData={this.handleSearch} queryFilter={queryFilter} profile={profile} /> */}
                <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
                  <Grid item md={12}>
                    <CustomChartWrapper
                      onGetData={this.handleSearch}
                      profile={profile}
                      onZoom={z => this.setState({ zoom: z })}
                      onRefresh={this.handleClear}
                      isReport={true}
                      code="reportTopSalesCustomer"
                      id="chart3"
                      onExport={() => this.setState({ isExport: true })}
                    >
                      <ColumnChart2
                        style={{ width: '100%', maxHeight: '100vh', height: zoom ? '80vh' : '50vh' }}
                        data={data}
                        titleTex="Top doanh số theo khách hàng"
                        onExportSuccess={this.onExportSuccess}
                        isExport={isExport}
                        id="chart8"
                      />
                    </CustomChartWrapper>
                  </Grid>
                </Grid>
                <Paper>
                  {' '}
                  <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell style={myStyle}>Khách hàng</TableCell>
                          <TableCell style={myStyle}>Doanh số</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data &&
                          data.map(item => (
                            <TableRow key={item._id}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.total} </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </Grid>
                </Paper>
              </div>
            ) : null}

            {sale === 2 ? (
              <div  style={{marginTop: "40px"}}>
                <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
                  <Grid item md={12}>
                    <CustomChartWrapper
                      onGetData={this.handleSearch}
                      profile={profile}
                      onZoom={z => this.setState({ zoom: z })}
                      onRefresh={this.handleClear}
                      isReport={true}
                      // id="chart9"
                      id="chart3"
                      code="reportTopSalesProduct"
                      onExport={() => this.setState({ isExport: true })}
                    >
                      <ColumnChart3
                        style={{ width: '100%', maxHeight: '100vh', height: zoom ? '80vh' : '50vh' }}
                        data={data}
                        titleTex="Top doanh số theo sản phẩm"
                        onExportSuccess={this.onExportSuccess}
                        isExport={isExport}
                        id="chart9"
                      />
                    </CustomChartWrapper>
                  </Grid>
                </Grid>
                <Paper>
                  {' '}
                  <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ myStyle }}>Mặt hàng</TableCell>
                          <TableCell style={{ myStyle }}>Doanh số</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data &&
                          data.map(item => (
                            <TableRow key={item._id}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.total} </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </Grid>
                </Paper>
              </div>
            ) : null}
          </Grid>
        </Grid>
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.props.mergeData({ openLiabiliti: false })}
          open={addSalesManager.openLiabiliti}
          width={!this.props.miniActive ? window.innerWidth - 260 : window.innerWidth - 65}
        >
          <Grid item md={12}>
            <LiabilitiesChart
              titles="BÁO CÁO CHI TIẾT SẢN PHẨM"
              data={addSalesManager.circleColumns}
              id="chart6"
              style={{ width: '100%', height: '50vh', marginTop: 30 }}
            />

            <div style={{ width: window.innerWidth - 260 }}>
              <ListPage
                // kanban="ST11"
                disableEdit
                disableAdd
                disableConfig
                columns={detailProductColumns}
                apiUrl={`${API_REPORT}/detailsaleOfProduct`}
                filter={filterDetail}
                mapFunction={this.mapDetailProduct}
              />
            </div>
          </Grid>
        </SwipeableDrawer>
      </div>
    );
  }

  mapLiabilitiReport = item => ({
    ...item,
    name: (
      <button
        onClick={() => {
          this.props.mergeData({ openLiabiliti: true, filterDetail: { productId: item.productId }, id: item.productId });
          this.props.getData({ ...this.props.addSalesManager.filterDetail, productId: item.productId });
        }}
        type="button"
        style={{ cursor: 'pointer', color: '#2196f3' }}
      >
        {item.name}
      </button>
    ),
  });

  mapDetailProduct = item => {
    const product = item.originItem.products.find(elm => elm.productId === this.props.addSalesManager.id);
    return {
      ...item,
      amount: product ? product.amount : 0,
      costPrice: product ? product.costPrice : 0,
      total: product ? product.costPrice * product.amount : 0,
      customer: item['customer.name'],
    };
  };

  handleChangeDate = value => {
    if (new Date(this.props.addSalesManager.startDate) > new Date(value)) {
      this.props.onChangeSnackbar({ status: true, message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu', variant: 'warning' });
      return;
    }
    this.props.mergeData({
      endDate: value,
      filter: {
        startDate: new Date(this.props.addSalesManager.startDate).toISOString(),
        endDate: new Date(value).toISOString(),
      },
    });
  };
}

AddSalesManager.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addSalesManager: makeSelectAddSalesManager(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    getData: filterDetail => dispatch(getData(filterDetail)),
    getSaleManager: path => dispatch(getSaleManager(path)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addSalesManager', reducer });
const withSaga = injectSaga({ key: 'addSalesManager', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AddSalesManager);

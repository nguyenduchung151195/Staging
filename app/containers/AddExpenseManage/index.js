/**
 *
 * AddExpenseManage
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { TableBody, TableCell, Table, TableRow, TableHead, MenuItem } from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import makeSelectAddExpenseManage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Grid, TextField, Paper } from '../../components/LifetekUi';
import { getReportExpense } from './actions';
import { mergeData } from '../ExpenseManager/actions';
import { MENU_REPORTS } from '../../contants';
import request from '../../utils/request';
import { serialize } from '../../helper';
import { API_REPORT_COST_MANAGEMENT, API_REPORT_RATIO_ITME } from '../../config/urlConfig';
import { makeSelectProfile, makeSelectMiniActive } from '../Dashboard/selectors';
import CustomChartWrapper from '../../components/Charts/CustomChartWrapper';

am4core.useTheme(Am4themesAnimated);
function CircleChart(props) {
  const { id, data, isExport, titleTex, onExportSuccess } = props;
  const [chartExport, setChartExport] = useState(null);
  let circleChart;
  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.PieChart);
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';

      // Add data
      chart.data = data;

      // Add and configure Series
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'percent';
      pieSeries.dataFields.category = 'name';
      pieSeries.alignLabels = true;
      pieSeries.labels.template.propertyFields.disabled = 'disabled';
      pieSeries.ticks.template.propertyFields.disabled = 'disabled';

      pieSeries.ticks.template.locationX = 1;
      pieSeries.ticks.template.locationY = 0;

      pieSeries.labelsContainer.width = 100;

      chart.legend = new am4charts.Legend();

      chart.legend.paddingRight = 160;
      chart.legend.paddingBottom = 40;
      const marker = chart.legend.markers.template.children.getIndex(0);
      chart.legend.markers.template.width = 20;
      chart.legend.markers.template.height = 10;
      marker.cornerRadius(10, 10, 20, 20);
      setChartExport(chart);
      circleChart = chart;
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
    [isExport, chartExport, data],
  );

  useEffect(
    () => () => {
      if (circleChart) {
        circleChart.dispose();
      }
    },
    [data],
  );
  return <div {...props} id={id} />;
}
function ColumnChart(props) {
  // eslint-disable-next-line no-unused-vars
  const { id, data, titleTex } = props;
  let ColumnChart;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.XYChart);
    const title = chart.titles.create();
    title.text = titleTex;
    title.fontSize = 25;
    title.marginBottom = 20;
    title.fontWeight = 'bold';
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = data;

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = 'country';
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.fontSize = 11;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 8000;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 30;

    function createSeries(field) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = 'country';
      series.dataFields.valueY = field;
      series.columns.template.tooltipText = '{valueY.value}';
      series.columns.template.tooltipY = 0;
      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    }
    createSeries('x1');
    createSeries('x2');
    createSeries('x3');
    createSeries('x4');

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
function ColumnChart1(props) {
  // eslint-disable-next-line no-unused-vars
  const { id, data, titleTex } = props;
  let ColumnChart;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.XYChart);
    const title = chart.titles.create();
    title.text = titleTex;
    title.fontSize = 25;
    title.marginBottom = 20;
    title.fontWeight = 'bold';
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = data;

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = 'country';
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.fontSize = 11;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 6000;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 30;

    function createSeries(field) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = 'country';
      series.dataFields.valueY = field;
      series.columns.template.tooltipText = '{valueY.value}';
      series.columns.template.tooltipY = 0;
      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    }
    createSeries('x1');
    createSeries('x2');
    createSeries('x3');

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

function ColumnChart2(props) {
  // eslint-disable-next-line no-unused-vars
  const { id, data = [], titleTex } = props;
  let ColumnChart;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.XYChart);
    const title = chart.titles.create();
    title.text = titleTex;
    title.fontSize = 25;
    title.marginBottom = 20;
    title.fontWeight = 'bold';
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = data;
    //set color
    chart.colors.list = [am4core.color('green'), am4core.color('#D65DB1')];
    // add chart legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = 'bottom';
    chart.legend.paddingBottom = 20;
    chart.legend.labels.template.maxWidth = 95;

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = 'name';
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.fontSize = 11;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    // valueAxis.max = 6000;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 30;

    function createSeries(value, name) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = 'name';
      series.dataFields.valueY = value;
      series.name = name;
      series.columns.template.tooltipText = '{valueY.value}';
      series.columns.template.tooltipY = 0;
      //set width series
      series.columns.template.width = am4core.percent(40);
      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    }
    createSeries('doanhthu', 'Doanh thu');
    createSeries('chiphi', 'Chi phí');
    createSeries('banhang', 'Bán hàng');
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

/* eslint-disable react/prefer-stateless-function */
export class AddExpenseManage extends React.Component {
  state = {
    partColumn: [
      {
        country: 'Bộ phận kinh doanh 1',
        x2: 5672.4,
        x3: 6000,
      },
      {
        country: 'Bộ phận kinh doanh 2',

        x3: 1000,
      },
      {
        country: 'Bộ phận kinh doanh 3 ',
        x2: 3848.8,
        x3: 3500,
      },
      {
        country: 'Bộ phận kinh doanh 4',
        x2: 1398.8,
        x3: 2000,
      },
      {
        country: 'Bộ phận kinh doanh 5 ',
        x2: 208,
      },
      {
        country: 'Bộ phận kế toán',
        x2: 124.3,
      },
    ],
    partColumn1: [
      {
        country: 'Phụ cấp xăng xe',
        x2: 1739,
      },
      {
        country: 'Công tác phí',
        x2: 2252.9,
      },
      {
        country: 'CP khách hàng ',
        x2: 220,
      },
      {
        country: 'CP hỗ trợ vận chuyển',
        x2: 240.9,
      },
      {
        country: 'CP thanh toán đúng hạn',
        x2: 5397,
      },
      {
        country: 'CP khác',
        x2: 1456.7,
      },
    ],
    circleColumns1: [
      {
        country: 'Giá vốn bán hàng',
        litres: 718,
      },
      {
        country: 'Chi phí tài chính',
        litres: 0.3,
      },
      {
        country: 'Chi phí bán hàng',
        litres: 230.1,
      },
      {
        country: 'Chi phí quản lý doanh nghiệp',
        litres: 42.2,
      },
      {
        country: 'Chi phí khác',
        litres: 5,
      },
      {
        country: 'Chi phí thuế thu nhập doanh nghiệp',
        litres: 0.2,
      },
    ],
    queryFilter: {
      year: 2021,
      organizationUnitId: '',
    },
    data: [],
    zoom: false,
    isExport: false,
  };
  getUrlByValue = value => {
    let url = {
      0: API_REPORT_COST_MANAGEMENT,
      1: API_REPORT_RATIO_ITME,
    };
    return url[value];
  };

  getData = obj => {
    const { expense } = this.props;
    const url = this.getUrlByValue(expense);
    request(`${url}?${serialize(obj)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    }).then(res => {
      console.log(res);
      res && this.setState({ data: res.data });
    });
  };

  componentDidMount() {
    const { expense } = this.props;
    const foundMenu = MENU_REPORTS.MENU_EXPENSE_MANAGER.find(item => item.expense === expense);
    const { path } = foundMenu;
    this.props.getReportExpense(path);

    const obj = {
      year: 2021,
    };
    this.getData(obj);
  }

  componentWillReceiveProps(props) {
    if (this.props.expense !== props.expense) {
      const { expense } = props;
      const foundExpense = MENU_REPORTS.MENU_EXPENSE_MANAGER.find(item => item.expense === expense);
      const { path } = foundExpense;
      this.props.getReportExpense(path);
    }
  }

  mergeData = data => {
    this.props.mergeData(data);
  };

  handleExpense = e => {
    this.props.mergeData({ expense: e.target.value.expense });
  };

  getMenu = value => {
    if (!value && value !== 0) return null;
    return MENU_REPORTS.MENU_EXPENSE_MANAGER.find(item => item.expense === value);
  };

  onExportSuccess = () => {
    this.setState({ isExport: false });
  };

  handleClear = () => {
    const obj = {
      year: moment().format('YYYY'),
    };
    this.getData(obj);
  };
  handleSearch = obj => {
    this.getData(obj);
  };
  render() {
    const { addExpenseManage, expense, profile, miniActive } = this.props;
    const { isExport, zoom, data, queryFilter } = this.state;
    const { costByDepartmentAndItem, costInMonthByDepartment, costInMonthByItem, totalAnnualBudget, proportionOfCosts } = addExpenseManage;
    const fakeData = [
      {
        id: 1,
        month: 1,
        name: 'Tháng 1',
        chiphi: 200,
        doanhthu: 350,
        banhang: 123,
      },
      {
        id: 2,
        month: 2,
        name: 'Tháng 2',
        chiphi: 250,
        doanhthu: 300,
        banhang: 323,
      },
      {
        id: 3,
        month: 3,
        name: 'Tháng 3',
        chiphi: 270,
        doanhthu: 400,
        banhang: 113,
      },
      {
        id: 4,
        month: 4,
        name: 'Tháng 4',
        chiphi: 320,
        doanhthu: 500,
        banhang: 232,
      },
      {
        id: 5,
        month: 5,
        name: 'Tháng 5',
        chiphi: 200,
        doanhthu: 350,
        banhang: 432,
      },
      {
        id: 6,
        month: 6,
        name: 'Tháng 6',
        chiphi: 250,
        doanhthu: 300,
        banhang: 132,
      },
      {
        id: 7,
        month: 7,
        name: 'Tháng 7',
        chiphi: 270,
        doanhthu: 400,
        banhang: 276,
      },
      {
        id: 8,
        month: 8,
        name: 'Tháng 8',
        chiphi: 320,
        doanhthu: 500,
        banhang: 363,
      },
      {
        id: 9,
        month: 9,
        name: 'Tháng 9',
        chiphi: 200,
        doanhthu: 350,
        banhang: 188,
      },
      {
        id: 10,
        month: 10,
        name: 'Tháng 10',
        chiphi: 250,
        doanhthu: 300,
        banhang: 230,
      },
      {
        id: 11,
        month: 11,
        name: 'Tháng 11',
        chiphi: 270,
        doanhthu: 400,
        banhang: 99,
      },
      {
        id: 12,
        month: 12,
        name: 'Tháng 12',
        chiphi: 320,
        doanhthu: 500,
        banhang: 434,
      },
    ];
    const chiphi =
      Array.isArray(fakeData) &&
      fakeData.map((item, index) => ({
        month: item.month,
        data: item.chiphi,
      }));
    const banhang =
      Array.isArray(fakeData) &&
      fakeData.map((item, index) => ({
        month: item.month,
        data: item.banhang,
      }));
    const doanhthu =
      Array.isArray(fakeData) &&
      fakeData.map((item, index) => ({
        month: item.month,
        data: item.doanhthu,
      }));
    const chiphiRate =
      Array.isArray(fakeData) &&
      fakeData.map((item, index) => ({
        month: item.month,
        data: `${((Number(item.chiphi) * 100) / Number(item.doanhthu)).toFixed(2)}%`,
      }));
    const newData = [
      { name: 'Chi phí', data: chiphi || [] },
      { name: 'Doanh thu', data: doanhthu || [] },
      { name: 'Tỷ trọng chi phí', data: chiphiRate || [] },
    ];
    return (
      <div>
      <Grid style={{ width: !miniActive ? 'calc(100vw - 260px)' : 'calc(100vw - 80px)' }}>
          <Grid item md={12}>
            <TextField
              select
              label="Quản lý chi phí"
              style={{ width: '30%', marginLeft: 30 }}
              InputLabelProps={{ shrink: true }}
              value={this.getMenu(expense)}
              name="expense"
              variant="outlined"
              onChange={e => this.handleExpense(e)}
            >
              {MENU_REPORTS.MENU_EXPENSE_MANAGER.map(item => (
                <MenuItem value={item}>{item.text}</MenuItem>
              ))}
            </TextField>

            {expense === 0 ? (
              <div>
                <Grid style={{ width: '100%', height: '100vh', marginTop: 30 }} container>
                  <Grid item md={12}>
                    <CustomChartWrapper
                      onGetData={this.handleSearch}
                      profile={profile}
                      onZoom={z => this.setState({ zoom: z })}
                      onRefresh={this.handleClear}
                      isReport={true}
                      disableEmployee={true}
                      code="reportCostRatio"
                      id="expenseChart1"
                      onExport={() => this.setState({ isExport: true })}
                    >
                      {/* <CircleChart
                        style={{ width: '100%', maxHeight: '100vh', height: zoom ? '80vh' : '70vh' }}
                        data={data}
                        onExportSuccess={this.onExportSuccess}
                        isExport={isExport}
                        id="chart4"
                      /> */}
                      <div>
                        <ColumnChart2
                          style={{ width: '100%', maxHeight: '100vh', height: zoom ? '80vh' : '70vh' }}
                          titleTex="Báo cáo tỷ trọng chi phí"
                          data={fakeData}
                          onExportSuccess={this.onExportSuccess}
                          isExport={isExport}
                          id="chart4"
                        />
                        <Paper style={{ margin: '20px', overflow: 'auto' }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell
                                  style={{
                                    color: 'rgba(0, 0, 0, 0.87)',
                                    fontSize: '0.8125rem',
                                    border: '1px solid rgba(224, 224, 224, 1)',
                                    minWidth: 150,
                                  }}
                                  align="center"
                                >
                                  Khoản mục
                                </TableCell>
                                {Array.isArray(fakeData) &&
                                  fakeData.map((item, index) => (
                                    <TableCell
                                      key={index}
                                      style={{
                                        color: 'rgba(0, 0, 0, 0.87)',
                                        fontSize: '0.8125rem',
                                        borderRight: '1px solid rgba(224, 224, 224, 1)',
                                        borderTop: '1px solid rgba(224, 224, 224, 1)',
                                        minWidth: 150,
                                      }}
                                      align="center"
                                    >
                                      {item.name}
                                    </TableCell>
                                  ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Array.isArray(newData) &&
                                newData.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell style={{ border: '1px solid rgba(224, 224, 224, 1)', minWidth: 150 }} align="center">
                                      {item.name}
                                    </TableCell>
                                    {Array.isArray(item.data) &&
                                      item.data.map((item, index) => (
                                        <TableCell
                                          key={index}
                                          style={{ borderRight: '1px solid rgba(224, 224, 224, 1)', minWidth: 150 }}
                                          align="center"
                                        >
                                          {item.data}
                                        </TableCell>
                                      ))}
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </Paper>
                      </div>
                    </CustomChartWrapper>
                  </Grid>
                </Grid>
              </div>
            ) : null}
            {expense === 1 ? (
              <div>
                <Grid style={{ width: '100%', height: '100vh', marginTop: 30 }} container>
                  <Grid item md={12}>
                    <CustomChartWrapper
                      onGetData={this.handleSearch}
                      profile={profile}
                      onZoom={z => this.setState({ zoom: z })}
                      onRefresh={this.handleClear}
                      isReport={true}
                      code="reportCostRatioItem"
                      id="expenseChart2"
                      onExport={() => this.setState({ isExport: true })}
                    >
                      <CircleChart
                        style={{ width: '100%', maxHeight: '100vh', height: zoom ? '80vh' : '70vh' }}
                        data={data}
                        onExportSuccess={this.onExportSuccess}
                        isExport={isExport}
                        id="chart4"
                      />
                    </CustomChartWrapper>
                  </Grid>
                </Grid>
                <Paper>
                  {' '}
                  <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }} />
                </Paper>
              </div>
            ) : null}
          </Grid>
        </Grid>
      </div>
    );
  }
}

AddExpenseManage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addExpenseManage: makeSelectAddExpenseManage(),
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getReportExpense: path => dispatch(getReportExpense(path)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addExpenseManage', reducer });
const withSaga = injectSaga({ key: 'addExpenseManage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AddExpenseManage);

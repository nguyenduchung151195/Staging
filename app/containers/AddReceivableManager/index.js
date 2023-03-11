/**
 *
 * AddReceivableManager
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { TableBody, TableCell, Table, TableRow, TableHead } from '@material-ui/core';
import Buttons from 'components/CustomButtons/Button';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import makeSelectAddReceivableManager from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Grid, Paper, Typography } from '../../components/LifetekUi';
import { getReportReceivableManager } from './actions';
import { mergeData } from './../ReceivableManager/actions';
import ListPage from 'containers/ListPage';
import { MENU_REPORTS } from '../../contants';
import { API_REPORT_ACCOMPLISH_GOAL, API_DEPT_EMPLOYEE, API_REPORT_RECEIVABLES } from '../../config/urlConfig';
import moment from 'moment';
import request from '../../utils/request';
import { serialize } from '../../utils/common';
import CustomChartWrapper from '../../components/Charts/CustomChartWrapper';
import { makeSelectProfile, makeSelectMiniActive } from '../Dashboard/selectors';
import './../AddSalesManager/style.css';

am4core.useTheme(Am4themesAnimated);

function ColumnChart(props) {
  const { id, data, titleTex = '', isExport } = props;
  let columnChart;

  const customDataChart = data => {
    let arrayMonth = [];
    let [item] = data || [];
    if (item) {
      arrayMonth = Object.keys(item).filter(f => f !== 'name' && f !== 'status' && f !== '_id');
    }
    let finalResult = [];
    if (arrayMonth.length !== 0) {
      arrayMonth.map((i, index) => {
        let item = {};
        data.map(j => {
          item.time = `Tháng ${index + 1}`;
          item[j.name] = j[i];
        });
        finalResult.push(item);
      });
    }
    return finalResult;
  };
  const finalResult = data && customDataChart(data);
  let series = [];
  if (data) {
    data.map(i => {
      series.push(i.name);
    });
  }

  const [chartExport, setChartExport] = useState(null);
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

      chart.data = finalResult;

      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = 'time';
      categoryAxis.renderer.minGridDistance = 70;
      categoryAxis.renderer.cellStartLocation = 0.2;
      categoryAxis.renderer.cellEndLocation = 0.8;
      categoryAxis.fontSize = 11;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.strictMinMax = true;
      valueAxis.renderer.minGridDistance = 50;

      function createSeries(field, name) {
        const series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryX = 'time';
        series.columns.template.width = am4core.percent(50);
        series.dataFields.valueY = field;
        series.name = name;
        series.columns.template.tooltipText = '{valueY.value}';
        series.columns.template.tooltipY = 0;
      }
      if (series.length > 0) {
        series.map(item => {
          createSeries(item, item);
        });
      }
      setChartExport(chart);
      columnChart = chart;
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
      if (columnChart) {
        columnChart.dispose();
      }
    },
    [data],
  );
  return <div {...props} id={id} />;
}
function CircleChart(props) {
  const { id, data, titleTex, isExport } = props;
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
      //Add legend chart
      chart.legend = new am4charts.Legend();
      chart.legend.position = 'right';
      chart.legend.maxHeight = 150;
      chart.legend.maxWidth = 300;
      chart.legend.scrollable = true;
      // Add and configure Series
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      // pieSeries.dataFields.value = 'debt';
      pieSeries.dataFields.value = 'pay';
      pieSeries.dataFields.category = 'name';
      //disable tooltip
      pieSeries.ticks.template.disabled = true;
      pieSeries.labels.template.disabled = true;

      circleChart = chart;
      setChartExport(chart);
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
  // useEffect(
  //   () => () => {
  //     if (circleChart) {
  //       circleChart.dispose();
  //     }
  //   },
  //   [data],
  // );
  return <div {...props} id={id} />;
}

function ColumnChart2(props) {
  // eslint-disable-next-line no-unused-vars
  const { id, data, titleTex, isExport } = props;
  const [chartExport, setChartExport] = useState(null);
  let ColumnChart;
  const customDataChart = data => {
    let arrayMonth = [];
    let [item] = data || [];
    if (item) {
      arrayMonth = Object.keys(item).filter(
        f => f !== 'name' && f !== 'managerEmployee' && f !== 'viewableEmployees' && f !== 'organizationUnitId' && f !== 'createdBy' && f !== '_id',
      );
    }
    let finalResult = [];
    if (arrayMonth.length !== 0) {
      arrayMonth.map((i, index) => {
        let item = {};
        data.map(j => {
          item.time = `Tháng ${index + 1}`;
          item[j.name] = j[i];
        });
        finalResult.push(item);
      });
    }
    return finalResult;
  };

  const finalResult = data && customDataChart(data);
  let series = [];
  if (data) {
    data.map(i => {
      series.push(i.name);
    });
  }

  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.XYChart);
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      chart.data = finalResult;

      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = 'time';
      categoryAxis.renderer.minGridDistance = 40;
      categoryAxis.fontSize = 11;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.strictMinMax = true;
      valueAxis.renderer.minGridDistance = 30;

      function createSeries(field) {
        const series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryX = 'time';
        series.dataFields.valueY = field;
        series.name = field;
        series.columns.template.tooltipText = '{valueY.value}';
        series.columns.template.tooltipY = 0;

        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      }
      chart.legend = new am4charts.Legend();
      chart.legend.valign = 'bottom';
      series &&
        series.map(i => {
          createSeries(i);
        });

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
/* eslint-disable react/prefer-stateless-function */
export class AddReceivableManager extends React.Component {
  state = {
    data: [],
    count: 0,
    queryFilter: {
      year: 2022,
      organizationUnitId: '',
      employeeId: '',
      skip: 0,
      limit: 10,
    },
    isExport: false,
    zoom: false,
  };

  componentDidMount() {
    const obj = {
      year: 2022,
      skip: 0,
      limit: 10,
    };
    this.getData(obj);
  }

  getData = obj => {
    const { tab } = this.props;
    //  ===== Report recaiables =====
    let url;
    switch (Number(tab)) {
      case 0:
        url = API_DEPT_EMPLOYEE;
        break;
      case 1:
        url = API_REPORT_ACCOMPLISH_GOAL;
        break;
      case 2:
        url = API_REPORT_RECEIVABLES;
        break;
    }
    request(`${url}?${serialize(obj)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    }).then(res => {
      res && this.setState({ data: res.data, count: res.count });
    });
  };

  componentWillReceiveProps(props) {
    if (this.props.tab !== props.tab) {
      const { tab } = props;
      const foundMenu = MENU_REPORTS.MENU_RECEIVABLE_MANAGER.find(item => item.tab === tab);
      const { path } = foundMenu;
      this.props.getReportReceivable(path);
    }
  }

  // componentDidUpdate(props, state) {
  //   if (state.queryFilter && state.queryFilter.skip > 0) {
  //     console.log('goi chua');
  //     this.getData(state.queryFilter);
  //     return () => {
  //       this.getData(state.queryFilter);
  //     };
  //   }
  // }

  mergeData = data => {
    this.props.mergeData(data);
  };
  customDataPieChart = () => {
    const { data } = this.state;
    let result = [];
    let objDept = {};
    let objToPay = {};
    objDept.groupName = 'Công nợ thu';
    objToPay.groupName = 'Công nợ phải trả';

    if (data) {
      data.map(i => {
        objDept[i._id] = i.debt;
        objToPay[i._id] = i.toPay;
      });
    }
    result.push(objDept, objToPay);
    return result;
  };
  customDataForPieChart = () => {
    const { data } = this.state;
    let result = [];
    let objDept = {};
    let objToPay = {};
    objDept.groupName = 'Công nợ thu';
    objDept.group = 'debt';
    objDept.data = [];
    objToPay.groupName = 'Công nợ phải trả';
    objToPay.group = 'toPay';
    objToPay.data = [];

    if (data) {
      data.map(i => {
        objDept.data.push({ _id: i._id, name: i.name, pay: i.debt });
        objToPay.data.push({ _id: i._id, name: i.name, pay: i.toPay });
      });
    }
    result.push(objDept, objToPay);
    return result;
  };
  customField = () => {
    const { data } = this.state;
    let viewConfig = [];
    viewConfig[0] = { name: 'groupName', title: 'Nội dung', checked: true, width: 180 };
    if (data) {
      data.map(i => {
        let obj = {
          name: i._id,
          title: i.name,
          checked: true,
          width: 120,
        };
        viewConfig.push(obj);
      });
    }
    return viewConfig;
  };

  customDataAccomplish = ({ data = [] }) => {
    let result = [];
    let [item = {}] = data;
    if (!item.organizationUnit) {
      if (data) {
        data.map(i => {
          result.push(i);
          return i;
        });
      }
    }
    return result || [];
  };
  customReceivables = ({ data = [] }) => {
    let result = [];
    let [item = {}] = data;

    if (data) {
      data.map(i => {
        console.log('i', i);
        delete i.createdBy;
        delete i.organizationUnitId;
        delete i.viewableEmployees;
        delete i._id;
        i.managerEmployee = i.managerEmployee ? i.managerEmployee.name : '';
        result.push(i);
        return i;
      });
    }
    return result || [];
  };
  customFieldAccomplish = () => {
    const viewConfig = [];
    const { data = [] } = this.state;
    viewConfig[0] = { name: 'name', title: 'Nội dung', checked: true, width: 200 };
    if (data) {
      let [item] = data || [];
      let arrayMonth = item && Object.keys(item).filter(f => f !== 'name' && f !== 'status' && f !== '_id');

      if (arrayMonth && arrayMonth.length > 0) {
        arrayMonth.map((i, index) => {
          let obj = {
            name: i,
            title: `Tháng ${index + 1}`,
            checked: true,
            width: 120,
          };
          viewConfig.push(obj);
        });
      }
    }

    return viewConfig || [];
  };
  customFieldReceivables = () => {
    const viewConfig = [];
    const { data = [] } = this.state;
    viewConfig[0] = { name: 'name', title: 'Nội dung', checked: true, width: 200 };
    if (data) {
      let [item] = data || [];
      let arrayMonth =
        item &&
        Object.keys(item).filter(f => f !== 'name' && f !== 'viewableEmployees' && f !== '_id' && f !== 'createdBy' && f !== 'organizationUnitId');

      if (arrayMonth && arrayMonth.length > 0) {
        arrayMonth.map((i, index) => {
          let obj = {
            name: i,
            title: `Tháng ${index + 1}`,
            checked: true,
            width: 120,
          };
          viewConfig[index + 1] = obj;
        });
      }
    }
    console.log('viewconfig', viewConfig);
    return viewConfig || [];
  };

  handleTab(tab) {
    this.props.mergeData({ open: true, tab });
  }

  handleClear = () => {
    const obj = {
      year: 2021,
      organizationUnitId: '',
      employeeId: '',
      skip: 0,
      limit: 10,
    };
    this.setState({
      queryFilter: obj,
    });
    this.getData(obj);
  };
  handleSearch = obj => {
    const { queryFilter } = this.state;
    const objFilter = {
      organizationUnitId: obj.organizationUnitId,
      employeeId: obj.employeeId,
      year: obj.year,
      limit: queryFilter.limit,
      skip: queryFilter.skip,
      // endDate: moment().format('DD/MM/YYYY'),
    };
    this.getData(objFilter);
  };

  handleLoadData = (page = 0, skip = 0, limit = 10) => {
    const { queryFilter } = this.state;
    let { year, organizationUnitId, employeeId } = queryFilter || {};
    let obj = {
      year,
      organizationUnitId,
      employeeId,
      skip,
      limit,
    };
    this.getData(obj);
    this.setState({ queryFilter: obj });
  };

  onExportSuccess = () => {
    this.setState({ isExport: false });
  };

  render() {
    const MONTH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    const { data, isExport, zoom, queryFilter, count } = this.state;
    const { profile, tab, miniActive } = this.props;
    const Bt = props => (
      <Buttons onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'}>
        {props.children}
      </Buttons>
    );

    return (
      <div>
        {/* <Grid style={{ width: !miniActive ? 'calc(100vw - 260px)' : 'calc(100vw - 80px)' }}>
          <Grid item sm={12}>
            {MENU_REPORTS.MENU_RECEIVABLE_MANAGER && MENU_REPORTS.MENU_RECEIVABLE_MANAGER.map(item => <Bt tab={item.tab}>{item.text}</Bt>)} */}
        {/* <Bt tab={0} style={{ marginLeft: 30 }}>
              Tổng hợp công nợ theo khu vực
            </Bt>
            <Bt tab={1}>Tổng hợp công nợ theo tỉnh thành</Bt>
            <Bt tab={2}>Số dư công nợ phải thu theo thời gian</Bt> */}
        {/* </Grid>
        </Grid> */}

        {tab === 0 ? (
          <Grid style={{ width: !miniActive ? 'calc(100vw - 260px)' : 'calc(100vw - 80px)' }}>
            {/* <Paper>
              <Typography style={{ marginTop: 10, fontSize: 25 }}>Tổng hợp công nợ theo nhân viên kinh doanh </Typography>
            </Paper> */}
            <Typography align="center" variant="h5" style={{ marginTop: 30 }}>
              Tổng hợp công nợ theo nhân viên kinh doanh
            </Typography>
            <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
              <Grid item md={12}>
                <CustomChartWrapper
                  onGetData={this.handleSearch}
                  profile={profile}
                  onZoom={z => this.setState({ zoom: z })}
                  onRefresh={this.handleClear}
                  isReport={true}
                  code="reportDebtEmployees"
                  id="receivableChart1"
                  onExport={() => this.setState({ isExport: true })}
                >
                  <Grid style={{ display: 'flex' }}>
                    {this.customDataForPieChart().map((item, index) => (
                      <Grid item md={6} key={index}>
                        <CircleChart
                          data={item.data}
                          titleTex={item.group === 'debt' ? 'Công nợ thu' : 'Công nợ phải trả'}
                          id={`chart${index + 1}`}
                          onExportSuccess={this.onExportSuccess}
                          isExport={isExport}
                          style={{ width: '100%', height: zoom ? '80vh' : '50vh', marginTop: 30 }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </CustomChartWrapper>
              </Grid>
            </Grid>
            <Paper>
              <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }}>
                <ListPage
                  apiUrl={`${API_DEPT_EMPLOYEE}?${serialize(queryFilter)}`}
                  columns={data && this.customField()}
                  customRows={this.customDataPieChart}
                  perPage={queryFilter.limit}
                  isReport={true}
                  onLoad={this.handleLoadData}
                  count={count}
                  client
                  disableEdit
                  disableAdd
                  disableConfig
                  disableSearch
                  disableSelect
                />
              </Grid>
            </Paper>
          </Grid>
        ) : null}
        {tab === 1 ? (
          <Grid style={{ width: !miniActive ? 'calc(100vw - 260px)' : 'calc(100vw - 80px)' }}>
            {/* <Paper>
              <Typography style={{ marginTop: 10, fontSize: 25 }}>Tổng hợp công nợ phải trả theo thời gian</Typography>
            </Paper> */}
            <Typography align="center" variant="h5" style={{ marginTop: 30 }}>
              Tổng hợp công nợ phải trả theo thời gian
            </Typography>
            <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '30px 0px' }} container>
              <Grid item md={12}>
                <CustomChartWrapper
                  onGetData={this.handleSearch}
                  profile={profile}
                  onZoom={z => this.setState({ zoom: z })}
                  onRefresh={this.handleClear}
                  isReport={true}
                  code="reportDebtToPay"
                  id="receivableChart2"
                  onExport={() => this.setState({ isExport: true })}
                >
                  <ColumnChart style={{ width: '100%', height: zoom ? '80vh' : '50vh' }} isExport={isExport} data={data} id="chart2" />
                </CustomChartWrapper>
              </Grid>
            </Grid>
            <Paper>
              <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }}>
                <ListPage
                  apiUrl={`${API_REPORT_ACCOMPLISH_GOAL}?${serialize(queryFilter)}`}
                  columns={data && this.customFieldAccomplish()}
                  customRows={this.customDataAccomplish}
                  perPage={queryFilter.limit}
                  isReport={true}
                  count={count}
                  onLoad={this.handleLoadData}
                  client
                  disableEdit
                  disableAdd
                  disableConfig
                  disableSearch
                  disableSelect
                />
              </Grid>
            </Paper>
          </Grid>
        ) : null}

        {tab === 2 ? (
          <Grid style={{ width: !miniActive ? 'calc(100vw - 260px)' : 'calc(100vw - 80px)' }}>
            {/* <Paper>
              <Typography style={{ marginTop: 25, fontSize: 25 }}>Tổng Hợp Công Nợ Phải Thu Theo Thời gian</Typography>
            </Paper> */}
            <Typography align="center" variant="h5" style={{ marginTop: 30 }}>
              Tổng hợp công nợ phải thu theo thời gian
            </Typography>
            <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
              <Grid item md={12}>
                <CustomChartWrapper
                  onGetData={this.handleSearch}
                  profile={profile}
                  onZoom={z => this.setState({ zoom: z })}
                  onRefresh={this.handleClear}
                  isReport={true}
                  code="reportDebtReceivables"
                  id="receivableChart3"
                  onExport={() => this.setState({ isExport: true })}
                >
                  <ColumnChart2
                    onExportSuccess={this.onExportSuccess}
                    isExport={isExport}
                    style={{ width: '100%', height: zoom ? '80vh' : '50vh' }}
                    data={data}
                    id="chart3"
                  />
                </CustomChartWrapper>
              </Grid>
            </Grid>
            <Paper>
              <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }}>
                <ListPage
                  apiUrl={API_REPORT_RECEIVABLES}
                  columns={data && this.customFieldReceivables()}
                  customRows={this.customReceivables}
                  perPage={queryFilter.limit}
                  isReport={true}
                  onLoad={this.handleLoadData}
                  count={count}
                  client
                  disableEdit
                  disableAdd
                  disableConfig
                  disableSearch
                  disableSelect
                />
              </Grid>
            </Paper>
            {/* <Paper>
              {' '}
              <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nội dung</TableCell>
                      {Array.isArray(MONTH) && MONTH.map(i => <TableCell>{`Tháng ${i}`}</TableCell>)}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data &&
                      data.map(item => (
                        <TableRow>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.jan} </TableCell>
                          <TableCell>{item.feb} </TableCell>
                          <TableCell>{item.mar} </TableCell>
                          <TableCell>{item.apr} </TableCell>
                          <TableCell>{item.may} </TableCell>
                          <TableCell>{item.jun} </TableCell>
                          <TableCell>{item.jul} </TableCell>
                          <TableCell>{item.aug} </TableCell>
                          <TableCell>{item.sep} </TableCell>
                          <TableCell>{item.oct} </TableCell>
                          <TableCell>{item.nov} </TableCell>
                          <TableCell>{item.dec} </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Grid>
            </Paper> */}
          </Grid>
        ) : null}
      </div>
    );
  }
}

AddReceivableManager.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addReceivableManager: makeSelectAddReceivableManager(),
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getReportReceivable: path => dispatch(getReportReceivableManager(path)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addReceivableManager', reducer });
const withSaga = injectSaga({ key: 'addReceivableManager', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AddReceivableManager);

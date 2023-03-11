/**
 *
 * AddFavoritePage
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TableBody, TableCell, Table, TableRow, TableHead, MenuItem, Divider, CircularProgress, Typography, Tooltip } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
// import Am4themesKelly from '@amcharts/amcharts4/themes/kelly';
import makeSelectAddFavoritePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Grid, TextField, Paper } from '../../components/LifetekUi';
import ListPage from 'containers/ListPage';
import { getDataChartInFavorite, changeMenuItemInFavorite } from './actions';
import { MENU_REPORTS } from '../../contants';
// import CircleChart from '../../components/Charts/CircleChart';
import CustomChartWrapper from '../../components/Charts/CustomChartWrapper';

import { API_REPORT_FAVORITE_BANK_BLANCE, API_REPORT_FAVORITE_COST, API_REPORT_FAVORITE_SALES } from '../../config/urlConfig';
import request from '../../utils/request';
import { makeSelectProfile } from '../Dashboard/selectors';
import { serialize } from '../../helper';
import './../AddSalesManager/style.css';
am4core.useTheme(Am4themesAnimated);
/* eslint-disable react/prefer-stateless-function */

const Process = ({ title, value, color }) => (
  <Tooltip title={title}>
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'no-wrap', height: 15, width: '100%', borderRadius: 2 }}>
      <div
        style={{
          width: `${value}%`,
          background: `${color}`,
          height: '100%',
          textAlign: 'center',
          alignItems: 'center',
          color: 'white',
          borderRadius: 2,
        }}
      >
        {value}%
      </div>
      <div style={{ width: `${100 - value}%`, height: '100%', background: '#9e9e9e75' }} />
    </div>
  </Tooltip>
);
function CircleChart(props) {
  const { id, data = [], titleTex, isExport } = props;
  const [chartExport, setChartExport] = useState(null);
  let finalResult = [];
  if (data && data.length !== 0) {
    data.map(item => {
      if (item && item.bank) {
        let { bank = {} } = item;
        item.value = bank.value ? bank.value : 0;
        finalResult.push(item);
      } else if (item && (item.value || item.balance)) {
        item.value = item.name ? item.name : '';
        item.currentBalance = item.balance ? item.balance : 0;
        finalResult.push(item);
      }
    });
  }
  let circleChart;
  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.PieChart);
      // remove logo am4chart
      am4core.addLicense('ch-custom-attribution');
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';

      // Add data
      chart.data = finalResult;

      // Add and configure Series
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'currentBalance';
      pieSeries.dataFields.category = 'value';
      chart.legend = new am4charts.Legend();
      chart.legend.position = 'right';
      chart.legend.width = '200px';
      chart.legend.maxHeight = '20vh';
      chart.legend.scrollable = true;
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

function CircleChart1(props) {
  const { id, data = [], titleTex, isExport } = props;
  let circleChart1;
  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.PieChart);
      // remove logo am4chart
      am4core.addLicense('ch-custom-attribution');
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';

      // Add data
      chart.data = data;

      // Add and configure Series
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'proportion';
      pieSeries.dataFields.category = 'name';
      pieSeries.ticks.template.disabled = true;
      pieSeries.labels.template.disabled = true;
      chart.legend = new am4charts.Legend();
      chart.legend.position = 'right';
      chart.legend.width = '100px';
      chart.legend.maxHeight = '15vh';
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
  return <div {...props} id={id} />;
}

function ColumnChart(props) {
  // eslint-disable-next-line no-unused-vars
  const { id, data, titleTex, isExport, onExportSuccess } = props;
  const [chartExport, setChartExport] = useState(null);
  let ColumnChart;
  let obj = {};
  let series = [{ code: 'sale', name: 'Doanh số' }, { code: 'plan', name: 'Kế hoạch' }];
  let finalResult = [];
  if (Array.isArray(series)) {
    series.map(serie => {
      let obj = {};
      obj.name = serie.name;
      data &&
        data.map(item => {
          obj[item.name] = item[serie.code];
        });
      finalResult.push(obj);
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
      categoryAxis.dataFields.category = 'name';
      categoryAxis.renderer.minGridDistance = 40;
      categoryAxis.fontSize = 11;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.strictMinMax = true;
      valueAxis.renderer.minGridDistance = 30;

      function createSeries(field, name) {
        const series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryX = 'name';
        series.dataFields.valueY = field;
        series.name = field;
        series.columns.template.tooltipText = field + ': ' + '{valueY.value}';
        series.columns.template.tooltipY = 0;
        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      }
      series.map(s => createSeries(s.code, s.name));
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
export class AddFavoritePage extends React.Component {
  state = {
    data: [],
    data1: [],
    count: 1,
    queryFilter: {
      year: 2021,
      organizationUnitId: '',
      employeeId: '',
      skip: 0,
      limit: 10,
    },
    isExport: false,
    zoom: false,
  };

  // getUrlByMenu = menu => {
  //   let url = {
  //     0: API_REPORT_FAVORITE_BANK_BLANCE,
  //   };
  //   if (menu) {
  //     return url[menu];
  //   }
  // };

  getData = obj => {
    const { menu } = this.props;
    let url;
    if (menu === 0) {
      url = API_REPORT_FAVORITE_BANK_BLANCE;
    }
    if (menu === 1) {
      url = API_REPORT_FAVORITE_SALES;
    }

    try {
      request(`${url}?${serialize(obj)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }).then(res => {
        if (res && res.data) {
          this.setState({ data: res.data });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  getDataLeft = obj => {
    let url = API_REPORT_FAVORITE_COST;
    try {
      request(`${url}?${serialize(obj)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }).then(res => {
        if (res && res.data) {
          this.setState({ data1: res.data });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    let obj = {
      year: 2021,
      organizationUnitId: '',
      employeeId: '',
      skip: 0,
      limit: 10,
    };
    this.getData(obj);
    this.getDataLeft(obj);
  }

  // componentWillReceiveProps(props) {
  //   if (this.props.menu !== props.menu) {
  //     const { menu } = props;
  //     const foundMenu = MENU_REPORTS.MENU_FAVORITE.find(item => item.menu === menu);
  //     const { path, name } = foundMenu;
  //     this.props.onGetDataChartInFavorite(path, name); // CALL-API: LẤY "DỮ LIỆU BIỂU ĐỒ"
  //   }
  // }

  // componentDidUpdate() {}

  handleMenu = e => {
    const { value = {} } = e.target;
    this.props.onChangeMenuItemInFavorite({ menu: value.menu || '' });
  };

  getMenu = value => {
    if (!value && value !== 0) return null;
    return MENU_REPORTS.MENU_FAVORITE.find(item => item.menu === value);
  };

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
    this.getDataLeft(obj);
  };

  customField1 = () => {
    let viewConfig = [];
    let { data = [] } = this.state;
    viewConfig[0] = { name: 'name', title: 'Nội dung', checked: true, width: 200 };
    if (data && data.length > 0) {
      data.map(item => {
        if (item && item.name) {
          let obj = {
            name: item.name,
            title: item.name,
            checked: true,
            width: 120,
          };
          viewConfig.push(obj);
        }
      });
    }
    return viewConfig;
  };

  customField2 = () => {
    const viewConfig = [
      {
        name: 'name',
        title: 'Nhân viên KD',
        checked: true,
        width: 200,
      },
      {
        name: 'total',
        title: 'Tổng',
        checked: true,
        width: 200,
      },
      {
        name: 'sale',
        title: 'Doanh số',
        checked: true,
        width: 200,
      },
      {
        name: 'plan',
        title: 'Kế hoạch',
        checked: true,
        width: 200,
      },
      {
        name: 'successfullyRate',
        title: 'Tỷ lệ hoàn thành kế hoạch',
        checked: true,
        width: 200,
      },
    ];
    return viewConfig;
  };
  customDataRow1 = ({ data = [] }) => {
    let result = [];
    let obj = {};
    obj.name = 'Số dư';
    if (data.length !== 0) {
      data.map(i => {
        if (i && i.name && i.balance) {
          obj[i.name] = i.balance ? i.balance : 0;
        }
        return i;
      });
    }
    result.push(obj);
    return result;
  };

  customDataRow2 = ({ data = [] }) => {
    let result = [];
    let obj = {};
    Array.isArray(data) &&
      data.forEach((item, index) => {
        const successfullyRate = Number(item.plan) > 0 ? (Number(item.sale) * 100) / Number(item.plan) : 100;
        obj = {
          ...item,
          total: Number(item.plan) + Number(item.sale) || 0,
          successfullyRate: <Process title="Tỷ lệ hoàn thành" value={successfullyRate} color="green" />,
        };
        result.push(obj);
      });
    return result;
  };
  handleExportSuccess = () => {
    this.setState({ isExport: false });
  };

  handleSearch = obj => {
    const { queryFilter = {} } = this.state;
    const objFilter = {
      organizationUnitId: obj.organizationUnitId,
      employeeId: obj.employeeId,
      year: obj.year,
      limit: queryFilter.limit,
      skip: queryFilter.skip,
      // endDate: moment().format('DD/MM/YYYY'),
    };
    this.setState({ queryFilter: objFilter });
    this.getData(objFilter);
    this.getDataLeft(objFilter);
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
    this.getDataLeft(obj);
    this.setState({ queryFilter: obj });
  };

  render() {
    // KHAI BÁO MÀU - "PHẦN BẢNG NHỎ TÓM TẮT": "TỔNG SỐ" CỦA BIỂU ĐỒ

    const { addFavoritePage, menu, profile, onChangeTab, miniActive } = this.props;
    const { data = [], data1 = [], isExport, zoom, queryFilter, count = 1 } = this.state;
    const columnExtension = [
      {
        columnName: 'name',
        width: 200,
      },
      {
        columnName: 'total',
        width: 200,
      },
      {
        columnName: 'sale',
        width: 200,
      },
      {
        columnName: 'plan',
        width: 200,
      },
      {
        columnName: 'successfullyRate',
        width: 200,
      },
    ];

    // RENDER:
    return (
      <div style={{ padding: '10px 8px' }}>
        <Grid container spacing={16} style={{ width: !miniActive ? 'calc(100vw - 250px)' : 'calc(100vw - 80px)' }}>
          <Grid item sm={12}>
            {/* PHẦN 1: SELECT BOX - MENU ITEM */}
            {/* <TextField
              select
              label="Favorite"
              style={{ width: '30%' }}
              // style={{ width: '30%', marginLeft: 30 }}
              InputLabelProps={{ shrink: true }}
              value={this.getMenu(addFavoritePage.menu)}
              name="menu"
              variant="outlined"
              onChange={e => this.handleMenu(e)}
            >
              {MENU_REPORTS.MENU_FAVORITE.map(item => (
                <MenuItem value={item}>{item.text}</MenuItem>
              ))}
            </TextField>
      */}
            {menu === 0 ? (
              <div style={{marginTop: "30px"}}>
                <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
                  <Grid item md={4}>
                    <Typography variant="h6">Tổng hợp chi phí trong năm {queryFilter.year}</Typography>
                    {Array.isArray(data1) &&
                      data1.map(item => (
                        <div className="style-left-box">
                          <p className="style-left-box__title">{item.name}</p>
                          <p className="style-left-box__value">{item.cost}</p>
                        </div>
                      ))}
                  </Grid>
                  <Grid item md={8}>
                    <CustomChartWrapper
                      onGetData={this.handleSearch}
                      profile={profile}
                      onZoom={z => this.setState({ zoom: z })}
                      onRefresh={this.handleClear}
                      isReport={true}
                      code="reportbankBalance"
                      id="favoriteChart1"
                      onExport={() => this.setState({ isExport: true })}
                    >
                      <CircleChart
                        style={{ width: '100%', height: isExport || zoom ? '80vh' : '50vh', marginTop: 30 }}
                        id="chart0"
                        titleTex="Số dư tại quỹ và các ngân hàng"
                        data={data}
                        onExportSuccess={this.handleExportSuccess}
                        isExport={isExport}
                      />
                    </CustomChartWrapper>
                  </Grid>
                  <Grid md={12}>
                    <ListPage
                      apiUrl={`${API_REPORT_FAVORITE_BANK_BLANCE}?${serialize(queryFilter)}`}
                      columns={data && this.customField1()}
                      customRows={this.customDataRow1}
                      perPage={queryFilter ? queryFilter.limit : 10}
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
                </Grid>
              </div>
            ) : null}
            {menu === 1 ? (
              <div style={{marginTop: "30px"}}>
                <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
                  <Grid item md={12}>
                    <CustomChartWrapper
                      onGetData={this.handleSearch}
                      profile={profile}
                      onZoom={z => this.setState({ zoom: z })}
                      onRefresh={this.handleClear}
                      isReport={true}
                      code="ReportSalesEmployees"
                      id="favoriteChart1"
                      onExport={() => this.setState({ isExport: true })}
                    >
                      <ColumnChart
                        style={{ width: '100%', height: isExport || zoom ? '80vh' : '50vh', marginTop: 30 }}
                        id="chart0"
                        titleTex="Báo cáo chi tiết bán hàng theo nhân viên"
                        data={data}
                        onExportSuccess={this.handleExportSuccess}
                        isExport={isExport}
                      />
                    </CustomChartWrapper>
                  </Grid>
                  <Grid md={6}>
                    <ListPage
                      apiUrl={`${API_REPORT_FAVORITE_SALES}?${serialize(queryFilter)}`}
                      columns={data && this.customField2()}
                      customRows={this.customDataRow2}
                      perPage={queryFilter ? queryFilter.limit : 10}
                      isReport={true}
                      count={count}
                      onLoad={this.handleLoadData}
                      columnExtension={columnExtension}
                      client
                      disableEdit
                      disableAdd
                      disableConfig
                      disableSearch
                      disableSelect
                    />
                  </Grid>
                  <Grid item md={6}>
                    <CircleChart1
                      style={{ width: '100%', height: isExport || zoom ? '80vh' : '50vh', marginTop: 30 }}
                      id="chart1"
                      titleTex="Tỷ trọng"
                      data={data}
                      // onExportSuccess={this.handleExportSuccess}
                      isExport={isExport}
                    />
                  </Grid>
                </Grid>
              </div>
            ) : null}
            {/* ReportSalesEmployees */}
          </Grid>
        </Grid>
      </div>
    );
  }
}

AddFavoritePage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addFavoritePage: makeSelectAddFavoritePage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onChangeMenuItemInFavorite: data => dispatch(changeMenuItemInFavorite(data)),
    // TT:"CALL API BACKEND" - LẤY DỮ LIỆU - "ĐỔ VÀO BIỂU ĐỒ"- THEO "PATH + NAME" CỦA MENU
    onGetDataChartInFavorite: (path, name) => dispatch(getDataChartInFavorite(path, name)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addFavoritePage', reducer });
const withSaga = injectSaga({ key: 'addFavoritePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AddFavoritePage);

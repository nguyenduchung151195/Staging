/* eslint-disable no-prototype-builtins */
/* eslint-disable func-names */
/**
 *
 * AddStockManager
 *
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Buttons from 'components/CustomButtons/Button';
import { TrendingFlat } from '@material-ui/icons';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import { TableBody, TableCell, Table, TableRow, TableHead, TextField, MenuItem } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
// import _ from 'lodash';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import ListPage from 'containers/ListPage';
import makeSelectAddStockManager from './selectors';
import { API_REPORT, API_REPORT_STOCK_INVENTORY_BY_YEAR, API_REPORT_PRODUCT_INVENTORY } from '../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import { Grid, Paper, Typography } from '../../components/LifetekUi';
import { inventoryColumns, inventoryReportByMonthColumns } from '../../variable';
import { changeSnackbar } from '../Dashboard/actions';
import { getAllStockAct, getAllCategoryAct, getAllInventoryAct, getAllTagsAct, mergeData } from './actions';
import request from '../../utils/request';
import { serialize } from '../../utils/common';
import CustomChartWrapper from '../../components/Charts/CustomChartWrapper';
import { makeSelectProfile, makeSelectMiniActive } from '../Dashboard/selectors';
import './../AddSalesManager/style.css';
am4core.useTheme(Am4themesAnimated);

function CircleChart(props) {
  const { id, data = [], titleTex } = props;
  let circleChart;

  let result = Array.isArray(data) && data.filter(i => Number(i.percent) !== 0);
  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.PieChart);
      chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
      chart.paddingLeft = 150;
      am4core.addLicense('ch-custom-attribution');
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = -10;
      title.fontWeight = 'bold';
      chart.data = result;
      chart.validateData();
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'percent';
      pieSeries.dataFields.category = 'name';
      pieSeries.alignLabels = true;
      // this makes only A label to be visible
      pieSeries.labels.template.propertyFields.disabled = 'disabled';
      pieSeries.ticks.template.propertyFields.disabled = 'disabled';

      pieSeries.ticks.template.locationX = 1;
      pieSeries.ticks.template.locationY = 0;

      pieSeries.labelsContainer.width = 100;

      chart.legend = new am4charts.Legend();
      chart.legend.position = 'right';

      chart.legend.paddingRight = 10;
      chart.legend.paddingBottom = 0;
      const marker = chart.legend.markers.template.children.getIndex(0);
      chart.legend.markers.template.width = 20;
      chart.legend.markers.template.height = 10;
      marker.cornerRadius(10, 10, 20, 20);
      circleChart = chart;
    },
    [data],
  );
  useEffect(
    () => () => {
      if (circleChart) {
        circleChart.dispose();
      }
    },
    [],
  );
  return <div {...props} id={id} />;
}

function customData(obj) {
  const { revenue = [], invetory = [] } = obj || {};

  let count = 0;
  let result = [];
  while (count < 12) {
    let object = {};
    object.month = count + 1;
    object.totalValue = invetory[count] && invetory[count].totalValue;
    object.totalRevenue = revenue[count] && revenue[count].totalRevenue;
    result.push(object);
    count += 1;
  }
  return result;
}
function ColumnChart(props) {
  const { data = {}, titleTex, id, isExport } = props;
  const [chartExport, setChartExport] = useState();
  let result = customData(data);
  let ColumnChart;
  useEffect(
    () => {
      let chart = am4core.create(id, am4charts.XYChart);
      am4core.addLicense('ch-custom-attribution');
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      chart.data = result;
      var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'month';
      categoryAxis.numberFormatter.numberFormat = '#';
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.cellStartLocation = 0.1;
      categoryAxis.renderer.cellEndLocation = 0.9;

      chart.legend = new am4charts.Legend();
      chart.legend.valign = 'bottom';

      var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.opposite = true;

      function createSeries(field, name) {
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = field;
        series.dataFields.categoryY = 'month';
        series.name = name;
        series.columns.template.tooltipText = '{name}: [bold]{valueX}[/]';
        series.columns.template.height = am4core.percent(100);
        series.sequencedInterpolation = true;

        var valueLabel = series.bullets.push(new am4charts.LabelBullet());
        valueLabel.label.text = '{valueX}';
        valueLabel.label.horizontalCenter = 'left';
        valueLabel.label.dx = 10;
        valueLabel.label.hideOversized = false;
        valueLabel.label.truncate = false;

        var categoryLabel = series.bullets.push(new am4charts.LabelBullet());
        categoryLabel.label.text = '{name}';
        categoryLabel.label.horizontalCenter = 'right';
        categoryLabel.label.dx = -10;
        categoryLabel.label.fill = am4core.color('#fff');
        categoryLabel.label.hideOversized = false;
        categoryLabel.label.truncate = false;
      }
      createSeries('totalRevenue', 'Doanh thu bán hàng');
      createSeries('totalValue', 'Giá trị tồn kho');
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
export class AddStockManager extends React.Component {
  state = {
    currentStock: '',
    currentCatalog: '',
    currentTag: '',
    allStock: [],
    allInventory: [],
    allCategoryTree: [],
    allTags: [],
    circleColumns: [],
    data: [],
    count: 0,
    queryFilter: {
      year: 2021,
      organizationUnitId: '',
      employeeId: '',
      skip: 0,
      limit: 10,
    },
  };

  getData = obj => {
    const { tab } = this.props;
    let url;
    switch (tab) {
      case 0:
        url = API_REPORT_PRODUCT_INVENTORY;
        break;
      case 1:
        url = API_REPORT_STOCK_INVENTORY_BY_YEAR;
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

  componentDidMount() {
    this.props.onGetAllStock();
    this.props.onGetAllInventory();
    const { tab } = this.props;
    if (Number(this.props.addStockManager.tab) === 1 || Number(this.props.addStockManager.tab) === 4) {
      this.props.onGetAllCategory();
    }
    if (Number(this.props.addStockManager.tab) === 2 || Number(this.props.addStockManager.tab) === 3) {
      this.props.onGetAllTag();
    }
    let obj = {
      year: 2021,
      organizationUnitId: '',
      employeeId: '',
      skip: 0,
      limit: 10,
    };
    this.getData(obj);
  }

  // componentWillReceiveProps(props) {
  //   if (props !== this.props) {
  //     const { addStockManager } = props;
  //     const allStock = addStockManager.allStock || [];
  //     const allInventory = addStockManager.allInventory || [];
  //     this.setState({ allInventory });
  //     if (Number(this.props.addStockManager.tab) === 1 || Number(this.props.addStockManager.tab) === 4) {
  //       const allCategoryFlat = addStockManager.allCategory || [];
  //       const allCategoryTree = this.covertFlatToTree(allCategoryFlat);
  //       allCategoryTree.forEach(item => {
  //         let arr = [item._id];
  //         if (item.children && item.children.length > 0) {
  //           arr = this.getListChild(item, arr);
  //         }
  //         item.listChild = arr;
  //       });
  //       this.setState({ allCategoryTree, currentCatalog: allCategoryTree.length > 0 ? allCategoryTree[0]._id : '' });
  //       const arrInventory = allInventory.filter(n => n.catalog);
  //       arrInventory.forEach(x => {
  //         const curCatalogIndex = allCategoryTree.findIndex(u => u.listChild.includes(x.catalog.catalogId));
  //         if (curCatalogIndex !== -1) {
  //           if (allCategoryTree[curCatalogIndex].hasOwnProperty('childInventory')) {
  //             allCategoryTree[curCatalogIndex].childInventory.push(x);
  //           } else {
  //             allCategoryTree[curCatalogIndex].childInventory = [x];
  //           }
  //           const point = x.sellingPoint.find(a => String(a.organizationUnitId) === String(this.state.currentStock));
  //           if (point) {
  //             if (allCategoryTree[curCatalogIndex].hasOwnProperty('value')) {
  //               allCategoryTree[curCatalogIndex].value += Number(point.amount) || 0;
  //             } else {
  //               allCategoryTree[curCatalogIndex].value = Number(point.amount) || 0;
  //             }
  //           }
  //         }
  //       });
  //       if (Number(this.props.addStockManager.tab) === 4) {
  //         const data = [];
  //         const curCategory = allCategoryTree.find(n => String(n._id) === String(this.state.currentCatalog));
  //         if (curCategory && curCategory.childInventory) {
  //           curCategory.childInventory.forEach(v => {
  //             const pointx = v.sellingPoint.find(a => String(a.organizationUnitId) === String(this.state.currentStock));
  //             if (pointx) {
  //               data.push({
  //                 name: v.name,
  //                 value: Number(pointx.amount) || 0,
  //               });
  //             }
  //           });
  //         }
  //         this.setState({ circleColumns: data });
  //       } else {
  //         const dataCircle = allCategoryTree.map(z => ({
  //           name: z.name,
  //           value: z.value || 0,
  //         }));
  //         this.setState({ circleColumns: dataCircle });
  //       }
  //     }
  //     if (Number(this.props.addStockManager.tab) === 2 || Number(this.props.addStockManager.tab) === 3) {
  //       const allTags = addStockManager.allTags || [];
  //       this.setState({ allTags, currentTag: allTags.length > 0 ? allTags[0].name : '' });
  //       this.state.currentTag = allTags.length > 0 ? allTags[0].name : '';
  //       const arrInventory = allInventory.filter(n => n.tags);
  //       arrInventory.forEach(x => {
  //         const curCatalogIndex = allTags.findIndex(u => String(u.name) === String(x.tags[0]));
  //         if (curCatalogIndex !== -1) {
  //           if (allTags[curCatalogIndex].hasOwnProperty('childInventory')) {
  //             allTags[curCatalogIndex].childInventory.push(x);
  //           } else {
  //             allTags[curCatalogIndex].childInventory = [x];
  //           }
  //           const point = x.sellingPoint.find(a => String(a.organizationUnitId) === String(this.state.currentStock));
  //           if (point) {
  //             if (allTags[curCatalogIndex].hasOwnProperty('value')) {
  //               allTags[curCatalogIndex].value += Number(point.amount) || 0;
  //             } else {
  //               allTags[curCatalogIndex].value = Number(point.amount) || 0;
  //             }
  //           }
  //         }
  //       });
  //       if (Number(this.props.addStockManager.tab) === 3) {
  //         const data = [];
  //         const curCategory = allTags.find(n => String(n.name) === String(this.state.currentTag));
  //         if (curCategory) {
  //           curCategory.childInventory
  //             ? curCategory.childInventory.forEach(v => {
  //                 const pointx = v.sellingPoint.find(a => String(a.organizationUnitId) === String(this.state.currentStock));
  //                 if (pointx) {
  //                   data.push({
  //                     name: v.name,
  //                     value: Number(pointx.amount) || 0,
  //                   });
  //                 }
  //               })
  //             : null;
  //         }
  //         this.setState({ circleColumns: data, allTags });
  //       } else {
  //         const dataCircle = allTags.map(z => ({
  //           name: z.name,
  //           value: z.value || 0,
  //         }));
  //         this.setState({ circleColumns: dataCircle, allTags });
  //       }
  //     }
  //     this.setState({ allStock, currentStock: allStock.length > 0 ? allStock[0].id : '' });
  //   }
  // }

  // getListChild = (item, arr) => {
  //   if (item.children && item.children.length > 0) {
  //     item.children.forEach(n => {
  //       arr.push(n._id);
  //       if (item.children && item.children.length > 0) {
  //         this.getListChild(n, arr);
  //       }
  //     });
  //   }
  //   return arr;
  // };
  // onExportSuccess = () => {
  //   this.setState({ isExport: false });
  // };
  // customData = obj => {
  //   const { data = {} } = obj;
  //   const { revenue = [], invetory = [] } = data || {};

  //   let result = [];
  //   let objRenue = {};
  //   let objInventory = {};
  //   objRenue.groupName = 'Doanh thu bán hàng';
  //   if (revenue.length !== 0) {
  //     revenue &&
  //       revenue.map(i => {
  //         if (i) {
  //           objRenue[`month_${i.month}`] = i.totalRevenue;
  //         }
  //       });
  //     result.push(objRenue);
  //   }
  //   if (invetory.length !== 0) {
  //     objInventory.groupName = 'Giá trị tồn kho';
  //     invetory &&
  //       invetory.map((i, index) => {
  //         if (i) {
  //           objInventory[`month_${index + 1}`] = i.totalValue;
  //         }
  //       });
  //     result.push(objInventory);
  //   }
  //   return result;
  // };

  customData = ({ data = [] }) => {
    let result = [];
    Array.isArray(data) &&
      data.length > 0 &&
      data.map(i => {
        let { status, name, ...rest } = i || {};
        const newItem = { groupName: name };
        if (Array.isArray(i.data)) {
          i.data.map((item, index) => {
            newItem[`month_${index + 1}`] = item.totalInventory;
          });
        }
        result.push(newItem);
      });
    return result;
  };

  mergeData = data => {
    this.props.mergeData(data);
  };
  handleClear = () => {
    const obj = {
      year: moment().format('YYYY'),
      organizationUnitId: '',
      employeeId: '',
      skip: 0,
      limit: 10,
    };
    this.getData(obj);
  };
  customField = () => {
    const { data = [] } = this.state;
    let result = [];
    result = Array.isArray(data) ? data.filter(f => f.percent !== 0) : [];

    let viewConfig = [];
    viewConfig[0] = { name: 'groupName', title: 'Nội dung', checked: true, width: 120 };
    if (result && Array.isArray(result)) {
      result.map((i, index) => {
        viewConfig[index + 1] = {
          name: i.name,
          title: i.name,
          checked: true,
          width: 120,
        };
      });
    }
    return viewConfig;
  };
  customDataPieChart = ({ data = [] }) => {
    let result = Array.isArray(data) ? data.filter(f => f.percent !== 0) : [];

    let obj = {};
    let finalResult = [];
    obj.groupName = 'Gía trị tồn kho';
    if (Array.isArray(result)) {
      result.map(i => {
        obj[i.name] = i.inventoryPrice && i.inventoryPrice.toFixed(2);
      });
      finalResult.push(obj);
    }
    return finalResult;
  };

  handleSearch = obj => {
    const { queryFilter } = this.state;
    const objFilter = {
      organizationUnitId: obj.organizationUnitId,
      employeeId: obj.employeeId,
      year: obj.year,
      limit: queryFilter.limit,
      skip: queryFilter.skip,
    };
    this.getData(objFilter);
  };

  render() {
    const { addStockManager, tab, profile, miniActive } = this.props;
    const { data, isExport, zoom, queryFilter, count } = this.state;
    const { filter } = this.props.addStockManager;
    console.log(data);
    const Bt = props => (
      <Buttons onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'}>
        {props.children}
      </Buttons>
    );
    return (
      <div>
        <Grid style={{ width: !miniActive ? 'calc(100vw - 260px)' : 'calc(100vw - 100px)' }}>
          <Grid item sm={12}>
            {/* <Bt tab={6}>
              <i>Báo cáo tồn kho</i>
            </Bt> */}
            {/* <Bt tab={1} style={{ marginLeft: 30 }}>
              <i>Tổng hợp tồn kho theo loại hình</i>
            </Bt> */}
            {/* <Bt tab={2}>
              <i>Tổng hợp tồn kho theo ngành hàng</i>
            </Bt>
            <Bt tab={3}>
              <i>Tổng hợp tồn kho theo loại sản phẩm</i>
            </Bt>
            <Bt tab={4}>
              <i>Tổng hợp tồn kho theo nhóm sản phẩm</i>
            </Bt>
            <Bt tab={5}>
              <i>Tổng hợp giá trị tồn kho trong năm</i>
            </Bt> */}
          </Grid>
        </Grid>
        {tab === 1 ? (
          <Grid style={{ width: !miniActive ? 'calc(100vw - 260px)' : 'calc(100vw - 80px)' }}>
            <Paper>
              <Typography align="center" style={{ marginTop: 10, fontSize: 25 }}>
                Tổng hợp giá trị tồn kho trong năm
              </Typography>{' '}
              <Grid item xs={12} />
              <Grid item xs={12}>
                <CustomChartWrapper
                  onGetData={this.handleSearch}
                  profile={profile}
                  onZoom={z => this.setState({ zoom: z })}
                  onRefresh={this.handleClear}
                  isReport={true}
                  code="reportRevenueInventory "
                  id="stockChart5"
                  onExport={() => this.setState({ isExport: true })}
                >
                  {/* <ColumnChart
                    style={{ width: '100%', maxHeight: '100vh', height: zoom ? '95vh' : '80vh' }}
                    data={data}
                    onExportSuccess={this.onExportSuccess}
                    isExport={isExport}
                    id="chart5"
                  /> */}
                </CustomChartWrapper>
              </Grid>
              <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }}>
                <ListPage
                  apiUrl={`${API_REPORT_STOCK_INVENTORY_BY_YEAR}?${serialize(queryFilter)}`}
                  columns={inventoryReportByMonthColumns}
                  customRows={this.customData}
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
        {tab === 0 ? (
          <div>
            <Paper>
              <Grid style={{ width: !miniActive ? 'calc(100vw - 280px)' : 'calc(100vw - 130px)' }}>
                <Grid item md={12}>
                  <Typography align="center" style={{ marginTop: 10, fontSize: 25 }}>
                    Tổng hợp tồn kho theo{' '}
                    {this.props.addStockManager.tab === 1
                      ? 'loại hình'
                      : this.props.addStockManager.tab === 2
                        ? 'ngành hàng'
                        : this.props.addStockManager.tab === 4
                          ? 'nhóm sản phẩm'
                          : 'loại sản phẩm'}
                  </Typography>

                  <CustomChartWrapper
                    onGetData={this.handleSearch}
                    profile={profile}
                    onZoom={z => this.setState({ zoom: z })}
                    onRefresh={this.handleClear}
                    isReport={true}
                    code="reportInventoryProduct"
                    id="stockChart4"
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
                <Grid item xs={12} md={12} style={{ marginTop: 30, paddingBottom: '30px' }}>
                  <ListPage
                    apiUrl={`${API_REPORT_PRODUCT_INVENTORY}?${serialize(queryFilter)}`}
                    columns={data && this.customField()}
                    // customColumns = {(data)=>this.customField(data)}
                    customRows={this.customDataPieChart}
                    client
                    count={count}
                    disableEdit
                    disableAdd
                    disableConfig
                    disableSearch
                    disableSelect
                  />
                </Grid>
                <Grid item md={2}>
                  {/* <TextField
                    label="Kho"
                    select
                    variant="outlined"
                    name="currentStock"
                    onChange={this.handleChange}
                    fullWidth
                    value={this.state.currentStock}
                    margin="normal"
                  >
                    {this.state.allStock && this.state.allStock.length > 0
                      ? this.state.allStock.map(item => (
                          <MenuItem
                            key={item.id}
                            value={item.id}
                            style={item.padding !== 0 ? { paddingLeft: `${parseInt(item.padding, 10) * 1.5}px` } : {}}
                          >
                            {item.name}
                          </MenuItem>
                        ))
                      : null}
                  </TextField> */}
                </Grid>
                {/* {tab === 4 ? (
                  <Grid item md={2}>
                    <TextField
                      label="Nhóm sản phẩm"
                      select
                      variant="outlined"
                      name="currentCatalog"
                      onChange={this.handleChangeCatalog}
                      fullWidth
                      value={this.state.currentCatalog}
                      margin="normal"
                    >
                      {this.state.allCategoryTree && this.state.allCategoryTree.length > 0
                        ? this.state.allCategoryTree.map(item => (
                            <MenuItem key={item._id} value={item._id}>
                              {item.name}
                            </MenuItem>
                          ))
                        : null}
                    </TextField>
                  </Grid>
                ) : null} */}
                {tab === 3 ? (
                  <Grid item md={2}>
                    <TextField
                      label="Loại sản phẩm"
                      select
                      variant="outlined"
                      name="currentTag"
                      onChange={this.handleChangeTag}
                      fullWidth
                      value={this.state.currentTag}
                      margin="normal"
                    >
                      {this.state.allTags && this.state.allTags.length > 0
                        ? this.state.allTags.map(item => (
                            <MenuItem key={item._id} value={item.name}>
                              {item.name}
                            </MenuItem>
                          ))
                        : null}
                    </TextField>
                  </Grid>
                ) : null}
              </Grid>
            </Paper>
            {/* <Grid style={{ width: '100%', marginTop: 30 }} container>
              <Grid item md={12}>
                {this.state.circleColumns && this.state.circleColumns.length > 0 ? (
                  <CircleChart data={this.state.circleColumns} id="chart1" style={{ width: '100%', height: '500px', marginTop: 30 }} />
                ) : (
                  <div>Loading</div>
                )}
              </Grid>
            </Grid> */}
            {/* <Grid style={{ width: '100%', height: '50vh', marginTop: 30 }} container>
              <Grid item md={12}>
                <FunnelChart style={{ width: '100%', height: '100%' }} data={this.state.columnFunnel} id="chart12" />
              </Grid>
            </Grid> */}
            {/* <Paper style={{ width: '100%' }}>
              {' '}
              <Grid item xs={12} md={12} style={{ marginTop: 50, paddingBottom: '30px', width: '100%' }}>
                <Table style={{ overflow: 'scroll', display: 'block' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nội dung</TableCell>
                      {this.state.circleColumns && this.state.circleColumns.length > 0
                        ? this.state.circleColumns.map(item => <TableCell>{item.name}</TableCell>)
                        : ''}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Giá trị tồn kho</TableCell>
                      {this.state.circleColumns && this.state.circleColumns.length > 0
                        ? this.state.circleColumns.map(item => <TableCell>{item.value}</TableCell>)
                        : ''}
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Paper> */}
          </div>
        ) : null}
        {tab === 6 ? (
          <Grid item md={12}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 20 }}>
                <DateTimePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY HH:mm"
                  label="Từ Ngày"
                  value={addStockManager.startDate}
                  name="startDate1"
                  error={false}
                  helperText={null}
                  variant="outlined"
                  margin="dense"
                  onChange={value => this.props.mergeData({ startDate: value })}
                  style={{ padding: 10 }}
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingFlat color="primary" />
                </div>

                <DateTimePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY HH:mm"
                  label="Đến"
                  error={false}
                  helperText={null}
                  value={addStockManager.endDate}
                  name="endDate"
                  margin="dense"
                  variant="outlined"
                  onChange={value => this.handleChangeDate(value)}
                  style={{ padding: 10 }}
                />
              </div>
            </MuiPickersUtilsProvider>
            <div id="report-task1">
              <ListPage
                // kanban="ST11"
                disableEdit
                disableAdd
                disableConfig
                columns={inventoryColumns}
                apiUrl={`${API_REPORT}/inventory`}
                filter={filter}
                client
                mapFunction={this.mapFuntionReport}
              />
            </div>
          </Grid>
        ) : null}
      </div>
    );
  }

  handleChangeDate = value => {
    if (new Date(this.props.addStockManager.startDate) > new Date(value)) {
      this.props.onChangeSnackbar({ status: true, message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu', variant: 'warning' });
      return;
    }
    this.props.mergeData({
      endDate: value,
      filter: {
        startDate: new Date(this.props.addStockManager.startDate).toISOString(),
        endDate: new Date(value).toISOString(),
      },
    });
  };

  mapFuntionReport = item => ({
    ...item,
    unit: item['unit.name'],
  });

  handleChangeTag = e => {
    this.setState({ [e.target.name]: e.target.value });
    if (Number(this.props.addStockManager.tab) === 2 || Number(this.props.addStockManager.tab) === 3) {
      const { allTags, allInventory } = this.state;
      const arrInventory = allInventory.filter(n => n.tags);
      arrInventory.forEach(x => {
        const curCatalogIndex = allTags.findIndex(u => String(u.name) === String(x.tags[0]));
        if (curCatalogIndex !== -1) {
          if (allTags[curCatalogIndex].hasOwnProperty('childInventory')) {
            allTags[curCatalogIndex].childInventory.push(x);
          } else {
            allTags[curCatalogIndex].childInventory = [x];
          }
          const point = x.sellingPoint.find(a => String(a.organizationUnitId) === String(this.state.currentStock));
          if (point) {
            if (allTags[curCatalogIndex].hasOwnProperty('value')) {
              allTags[curCatalogIndex].value += Number(point.amount) || 0;
            } else {
              allTags[curCatalogIndex].value = Number(point.amount) || 0;
            }
          }
        }
      });
      if (Number(this.props.addStockManager.tab) === 3) {
        const data = [];
        const curCategory = allTags.find(n => String(n.name) === String(e.target.value));
        if (curCategory) {
          curCategory.childInventory
            ? curCategory.childInventory.forEach(v => {
                const pointx = v.sellingPoint.find(a => String(a.organizationUnitId) === String(this.state.currentStock));
                if (pointx) {
                  data.push({
                    name: v.name,
                    value: Number(pointx.amount) || 0,
                  });
                }
              })
            : null;
        }
        this.setState({ circleColumns: data, allTags });
      } else {
        const dataCircle = allTags.map(z => ({
          name: z.name,
          value: z.value || 0,
        }));
        this.setState({ circleColumns: dataCircle, allTags });
      }
    }
  };

  covertFlatToTree = list => {
    let node;
    let i;
    const map = {};
    const roots = [];
    for (i = 0; i < list.length; i += 1) {
      map[list[i]._id] = i; // initialize the map
      list[i].children = []; // initialize the children
    }
    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.parent !== null) {
        // if you have dangling branches check that map[node.parentId] exists
        list[map[node.parent]] ? list[map[node.parent]].children.push(node) : null;
      } else {
        roots.push(node);
      }
    }
    return roots;
  };

  handleChangeCatalog = e => {
    this.setState({ [e.target.name]: e.target.value });
    if (Number(this.props.addStockManager.tab) === 4) {
      const { allInventory, allCategoryTree } = this.state;
      const arrInventory = allInventory.filter(n => n.catalog);
      arrInventory.forEach(x => {
        const curCatalogIndex = allCategoryTree.findIndex(u => u.listChild.includes(x.catalog.catalogId));
        if (curCatalogIndex !== -1) {
          if (allCategoryTree[curCatalogIndex].hasOwnProperty('childInventory')) {
            allCategoryTree[curCatalogIndex].childInventory.push(x);
          } else {
            allCategoryTree[curCatalogIndex].childInventory = [x];
          }
          const point = x.sellingPoint.find(a => String(a.organizationUnitId) === String(this.state.currentStock));
          if (point) {
            if (allCategoryTree[curCatalogIndex].hasOwnProperty('value')) {
              allCategoryTree[curCatalogIndex].value += Number(point.amount) || 0;
            } else {
              allCategoryTree[curCatalogIndex].value = Number(point.amount) || 0;
            }
          }
        }
      });
      if (Number(this.props.addStockManager.tab) === 4) {
        const data = [];
        const curCategory = allCategoryTree.find(n => String(n._id) === String(e.target.value));
        if (curCategory) {
          curCategory.childInventory.forEach(v => {
            const pointx = v.sellingPoint.find(a => String(a.organizationUnitId) === String(this.state.currentStock));
            if (pointx) {
              data.push({
                name: v.name,
                value: Number(pointx.amount) || 0,
              });
            }
          });
        }
        this.setState({ circleColumns: data });
      } else {
        const dataCircle = allCategoryTree.map(z => ({
          name: z.name,
          value: z.value || 0,
        }));
        this.setState({ circleColumns: dataCircle });
      }
    }
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    if (Number(this.props.addStockManager.tab) === 1 || Number(this.props.addStockManager.tab) === 4) {
      const { allInventory, allCategoryTree } = this.state;
      const arrInventory = allInventory.filter(n => n.catalog);
      arrInventory.forEach(x => {
        const curCatalogIndex = allCategoryTree.findIndex(u => u.listChild.includes(x.catalog.catalogId));
        if (curCatalogIndex !== -1) {
          if (allCategoryTree[curCatalogIndex].hasOwnProperty('childInventory')) {
            allCategoryTree[curCatalogIndex].childInventory.push(x);
          } else {
            allCategoryTree[curCatalogIndex].childInventory = [x];
          }
          const point = x.sellingPoint.find(a => String(a.organizationUnitId) === String(e.target.value));
          if (point) {
            if (allCategoryTree[curCatalogIndex].hasOwnProperty('value')) {
              allCategoryTree[curCatalogIndex].value += Number(point.amount) || 0;
            } else {
              allCategoryTree[curCatalogIndex].value = Number(point.amount) || 0;
            }
          }
        }
      });
      if (Number(this.props.addStockManager.tab) === 4) {
        const data = [];
        const curCategory = allCategoryTree.find(n => String(n._id) === String(this.state.currentCatalog));
        if (curCategory) {
          curCategory.childInventory.forEach(v => {
            const pointx = v.sellingPoint.find(a => String(a.organizationUnitId) === String(e.target.value));
            if (pointx) {
              data.push({
                name: v.name,
                value: Number(pointx.amount) || 0,
              });
            }
          });
        }
        this.setState({ circleColumns: data });
      } else {
        const dataCircle = allCategoryTree.map(z => ({
          name: z.name,
          value: z.value || 0,
        }));
        this.setState({ circleColumns: dataCircle });
      }
    }
    if (Number(this.props.addStockManager.tab) === 2 || Number(this.props.addStockManager.tab) === 3) {
      const { allTags, allInventory } = this.state;
      const arrInventory = allInventory.filter(n => n.tags);
      arrInventory.forEach(x => {
        const curCatalogIndex = allTags.findIndex(u => String(u.name) === String(x.tags[0]));
        if (curCatalogIndex !== -1) {
          if (allTags[curCatalogIndex].hasOwnProperty('childInventory')) {
            allTags[curCatalogIndex].childInventory.push(x);
          } else {
            allTags[curCatalogIndex].childInventory = [x];
          }
          const point = x.sellingPoint.find(a => String(a.organizationUnitId) === String(e.target.value));
          if (point) {
            if (allTags[curCatalogIndex].hasOwnProperty('value')) {
              allTags[curCatalogIndex].value += Number(point.amount) || 0;
            } else {
              allTags[curCatalogIndex].value = Number(point.amount) || 0;
            }
          }
        }
      });
      if (Number(this.props.addStockManager.tab) === 3) {
        const data = [];
        const curCategory = allTags.find(n => String(n.name) === String(this.state.currentTag));
        if (curCategory) {
          curCategory.childInventory
            ? curCategory.childInventory.forEach(v => {
                const pointx = v.sellingPoint.find(a => String(a.organizationUnitId) === String(e.target.value));
                if (pointx) {
                  data.push({
                    name: v.name,
                    value: Number(pointx.amount) || 0,
                  });
                }
              })
            : null;
        }
        this.setState({ circleColumns: data, allTags });
      } else {
        const dataCircle = allTags.map(z => ({
          name: z.name,
          value: z.value || 0,
        }));
        this.setState({ circleColumns: dataCircle, allTags });
      }
    }
  };
}

AddStockManager.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addStockManager: makeSelectAddStockManager(),
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAllStock: () => {
      dispatch(getAllStockAct());
    },
    onGetAllCategory: () => {
      dispatch(getAllCategoryAct());
    },
    onGetAllInventory: () => {
      dispatch(getAllInventoryAct());
    },
    onGetAllTag: () => {
      dispatch(getAllTagsAct());
    },
    mergeData: data => dispatch(mergeData(data)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addStockManager', reducer });
const withSaga = injectSaga({ key: 'addStockManager', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AddStockManager);

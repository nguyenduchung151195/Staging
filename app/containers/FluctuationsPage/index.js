/**
 *
 * FluctuationsPage
 *
 */

import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectFluctuationsPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import makeSelectDashboardPage, { makeSelectMiniActive } from '../Dashboard/selectors';
import VerticalDepartmentTree from '../../components/Filter/VerticalDepartmentTree';
import { Paper } from 'components/LifetekUi';
import { Grid } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import CustomChartWrapper from '../../components/Charts/CustomChartWrapper';
import { getIncreasesOrDecreases } from './actions';
import ExportTable from './exportTable';
import { tableToExcelCustomNoList, tableToPDF } from '../../helper';
import { Height } from 'devextreme-react/range-selector';
am4core.useTheme(Am4themesAnimated);

function createChart(id, data, category, value, legend, titleChart) {
  const chart = am4core.create(id, am4charts.XYChart);
  const title = chart.titles.create();
  title.text = titleChart;
  title.fontSize = 25;
  title.marginBottom = 30;
  title.fontWeight = 'bold';
  // Add data
  chart.data = data;
  // Create axes
  const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.renderer.minGridDistance = 30;
  categoryAxis.dataFields.category = category;
  categoryAxis.renderer.inversed = false;
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.renderer.cellStartLocation = 0.1;
  categoryAxis.renderer.cellEndLocation = 0.9;
  categoryAxis.renderer.minGridDistance = 40;

  const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.renderer.opposite = false;
  valueAxis.min = 0;
  // Create series
  function createSeries(field, name) {
    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = field;
    series.dataFields.categoryX = category;
    series.name = name;
    series.tooltipText = `${name}: [b]{valueY}[/]`;
    series.strokeWidth = 2;
    series.sequencedInterpolation = true;
    series.sequencedInterpolationDelay = 1;

    const bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.stroke = am4core.color('#fff');
    bullet.circle.strokeWidth = 2;

    return series;
  }
  if (value) {
    value.map(item => createSeries(item.field, item.name));
  }

  if (legend) {
    chart.legend = new am4charts.Legend();
  }
  chart.cursor = new am4charts.XYCursor();

  return chart;
}

function ColumnXYChart(props) {
  const [chart, setChart] = useState(null);
  const { id, data, category, isExport, onExportSuccess, value, legend, titleChart, isFullScreen} = props;

  useEffect(
    () => {
      if (isExport && chart) {
        chart.exporting.export('png');
        onExportSuccess();
      }
    },
    [isExport],
  );

  useEffect(
    () => {
      const columnChart = createChart(id, data, category, value, legend, titleChart);
      setChart(columnChart);
      return () => {
        if (columnChart) {
          columnChart.dispose();
        }
      };
    },
    [data],
  );

  // return <div id={id} {...props} />;
  return (
    <React.Fragment style={{ position: 'relative' }}>
      {isFullScreen ? (
        <div
          {...props}
          style={{ height: '70%', padding: '20px 0', marginTop: 20, width: '100%' }}
          id={id}
        />
      ) : (
        <div
          {...props}
          style={{ height: '100%', padding: '20px 0', marginTop: 20, width: '100%' }}
          id={id}
        />
      )}
    </React.Fragment>
  );
}

function FluctuationsPage(props) {
  const {
    timekeepingPage,
    fluctuationsPage,
    dashboardPage,
    tableId,
    onGetTimekeepingData,
    onSaveCellData,
    onGetAllTimekeepType,
    getIncreasesOrDecreases,
    miniActive
  } = props;

  const { increasesOrDecreases, loadingChart } = fluctuationsPage;
  const { allDepartment, allSymbol } = dashboardPage;
  const [query, setQuery] = useState({
    tableId,
    hrmEmployeeId: null,
    organizationId: null,
  });
  const [expansive, setExpansive] = useState(true);
  const [widthColumn, setWidthColumn] = useState(300);
  const [organizationUnitId, setOrganizationUnitId] = useState('');
  const [fields, setFields] = useState([]);
  const [localState, setLocalState] = useState({
    // isExportRevenueChart: false,
    exportAnchor: null,
    OpenExcel: null,
    exportHrm1: null,
    fullScreen: false,
  });

  useEffect(() => {
    getIncreasesOrDecreases();
  }, []);

  useEffect(() => {
    const hrmStatus = JSON.parse(localStorage.getItem('hrmStatus'));
    const foundKanban = hrmStatus && hrmStatus.find(item => item.code === 'ST01');
    const { data } = foundKanban;
    if (data) {
      const formatData = data.map(item => ({ field: item._id, name: item.name }));
      setFields(formatData);
    }
  }, []);

  const onClickExpansive = () => {
    if (expansive) {
      setExpansive(false);
      setWidthColumn(50);
    } else {
      setExpansive(true);
      setWidthColumn(300);
    }
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
  const handleChangeExportAnchor = data => {
    setLocalState({ exportAnchor: data });
  };
  const handleChangeOpenExcel = (key, data) => {
    // console.log(key, 'key');
    setLocalState({ [key]: data });
  };
  const handleCloseExcel = () => {
    const type = localState.OpenExcel;
    setLocalState({ OpenExcel: null });
    let title = 'Báo cáo theo tình hình nhân sự';
    // console.log(type, 'type');
    let html = [];
    let htmlTotal = 0;
    switch (type) {
      case 'PDF':
        const { totalPage = 1, pageNumber = 1 } = {};
        const content = tableToPDF('ExportTable', '', 'Báo cáo theo tình hình biến động tăng giảm', 'Báo cáo theo tình hình biến động tăng giảm');
        // this.setState({html: [e => [...e, { content, pageNumber }]]});
        // this.setState({htmlTotal: totalPage});
        html = [{ content, pageNumber }];
        htmlTotal = totalPage;
        if (html.length > 0 && htmlTotal !== 0) {
          if (html.length === htmlTotal) {
            for (let index = 0; index < htmlTotal; index++) {
              const win = window.open();
              win.document.write(html[index].content);
              win.document.close();
              win.print();
            }
          }
        }
        break;
      default:
        tableToExcelCustomNoList('ExportTable', 'W3C Example Table', undefined, undefined, title);
    }
  };
  const handleCheckFullScreen = () => {
    // console.log(localState.fullScreen, 123);
    setLocalState({ fullScreen: !localState.fullScreen });
  };
  return (
    <Paper>
      <Grid container spacing={16} direction="row" justify="flex-start" alignItems="flex-start" style={{ width: '100%', paddingTop: 15 }}>
        {expansive ? (
          <Grid item container style={{ width: `${widthColumn}px` }}>
            <Grid item container>
              <ArrowBackIcon color="primary" onClick={onClickExpansive} />
            </Grid>

            <VerticalDepartmentTree
              addUser={false}
              addHrm={true}
              departments={allDepartment}
              onChange={handleSelectDepart}
              departmentId={organizationUnitId}
            />
          </Grid>
        ) : (
          <Grid item container style={{ width: `${widthColumn}px` }}>
            <Grid item container className="ml-1">
              <ArrowForwardIcon color="primary" onClick={onClickExpansive} />
            </Grid>
          </Grid>
        )}
        <Grid item style={{ width: `calc(100% - ${widthColumn}px)` }}>
          <Grid container spacing={16} >
            <Grid item xs={12}>
              <CustomChartWrapper
                height="450px"
                onRefresh={getIncreasesOrDecreases}
                isLoading={loadingChart}
                // onExport={() => {
                //   setLocalState({ ...localState, isExportRevenueChart: true });
                // }}
                handleCheckFullScreen={handleCheckFullScreen}
                handleChangeExportAnchor={handleChangeExportAnchor}
                handleChangeOpenExcel={handleChangeOpenExcel}
                exportHrm1
              >
                <ColumnXYChart
                  id="chartIncreasesOrDecreases"
                  data={increasesOrDecreases}
                  titleChart="Biểu đồ biến động tăng giảm" // tiêu đề biểu đồ
                  category="month" // danh mục
                  value={fields} // dữ liệu string or array
                  lenged // hiển thị lenged
                  isFullScreen={localState.fullScreen}
                  // isExport={localState.isExportRevenueChart}
                  // onExportSuccess={() => setLocalState({ ...localState, isExportRevenueChart: false })}
                />
              </CustomChartWrapper>
              <ExportTable
                exportType={localState.OpenExcel}
                open={localState.OpenExcel}
                onClose={() => handleCloseExcel()}
                row={increasesOrDecreases}
                value={fields}
              />
            </Grid>
          </Grid>
          {/* <ListPage code="SalesPolicy" apiUrl={API_SALE_POLICY} /> */}
        </Grid>
      </Grid>
    </Paper>
  );
}

FluctuationsPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  fluctuationsPage: makeSelectFluctuationsPage(),
  dashboardPage: makeSelectDashboardPage(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getIncreasesOrDecreases: () => dispatch(getIncreasesOrDecreases()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'fluctuationsPage', reducer });
const withSaga = injectSaga({ key: 'fluctuationsPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(FluctuationsPage);

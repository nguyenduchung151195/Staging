/**
 *
 * TradingReport
 *
 */

import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@material-ui/core';
import { DateRangePicker } from 'react-date-range';
import moment from 'moment';
import _ from 'lodash';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import makeSelectTradingReport from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';
import { getItemByRangeAct, getLogsByRangeAct } from './actions';
import { Typography } from '../../components/LifetekUi';
import CustomDatePicker from '../../components/CustomDatePicker';

am4core.useTheme(Am4themesAnimated);
function CircleChart(props) {
  const { id, data, titleTex } = props;
  let circleChart;
  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.PieChart);
      chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
      chart.paddingLeft = 150;
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';
      chart.data = data;
      chart.validateData();
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'value';
      pieSeries.dataFields.category = 'name';
      pieSeries.alignLabels = true;
      // this makes only A label to be visible
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

function FunnelChart(props) {
  const { id, data, titleTex } = props;
  let funnelChart;
  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.SlicedChart);
      chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
      // chart.paddingLeft = 150;
      chart.paddingRight = 120;
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';
      chart.data = data;
      chart.validateData();
      const pieSeries = chart.series.push(new am4charts.FunnelSeries());
      pieSeries.dataFields.value = 'value';
      pieSeries.dataFields.category = 'name';
      pieSeries.alignLabels = true;
      // this makes only A label to be visible
      pieSeries.labels.template.propertyFields.disabled = 'disabled';
      pieSeries.ticks.template.propertyFields.disabled = 'disabled';

      pieSeries.ticks.template.locationX = 1;
      pieSeries.ticks.template.locationY = 0;

      pieSeries.labelsContainer.width = 100;

      chart.legend = new am4charts.Legend();

      // chart.legend.paddingRight = 160;
      chart.legend.paddingBottom = 40;
      const marker = chart.legend.markers.template.children.getIndex(0);
      chart.legend.markers.template.width = 20;
      chart.legend.markers.template.height = 10;
      marker.cornerRadius(10, 10, 20, 20);
      funnelChart = chart;
    },
    [data],
  );
  useEffect(
    () => () => {
      if (funnelChart) {
        funnelChart.dispose();
      }
    },
    [],
  );
  return <div {...props} id={id} />;
}

const actionDefineList = [
  {
    name: 'Bình luận',
    type: 'messages',
  },
  {
    name: 'Tạo công việc',
    type: 'task',
  },
  {
    name: 'Gọi điện',
    type: 'call',
  },
  {
    name: 'Thăm doanh nghiệp',
    type: 'Visit',
  },
  {
    name: 'Lịch họp',
    type: 'Meeting',
  },
  {
    name: 'Nhắc lịch',
    type: 'Reminder',
  },
];
/* eslint-disable react/prefer-stateless-function */
export class TradingReport extends React.Component {
  state = {
    openPickDate: false,
    dateString: `Từ ${moment()
      .subtract(1, 'months')
      .format('DD/MM/YYYY')} đến ${moment().format('DD/MM/YYYY')}`,
    selectionRange: {
      startDate: new Date(moment().subtract(1, 'months')),
      endDate: new Date(),
      key: 'selection',
    },
    dialogSelectionRange: {
      // startDate: new Date(moment().subtract(1, 'months')),
      // endDate: new Date(),
      endDate: moment().format('YYYY-MM-DD'),
      startDate: moment()
        .clone()
        .startOf('month')
        .format('YYYY-MM-DD'),
      key: 'selection',
    },
    crmStatusSteps: [],
    funnelData: [],
    actionsData: [],
    errorStartDateEndDate: false,
    errorTextStartDate: '',
    errorTextEndDate: '',
  };

  componentDidMount() {
    const listCrmStatus = JSON.parse(localStorage.getItem('crmStatus'));
    const currentCrmStatus = listCrmStatus[listCrmStatus.findIndex(d => d.code === 'ST03')];
    const laneStart = [];
    const laneAdd = [];
    const laneSucces = [];
    const laneFail = [];
    currentCrmStatus.data.forEach(item => {
      switch (item.code) {
        case 1:
          laneStart.push(item);
          break;
        case 2:
          laneAdd.push(item);
          break;

        case 3:
          laneSucces.push(item);
          break;

        case 4:
          laneFail.push(item);
          break;

        default:
          break;
      }
    });
    const sortedKanbanStatus = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
    this.setState({ crmStatusSteps: sortedKanbanStatus });
    const { selectionRange } = this.state;
    const start = `${moment(selectionRange.startDate).format('YYYY-MM-DD')}T00:00:00.000Z`;
    const end = `${moment(selectionRange.endDate).format('YYYY-MM-DD')}T23:59:00.000Z`;
    const params = {
      filter: {
        createdAt: {
          $gte: start,
          $lte: end,
        },
      },
    };
    const params2 = {
      filter: {
        createdAt: {
          $gte: start,
          $lte: end,
        },
        model: 'ExchangingAgreement',
      },
    };
    this.props.onGetItem(params);
    this.props.onGetLogs(params2);
  }

  

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      const { tradingReport } = props;
      const { crmStatusSteps } = this.state;
      const itemsList = tradingReport.items || [];
      const actionsList = tradingReport.logs || [];
      const newList = _.groupBy(itemsList, 'kanbanStatus');
      const dataList = crmStatusSteps.map(item => ({
        name: item.name,
        value: newList[item._id] ? newList[item._id].length : 0,
      }));

      const newActionsList = _.groupBy(actionsList, 'type');
      const dataActionsList = actionDefineList.map(item => ({
        name: item.name,
        value: newActionsList[item.type] ? newActionsList[item.type].length : 0,
      }));

      this.setState({
        funnelData: dataList,
        actionsData: dataActionsList,
      });
    }
  }

  render() {
    
    const {
      dialogSelectionRange,
      errorStartDateEndDate,
      errorTextStartDate,
      errorTextEndDate,
    } = this.state;
    const { startDate,endDate } = dialogSelectionRange;
    return (
      <div>
        <Grid style={{margin: '0 20px'}} container spacing={8} >
            {/* <Button
              onClick={() => {
                const { selectionRange } = this.state;
                this.setState({ openPickDate: true, dialogSelectionRange: selectionRange });
              }}
            >
              {this.state.dateString}
            </Button> */}
            <Grid item md={3}>
              <CustomDatePicker name="startDate" label="Từ ngày" value={startDate}  onChange={e => this.handleChangeFiler(e, true)} />
              {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextStartDate}</Typography> : null}
            </Grid>
            <Grid item md={3}>
              <CustomDatePicker name="endDate" label="Đến ngày" value={endDate}  onChange={e => this.handleChangeFiler(e, false)} />
              {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextEndDate}</Typography> : null}
            </Grid>
        </Grid>
        <FunnelChart
          data={this.state.funnelData}
          titleTex="Trạng thái Kanban 1"
          id="chart1"
          style={{ width: '48%', height: '500px', margin: 0, display: 'inline-flex' }}
        />
        <CircleChart
          data={this.state.actionsData}
          titleTex="Hành động"
          id="chart3"
          style={{ width: '48%', height: '500px', margin: 0, display: 'inline-flex' }}
        />
        {/* <Dialog open={this.state.openPickDate} onClose={this.handleClose} aria-labelledby="form-dialog-title" maxWidth="md">
          <DialogTitle id="form-dialog-title">Chọn khoảng ngày</DialogTitle>
          <DialogContent>
            <DateRangePicker
              ranges={[this.state.dialogSelectionRange]}
              maxDate={new Date()}
              showSelectionPreview={false}
              onChange={this.handleSelect}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} varian='outlined' color="secondary">
              Hủy
            </Button>
            <Button onClick={this.handleSaveDate} varian='outlined' color="primary">
              Lưu
            </Button>
          </DialogActions>
        </Dialog> */}
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }

  // handleClose = () => {
  //   const { selectionRange } = this.state;
  //   this.setState({ openPickDate: false, dialogSelectionRange: selectionRange });
  // };
  handleChangeFiler = (e, isStartDate) => {
    const name = isStartDate ? 'startDate' : 'endDate';
    const value = isStartDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
    const { dialogSelectionRange } = this.state;
    const newDialogSelectionRange = { ...dialogSelectionRange, [name]: value };

    // TT
    if (!newDialogSelectionRange.startDate && newDialogSelectionRange.endDate) {
      this.setState(state => ({ ...state, errorStartDateEndDate: true, errorTextStartDate: 'nhập thiếu: "Từ ngày"', errorTextEndDate: '' }));
    } else if (newDialogSelectionRange.startDate && !newDialogSelectionRange.endDate) {
      this.setState(state => ({ ...state, errorStartDateEndDate: true, errorTextStartDate: '', errorTextEndDate: 'nhập thiếu: "Đến ngày"' }));
    } else if (newDialogSelectionRange.startDate && newDialogSelectionRange.endDate && new Date(newDialogSelectionRange.endDate) < new Date(newDialogSelectionRange.startDate)) {
      this.setState(state => ({
        ...state,
        errorStartDateEndDate: true,
        errorTextStartDate: '"Từ ngày" phải nhỏ hơn "Đến ngày"',
        errorTextEndDate: '"Đến ngày" phải lớn hơn "Từ ngày"',
      }));
    } else {
      this.setState(state => ({ ...state, errorStartDateEndDate: false, errorTextStartDate: '', errorTextEndDate: '' }));
    }

    

    this.setState(state => ({ ...state, dialogSelectionRange: { ...newDialogSelectionRange } }));
    
    // this.setState(state => ({ ...state, filter: { ...state.filter, [name]: value } }));
  };

  handleSaveDate = () => {
    const { dialogSelectionRange } = this.state;
    let str = '';
    const x = new Date(dialogSelectionRange.startDate);
    const y = new Date(dialogSelectionRange.endDate);
    if (x.getTime() === y.getTime()) {
      str = `${moment(dialogSelectionRange.startDate).format('DD/MM/YYYY')}`;
    } else {
      str = `Từ ${moment(dialogSelectionRange.startDate).format('DD/MM/YYYY')} đến ${moment(dialogSelectionRange.endDate).format('DD/MM/YYYY')}`;
    }
    const start = `${moment(dialogSelectionRange.startDate).format('YYYY-MM-DD')}T00:00:00.000Z`;
    const end = `${moment(dialogSelectionRange.endDate).format('YYYY-MM-DD')}T23:59:00.000Z`;
    const params = {
      filter: {
        createdAt: {
          $gte: start,
          $lte: end,
        },
      },
    };
    const params2 = {
      filter: {
        createdAt: {
          $gte: start,
          $lte: end,
        },
        model: 'ExchangingAgreement',
      },
    };
    this.props.onGetLogs(params2);
    this.props.onGetItem(params);
    this.setState({ openPickDate: false, selectionRange: dialogSelectionRange, dateString: str });
  };

  handleSelect = ranges => {
    if (ranges.selection.endDate > new Date(moment().add(1, 'days'))) {
      return;
    }
    const range = {
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
      key: 'selection',
    };
    this.setState({
      dialogSelectionRange: range,
    });
  };
}

TradingReport.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  tradingReport: makeSelectTradingReport(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetItem: body => {
      dispatch(getItemByRangeAct(body));
    },
    onGetLogs: body => {
      dispatch(getLogsByRangeAct(body));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'tradingReport', reducer });
const withSaga = injectSaga({ key: 'tradingReport', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(TradingReport);

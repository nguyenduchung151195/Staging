/**
 *
 * ReportSource
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { TrendingFlat } from '@material-ui/icons';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import { Grid } from '@material-ui/core';
import injectSaga from 'utils/injectSaga';

import injectReducer from 'utils/injectReducer';
import { reportSourceColumns } from 'variable';
import ListPage from 'components/List';
import { changeSnackbar } from '../Dashboard/actions';
import makeSelectReportSource from './selectors';
import reducer from './reducer';
import saga from './saga';
import { mergeData, getData } from './actions';
import CircleChart from './CircleChart';
import { API_REPORT } from '../../config/urlConfig';
// import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
export class ReportSource extends React.Component {
  componentDidMount() {
    this.props.getData(this.props.reportSource.filter);
  }

  render() {
    const { reportSource } = this.props;
    const { filter, reload } = reportSource;

    return (
      <div>
        <Grid item md={12}>
          <CircleChart
            style={{ width: '100%', height: '500px' }}
            title="BÁO CÁO DOANH SỐ THEO NGUỒN ĐẾN"
            data={reportSource.circleChart}
            id="chart1"
          />
        </Grid>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginRight: 50,
          }}
        >
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginLeft: 30 }}>
              <DateTimePicker
                inputVariant="outlined"
                format="DD/MM/YYYY HH:mm"
                label="Từ Ngày"
                value={reportSource.startDate}
                name="startDate1"
                error={false}
                helperText={null}
                variant="outlined"
                margin="dense"
                onChange={value => this.props.mergeData({ startDate: value })}
                // style={{ padding: 10 }}
              />
              <div style={{ display: 'flex', alignItems: 'center', margin: '0 10px' }}>
                <TrendingFlat color="primary" />
              </div>

              <DateTimePicker
                inputVariant="outlined"
                format="DD/MM/YYYY HH:mm"
                label="Đến"
                error={false}
                helperText={null}
                value={reportSource.endDate}
                name="endDate"
                margin="dense"
                variant="outlined"
                onChange={value => this.handleChangeDate(value)}
                // style={{ padding: 10 }}
              />
            </div>
          </MuiPickersUtilsProvider>
        </div>

        <Grid container md={12}>
          <ListPage
            disableEdit
            disableAdd
            disableConfig
            columns={reportSourceColumns}
            apiUrl={`${API_REPORT}/source`}
            filter={filter}
            client
            mapFunction={this.mapLiabilitiReport}
            reload={reload + 1}
          />
        </Grid>
      </div>
    );
  }

  mapLiabilitiReport = (item, index) => ({
    ...item,
    index: index + 1,
  });

  handleChangeDate = value => {
    if (new Date(this.props.reportSource.startDate) > new Date(value)) {
      this.props.onChangeSnackbar({ status: true, message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu', variant: 'warning' });
      return;
    }
    this.props.mergeData({
      endDate: value,
      filter: {
        startDate: new Date(this.props.reportSource.startDate).toISOString(),
        endDate: new Date(value).toISOString(),
      },
      reload: this.props.reportSource.reload + 1,
    });
  };
}

ReportSource.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  reportSource: makeSelectReportSource(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    mergeData: data => dispatch(mergeData(data)),
    getData: filter => dispatch(getData(filter)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'reportSource', reducer });
const withSaga = injectSaga({ key: 'reportSource', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ReportSource);

/**
 *
 * ReportTask
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Button } from '@material-ui/core';
import { tableToExcel } from '../../helper';
import { Paper } from '../../components/LifetekUi';
import makeSelectReportTask from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getData, mergeData } from './actions';
// import messages from './messages';

/* eslint-disable react/prefer-stateless-function */

const fixedRow = {
  header: [
    {
      sst: 'TT',
      name: 'Dự án/Công việc theo mảng',
      code: 'Mã Dự Án',
      color: 'green',
      childTask: 'Công việc thực hiện trong tuần/Tháng',
      derpartment: 'Công việc thực hiện trong tuần/Tháng',
      join: 'Người thực hiện',
    },
  ],
  I: [{ stt: 'I', color: 'darksalmon ', name: 'Công tác tồn đọng' }],
  'I.1': [{ stt: 'I.1', color: 'gold', name: 'Tồn Đọng Dự Án' }],
  'I.2': [{ stt: 'I.2', color: 'gold', name: 'Tồn Đọng Phòng Ban' }],
};

export class ReportTask extends React.Component {
  state = {
    arrIndex: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
  };

  componentDidMount() {
    this.props.getData();
    this.mapData();
  }

  mapData() {
    const { reportTask } = this.props;
    const backlog = reportTask.data.backlog ? reportTask.data.backlog : [];
    const backlogTask = backlog.filter(i => Boolean(i.projectId));
    const newTask = this.convertTask(backlogTask);
    const backlogDerpartment = backlog.filter(i => !Boolean(i.projectId));
    const data = fixedRow.I.concat(fixedRow['I.1'], newTask, fixedRow['I.2'], this.mapItem(backlogDerpartment));
    this.props.mergeData({ taskData: data });
  }

  convertTask(backlogTask) {
    backlogTask.forEach(element => {
      if (!element.parentId) {
        const child = backlogTask.filter(i => i.projectId && i.projectId._id === element._id && i.parentId);
        // console.log('child', child);
        if (child.length) element.child = child;
      }
    });
    const newBacklogTask = backlogTask.filter(i => !i.parentId);

    return this.mapItem(newBacklogTask);
  }

  mapItem(item) {
    return item.map(i => ({
      ...i,
      join: this.mapName(i.join),
      startDate: new Date(i.startDate).toLocaleDateString('vi'),
      endDate: new Date(i.endDate).toLocaleDateString('vi'),
      dayLater: `${((new Date() - new Date(i.endDate)) / 86400000).toFixed()} ngày`,
      inCharge: this.mapName(i.inCharge),
      task: this.mapName(i.child),
    }));
  }

  mapName(item) {
    if (item && item.length) return item.map(i => i.name).join();
    return '';
  }

  render() {
    const { arrIndex } = this.state;
    const { reportTask } = this.props;

    return (
      <div style={{ overflow: 'auto' }}>
        <Button
          variant="outlined"
          color="primary"
          style={{ cursor: 'pointer', marginBottom: 20 }}
          type="button"
          onClick={() => tableToExcel('report-task1', 'W3C Example Table')}
        >
          Xuất File Excel Kế Hoạch tháng hiện tại
        </Button>
        <Paper>
          <table style={{ width: '100%' }} id="report-task1">
            <thead style={{ background: 'green', color: 'black' }}>
              <tr className="td">
                <th className="td" rowSpan={2}>
                  STT
                </th>
                <th className="td" rowSpan={2}>
                  Dự án/Công việc theo mảng
                </th>
                <th className="td" rowSpan={2}>
                  Mã Dự Án
                </th>
                <th className="td" rowSpan={2}>
                  Công việc thực hiện trong tuần/Tháng
                </th>
                <th className="td" rowSpan={2}>
                  Bp Phối hợp/ Thực hiện
                </th>
                <th className="td" colSpan={2}>
                  Thời gian dự kiến{' '}
                </th>
                <th className="td" rowSpan={2}>
                  Dự trù rủi ro
                </th>
                <th className="td" rowSpan={2}>
                  Đề xuất hỗ trợ
                </th>
                <th className="td" rowSpan={2}>
                  Tiêu chí đánh giá
                </th>
                <th className="td" rowSpan={2}>
                  BM/VĂN BẢN THAM CHIẾU
                </th>
              </tr>
              <tr className="td">
                <th className="td">Bắt đầu</th>
                <th className="td">Kết thúc</th>
              </tr>
            </thead>

            <tbody>
              <tr className="td">
                {arrIndex.map(item => (
                  <td className="td">{item}</td>
                ))}
              </tr>
              {reportTask.taskData.map(i => (
                <tr style={{ background: i.color ? i.color : 'transparent' }}>
                  <td>{i.stt}</td>
                  <td>{i.name}</td>
                  <td>{i.code}</td>
                  <td>{i.task}</td>
                  <td>{i.join}</td>
                  <td>{i.startDate}</td>
                  <td>{i.endDate}</td>
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
              ))}
              {/* <tr className="td" style={{ background: '#849396' }}>
                <td className="td">I.1</td>
                <td style={{ fontWeight: 'bold' }}>Công tác phòng ban</td>
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
              </tr>
              {projects.map((item, index) => (
                <tr className="td">
                  <td className="td">{index + 1}</td>
                  <td className="td">{item.name}</td>
                  <td className="td">{item.code}</td>
                  <td className="td">{item.task}</td>
                  <td className="td">{item.part}</td>
                  <td className="td">{item.startDate}</td>
                  <td className="td">{item.endDate}</td>
                  <td className="td">{item.intended}</td>
                  <td className="td">{item.support}</td>
                  <td className="td">{item.criteria}</td>
                  <td className="td">{item.reference}</td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </Paper>
      </div>
    );
  }
}

ReportTask.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  reportTask: makeSelectReportTask(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getData: () => dispatch(getData()),
    mergeData: data => dispatch(mergeData(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'reportTask', reducer });
const withSaga = injectSaga({ key: 'reportTask', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ReportTask);

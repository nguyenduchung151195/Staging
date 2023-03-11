/* eslint-disable no-alert */
/* eslint-disable react/no-unused-prop-types */
/**
 *
 * KpiEvaluate
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Add } from '@material-ui/icons';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import ListPage from '../../components/List';
import { kpiEvaluateGroupColumns, kpiProcessTypeColumns, kpiProcessColumns, kpiReviewColumns } from '../../variable';
import { compose } from 'redux';
import messages from './messages';
import { injectIntl } from 'react-intl';
import injectSaga from 'utils/injectSaga';
import { MenuItem, Checkbox, TableCell, Table, TableBody, TableRow } from '@material-ui/core';
import injectReducer from 'utils/injectReducer';
import makeSelectKpiEvaluate from './selectors';
import { API_CRITERIA } from '../../config/urlConfig';
import { Tabs, Tab, Dialog, Paper, Grid, TextField, Typography, AsyncAutocomplete } from '../../components/LifetekUi';
import reducer from './reducer';
import saga from './saga';
import {
  mergeData,
  postProcess,
  getProcessCurrent,
  putProcess,
  getDefault,
  postEvaluate,
  getEvaluateCurrent,
  putEvaluate,
  postProcessGroup,
  getProcessGroupCurrent,
  putProcessGroup,
} from './actions';
import { changeSnackbar } from '../Dashboard/actions';
// import messages from './messages';
import moment from 'moment'
/* eslint-disable react/prefer-stateless-function */
import CustomDatePicker from '../../components/CustomDatePicker';

export class KpiEvaluate extends React.Component {
  addItemGroup = () => (
    <Add onClick={this.handleAddItemGroup}>
      Open Menu
    </Add>
  );

  handleAddItemGroup = () => {
    this.props.mergeData({ openDrawerGroup: true });
    this.props.getDefault();
  };

  addItemProcess = () => (
    <Add onClick={this.handleAddItemProcess}>
      Open Menu
    </Add>
  );

  handleAddItemProcess = () => {
    this.props.mergeData({ openDrawerProcess: true });
    this.props.getDefault();
  };

  addItemType = () => (
    <Add onClick={this.handleAddItemType}>
      Open Menu
    </Add>
  );

  handleAddItemType = () => {
    this.props.mergeData({ openDrawerType: true });
    this.props.getDefault();
  };

  mapFunctionProcessType = (item, index) => ({
    ...item,
    index: index + 1,
    method: item.method === 1 ? 'Chấm điểm' : 'Đánh giá',
    name: (
      <button onClick={() => this.handleDialogProcessType(item._id)} type="button" style={{ cursor: 'pointer', color: '#2196f3' }}>
        {item.name}
      </button>
    ),
  });

  mapFunctionProcess = item => ({
    ...item,
    processType: item['processType.name'],
    name: (
      <button onClick={() => this.handleDialogProcess(item._id)} type="button" style={{ cursor: 'pointer', color: '#2196f3' }}>
        {item.name}
      </button>
    ),
  });

  mapFunctionReview = item => ({
    ...item,
    processType: item['processType.name'],
    process: item['process.name'],
    employee: item['employee.name'],
  });

  handleDialogProcessType = id => {
    this.props.mergeData({ openDrawerType: true, id });
    this.props.getProcessCurrent(id);
  };

  handleDialogProcess = id => {
    this.props.mergeData({ openDrawerProcess: true, id });
    this.props.getEvaluateCurrent(id);
  };

  onSaveGroup = () => {
    const { kpiEvaluate } = this.props;
    if (kpiEvaluate.startDate >= kpiEvaluate.endDate) {
      this.props.onChangeSnackbar({ status: true, message: 'Ngày kết thúc đánh giá phải lớn hơn ngày bắt đầu đánh giá ', variant: 'error' });
      return;
    }
    if (kpiEvaluate.name === '' || kpiEvaluate.code === '') return;
    const data = {
      name: kpiEvaluate.name,
      code: kpiEvaluate.code,
      nameTA: kpiEvaluate.nameTA,
      startDate: kpiEvaluate.startDate,
      endDate: kpiEvaluate.endDate,
      startDateDetail: kpiEvaluate.startDateDetail,
      endDateDetail: kpiEvaluate.endDateDetail,
      target: kpiEvaluate.target,
      evaluate: kpiEvaluate.evaluate,
      active: kpiEvaluate.active,
    };
    if (kpiEvaluate.id === null) this.props.postProcessGroup(data);
    else this.props.putProcessGroup(data, kpiEvaluate.id);
    this.props.mergeData({ openDrawerGroup: false, reload: kpiEvaluate.reload + 1 });
  };

  mapFunctionGroup = item => (
    // console.log('test', item),
    {
      ...item,
      startDate: item.startDate && moment(item.startDate).format("DD/MM/YYYY"),
      startDateDetail: item.startDateDetail && moment(item.startDateDetail).format("DD/MM/YYYY"),
      endDate: item.endDate && moment(item.endDate).format("DD/MM/YYYY"),
      endDateDetail: item.endDateDetail && moment(item.endDateDetail).format("DD/MM/YYYY"),
      target: (
        <Checkbox
          checked={item.target}
          color="primary"
          inputProps={{
            'aria-label': 'secondary checkbox',
          }}
        />
      ),
      evaluate: (
        <Checkbox
          checked={item.evaluate}
          color="primary"
          inputProps={{
            'aria-label': 'secondary checkbox',
          }}
        />
      ),
      active: (
        <Checkbox
          checked={item.active}
          color="primary"
          inputProps={{
            'aria-label': 'secondary checkbox',
          }}
        />
      ),
      name: (
        <button onClick={() => this.handleDialogGroup(item._id)} type="button" style={{ cursor: 'pointer', color: '#2196f3' }}>
          {item.name}
        </button>
      ),
    }
  );

  handleDialogGroup = id => {
    this.props.mergeData({ openDrawerGroup: true, id });
    this.props.getProcessGroupCurrent(id);
  };

  render() {
    const { kpiEvaluate, intl } = this.props;

    const { tab, openDrawerGroup, openDrawerProcess, openDrawerType } = kpiEvaluate;
    const columnExtensions = [{ columnName: 'index', width: 100 }, { columnName: 'edit', width: 150 }];
    return (
      <div>
        <Tabs value={tab} onChange={(e, tab) => this.props.mergeData({ tab })}>
          <Tab value={0} label={intl.formatMessage(messages.manageassessmentteam || { id: 'manageassessmentteam' })} />
          <Tab value={1} label={intl.formatMessage(messages.manageevaluationprocess || { id: 'manageevaluationprocess' })} />
          <Tab value={2} label={intl.formatMessage(messages.manageprocesstype || { id: 'manageprocesstype' })} />
          <Tab value={3} label={intl.formatMessage(messages.reviews || { id: 'reviews' })} />
        </Tabs>

        {tab === 0 ? (
          <div>
            <Paper className="py-3" style={{ height: '100%' }}>
              <ListPage
                height="650px"
                code="Kpi"
                // client
                // optionSearch={[{ name: "code", title: "Mã nhóm" }, { name: "name", title: "Tên nhóm" }]}
                reload={kpiEvaluate.reload + 1}
                apiUrl={`${API_CRITERIA}/processGroup`}
                // columns={kpiEvaluateGroupColumns}
                mapFunction={this.mapFunctionGroup}
                // excludeDatetype="updatedAt"
                disableAdd
                settingBar={[this.addItemGroup()]}
                
              />
            </Paper>
          </div>
        ) : null}
        {tab === 1 ? (
          <div>
            <Paper className="py-3" style={{ height: '100%' }}>
              <ListPage
                height="640px"
                code="Kpi"
                apiUrl={`${API_CRITERIA}/process`}
                columns={kpiProcessColumns}
                mapFunction={this.mapFunctionProcess}
                disableAdd
                settingBar={[this.addItemProcess()]}
                client
                reload={kpiEvaluate.reload + 1}
                tabEx="process"
              />
            </Paper>
          </div>
        ) : null}
        {tab === 2 ? (
          <div>
            <Paper className="py-3" style={{ height: '100%' }}>
              <ListPage
                height="640px"
                code="Kpi"
                columns={kpiProcessTypeColumns}
                apiUrl={`${API_CRITERIA}/processType`}
                mapFunction={this.mapFunctionProcessType}
                disableAdd

                settingBar={[this.addItemType()]}
                reload={kpiEvaluate.reload + 1}
                client
                columnExtensions={columnExtensions}
                tabEx="processType"
              />
            </Paper>
          </div>
        ) : null}
        {tab === 3 ? (
          <div>
            <Paper className="py-3" style={{ height: '100%' }}>
              <ListPage
                height="640px"
                code="Kpi"
                columns={kpiReviewColumns}
                apiUrl={`${API_CRITERIA}/review`}
                mapFunction={this.mapFunctionReview}
                // disableAdd
                // settingBar={[this.addItemType()]}
                reload={kpiEvaluate.reload + 1}
                client
                columnExtensions={columnExtensions}
                tabEx="review"
              />
            </Paper>
          </div>
        ) : null}
        <Dialog
          anchor="right"
          onClose={() => this.props.mergeData({ openDrawerGroup: false, id: 'add' })}
          open={openDrawerGroup}
          title=" Thông tin nhóm đánh giá"
          onSave={this.onSaveGroup}
        >
          <Paper>
            <Grid container md={12}>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Grid item md={5}>
                  <TextField
                    required
                    helperText={kpiEvaluate.code ? null : 'Mã nhóm không được bỏ trống'}
                    error={!kpiEvaluate.code}
                    value={kpiEvaluate.code}
                    fullWidth
                    onChange={e => this.props.mergeData({ code: e.target.value })}
                    label="Mã nhóm"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    required
                    helperText={kpiEvaluate.name ? null : 'Tên nhóm không được bỏ trống'}
                    error={!kpiEvaluate.name}
                    value={kpiEvaluate.name}
                    fullWidth
                    onChange={e => this.props.mergeData({ name: e.target.value })}
                    label="Tên nhóm"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    value={kpiEvaluate.nameTA}
                    fullWidth
                    onChange={e => this.props.mergeData({ nameTA: e.target.value })}
                    label="Tên TA"
                    InputLabelProps={{ shrink: true }}
                  />
                  {/* <TextField
                    value={kpiEvaluate.codeFormat}
                    fullWidth
                    onChange={e => this.props.mergeData({ codeFormat: e.target.value })}
                    label="Code format"
                    InputLabelProps={{ shrink: true }}
                  /> */}
                </Grid>
                <Grid item md={5} style={{ marginLeft: '40' }}>
                  {/* <TextField
                    required
                    value={kpiEvaluate.startDate}
                    fullWidth
                    onChange={e => this.props.mergeData({ startDate: e.target.value })}
                    label="Ngày bắt đầu đánh giá"
                    InputLabelProps={{ shrink: true }}
                    type="date"
                  /> */}
                  <CustomDatePicker
                    value={kpiEvaluate.startDate ? moment(kpiEvaluate.startDate, "YYYY-MM-DD") : null}
                    onChange={e => {
                      this.props.mergeData({ startDate: e ? moment(e) : null })
                    }}
                    label="Ngày bắt đầu đánh giá"
                    helperText={kpiEvaluate.startDate ? null : 'Ngày bắt đầu đánh giá không được bỏ trống'}
                    error={!kpiEvaluate.startDate}
                  />

                  {/* <TextField
                    required
                    value={kpiEvaluate.endDate}
                    fullWidth
                    onChange={e => this.props.mergeData({ endDate: e.target.value })}
                    label="Ngày kết thúc đánh giá"
                    InputLabelProps={{ shrink: true }}
                    type="date"
                    helperText={kpiEvaluate.endDate ? null : 'Ngày kết thúc không được bỏ trống'}
                    error={!kpiEvaluate.endDate}
                  /> */}
                  <CustomDatePicker
                    value={kpiEvaluate.endDate ? moment(kpiEvaluate.endDate, "YYYY-MM-DD") : null}
                    onChange={e => this.props.mergeData({ endDate: e ? moment(e) : null })}
                    label="Ngày kết thúc đánh giá"
                    InputLabelProps={{ shrink: true }}
                    helperText={kpiEvaluate.endDate ? null : 'Ngày kết thúc không được bỏ trống'}
                    error={!kpiEvaluate.endDate}
                  />
                  {/* <TextField
                    value={kpiEvaluate.startDateDetail}
                    fullWidth
                    onChange={e => this.props.mergeData({ startDateDetail: e.target.value })}
                    label="Ngày bắt đầu nhập chi tiết"
                    InputLabelProps={{ shrink: true }}
                    type="date"
                  /> */}
                  <CustomDatePicker
                    value={kpiEvaluate.startDateDetail ? moment(kpiEvaluate.startDateDetail, "YYYY-MM-DD") : null}
                    required={false}
                    onChange={e => this.props.mergeData({ startDateDetail: e ? moment(e) : null })}
                    label="Ngày bắt đầu nhập chi tiết"
                    error={false}
                  />
                  {/* <TextField
                    value={kpiEvaluate.endDateDetail}
                    fullWidth
                    onChange={e => this.props.mergeData({ endDateDetail: e.target.value })}
                    label="Ngày kết thúc nhập chi tiết"
                    InputLabelProps={{ shrink: true }}
                    type="date"
                  /> */}
                  <CustomDatePicker
                    value={kpiEvaluate.endDateDetail ? moment(kpiEvaluate.endDateDetail, "YYYY-MM-DD") : null}
                    required={false}
                    onChange={e => this.props.mergeData({ endDateDetail: e ? moment(e) : null })}
                    label="Ngày kết thúc nhập chi tiết"
                    error={false}
                    helperText={kpiEvaluate.endDateDetail ? null : ''}
                  />
                </Grid>
              </div>
              <Grid container md={12} style={{ justifyContent: 'space-around' }}>
                <div>
                  <Checkbox
                    checked={kpiEvaluate.target}
                    onChange={e => this.props.mergeData({ target: e.target.checked })}
                    value="target"
                    color="primary"
                    inputProps={{
                      'aria-label': 'secondary checkbox',
                    }}
                  />
                  Có thiêt lập mục tiêu
                </div>
                <div>
                  <Checkbox
                    checked={kpiEvaluate.evaluate}
                    onChange={e => this.props.mergeData({ evaluate: e.target.checked })}
                    value="evaluate"
                    color="primary"
                    inputProps={{
                      'aria-label': 'secondary checkbox',
                    }}
                  />
                  Có tự đánh giá
                </div>
                <div>
                  <Checkbox
                    checked={kpiEvaluate.active}
                    onChange={e => this.props.mergeData({ active: e.target.checked })}
                    value="active"
                    color="primary"
                    inputProps={{
                      'aria-label': 'secondary checkbox',
                    }}
                  />
                  Sử dụng
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Dialog>
        <Dialog
          anchor="right"
          onClose={() => this.props.mergeData({ openDrawerProcess: false, id: 'add' })}
          open={openDrawerProcess}
          title=" Thông tin quy trình đánh giá"
          onSave={this.onSaveProcess}
        >
          <Paper>
            <Grid container md={12}>
              <TextField
                required
                helperText={kpiEvaluate.code ? null : 'Mã nhóm không được bỏ trống'}
                error={!kpiEvaluate.code}
                value={kpiEvaluate.code}
                fullWidth
                onChange={e => this.props.mergeData({ code: e.target.value })}
                label="Mã quy trình"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                required
                helperText={kpiEvaluate.name ? null : 'Tên nhóm không được bỏ trống'}
                error={!kpiEvaluate.name}
                value={kpiEvaluate.name}
                fullWidth
                onChange={e => this.props.mergeData({ name: e.target.value })}
                label="Quy trình"
                InputLabelProps={{ shrink: true }}
              />
              <AsyncAutocomplete
                // name="Loại quy trình"
                label="Loại quy trình"
                onChange={value => this.props.mergeData({ processType: value })}
                url={`${API_CRITERIA}/processType`}
                value={kpiEvaluate.processType}
                helperText={kpiEvaluate.processType ? null : 'Loại quy trình không được bỏ trống'}
                error={!kpiEvaluate.processType}
              />
            </Grid>
          </Paper>
        </Dialog>
        <Dialog
          anchor="right"
          onClose={() => this.props.mergeData({ openDrawerType: false, id: 'add' })}
          open={openDrawerType}
          title=" Thông tin loại quy trình"
          onSave={this.onSaveProcessType}
        >
          <Paper>
            <Grid container md={12}>
              <TextField
                required
                helperText={kpiEvaluate.code ? null : 'Mã loại quy trình không được bỏ trống'}
                error={!kpiEvaluate.code}
                value={kpiEvaluate.code}
                fullWidth
                onChange={e => this.props.mergeData({ code: e.target.value })}
                label="Mã loại quy trình"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                required
                helperText={kpiEvaluate.name ? null : 'Tên loại quy trình không được bỏ trống'}
                error={!kpiEvaluate.name}
                value={kpiEvaluate.name}
                fullWidth
                onChange={e => this.props.mergeData({ name: e.target.value })}
                label="Tên loại quy trình"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                select
                value={kpiEvaluate.method}
                fullWidth
                onChange={e => this.props.mergeData({ method: e.target.value })}
                label="Phương pháp chấm điểm/đánh giá"
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value={1}>Chấm điểm</MenuItem>
                <MenuItem value={2}>Đánh giá</MenuItem>
              </TextField>
            </Grid>
            <Grid item md={12}>
              <Typography variant="subtitle2">Quy trình đánh giá</Typography>
              <Table>
                <TableBody>
                  {kpiEvaluate.process.map((item, index) => (
                    <TableRow>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <TextField
                          required
                          value={item.evaluate}
                          fullWidth
                          onChange={this.handleChangeProcessType(index)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </TableCell>
                      <TableCell>
                        <Add onClick={this.addRow} style={{ cursor: 'pointer' }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          </Paper>
        </Dialog>
      </div>
    );
  }

  handleChangeProcessType = index => e => {
    const process = [...this.props.kpiEvaluate.process];
    process[index].evaluate = e.target.value;
    this.props.mergeData({ process });
  };

  addRow = () => {
    const { process } = this.props.kpiEvaluate;
    const data = { evaluate: '' };
    const newRow = process.concat(data);
    this.props.mergeData({ process: newRow });
  };

  onSaveProcessType = () => {
    const { kpiEvaluate } = this.props;
    if (kpiEvaluate.name === '' || kpiEvaluate.code === '') return;
    const data = {
      name: kpiEvaluate.name,
      code: kpiEvaluate.code,
      method: kpiEvaluate.method,
      process: kpiEvaluate.process,
    };
    if (kpiEvaluate.id === null) this.props.postProcess(data);
    else this.props.putProcess(data, kpiEvaluate.id);
    this.props.mergeData({ openDrawerType: false, reload: kpiEvaluate.reload + 1 });
  };

  onSaveProcess = () => {
    const { kpiEvaluate } = this.props;
    if (kpiEvaluate.name === '' || kpiEvaluate.code === '' || kpiEvaluate.processType === '') return;
    const data = {
      name: kpiEvaluate.name,
      code: kpiEvaluate.code,
      processType: kpiEvaluate.processType,
    };
    if (kpiEvaluate.id === null) this.props.postEvaluate(data);
    else this.props.putEvaluate(data, kpiEvaluate.id);
    this.props.mergeData({ openDrawerProcess: false, reload: kpiEvaluate.reload + 1 });
  };
}

KpiEvaluate.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  kpiEvaluate: makeSelectKpiEvaluate(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    postProcess: data => dispatch(postProcess(data)),
    getProcessCurrent: id => dispatch(getProcessCurrent(id)),
    putProcess: (data, id) => dispatch(putProcess(data, id)),
    getDefault: data => dispatch(getDefault(data)),
    postEvaluate: data => dispatch(postEvaluate(data)),
    getEvaluateCurrent: id => dispatch(getEvaluateCurrent(id)),
    putEvaluate: (data, id) => dispatch(putEvaluate(data, id)),
    postProcessGroup: data => dispatch(postProcessGroup(data)),
    getProcessGroupCurrent: id => dispatch(getProcessGroupCurrent(id)),
    putProcessGroup: (data, id) => dispatch(putProcessGroup(data, id)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'kpiEvaluate', reducer });
const withSaga = injectSaga({ key: 'kpiEvaluate', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(KpiEvaluate);

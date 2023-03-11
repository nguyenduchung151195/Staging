/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * KpiProject
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { Add } from '@material-ui/icons';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Table,
  Typography,
} from '@material-ui/core';
import ListPage from 'components/List';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectKpiProject from './selectors';
import reducer from './reducer';
import saga from './saga';
import { mergeData, postData, getData } from './actions';
import { API_TASK_PROJECT, API_CRITERIA } from '../../config/urlConfig';
import { convertTableNested } from '../../helper';
import { kpiProjectColumns } from '../../variable';
// import messages from './messages';
import { AsyncAutocomplete, SwipeableDrawer, TextField, Paper } from '../../components/LifetekUi';

/* eslint-disable react/prefer-stateless-function */
export class KpiProject extends React.Component {
  componentDidMount() {
    this.props.getData();
  }

  addItem = () => (
    <Add style={{ color: 'white' }} onClick={() => this.props.mergeData({ openDrawer: true })}>
      Open Menu
    </Add>
  );

  mapFunction = item => {
    const project = this.props.kpiProject.projectArr.find(elm => elm._id === item.taskId) || {}
    return {
      ...item,
      taskId: project.name ? project.name : null,
      customer: project.customer ? project.customer.name : null,
      taskCode: project.code ? project.code : null,
      taskStatus:
        project.taskStatus === 1
          ? 'Chưa thực hiện'
          : project.taskStatus === 2
            ? 'Đang thực hiện'
            : project.taskStatus === 3
              ? 'Hoàn thành'
              : project.taskStatus === 4
                ? 'Đóng'
                : project.taskStatus === 5
                  ? 'Tạm dừng'
                  : 'Không thực hiện',
      code: (
        <p style={{ color: '#0335fc', cursor: 'pointer' }} onClick={this.handleOpenEdit(item, project)}>
          {item.code}
        </p>
      ),
    };
  };

  handleOpenEdit = (item, project) => _e => {
    const tasks = [];
    project.join.forEach(i => {
      tasks.push({
        taskName: project.name,
        taskCode: project.code,
        employeeName: i.name,
        taskId: project._id,
        type: 2,
        employeeId: i._id,
        code: item.code,
        ratio: 0,
      });
    });
    project.inCharge.forEach(i => {
      const index = tasks.findIndex(el => el.employeeId === i._id);
      if (index !== -1)
        tasks[index] = {
          taskName: project.name,
          taskCode: project.code,
          employeeName: i.name,
          taskId: project._id,
          type: 3,
          employeeId: i._id,
          code: item.code,
          ratio: 0,
        };
      else
        tasks.push({
          taskName: project.name,
          taskCode: project.code,
          employeeName: i.name,
          taskId: project._id,
          type: 1,
          employeeId: i._id,
          code: item.code,
          ratio: 0,
        });
    });
    const newTask = convertTableNested(tasks.map(i => ({ ...i, taskId: i.taskId })), 'taskId');

    this.props.mergeData({ openDialogEdit: true, itemProject: newTask, itemKpi: project });
  };

  render() {
    const { kpiProject } = this.props;
    const { openDrawer, openDialog, newEmployees, openDialogEdit, itemKpi, itemProject, reload } = kpiProject;

    return (
      <div>
        <Paper className="py-3" style={{ height: '100%' }}>
          <ListPage
            apiUrl={`${API_CRITERIA}/task`}
            mapFunction={this.mapFunction}
            disableAdd
            settingBar={[this.addItem()]}
            client
            columns={kpiProjectColumns}
            reload={reload}
          //  code="KpiTask"
          />
        </Paper>
        <Dialog scroll="body" open={openDrawer} onClose={() => this.props.mergeData({ openDrawer: false })}>
          <DialogTitle id="alert-dialog-title">Tạo mới kpi cá nhân</DialogTitle>
          <DialogContent style={{ width: 600, height: 200 }}>
            <AsyncAutocomplete
              name="Chọn..."
              label="Dự án"
              onChange={this.selectProject}
              url={API_TASK_PROJECT}
              filter={{ isProject: true }}
              value={kpiProject.project}
            />
            {/* <TextField
              required
              // helperText={templateError ? 'Chọn biểu mẫu để xuất hóa đơn' : null}
              // error={templateError}
              value={kpiProject.code}
              fullWidth
              onChange={e => this.props.mergeData({ code: e.target.value })}
              label="Mã KPI"
              InputLabelProps={{ shrink: true }}
            /> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleKpi} variant="outlined" color="primary" autoFocus>
              Lưu
            </Button>
            <Button onClick={() => this.props.mergeData({ openDrawer: false })} variant="outlined" color="secondary" autoFocus>
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
        <SwipeableDrawer open={openDialog} onClose={() => this.props.mergeData({ openDialog: false })} width={window.innerWidth - 260}>
          <Paper style={{ marginTop: 50 }}>
            <Typography variant="h6" gutterBottom style={{ justifyContent: 'center', display: 'flex', marginBottom: 50 }}>
              Duyệt dự án
            </Typography>

            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Mã dự án</TableCell>
                  <TableCell>Tên dự án</TableCell>
                  <TableCell>Tên nhân viên</TableCell>
                  <TableCell>Vai trò</TableCell>
                  {/* <TableCell>Chức vụ</TableCell> */}
                  <TableCell>Tỷ lệ (%)</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {newEmployees.map((item, index) => (
                  <TableRow>
                    {item.ord === 0 ? <TableCell rowSpan={newEmployees.length}>{item.code}</TableCell> : null}
                    {item.ord === 0 ? <TableCell rowSpan={newEmployees.length}>{item.name}</TableCell> : null}
                    <TableCell>
                      <TableRow>{item.employeeName}</TableRow>
                    </TableCell>
                    <TableCell>
                      <TableRow>
                        {item.type === 1 ? 'Người phụ trách' : item.type === 2 ? 'Người tham gia' : 'Người tham gia, Người phụ trách'}
                      </TableRow>
                    </TableCell>

                    <TableCell>
                      <TableCell>
                        <TableRow>
                          <TextField
                            id="standard-basic"
                            value={item.ratio}
                            onChange={this.handleRatio(index)}
                            error={this.props.kpiProject.errorRatio}
                            helperText={this.props.kpiProject.errorRatio ? 'Bạn cần thay đổi tỷ lệ' : ''}
                          />
                        </TableRow>
                      </TableCell>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outlined" color="primary" onClick={this.onSave}>
                Lưu
              </Button>
            </div>
          </Paper>
        </SwipeableDrawer>
        <Dialog maxWidth="lg" scroll="body" open={openDialogEdit} onClose={() => this.props.mergeData({ openDialogEdit: false })}>
          <DialogTitle id="alert-dialog-title">Chi tiết Kpi cá nhân</DialogTitle>
          <DialogContent>
            {itemProject ? (
              <Paper>
                <Typography variant="subtitle2" gutterBottom>
                  Mã KPI: {itemKpi.code}
                </Typography>

                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Mã dự án</TableCell>
                      <TableCell>Tên dự án</TableCell>
                      <TableCell>Người phê duyêt</TableCell>
                      <TableCell>Ngày phê duyêt</TableCell>
                      <TableCell>Tên nhân viên</TableCell>
                      <TableCell>Vai trò</TableCell>
                      <TableCell>Tỷ lệ (%)</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {itemProject.map(item => (
                      <TableRow>
                        {item.ord === 0 ? <TableCell rowSpan={itemProject.length}>{item.taskCode}</TableCell> : null}
                        {item.ord === 0 ? <TableCell rowSpan={itemProject.length}>{item.taskName}</TableCell> : null}
                        <TableCell>{itemKpi.approved ? itemKpi.approved.map(elm => `${elm.name} `) : null}</TableCell>
                        <TableCell>Ngày phê duyêt</TableCell>
                        <TableCell>
                          <TableRow>{item.employeeName}</TableRow>
                        </TableCell>
                        <TableCell>
                          <TableRow>
                            {item.type === 1 ? 'Người phụ trách' : item.type === 2 ? 'Người tham gia' : 'Người tham gia, Người phụ trách'}
                          </TableRow>
                        </TableCell>
                        <TableCell>
                          <TableCell>
                            <TableRow>{item.ratio}</TableRow>
                          </TableCell>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.props.mergeData({ openDialogEdit: false })} variant="outlined" color="primary" autoFocus>
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  handleRatio = index => e => {
    const Employees = [...this.props.kpiProject.newEmployees];
    Employees[index].ratio = e.target.value;
    this.props.mergeData({ newEmployees: Employees, errorRatio: !Boolean(e.target.value) });
    const employeeArr = this.props.kpiProject.newEmployees.map(item => ({
      ...item,
      name: item.employeeName,
      ratio: item.ratio,
      id: item.employeeId,
      type: item.type,
    }));

    this.props.mergeData({ employees: employeeArr });
  };

  selectProject = project => {
    // console.log('check>>>>', project);
    const tasks = [];
    project.join.forEach(i => {
      tasks.push({ name: project.name, employeeName: i.name, taskId: project._id, type: 2, employeeId: i._id, code: project.code, ratio: 0 });
    });
    project.inCharge.forEach(i => {
      const index = tasks.findIndex(el => el.employeeId === i._id);
      if (index !== -1)
        tasks[index] = { name: project.name, employeeName: i.name, taskId: project._id, type: 3, employeeId: i._id, code: project.code, ratio: 0 };
      else tasks.push({ name: project.name, employeeName: i.name, taskId: project._id, type: 1, employeeId: i._id, code: project.code, ratio: 0 });
    });

    this.props.mergeData({ projects: tasks, project });
  };

  // employees.type = 1 là người phụ trach, 2 là người tham gia, 3 là cả phụ trach và tham gia
  handleKpi = () => {
    const { projects } = this.props.kpiProject;
    const newEmployees = convertTableNested(projects.map(i => ({ ...i, taskId: i.taskId })), 'taskId');
    this.props.mergeData({ openDialog: true, openDrawer: false, newEmployees });
  };

  onSave = () => {
    const { kpiProject } = this.props;
    if (kpiProject.errorRatio) return;
    const data = {
      approved: false,
      employees: kpiProject.employees,
      taskId: kpiProject.project._id,
    };
    this.props.postData(data);
    this.props.mergeData({ openDialog: false, reload: kpiProject.reload + 1 });
  };
}

KpiProject.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  kpiProject: makeSelectKpiProject(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    postData: data => dispatch(postData(data)),
    getData: () => dispatch(getData()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'kpiProject', reducer });
const withSaga = injectSaga({ key: 'kpiProject', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(KpiProject);

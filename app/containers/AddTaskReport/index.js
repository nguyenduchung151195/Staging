import { Grid, MenuItem, Paper } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import CustomChartWrapper from '../../components/Charts/CustomChartWrapper';
import { API_REPORT_TASK_PROCESS, API_REPORT_TASK_WEEK } from '../../config/urlConfig';
import { serialize } from '../../helper';
import { Grid as GridLife } from 'components/LifetekUi';
import moment from 'moment';
import List from '../../components/List/ListTask';
import request from '../../utils/request';
import { makeSelectProfile, makeSelectMiniActive } from '../Dashboard/selectors';
import { Typography } from '../../components/LifetekUi';

const GridList = React.memo(({ reload, openTask, filter, openBusiness, modalRequiredFilter, modalFilter, miniActive }) => {
  const { isProject, ...rest } = filter;
  const mapTask = item => {
    return {
      ...item,
      // parentId: item.parentId ? item['parentId.name'] : null,
      name: (
        <button onClick={() => openTask(item._id)} type="button" style={{ cursor: 'pointer', color: '#2196f3' }}>
          {item.name}
        </button>
      ),
      // avatar: <Avatar src={item.avatar} />,
      progress: (
        <Process value={item.progress} progress={item.progress} color={colorProgress(item)} time={ProcessTask(item)} color2={color2Progress(item)} />
      ),
      note: (
        <Tooltip title={item.note || null}>
          <p>{item.note || null}</p>
        </Tooltip>
      ),
      planApproval:
        item.planApproval === 1 ? (
          <p style={{ color: '#18ed00', fontWeight: 'bold' }}>Đã phê duyệt kế hoạch</p>
        ) : item.planApproval === 2 ? (
          <p style={{ color: '#ed0000', fontWeight: 'bold' }}>Không phê duyệt kế hoạch</p>
        ) : item.planApproval === 3 ? (
          <p style={{ color: 'rgb(214, 129, 11)', fontWeight: 'bold' }}>Chờ phê duyệt kế hoạch</p>
        ) : (
          <p style={{ color: 'rgb(52, 11, 214)', fontWeight: 'bold' }}>Chưa phê duyệt kế hoạch</p>
        ),
      acceptApproval:
        item.acceptApproval === 1 ? (
          <p style={{ color: '#18ed00', fontWeight: 'bold' }}>Đã phê duyệt nghiệm thu </p>
        ) : item.acceptApproval === 2 ? (
          <p style={{ color: '#ed0000', fontWeight: 'bold' }}>Không phê duyệt nghiệm thu</p>
        ) : item.acceptApproval === 3 ? (
          <p style={{ color: 'rgb(214, 129, 11)', fontWeight: 'bold' }}>Chờ phê duyệt nghiệm thu</p>
        ) : (
          <p style={{ color: 'rgb(52, 11, 214)', fontWeight: 'bold' }}>Chưa phê duyệt nghiệm thu</p>
        ),

      type: item.type === 1 ? 'Nhóm bảo mật' : item.type === 4 ? 'Nhóm công khai' : item.type === 2 ? 'Nhóm ẩn' : 'Nhóm mở rộng',
      priority:
        item.priority === 1
          ? 'Rất cao'
          : item.priority === 2
            ? 'Cao'
            : item.priority === 3
              ? 'Trung bình'
              : item.priority === 4
                ? 'Thấp'
                : 'Rất thấp',
      organizationUnit: item.organizationUnitName || item.organizationUnit,
    };
  };

  return (
    <Grid md={12}>
      <List
        showDepartmentAndEmployeeFilter
        columnExtensions={[{ columnName: 'name', width: 300 }, { columnName: 'edit', width: 150 }, { columnName: 'progress', width: 180 }]}
        tree
        apiUrl={`${API_REPORT_TASK_PROCESS}`}
        isReport={true}
        reload={0}
        code="Task"
        kanban="KANBAN"
        status="taskStatus"
        mapFunction={mapTask}
        // customExport={customExport}
        modalRequiredFilter={modalRequiredFilter}
        modalFilter={modalFilter}
        addChildTask
        perPage={10}
        filter={rest}
        extraMenu={openBusiness}
        disableSearch
        disableAdd
        disableViewConfig
        disableImport
        // setPage={setPage}
      />
    </Grid>
  );
});

function AddTaskReport(props) {
  const { tab, profile, intl, miniActive } = props;
  const [data, setData] = useState([]);
  const [isExport, setIsExport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const [total, setTotal] = useState(0);
  const [zoom, setZoom] = useState(false);
  const INTIAL_QUERY = {
    startDate: moment()
      .startOf('year')
      .format('DD/MM/YYYY'),
    endDate: moment()
      .endOf('year')
      .format('DD/MM/YYYY'),
    organizationUnitId: '',
    employeeId: '',
  };
  const [queryFilter, setQueryFilter] = useState(INTIAL_QUERY);
  const getUrlByValue = tab => {
    let url = {
      0: 'some thing',
      1: 'something',
      2: API_REPORT_TASK_PROCESS,
    };
    return url[tab];
  };
  const getData = obj => {
    let url = getUrlByValue(tab);
    if (url) {
      request(`${url}?${serialize(obj)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }).then(res => {
        if (res && res.data) {
          setTotal(res.count);
          setReload(r => r + 1);
        }
      });
    }
  };

  const customField = () => {
    const viewConfig = [];
  };
  const customDataRow = ({ data = [] }) => {
    console.log(data);
  };
  const handleSearch = obj => {
    getData(obj);
  };

  const handleClear = () => {
    let obj = { ...INTIAL_QUERY };
    getData(obj);
  };

  const handleLoadData = (page = 0, skip = 0, limit = 10) => {
    let obj = { ...INTIAL_QUERY };
    getData(obj);
    setQueryFilter(obj);
  };
  useEffect(() => {
    getData(INTIAL_QUERY);
  }, []);
  const openBusiness = () => <MenuItem onClick={this.handleDialogBusiness}>Thêm cơ hội kinh doanh</MenuItem>;

  return (
    <>
      <Paper>
        <Grid style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 80px)' }}>
          {tab === 2 ? (
            <Grid item md={12}>
              <Typography align="center" variant="h5" style={{ marginTop: 30 }}>
                Báo cáo tiến độ công việc
              </Typography>
              <CustomChartWrapper
                onGetData={handleSearch}
                profile={profile}
                onZoom={z => setZoom(z)}
                onRefresh={handleClear}
                isReport={true}
                code="reportProgressTask"
                id="processReport3"
                onExport={() => setIsExport(true)}
              >
                <GridList
                  reload={reload}
                  filter={queryFilter}
                  // modalRequiredFilter={this.modalRequiredFilter()}
                  // modalFilter={modalFilter(intl, data, tab)}
                  // customExport={this.exportTable()}
                />
              </CustomChartWrapper>
            </Grid>
          ) : null}
        </Grid>
      </Paper>
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect)(AddTaskReport);

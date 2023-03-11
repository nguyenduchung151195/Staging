import { Paper, Grid, Avatar } from '@material-ui/core';
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import CustomChartWrapper from '../../components/Charts/CustomChartWrapper';
import { makeSelectProfile, makeSelectMiniActive } from '../Dashboard/selectors';
import ListPage from 'containers/ListPage';
import CCallPage from 'components/List/CallDialog/reportPage';
import { API_PERSONNEL_REPORT, API_REPORT_EMPLOYEE_KPI_SALES, API_REPORT_FINISH_LEVEL } from '../../config/urlConfig';
import { serialize } from '../../helper';
import request from '../../utils/request';
import './../AddCashManager/style.css';
import { Typography } from '../../components/LifetekUi';

function AddReportEmployee(props) {
  const { tab, profile, miniActive } = props;
  const [data, setData] = useState([]);
  const [zoom, setZoom] = useState(false);
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [isExport, setIsExport] = useState(false);
  const INIT_QUERY = {
    year: 2021,
    organizationUnitId: '',
    employeeId: '',
    limit: 15,
    skip: 0,
  };
  const [queryFilter, setQueryFilter] = useState(INIT_QUERY);

  const getUrlBy = value => {
    let url = {
      0: API_REPORT_FINISH_LEVEL,
      1: API_REPORT_EMPLOYEE_KPI_SALES,
      2: API_PERSONNEL_REPORT,
    };
    return value && url[value];
  };
  const customField = () => {
    let viewConfig = [];
    if (tab === 2) {
      viewConfig[0] = { name: 'order', title: 'STT', checked: true, width: 120 };
      viewConfig[1] = { name: 'organizationUnit', title: 'Tên phòng ban', checked: true, width: 120 };
      viewConfig[2] = { name: 'username', title: 'Tên đăng nhập', checked: true, width: 120 };
      viewConfig[3] = { name: 'email', title: 'Email', checked: true, width: 120 };
      viewConfig[4] = { name: 'gender', title: 'Giới tính', checked: true, width: 120 };
      viewConfig[5] = { name: 'phoneNumber', title: 'Số điện thoại', checked: true, width: 120 };
      viewConfig[6] = { name: 'positions', title: 'Chức danh', checked: true, width: 120 };
      viewConfig[7] = { name: 'beginWork', title: 'Thời điểm bắt đầu làm việc', checked: true, width: 120 };
      // viewConfig[8] = { name: 'status', title: 'Trạng thái', checked: true, width: 120 };
    } else if (tab === 'ccall_report') {
      viewConfig[0] = { name: 'order', title: 'STT', checked: true, width: 120 };
      viewConfig[1] = { name: 'employee', title: 'Nhân viên', checked: true, width: 120 };
      viewConfig[2] = { name: 'sip', title: 'sip', checked: true, width: 120 };
      viewConfig[3] = { name: 'customer', title: 'khách hàng', checked: true, width: 120 };
      viewConfig[4] = { name: 'record', title: 'Ghi âm', checked: true, width: 120 };
      viewConfig[5] = { name: 'chat', title: 'Hội thoại', checked: true, width: 120 };
      viewConfig[6] = { name: 'date', title: 'Thời gian', checked: true, width: 120 };
    }
    return viewConfig;
  };

  const getData = obj => {
    let url = tab && getUrlBy(tab);
    try {
      request(`${url}?${serialize(obj)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }).then(res => {
        if (res && res.data && res.count) {
          setData(res.data);
          setCount(res.count);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoadData = (page = 0, skip = 0, limit = 15) => {
    const { year, organizationUnitId, employeeId } = queryFilter;
    let obj = {
      year,
      organizationUnitId,
      employeeId,
      skip,
      limit,
    };
    setQueryFilter(obj);
    getData(obj);
  };

  const customRowData = ({ data }) => {
    let result = [];
    if (data && Array.isArray(data)) {
      data.map((item, index) => {
        let obj = {
          order: index + 1,
          beginWork: item.beginWork ? item.beginWork : '',
          email: item.email ? item.email : '',
          gender: item.gender && item.gender === 'male' ? 'Nam' : 'Nữ',
          phoneNumber: item.phoneNumber ? item.phoneNumber : '',
          positions: item.positions ? item.positions : '',
          status: item.status ? item.status : '',
          username: item.username ? item.username : '',
          organizationUnit: item.organizationUnit ? item.organizationUnit.name : '',
        };
        result.push(obj);
      });
    }
    return result;
  };

  const handleClear = () => {
    getData(INIT_QUERY);
  };

  const handleSearch = obj => {
    const { year, employeeId = '', month, organizationUnitId } = obj;

    setQueryFilter(obj);
    getData(obj);
  };

  useEffect(() => {
    getData(INIT_QUERY);
  }, []);

  return (
    <Grid style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 80px)' }}>
      {tab === 2 ? (
        <Grid container>
          <Grid md={12}>
            <Typography align="center" variant="h5" style={{ marginTop: 30 }}>
              Báo cáo thống kê nhân viên
            </Typography>
            <CustomChartWrapper
              onGetData={handleSearch}
              profile={profile}
              onZoom={z => setZoom(z)}
              onRefresh={handleClear}
              isReport={true}
              noChart={true}
              code="reportStatsHrm"
              id="employeeReport2"
              onExport={() => setIsExport(true)}
            />
          </Grid>
          <Grid md={12}>
            <ListPage
              apiUrl={`${API_PERSONNEL_REPORT}?${serialize(queryFilter)}`}
              columns={data && customField()}
              customRows={customRowData}
              perPage={queryFilter.limit}
              isReport={true}
              count={count}
              onLoad={handleLoadData}
              formatDate={true}
              disableEdit
              disableAdd
              disableConfig
              disableSearch
              disableSelect
            />
          </Grid>
        </Grid>
      ) : null}
      {tab === 'ccall_report' &&
        profile && (
          <Grid container>
            <Grid md={12}>
              <Typography align="center" variant="h5" style={{ marginTop: 30 }}>
                Báo cáo tổng đài
              </Typography>
              <CustomChartWrapper
                show
                onGetData={handleSearch}
                profile={profile}
                onZoom={z => setZoom(z)}
                onRefresh={handleClear}
                isReport={true}
                noChart={true}
                code={'reportStatsHrm'}
                // onExport={() => setIsExport(true)}
              />
            </Grid>
            <Grid md={12}>
              <CCallPage profile={profile} columns={customField()} />
            </Grid>
          </Grid>
        )}
    </Grid>
  );
}

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect)(AddReportEmployee);

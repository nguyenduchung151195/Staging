/**
 *
 * AllocationPage
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Grid, Paper } from '@material-ui/core';
import { DatePicker } from 'material-ui-pickers';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAllocationPage from './selectors';
import reducer from './reducer';
import saga from './saga';

import { AsyncAutocomplete, Grid as GridLT } from '../../../components/LifetekUi';
import { API_ASSET, API_TAG_STOCK, API_USERS, API_ASSET_TYPE_STOCK, API_HRM_EMPLOYEE } from '../../../config/urlConfig';
import ListPage from '../../../components/List';
import Buttons from 'components/CustomButtons/Button';
import { MODULE_CODE } from '../../../utils/constants';
import moment from 'moment'

import { changeTab } from './actions'
const tabs = [
  {
    name: 'Tất cả',
    index: 9,
  },
  {
    name: 'Chưa cấp phát',
    index: 0,
  },
  {
    name: 'Đã cấp phát',
    index: 1,
  },

  {
    name: 'Thu hồi',
    index: 2,
  },
];

function AllocationPage(props) {
  const { allocationPage } = props;
  const [tabIndex, setTabIndex] = useState(allocationPage.tabIndex);

  const [filter, setFilter] = useState({ 'allocation.status': { $in: [0, 1, 2] } });

  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  const [assetType, setAssetType] = useState(null);

  const [employee, setEmployee] = useState(null);

  const mapFunctionProject = item => {
    return {
      ...item,
      type: item['type.name'] || '',
      ['allocation.dateReceive']: item['allocation.dateReceive'] && moment(item['allocation.dateReceive']).isValid() ? moment(item['allocation.dateReceive']).format("DD/MM/YYYY") : ""
    };
  };

  const addNewAllocation = () => {
    // props.history.push('/Stock/allocation/add');
    props.history.push('/Stock/Allocate/add');

  };

  const handleChangeTab = index => {
    if (index !== 9) {
      setFilter({ ['allocation.status']: index });
    } else {
      setFilter({ 'allocation.status': { $in: [0, 1, 2] } });
    }
    setTabIndex(index);
    props.changeTab(index)
  };

  const handleChangeStartDate = date => {
    setStartDate(date);
    if (date) {
      setFilter({
        ...filter,
        ['allocation.dateReceive']: {
          ...filter['allocation.dateReceive'],
          $gte: date.toISOString(),
        },
      });
    } else {
      delete filter['allocation.dateReceive'].$gte;
    }
  };

  const handleChangeEndDate = date => {
    if (date) {
      setFilter({
        ...filter,
        ['allocation.dateReceive']: {
          ...filter['allocation.dateReceive'],
          $lte: date.toISOString(),
        },
      });
    } else {
      delete filter['allocation.dateReceive'].$lte;
    }
    setEndDate(date);
  };

  const handleChangeAssetType = data => {
    setAssetType(data);
    if (data) {
      setFilter({
        ...filter,
        type: data._id,
      });
    } else {
      delete filter.type;
    }
  };

  const handleChangeEmployee = data => {
    setEmployee(data);
    if (data) {
      setFilter({
        ...filter,
        ['allocation.personReceive']: data._id,
      });
    } else {
      delete filter['allocation.personReceive'];
    }
  };

  const ButtonUI = props => (
    <Buttons onClick={() => handleChangeTab(props.index)} color={props.index === tabIndex ? 'gradient' : 'simple'}>
      {props.children}
    </Buttons>
  );

  return (
    <Paper style={{ padding: 10 }}>
      <GridLT container spacing={16}>
        <Grid item sm={12}>
          <Grid container spacing={8}>
            <Grid item xs={8}>
              <Grid container spacing={8}>
                <Grid item xs={2}>
                  <DatePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY"
                    value={startDate}
                    clearable
                    variant="outlined"
                    label="Ngày bắt đầu"
                    margin="dense"
                    onChange={date => handleChangeStartDate(date)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <DatePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY"
                    value={endDate}
                    clearable
                    variant="outlined"
                    label="Ngày kết thúc"
                    margin="dense"
                    onChange={date => handleChangeEndDate(date)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <AsyncAutocomplete
                    name="Chọn loại tài sản..."
                    label="Loại tài sản"
                    onChange={value => handleChangeAssetType(value)}
                    url={API_ASSET_TYPE_STOCK}
                    value={assetType}
                  />
                </Grid>
                <Grid item xs={2}>
                  <AsyncAutocomplete
                    name="Chọn nhân viên..."
                    label="nhân viên"
                    onChange={value => handleChangeEmployee(value)}
                    url={API_HRM_EMPLOYEE}
                    value={employee}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={12}>
          <Grid container>
            {tabs.map(tab => (
              <Grid item>
                <ButtonUI index={tab.index}>
                  {tab.name}
                </ButtonUI>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {
            console.log(MODULE_CODE.Allocate, 'MODULE_CODE.Allocate')
          }
          <ListPage
            // columns={[
            //   { name: 'code', title: 'Mã tài sản', checked: true, width: 200, enabaleSearch: true, type: "String", isInSearchbar: true },
            //   { name: 'name', title: 'Tên tài sản', checked: true, width: 200, enabaleSearch: true, type: "String", isInSearchbar: true },
            //   { name: 'allocation.personReceiveName', title: 'Người tiếp nhận', checked: true, width: 300 },
            //   { name: 'allocation.dateReceive', type: "date", title: 'Thời gian tiếp nhận', checked: true, width: 300 },
            //   { name: 'note', title: 'Mô tả', checked: true, width: 300, type: "String" },
            // ]}
            disableTodo={false}
            disableCreateTodo={false}
            disableSeenMail={false}
            disableSMS={false}
            disableRequest={false}
            code={MODULE_CODE.Allocate}
            // disableViewConfig
            apiUrl={API_ASSET}
            mapFunction={mapFunctionProject}
            filter={filter}
            addFunction={addNewAllocation}
            exportExcel
            optionSearch={[{ name: "code", title: "Mã tài sản" }, { name: "name", title: "Tên tài sản" }]}
          />
        </Grid>
      </GridLT>
    </Paper>
  );
}

AllocationPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  allocationPage: makeSelectAllocationPage(),

});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    changeTab: index => dispatch(changeTab(index)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'allocationPage', reducer });
const withSaga = injectSaga({ key: 'allocationPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AllocationPage);

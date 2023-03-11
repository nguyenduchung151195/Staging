import React, { useState, useEffect, Fragment } from 'react';
import { Paper, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { API_REPORT_TASK_WEEK } from 'config/urlConfig';
import _ from 'lodash'

import {
  GroupingState,
  IntegratedGrouping,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableGroupRow,
} from '@devexpress/dx-react-grid-material-ui';


function AskTaskReportWeek(props) {
  const { item } = props

  const [data, setData] = useState([])

  const [columns] = useState([
    { name: 'STT', title: 'STT' },
    { name: 'code', title: 'Mã CVDA' },
    { name: 'name', title: 'Tên dự án' },
    { name: 'customer', title: 'Khách hàng' },
    { name: 'totalContractValue', title: 'Giá trị HĐ' },
    { name: 'progress', title: 'Tiến độ thực hiện' },
    { name: 'inCharge', title: 'Cán bộ theo dõi' },
    { name: 'weekTasks', title: 'Trong tuần' },
    { name: 'nextWeekTasks', title: 'Tuần tới' },
    { name: 'kanbanStatus', title: 'Trạng thái' },
  ]);
  const [tableColumnExtensions] = useState([
    { wordWrapEnabled: true, columnName: 'code', title: 'Mã CVDA' },
    { wordWrapEnabled: true, columnName: 'name', title: 'Tên dự án' },
    { wordWrapEnabled: true, columnName: 'customer', title: 'Khách hàng' },
    { wordWrapEnabled: true, columnName: 'totalContractValue', title: 'Giá trị HĐ' },
    { wordWrapEnabled: true, columnName: 'progress', title: 'Tiến độ thực hiện' },
    { wordWrapEnabled: true, columnName: 'inCharge', title: 'Cán bộ theo dõi' },
    { wordWrapEnabled: true, columnName: 'weekTasks', title: 'Trong tuần' },
    { wordWrapEnabled: true, columnName: 'nextWeekTasks', title: 'Tuần tới' },
    { wordWrapEnabled: true, columnName: 'kanbanStatus', title: 'Trạng thái' },
  ]);
  useEffect(() => {
    fetch(`${API_REPORT_TASK_WEEK}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then(result => result.json())
      .then(data => {
        let result = data.data
        result = result.map(item => ({ ...item, kanbanStatus: item.kanbanStatus ? item.kanbanStatus : 'Không xác định' }))
        let result1 = result.map(item => ({ ...item, kanbanStatus: 'test' }))
        result = [...result, ...result1]
        setData(result);
      });
  }, []);

  return (
    <Paper>
      <Typography gutterBottom align="center" variant='h5' style={{ marginTop: 30 }}>
        {item.titleFunction}
      </Typography>
      <Grid
        rows={data}
        columns={columns}
      >
        <GroupingState
          grouping={[{ columnName: 'kanbanStatus' }]}
        />
        <IntegratedGrouping />
        <Table columnExtensions={tableColumnExtensions} cellComponent={Cell} />
        <TableHeaderRow />
        <TableGroupRow />
      </Grid>
    </Paper>
  );
}

const mapStateToProps = createStructuredSelector({
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(AskTaskReportWeek);

const styles = {
  title: {
    textTranform: 'uppercase'
  }
}

const Cell = (props) => {
  const { column } = props;
  if (column.name === 'STT') {
    console.log(props)
    return <Table.Cell {...props} />;
  }
  return <Table.Cell {...props} />;
};
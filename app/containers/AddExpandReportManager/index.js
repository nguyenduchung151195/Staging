import {
  Grid,
  Paper,
  Typography,
  TableBody,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  TextField,
  Button,
  Menu,
  MenuItem,
} from '@material-ui/core';
import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import ListPage from 'components/List';
import { API_REPORT_TASK_WEEK, API_PERSONNEL } from 'config/urlConfig';
import { MODULE_CODE } from 'utils/constants';
import _ from 'lodash';
import moment from 'moment';
import ExportTable from './exportTable';
import { tableToExcel, tableToPDF } from 'helper';
import CustomInputField from 'components/Input/CustomInputField';
import { serialize } from 'utils/common';
import { makeSelectProfile, makeSelectMiniActive } from '../Dashboard/selectors';

function AddExpandReportManager(props) {
  const { item, miniActive, tab } = props;
  const [data, setData] = useState({});
  const [exportAnchor, setExportAnchor] = useState(null);
  const [exportDate, setExportDate] = useState('');
  const [html, setHtml] = useState([]);
  const [htmlTotal, setHtmlTotal] = useState(0);
  const [openExcel, setOpenExcel] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(
    () => {
      const query = {
        filter: {},
      };
      if (category) {
        query.filter.category = category.code;
      }
      fetch(`${API_REPORT_TASK_WEEK}?${serialize(query)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
        .then(result => result.json())
        .then(data => {
          let result = data.data;
          result = _.groupBy(result, 'kanbanStatus');
          try {
            JSON.parse(localStorage.getItem('taskStatus')) &&
              JSON.parse(localStorage.getItem('taskStatus'))
                .find(i => i.code === 'KANBAN')
                .data.forEach(st => {
                  if (!result[st.name]) {
                    result[st.name] = [];
                  }
                });
          } catch (e) {
            console.log('e', e);
          }
          setData(result);
        });
    },
    [category],
  );

  const onExportExcel = () => {
    // if (!exportDate || moment(exportDate).isBefore(moment(filter.startDate))) {
    //   props.onChangeSnackbar({ status: true, message: 'Ngày xuất báo cáo không hợp lệ!', variant: 'error' });
    //   return;
    // }

    setOpenExcel('Excel');
  };
  const onExportPDF = () => {
    // if (!exportDate || moment(exportDate).isBefore(moment(filter.startDate))) {
    //   props.onChangeSnackbar({ status: true, message: 'Ngày xuất báo cáo không hợp lệ!', variant: 'error' });
    //   return;
    // }

    setOpenExcel('PDF');
  };
  useEffect(
    () => {
      if (html.length > 0 && htmlTotal !== 0) {
        if (html.length === htmlTotal) {
          for (let index = 0; index < htmlTotal; index++) {
            const win = window.open();
            win.document.write(html[index].content);
            win.document.close();
            win.print();
          }

          setHtml([]);
          setHtmlTotal(0);
        }
      }
    },
    [html, htmlTotal],
  );

  const handleCloseExcel = payload => {
    const type = openExcel;
    setOpenExcel(null);

    if (payload && payload.error) {
      if (payload.res && payload.res.message) {
        const { message } = payload.res;
        console.log(message, 'ooooooooo');
      } else {
        console.log('loisssssss');
      }
      return;
    }

    switch (type) {
      case 'PDF':
        const { totalPage = 1, pageNumber = 1 } = payload || {};
        const content = tableToPDF('reportTaskWeek');
        setHtml(e => [...e, { content, pageNumber }]);
        setHtmlTotal(totalPage);
        break;
      default:
        tableToExcel('reportTaskWeek', 'W3C Example Table');
    }

    // setOpenExcel(null);
    // tableToExcel('excel-table-customer-contract', 'W3C Example Table');
  };

  return (
    <>
      {tab === 0 ? (
        <>
          <Grid container spacing={16} style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 80px)' }}>
            {/* <Paper style={{ marginTop: 20, alignSelf: 'center' }}> */}
            <Typography align="center" variant="h5" style={{ marginTop: 30, marginLeft: '550px' }}>
              Báo cáo khách hàng theo số lượng mua hàng
            </Typography>
            {/* </Paper> */}
          </Grid>
        </>
      ) : null}
      {tab === 1 ? (
        <>
          <Grid container spacing={16} style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 80px)' }}>
            <Typography align="center" variant="h5" style={{ marginTop: 30, marginLeft: '550px' }}>
              Báo cáo tần xuất khách hàng mua hàng{' '}
            </Typography>
          </Grid>
        </>
      ) : null}
      {tab === 2 ? (
        <>
          <Grid container spacing={16} style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 80px)' }}>
            <Typography align="center" variant="h5" style={{ marginTop: 30, marginLeft: '550px' }}>
              Báo cáo tổng hợp chi phí trong năm{' '}
            </Typography>
          </Grid>
        </>
      ) : null}
      {tab === 3 ? (
        <>
          <Grid container spacing={16} style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 80px)' }}>
            <Typography align="center" variant="h5" style={{ marginTop: 30, marginLeft: '550px' }}>
              Báo cáo tồn kho trong năm{' '}
            </Typography>
          </Grid>
        </>
      ) : null}
      {tab === 4 ? (
        <>
          <Grid container spacing={16} style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 80px)' }}>
            <Typography align="center" variant="h5" style={{ marginTop: 30, marginLeft: '550px' }}>
              Báo cáo tổng hợp doanh thu
            </Typography>
          </Grid>
        </>
      ) : null}
      {tab === 5 ? (
        <>
          <Grid container spacing={16} style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 80px)' }}>
            <Typography align="center" variant="h5" style={{ marginTop: 30, marginLeft: '550px' }}>
              Báo cáo tổng hợp giá trị hợp đồng và thanh toán
            </Typography>
          </Grid>
        </>
      ) : null}
      {tab === 6 ? (
        <>
          <Grid style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 80px)' }}>
            <Paper style={{ marginTop: 20 }}>
              <Typography gutterBottom align="center" variant="h5" style={{ marginTop: 30 }}>
                BÁO CÁO ĐÃ XUẤT BẢN TRONG TUẦN
              </Typography>
              {/* <div style={{ width: 250, marginLeft: 20 }}>
            <CustomInputField
              configType="taskStatus"
              configCode="TASKTYPE"
              type="Source|TaskConfig,TASKTYPE|Id||code"
              name="category"
              label="Loại CV/DA"
              isChecked
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            />
          </div> */}
              <Table>
                <TableHead>
                  <TableCell style={styles.title}>STT</TableCell>
                  <TableCell style={styles.title}>Dự án</TableCell>
                  <TableCell style={styles.title}>Giá trị hợp đồng</TableCell>
                  <TableCell style={styles.title}>Lần xuất bản</TableCell>
                  <TableCell style={styles.title}>Khả năng thanh toán sau xuất bản</TableCell>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell style={styles.title}>A</TableCell>
                    <TableCell style={styles.title}>Báo cáo đề án</TableCell>
                    <TableCell style={styles.title} />
                    <TableCell style={styles.title} />
                    <TableCell style={styles.title} />
                  </TableRow>
                  <TableRow>
                    <TableCell style={styles.title}>1</TableCell>
                    <TableCell style={styles.title} />
                    <TableCell style={styles.title} />
                    <TableCell style={styles.title} />
                    <TableCell style={styles.title} />
                  </TableRow>
                  <TableRow>
                    <TableCell style={styles.title}>2</TableCell>
                    <TableCell style={styles.title} />
                    <TableCell style={styles.title} />
                    <TableCell style={styles.title} />
                    <TableCell style={styles.title} />
                  </TableRow>
                  <TableRow>
                    <TableCell style={styles.title}>B</TableCell>
                    <TableCell style={styles.title}>Công văn</TableCell>
                    <TableCell style={styles.title} />
                    <TableCell style={styles.title} />
                    <TableCell style={styles.title} />
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
            {/* <ExportTable
          exportType={openExcel}
          // filter={newFilter}
          url={`${API_REPORT_TASK_WEEK}`}
          open={openExcel}
          onClose={handleCloseExcel}
          // exportDate={exportDate}
          startDate={moment().format('YYYY-MM-DD')}
          endDate={moment().format('YYYY-MM-DD')}
          // employee={employee}
          // department={filter.organizationUnitId}
          // customer={customer}
          // maxLimit={maxLimit}
        />
  
        <Grid item xs={12} container direction="row" alignItems="center" spacing={16} style={{ paddingTop: 20 }}>
          <Grid item xs={4} container direction="row" alignItems="flex-end" style={{ paddingLeft: 50 }}>

          </Grid>
  
          <Grid item xs={8} container direction="row" justify="flex-end" style={{ paddingRight: 50 }}>
            <Button variant="outlined" color="primary" onClick={e => setExportAnchor(e.currentTarget)} style={styles.importBtn}>
              Xuất báo cáo
            </Button>

            <Menu keepMounted open={Boolean(exportAnchor)} onClose={() => setExportAnchor(null)} anchorEl={exportAnchor}>
              <MenuItem onClick={onExportExcel} style={styles.menuItem}>
                Excel
              </MenuItem>
              <MenuItem onClick={onExportPDF} style={styles.menuItem}>
                PDF
              </MenuItem>
            </Menu>
          </Grid>
        </Grid> */}
          </Grid>
        </>
      ) : null}
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect)(AddExpandReportManager);

const styles = {
  title: {
    textTranform: 'uppercase',
    fontWeight: 'bold',
    color: 'black',
  },
  importBtn: {
    marginLeft: 10,
    // marginRight: 20,
    width: 200,
  },
  menuItem: {
    width: 200,
    justifyContent: 'center',
  },
};

import { Grid, Paper, Typography, TableBody, Table, TableCell, TableRow, TableHead, TableContainer, Button, Menu, MenuItem } from '@material-ui/core';
import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import ListPage from 'components/List';
import { API_REPORT_TASK_VALUE_AND_PAID } from 'config/urlConfig';
import { MODULE_CODE } from 'utils/constants';
import _ from 'lodash';
import moment from 'moment';
import ExportTable from './exportTable';
import { tableToExcel, tableToPDF } from 'helper';

// import ExportButton from './ExportButton'

function ReportContractValueAndPaid(props) {
  const { item, tab, miniActive } = props;
  const [data, setData] = useState({});
  const [paidState, setPaidState] = useState();
  const [exportAnchor, setExportAnchor] = useState(null);
  const [html, setHtml] = useState([]);
  const [htmlTotal, setHtmlTotal] = useState(0);
  const [openExcel, setOpenExcel] = useState(null);

  useEffect(() => {
    fetch(`${API_REPORT_TASK_VALUE_AND_PAID}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then(result => result.json())
      .then(data => {
        let result = data.data;
        setData(result);
        const arr = _.get(result, 'paidState');
        if (Array.isArray(arr) && arr.length) setPaidState(arr);
      });
  }, []);
  const onExportExcel = () => {
    setOpenExcel('Excel');
  };
  const onExportPDF = () => {
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
        const content = tableToPDF('reportContractValueAndPaid');
        setHtml(e => [...e, { content, pageNumber }]);
        setHtmlTotal(totalPage);
        break;
      default:
        tableToExcel('reportContractValueAndPaid', 'W3C Example Table');
    }
  };
  const numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  return (
    <>
      {tab === 0 ? (
        <>
          <Grid container spacing={16} style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 65px)' }}>
            <Typography>Báo cáo khách hàng theo số lượng mua hàng </Typography>
          </Grid>
        </>
      ) : null}
      {tab === 1 ? (
        <>
          <Grid container spacing={16} style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 65px)' }}>
            <Typography>Báo cáo khách hàng theo số lượng mua hàng </Typography>
          </Grid>
        </>
      ) : null}
      {tab === 2 ? (
        <>
          <Grid container spacing={16} style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 65px)' }}>
            <Typography>Báo cáo khách hàng theo số lượng mua hàng </Typography>
          </Grid>
        </>
      ) : null}
      {tab === 3 ? (
        <>
          <Grid container spacing={16} style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 65px)' }}>
            <Typography>Báo cáo khách hàng theo số lượng mua hàng </Typography>
          </Grid>
        </>
      ) : null}
      {tab === 4 ? (
        <>
          <Grid container spacing={16} style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 65px)' }}>
            <Typography>Báo cáo khách hàng theo số lượng mua hàng </Typography>
          </Grid>
        </>
      ) : null}
      {tab === 5 ? (
        <>
          <Grid container spacing={16} style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 65px)' }}>
            <Typography>Báo cáo khách hàng theo số lượng mua hàng </Typography>
          </Grid>
        </>
      ) : null}
      {tab === 6 ? (
        <>
          <Paper>
            <Typography gutterBottom align="center" variant="h5" style={{ marginTop: 30 }}>
              {item.titleFunction}
            </Typography>
            <Table>
              <TableHead>
                <TableCell style={styles.title}>STT</TableCell>
                <TableCell style={styles.title}>Nội dung</TableCell>
                <TableCell style={styles.title}>Số lượng</TableCell>
                <TableCell style={styles.title}>Giá trị</TableCell>
                <TableCell style={styles.title}>Thông tin HĐ/ Biện pháp xử lý</TableCell>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>Tổng giá trị Hợp đồng</TableCell>
                  <TableCell>{data.contractAmount}</TableCell>
                  <TableCell>{numberWithCommas(parseInt(data.contractValue))}</TableCell>
                  <TableCell />
                </TableRow>
                <TableRow>
                  <TableCell>2</TableCell>
                  <TableCell>Lũy kế tiền về</TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell> - Tuần trước</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{numberWithCommas(parseInt(data.lastWeekIncome))}</TableCell>
                  <TableCell />
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell> - Tuần này</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{numberWithCommas(parseInt(data.currentWeekIncom))}</TableCell>
                  <TableCell />
                </TableRow>
                <TableRow>
                  <TableCell>3</TableCell>
                  <TableCell>Giá trị cần thanh toán</TableCell>
                  <TableCell>{data.debtAmount}</TableCell>
                  <TableCell>{numberWithCommas(parseInt(data.debtValue))}</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>3.1</TableCell>
                  <TableCell>Tình trạng xuất hóa đơn</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell />
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell> - Các công trình đã xuất hóa đơn VAT</TableCell>
                  <TableCell>{data.hasBillAmount}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell />
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell> - Chưa xuất hóa đơn</TableCell>
                  <TableCell>{data.notBillAmount}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell />
                </TableRow>
                <TableRow>
                  <TableCell>3.2</TableCell>
                  <TableCell>Tình trạng thanh toán</TableCell>
                  <TableCell />
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                {data &&
                  data.paidState && (
                    <>
                      {data.paidState.map((item, index) => {
                        return (
                          <TableRow key={item.title}>
                            <TableCell />
                            <TableCell>{item.title}</TableCell>
                            <TableCell>{item.value}</TableCell>
                            <TableCell />
                            <TableCell />
                          </TableRow>
                        );
                      })}
                    </>
                  )}
              </TableBody>
            </Table>
            {/* <ExportButton /> */}
          </Paper>
          <ExportTable
            exportType={openExcel}
            // filter={newFilter}
            url={`${API_REPORT_TASK_VALUE_AND_PAID}`}
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
              {/* <MuiPickersUtilsProvider utils={MomentUtils}>
              <DateTimePicker
                inputVariant="outlined"
                format="DD/MM/YYYY"
                value={exportDate}
                variant="outlined"
                label="Ngày xuất báo cáo"
                margin="dense"
                required
                name="exportDate"
                disableFuture
              />
            </MuiPickersUtilsProvider> */}
            </Grid>

            <Grid item xs={8} container direction="row" justify="flex-end" style={{ paddingRight: 50 }}>
              <Button variant="outlined" color="primary" onClick={e => setExportAnchor(e.currentTarget)} style={styles.importBtn}>
                Xuất báo cáo
              </Button>
              {/* <Button variant="outlined" color="secondary" onClick={props.onClose} style={styles.importBtn}>
              Thoát
            </Button> */}
              <Menu keepMounted open={Boolean(exportAnchor)} onClose={() => setExportAnchor(null)} anchorEl={exportAnchor}>
                <MenuItem onClick={onExportExcel} style={styles.menuItem}>
                  Excel
                </MenuItem>
                <MenuItem onClick={onExportPDF} style={styles.menuItem}>
                  PDF
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </>
      ) : null}
    </>
  );
}

const mapStateToProps = createStructuredSelector({});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(ReportContractValueAndPaid);

const styles = {
  title: {
    textTranform: 'uppercase',
  },
  importBtn: {
    marginLeft: 10,
    width: 200,
  },
  menuItem: {
    width: 200,
    justifyContent: 'center',
  },
};

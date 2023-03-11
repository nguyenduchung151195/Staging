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
  Button,
  Menu,
  MenuItem,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import ListPage from 'components/List';
import { API_REPORT_TASK_SUMMARY } from 'config/urlConfig';
import { MODULE_CODE } from 'utils/constants';
import _ from 'lodash';
import moment from 'moment';
import ExportTable from './exportTable';
import { tableToExcel, tableToPDF } from 'helper';
import { makeSelectProfile, makeSelectMiniActive } from '../../../Dashboard/selectors';
import { Archive } from '@material-ui/icons';
function AddTaskReportSummary(props) {
  const { item, miniActive } = props;
  const [data, setData] = useState([]);
  const [exportAnchor, setExportAnchor] = useState(null);
  const [html, setHtml] = useState([]);
  const [htmlTotal, setHtmlTotal] = useState(0);
  const [openExcel, setOpenExcel] = useState(null);
  useEffect(() => {
    fetch(`${API_REPORT_TASK_SUMMARY}`, {
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
        const content = tableToPDF('reportTaskSummary');
        setHtml(e => [...e, { content, pageNumber }]);
        setHtmlTotal(totalPage);
        break;
      default:
        tableToExcel('reportTaskSummary', 'W3C Example Table');
    }
  };

  const numberWithCommas = x => {
    return (typeof x === 'string' || typeof x === 'number') ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ('');
  };

  return (
    <Grid style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 80px)' }}>
      <Paper>
        <Typography gutterBottom align="center" variant="h5" style={{ marginTop: 30 }}>
          Báo cáo tổng hợp công việc
        </Typography>
        <Tooltip title="Xuất dữ liệu">
          <IconButton style={{ marginLeft: '1200px' }} aria-label="Export" onClick={e => setExportAnchor(e.currentTarget)}>
            <Archive style={{ width: '30px', height: '30px' }} />
          </IconButton>
        </Tooltip>
        <Table>
          <TableHead>
            <TableCell style={styles.title}>STT</TableCell>
            <TableCell style={styles.title}>Nội dung</TableCell>
            <TableCell style={styles.title}>Số lượng</TableCell>
            <TableCell style={styles.title}>Giá trị</TableCell>
            <TableCell style={styles.title}>Thông tin HĐ/ Biện pháp/ Hành động</TableCell>
          </TableHead>
          <TableBody>
            {data.map((item, index) => {
              return (
                <TableRow key={item._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>{numberWithCommas(item.value)}</TableCell>
                  <TableCell>{}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
      <ExportTable
        exportType={openExcel}
        // filter={newFilter}
        url={`${API_REPORT_TASK_SUMMARY}`}
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
          {/* <Button variant="outlined" color="primary" onClick={e => setExportAnchor(e.currentTarget)} style={styles.importBtn}>
            Xuất báo cáo
          </Button> */}
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
    </Grid>
  );
}

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect)(AddTaskReportSummary);

const styles = {
  title: {
    textTranform: 'uppercase',
    fontWeight: 'bold',
    color: 'black',
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

import { Grid, Paper, Typography, TableBody, Table, TableCell, TableRow, TableHead, TableContainer, Button, Menu, MenuItem } from '@material-ui/core';
import React, { useState, useEffect, Fragment, useCallback } from 'react';
import { Dialog, DialogContent, withStyles, Slide, AppBar, Tab, Tabs, Toolbar, Tooltip, IconButton } from '@material-ui/core';
import { connect } from 'react-redux';
import { compose } from 'redux';
import CustomChartWrapper from 'components/Charts/CustomChartWrapper';
import DepartmentAndEmployee from '../../../../components/Filter/DepartmentAndEmployee';
import { createStructuredSelector } from 'reselect';
import ListPage from 'components/List';
import { SwipeableDrawer } from 'components/LifetekUi';
import { API_REPORT_HRM_BY_CONTRACT } from 'config/urlConfig';
import { MODULE_CODE } from 'utils/constants';
import _ from 'lodash';
// import Details from './details'
import moment from 'moment';
import ExportTable from './exportTable';
import HrmChart from './hrmChart';
import { tableToExcel, tableToPDF } from 'helper';
import { Fullscreen, Refresh, FullscreenExit, ImportExport, Archive, Remove } from '@material-ui/icons';

// import ExportButton from './ExportButton'

function ReportContractValueAndPaid(props) {
  const { item } = props;
  const [data, setData] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [paidState, setPaidState] = useState();
  const [exportAnchor, setExportAnchor] = useState(null);
  const [html, setHtml] = useState([]);
  const [htmlTotal, setHtmlTotal] = useState(0);
  const [index, setIndex] = useState(null);
  const [openExcel, setOpenExcel] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);

  useEffect(() => {
    fetch(`${API_REPORT_HRM_BY_CONTRACT}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then(result => result.json())
      .then(data => {
        console.log(data, 'ádsad');
        let result = data.data;
        setData(result);
        // const arr = _.get(result, 'paidState');
        // if (Array.isArray(arr) && arr.length) setPaidState(arr);
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

  // const handleChangeDepartmentAndEmployee = useCallback(
  //   result => {
  //     const { department, employee } = result;
  //     if (department) {
  //       const newFilter = { ...filter, organizationUnitId: department };
  //       delete newFilter.employeeId;
  //       setFilter(newFilter);
  //       setEmployee(null);
  //     }
  //     if (employee && employee._id) {
  //       setFilter({ ...filter, employeeId: employee && employee._id });
  //       setEmployee(employee);
  //     }
  //   },
  //   [filter],
  // );

  const handleCloseExcel = payload => {
    const type = openExcel;
    setOpenExcel(null);

    if (payload && payload.error) {
      if (payload.res && payload.res.message) {
        const { message } = payload.res;
        alert(message);
      } else alert('errr');
      return;
    }

    switch (type) {
      case 'PDF':
        const { totalPage = 1, pageNumber = 1 } = payload || {};
        const content = tableToPDF('excelTableBosReport');
        setHtml(e => [...e, { content, pageNumber }]);
        setHtmlTotal(totalPage);
        break;
      default:
        tableToExcel('excelTableBosReport', 'W3C Example Table');
    }
  };

  return (
    <div>
      <Tabs
        value={tabIndex}
        onChange={(event, tabIndex) => {
          setTabIndex(tabIndex);
        }}
        indicatorColor="primary"
        textColor="primary"
        style={{ width: 500 }}
      >
        <Tab value={0} label={'Báo cáo'} />
        <Tab value={1} label={'Biểu đồ'} />
      </Tabs>
      {tabIndex === 0 ? (
        <Grid container spacing={16} style={{ width: window.innerWidth - 250 }}>
          <Grid xs={12}>
            <Typography gutterBottom align="center" variant="h5" style={{ marginTop: 30 }}>
              Báo cáo thống kê nhân sự theo loại hợp đồng
            </Typography>
            <Grid item xs={12} container direction="row" alignItems="right" spacing={16} style={{ paddingTop: 20 }}>
              <Grid item xs={6}>
                {/* <DepartmentAndEmployee
                    department={filter.organizationUnitId}
                    employee={employee}
                    disableEmployee
                    onChange={handleChangeDepartmentAndEmployee}
                    profile={props.profile}
                    moduleCode="reportHrmCountBySignedContractDate"
                  /> */}
              </Grid>
              <Grid item xs={6} style={{textAlign: "right"}}>
                <Tooltip title="Xuất dữ liệu">
                  <IconButton
                    style={{ padding: '6px', width: '30px', height: '30px' }}
                    aria-label="Export"
                    onClick={e => setExportAnchor(e.currentTarget)}
                  >
                    <Archive style={{ width: '30px', height: '30px' }} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            {/* <Grid item xs={12} container direction="row" alignItems="center" spacing={16} style={{ paddingTop: 20 }}>
              <Grid item xs={2}>
                <Tooltip title="Xuất dữ liệu">
                  <IconButton
                    style={{ padding: '6px', width: '30px', height: '30px' }}
                    aria-label="Export"
                    onClick={e => setExportAnchor(e.currentTarget)}
                  >
                    <Archive style={{ width: '30px', height: '30px' }} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid> */}

            <Table style={{ marginTop: 20 }}>
              <TableHead>
                <TableCell style={styles.title}>STT</TableCell>
                <TableCell style={styles.title}>Phòng ban</TableCell>
                <TableCell style={styles.title}>Mã nhân viên chấm công</TableCell>
                <TableCell style={styles.title}>Họ và tên</TableCell>
                <TableCell style={styles.title}>Chức danh</TableCell>
                <TableCell style={styles.title}>Ngày vào làm</TableCell>
                <TableCell style={styles.title}>Năm sinh</TableCell>
                <TableCell style={styles.title}>Hộ khẩu thường trú</TableCell>
                <TableCell style={styles.title}>Loại hợp đồng</TableCell>
                <TableCell style={styles.title}>Ngày kí</TableCell>
                <TableCell style={styles.title}>Ghi chú </TableCell>
                <TableCell style={styles.title1}>Ngày hết hạn</TableCell>
              </TableHead>
              <TableBody>
                {data &&
                  data.filter(item => item['list'].length > 0).map((item, index) => (
                    <TableRow key={item.name}>
                      <TableCell style={{ borderLeft: '1px solid rgb(222,222,222)', borderRight: '1px solid rgb(222,222,222)' }}>
                        {index + 1}
                      </TableCell>
                      <TableCell style={{ borderLeft: '1px solid rgb(222,222,222)', borderRight: '1px solid rgb(222,222,222)' }}>
                        {item.name}
                      </TableCell>
                      <TableCell style={{ borderLeft: '1px solid rgb(222,222,222)', borderRight: '1px solid rgb(222,222,222)', padding: 0 }}>
                        {Array.isArray(item.list) &&
                          item.list.filter((i, index) => index !== item.list.length - 1).map(i => (
                            <>
                              <TableRow key={i.name}>
                                <p style={{ transform: 'translate(50px, 15px)' }}>{i.mcc || ''}</p>
                              </TableRow>
                              <hr style={{ marginTop: 0, marginBottom: 0 }} />
                            </>
                          ))}
                        <TableRow>
                          <p style={{ transform: 'translate(50px, 15px)' }}>
                            {Array.isArray(item.list) && item.list.length > 0 ? item.list[item.list.length - 1].mcc : ''}
                          </p>
                        </TableRow>
                      </TableCell>
                      <TableCell style={{ borderBottom: '1px solid rgb(222,222,222)', padding: 0 }}>
                        {Array.isArray(item.list) &&
                          item.list.filter((i, index) => index !== item.list.length - 1).map(i => (
                            <>
                              <TableRow key={i.name}>
                                <p style={{ transform: 'translate(10px, 15px)', paddingRight: 8 }}>{i.name || ''}</p>
                              </TableRow>
                              <hr style={{ marginTop: 0, marginBottom: 0 }} />
                            </>
                          ))}
                        <TableRow>
                          <p style={{ transform: 'translate(10px, 15px)', paddingRight: 8 }}>
                            {Array.isArray(item.list) && item.list.length > 0 ? item.list[item.list.length - 1].name : ''}
                          </p>
                        </TableRow>
                      </TableCell>
                      <TableCell style={{ borderLeft: '1px solid rgb(222,222,222)', borderRight: '1px solid rgb(222,222,222)', padding: 0 }}>
                        {Array.isArray(item.list) &&
                          item.list.filter((i, index) => index !== item.list.length - 1).map(i => (
                            <>
                              <TableRow key={i.name}>
                                <p style={{ transform: 'translate(10px, 15px)', paddingRight: 8 }}>{i.title ? i.title.title : ''}</p>
                              </TableRow>
                              <hr style={{ marginTop: 0, marginBottom: 0 }} />
                            </>
                          ))}
                        <TableRow>
                          <p style={{ transform: 'translate(10px, 15px)', paddingRight: 8 }}>
                            {Array.isArray(item.list) && item.list.length > 0
                              ? item.list[item.list.length - 1].title
                                ? item.list[item.list.length - 1].title.title
                                : ''
                              : ''}
                          </p>
                        </TableRow>
                      </TableCell>
                      <TableCell style={{ borderLeft: '1px solid rgb(222,222,222)', borderRight: '1px solid rgb(222,222,222)', padding: 0 }}>
                        {Array.isArray(item.list) &&
                          item.list.filter((i, index) => index !== item.list.length - 1).map(i => (
                            <>
                              <TableRow key={i.name}>
                                <p style={{ transform: 'translate(0px, 15px)' }}>
                                  {i.contractStartDate ? moment(i.contractStartDate).format('DD/MM/YYYY') : ''}
                                </p>
                              </TableRow>
                              <hr style={{ marginTop: 0, marginBottom: 0 }} />
                            </>
                          ))}
                        <TableRow>
                          <p style={{ transform: 'translate(0px, 15px)' }}>
                            {Array.isArray(item.list) && item.list.length > 0
                              ? item.list[item.list.length - 1].contractStartDate
                                ? moment(item.list[item.list.length - 1].contractStartDate).format('DD/MM/YYYY')
                                : ''
                              : ''}
                          </p>
                        </TableRow>
                      </TableCell>
                      <TableCell style={{ borderLeft: '1px solid rgb(222,222,222)', borderRight: '1px solid rgb(222,222,222)', padding: 0 }}>
                        {Array.isArray(item.list) &&
                          item.list.filter((i, index) => index !== item.list.length - 1).map(i => (
                            <>
                              <TableRow key={i.name}>
                                <p style={{ transform: 'translate(10px, 15px)' }}> {i.birthday ? moment(i.birthday).format('YYYY') : ''}</p>
                              </TableRow>
                              <hr style={{ marginTop: 0, marginBottom: 0 }} />
                            </>
                          ))}
                        <TableRow>
                          <p style={{ transform: 'translate(10px, 15px)' }}>
                            {Array.isArray(item.list) && item.list.length > 0
                              ? item.list[item.list.length - 1].birthday
                                ? moment(item.list[item.list.length - 1].birthday).format('YYYY')
                                : ''
                              : ''}
                          </p>
                        </TableRow>
                      </TableCell>
                      <TableCell style={{ borderLeft: '1px solid rgb(222,222,222)', borderRight: '1px solid rgb(222,222,222)', padding: 0 }}>
                        {Array.isArray(item.list) &&
                          item.list.filter((i, index) => index !== item.list.length - 1).map(i => (
                            <>
                              <TableRow key={i.name}>
                                <p style={{ transform: 'translate(10px, 15px)' }}> {i.address || ''}</p>
                              </TableRow>
                              <hr style={{ marginTop: 0, marginBottom: 0 }} />
                            </>
                          ))}
                        <TableRow>
                          <p style={{ transform: 'translate(10px, 15px)' }}>
                            {' '}
                            {Array.isArray(item.list) && item.list.length > 0 ? item.list[item.list.length - 1].address : ''}
                          </p>
                        </TableRow>
                      </TableCell>
                      <TableCell style={{ borderLeft: '1px solid rgb(222,222,222)', borderRight: '1px solid rgb(222,222,222)', padding: 0 }}>
                        {Array.isArray(item.list) &&
                          item.list.filter((i, index) => index !== item.list.length - 1).map(i => (
                            <>
                              <TableRow key={i.name}>
                                <p style={{ transform: 'translate(10px, 15px)' }}>
                                  {item.list.contractType && item.list.contractType.title ? item.list.contractType.title : ''}
                                </p>
                              </TableRow>
                              <hr style={{ marginTop: 0, marginBottom: 0 }} />
                            </>
                          ))}
                        <TableRow>
                          <p style={{ transform: 'translate(10px, 15px)' }}>
                            {' '}
                            {Array.isArray(item.list) && item.list.length > 0
                              ? item.list[item.list.length - 1].contractType
                                ? item.list[item.list.length - 1].contractType.title
                                : ''
                              : ''}
                          </p>
                        </TableRow>
                      </TableCell>
                      <TableCell style={{ borderLeft: '1px solid rgb(222,222,222)', borderRight: '1px solid rgb(222,222,222)', padding: 0 }}>
                        {Array.isArray(item.list) &&
                          item.list.filter((i, index) => index !== item.list.length - 1).map(i => (
                            <>
                              <TableRow key={i.name}>
                                <p style={{ transform: 'translate(0px, 15px)' }}> {i.beginWork ? moment(i.beginWork).format('DD/MM/YYYY') : ''}</p>
                              </TableRow>
                              <hr style={{ marginTop: 0, marginBottom: 0 }} />
                            </>
                          ))}
                        <TableRow>
                          <p style={{ transform: 'translate(0px, 15px)' }}>
                            {Array.isArray(item.list) && item.list.length > 0
                              ? item.list[item.list.length - 1].beginWork
                                ? moment(item.list[item.list.length - 1].beginWork).format('DD/MM/YYYY')
                                : ''
                              : ''}
                          </p>
                        </TableRow>
                      </TableCell>
                      <TableCell style={{ borderLeft: '1px solid rgb(222,222,222)', borderRight: '1px solid rgb(222,222,222)', padding: 0 }}>
                        {Array.isArray(item.list) &&
                          item.list.filter((i, index) => index !== item.list.length - 1).map(i => (
                            <>
                              <TableRow key={i.name}>
                                <p style={{ transform: 'translate(10px, 15px)' }}> {i.note ? i.note : ''}</p>
                              </TableRow>
                              <hr style={{ marginTop: 0, marginBottom: 0 }} />
                            </>
                          ))}
                        <TableRow>
                          <p style={{ transform: 'translate(10px, 15px)' }}>
                            {Array.isArray(item.list) && item.list.length > 0
                              ? item.list[item.list.length - 1].note
                                ? item.list[item.list.length - 1].note
                                : ''
                              : ''}
                          </p>
                        </TableRow>
                      </TableCell>
                      <TableCell style={{ borderLeft: '1px solid rgb(222,222,222)', borderRight: '1px solid rgb(222,222,222)', padding: 0 }}>
                        {Array.isArray(item.list) &&
                          item.list.filter((i, index) => index !== item.list.length - 1).map(i => (
                            <>
                              <TableRow key={i.name}>
                                <p style={{ transform: 'translate(0px, 15px)', paddingRight: 10 }}>
                                  {' '}
                                  {i.contractEndDate ? moment(i.contractEndDate).format('DD/MM/YYYY') : ''}
                                </p>
                              </TableRow>
                              <hr style={{ marginTop: 0, marginBottom: 0 }} />
                            </>
                          ))}
                        <TableRow>
                          <p style={{ transform: 'translate(0px, 15px)', paddingRight: 10 }}>
                            {Array.isArray(item.list) && item.list.length > 0
                              ? item.list[item.list.length - 1].contractEndDate
                                ? moment(item.list[item.list.length - 1].contractEndDate).format('DD/MM/YYYY')
                                : ''
                              : ''}
                          </p>
                        </TableRow>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Grid item xs={12} container direction="row" justify="flex-end" style={{ paddingRight: 50, marginTop: 20 }}>
              {/* <Button variant="outlined" color="primary" onClick={e => setExportAnchor(e.currentTarget)} style={styles.importBtn}>
                Xuất báo cáo
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
      ) : null}
      {tabIndex === 1 ? (
        <Grid container spacing={16} style={{ width: window.innerWidth - 250, height: '1vh' }}>
          <Grid xs={12} style={{ marginTop: 20 }}>
            <CustomChartWrapper>
              <HrmChart id="hrmSigned" />
            </CustomChartWrapper>
          </Grid>
        </Grid>
      ) : null}
      <ExportTable
        exportType={openExcel}
        url={API_REPORT_HRM_BY_CONTRACT}
        open={openExcel}
        onClose={handleCloseExcel}
        // exportDate={exportDate}
        // startDate={filter.startDate}
        // endDate={filter.endDate}
        // employee={employee}
        // department={filter.organizationUnitId}
        //   maxLimit={maxLimit}
      />
    </div>
  );
}

const mapStateToProps = createStructuredSelector({});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(ReportContractValueAndPaid);

const styles = {
  title: {
    textTranform: 'uppercase',
    color: 'black',
    borderLeft: '1px solid rgb(222,222,222)',
    borderTop: '1px solid rgb(222,222,222)',
    padding: 0,
    textAlign: 'center',
  },
  title1: {
    textTranform: 'uppercase',
    color: 'black',
    borderLeft: '1px solid rgb(222,222,222)',
    borderTop: '1px solid rgb(222,222,222)',
    padding: 0,
    textAlign: 'center',
    paddingRight: 10,
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

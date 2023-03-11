/**
 *
 * TimekeepTable
 *
 */

import React, { memo, useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { Grid, Menu, MenuItem, TextField, Typography, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@material-ui/core';
import messages from './messages';
import { injectIntl } from 'react-intl';
import { generateTimekeepingData } from '../../../../../../utils/common';
import TimekeepingTableCell from './TimekeepingTableCell';
import CellEditingModal from '../CellEditingModal';
import _ from 'lodash';
import { Grid as Grids, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { Fab } from 'components/LifetekUi';
import { Archive } from '@material-ui/icons';
import ExportTable from './exportTable';
import { tableToExcel, tableToPDF, tableToExcelCustom } from 'helper';

import {
  SortingState,
  SelectionState,
  PagingState,
  CustomPaging,
  SearchState,
  IntegratedPaging,
  IntegratedSelection,
  IntegratedFiltering,
  IntegratedSorting,
} from '@devexpress/dx-react-grid';
import GridItem from 'components/Grid/ItemGrid';
import { pagingPanel } from '../../actions';
import { AirlineSeatReclineNormalOutlined } from '@material-ui/icons';
import { API_HRM_SHIFT, API_HRM_SYMBOL, API_TIMEKEEPING } from '../../../../../../config/urlConfig';
import { fetchData } from '../../../../../../helper';
/* eslint-disable react/prefer-stateless-function */
const styles = theme => ({
  root: {
    width: '100%',
    overflow: 'auto',
    paddingBottom: 10,
    paddingRight: 5,
    // height: 700
  },
  tablecell: {
    border: '1px solid rgba(224, 224, 224, 1)',
    width: '100px',
    textAlign: 'center',
    padding: '0px 16px',
  },

  tablecellSTT: {
    border: '1px solid rgba(224, 224, 224, 1)',
    width: '100px',
    textAlign: 'center',
    padding: '0px 16px',
  },

  table: {
    minWidth: 600,
  },
  tablecellWeek: {
    border: '1px solid rgba(224, 224, 224, 1)',
    width: '100px',
    textAlign: 'center',
    padding: '0px 16px',
  },
  fixRow: {
    position: 'sticky',
    top: 0,
    border: '1px solid rgba(224, 224, 224, 1)',
    width: '50px',
    textAlign: 'center',
    padding: '1px 16px',
    backgroundColor: '#FFFFFF',
    zIndex: 999,
  },
  fixRowName: {
    position: 'sticky',
    top: 0,
    border: '1px solid rgba(224, 224, 224, 1)',
    width: '200px',
    textAlign: 'center',
    padding: '1px 16px',
    backgroundColor: '#FFFFFF',
    zIndex: 999,
  },
  fixRowWeek: {
    position: 'sticky',
    top: 0,
    border: '1px solid rgba(224, 224, 224, 1)',
    width: '100px',
    textAlign: 'center',
    padding: '1px 16px',
    backgroundColor: '#FFFFFF',
    zIndex: 999,
  },
  fixRowOne: {
    position: 'sticky',
    top: 50,
    border: '1px solid rgba(224, 224, 224, 1)',
    width: '100px',
    textAlign: 'center',
    padding: '1px 16px',
    backgroundColor: '#FFFFFF',
    zIndex: 999,
  },
  fixRowTwo: {
    position: 'sticky',
    top: 100,
    border: '1px solid rgba(224, 224, 224, 1)',
    width: '100px',
    textAlign: 'center',
    padding: '1px 16px',
    backgroundColor: '#FFFFFF',
    zIndex: 999,
  },
  fixRowSTT: {
    position: 'sticky',
    top: 0,
    border: '1px solid rgba(224, 224, 224, 1)',
    width: '100px',
    textAlign: 'center',
    padding: '1px 16px',
    backgroundColor: '#FFFFFF',
    zIndex: 999,
  },
  fixRow2: {
    position: 'sticky',
    top: 54,
    border: '1px solid rgba(224, 224, 224, 1)',
    width: '100%',
    textAlign: 'center',
    padding: '0px 5px',
    backgroundColor: '#FFFFFF',
    zIndex: 999,
  },
  fixColumn: {
    position: 'sticky',
    left: 0,
    border: '1px solid rgba(224, 224, 224, 1)',
    width: '100%',
    textAlign: 'center',
    padding: '0px 16px',
    backgroundColor: '#FFFFFF',
  },
  fixColumnName: {
    position: 'sticky',
    left: 0,
    border: '1px solid rgba(224, 224, 224, 1)',
    width: '200px',
    textAlign: 'center',
    padding: '0px 16px',
    backgroundColor: '#FFFFFF',
  },
  name: {
    width: 150,
    textAlign: 'left',
  },
});

function TimekeepTable(props) {
  const { data, classes, intl, allSymbol, onSaveCellData, updateCellDataSuccess, timekeepTypes, onClose, filterName, onPagingPanel, titleExcel } = props;
  const [rows, setRow] = useState([]);
  const month = moment().get('month');
  const year = moment().get('year');

  const formatDayInWeek = date => {
    const dayInWeek = date.day();
    const dayInMonth = date.date();
    const str = intl.formatMessage(messages[`dayInWeek_${dayInWeek}`] || { id: `dayInWeek_${dayInWeek}`, formatMessage: 'monday' }).toUpperCase();
    return { dayInWeek: str, dayInMonth };
  };
  const [days, setDays] = useState(generateTimekeepingData(month, year).map(item => ({ ...item, ...formatDayInWeek(item.date) })));
  const [openCellEditingModal, setOpenCellEditingModal] = useState(false);
  const [selectedCellData, setSelectedCellData] = useState(null);
  const [exportAnchor, setExportAnchor] = useState(null);
  const [titleExcell, setTitleExcell] = useState(null);


  useEffect(
    () => {
      if (data && data.month && data.year) {
        setDays(generateTimekeepingData(data.month - 1, data.year).map(item => ({ ...item, ...formatDayInWeek(item.date) })));
        setRow(data.data);
      }
    },
    [data],
  );
  useEffect(
    () => {
      if (updateCellDataSuccess === true) {
        setOpenCellEditingModal(false);
      }
    },
    [updateCellDataSuccess],
  );

  const getAll = (timekeepings) => {
    let all = 0;
    timekeepings.forEach(times => {
      if (times.symbol && times.symbol !== 'X') {
        all = all + 1
      } else if (times.symbol && times.symbol === 'X') {
        all = all + 0.5
      }
    })
    return all
  }
  const getDayOff = (timekeepings) => {
    let dayOff = 0;
    timekeepings.forEach(times => {
      if (times.symbol && times.symbol === 'V') dayOff = dayOff + 1
      else if (times.symbol && times.symbol === 'X') dayOff = dayOff + 0.5
      else if (times.symbol && times.symbol === 'NP') dayOff = dayOff + 1
      else if (times.symbol && times.symbol === 'P') dayOff = dayOff + 1
    })
    return dayOff
  }
  const getDayOn = (timekeepings) => {
    let dayOn = 0;
    timekeepings.forEach(times => {
      if (times.symbol && times.symbol === 'X') dayOn = dayOn + 0.5
      else if (times.symbol && times.symbol === 'XX') dayOn = dayOn + 1
      else if (times.symbol && times.symbol === 'CNL') dayOn = dayOn + 1
    })
    return dayOn
  }
  const fillTimekeepingTypeCount = (timekeepings, symbols, timekeepingTypes) => {
    const initSymbolCount = {};
    const symbol2type = {};
    console.log('symbols', symbols);
    symbols.forEach(s => {
      initSymbolCount[s.symbol] = 0;
      const initSymbol2Type = {};
      s.data.forEach(m => {
        if (!m) return;
        initSymbol2Type[m.hrmTimekeepingTypeCode] = parseInt(m.value, 10) || 0;
      });
      symbol2type[s.symbol] = initSymbol2Type;
    });

    const timekeepingTypeCountObj = {};
    timekeepingTypes.forEach(t => {
      timekeepingTypeCountObj[t.code] = 0;
    });
    const symbolCountObj = _.reduce(
      timekeepings,
      (result, item) => {
        // console.log('result', result, ', item', item)
        const newResults = {};
        Object.keys(result).forEach(symbol => {
          if (item.symbol === symbol) {
            newResults[symbol] += 1;
            Object.keys(symbol2type[symbol]).forEach(timekeepingCode => {
              timekeepingTypeCountObj[timekeepingCode] += symbol2type[symbol][timekeepingCode];
            });
          } else {
            newResults[symbol] = result[symbol];
          }
        });
        return newResults;
      },
      { ...initSymbolCount },
    );
    return timekeepingTypeCountObj;
  };

  const handleChange = (newSymbol, day, row) => {
    if (row && row._id) {
      const newRows = [...rows];
      const foundRow = newRows.find(item => item._id === row._id);
      if (foundRow && day && day._id) {
        const foundDay = foundRow.timekeepingData.find(item => item._id === day._id);
        foundDay.symbol = newSymbol;
        foundDay.shifts = day.shifts;
        setRow(newRows);
      }
    }
  };

  const handleSaveCellData = async newData => {
    handleChange(newData.day.symbol, newData.day, newData.row);
    try {
      const ca_lam_viec = await fetchData(API_HRM_SHIFT);
      const ky_hieu_cham_cong = await fetchData(API_HRM_SYMBOL);
      const dayInfo = newData.day.shifts;
      if (Array.isArray(dayInfo.data)) {
      } else {
      }
    } catch (e) {
      console.log(e);
    }
    if (onSaveCellData) {
      setOpenCellEditingModal(false);
      // onClose()
      onSaveCellData(newData);
    }
  };

  const handleCellClick = (e, day, row) => {
    setSelectedCellData({
      day,
      row,
    });
    if (day.symbol === 'NP') {
      setOpenCellEditingModal(false);
    } else {
      setOpenCellEditingModal(true);
    }
  };

  const handleCloseCellEditingModal = () => {
    setOpenCellEditingModal(false);
  };

  const [tabWeek, setTabWeek] = useState({
    one: false,
    two: false,
    three: false,
    four: false,
    five: false,
  });

  useEffect(
    () => {
      setTimeout(() => {
        for (let i = 0; i < weekOne().length; i++) {
          if (
            parseInt(weekOne()[i].date.format('YYYY')) === parseInt(moment().format('YYYY')) &&
            parseInt(weekOne()[i].date.format('MM')) === parseInt(moment().format('MM')) &&
            parseInt(weekOne()[i].date.format('DD')) === parseInt(moment().format('DD'))
          ) {
            setTabWeek({ ...tabWeek, one: true });
            break;
          } else {
            setTabWeek({ ...tabWeek, one: false });
          }
        }
        for (let i = 0; i < weekTwo().length; i++) {
          if (
            parseInt(weekTwo()[i].date.format('YYYY')) === parseInt(moment().format('YYYY')) &&
            parseInt(weekTwo()[i].date.format('MM')) === parseInt(moment().format('MM')) &&
            parseInt(weekTwo()[i].date.format('DD')) === parseInt(moment().format('DD'))
          ) {
            setTabWeek({ ...tabWeek, two: true });

            break;
          } else {
            setTabWeek({ ...tabWeek, two: false });
          }
        }
        for (let i = 0; i < weekThree().length; i++) {
          if (
            parseInt(weekThree()[i].date.format('YYYY')) === parseInt(moment().format('YYYY')) &&
            parseInt(weekThree()[i].date.format('MM')) === parseInt(moment().format('MM')) &&
            parseInt(weekThree()[i].date.format('DD')) === parseInt(moment().format('DD'))
          ) {
            setTabWeek({ ...tabWeek, three: true });
            break;
          } else {
            setTabWeek({ ...tabWeek, three: false });
          }
        }
        for (let i = 0; i < weekFour().length; i++) {
          if (
            parseInt(weekFour()[i].date.format('YYYY')) === parseInt(moment().format('YYYY')) &&
            parseInt(weekFour()[i].date.format('MM')) === parseInt(moment().format('MM')) &&
            parseInt(weekFour()[i].date.format('DD')) === parseInt(moment().format('DD'))
          ) {
            setTabWeek({ ...tabWeek, four: true });
            break;
          } else {
            setTabWeek({ ...tabWeek, four: false });
          }
        }
        for (let i = 0; i < weekFive().length; i++) {
          if (
            parseInt(weekFive()[i].date.format('YYYY')) === parseInt(moment().format('YYYY')) &&
            parseInt(weekFive()[i].date.format('MM')) === parseInt(moment().format('MM')) &&
            parseInt(weekFive()[i].date.format('DD')) === parseInt(moment().format('DD'))
          ) {
            setTabWeek({ ...tabWeek, five: true });
            break;
          } else {
            setTabWeek({ ...tabWeek, five: false });
          }
        }
      }, 0);
    },
    [days],
  );

  const weekOne = () => {
    const stday = days[0].date;
    const edday = stday.clone().weekday(6);
    const count = edday.diff(stday, 'days');
    let data = [];
    for (let i = 0; i <= count; i++) {
      data.push(days[i]);
    }
    return data;
  };

  const weekTwo = () => {
    const stday = days[0].date;
    const edday = stday.clone().weekday(6);
    let data = [];
    for (let i = parseInt(edday.format('DD')); i <= parseInt(edday.format('DD')) + 6; i++) {
      data.push(days[i]);
    }
    return data;
  };

  const weekThree = () => {
    const stday = days[0].date;
    const edday = stday.clone().weekday(6);
    let data = [];
    for (let i = parseInt(edday.format('DD')) + 7; i <= parseInt(edday.format('DD')) + 13; i++) {
      data.push(days[i]);
    }
    return data;
  };

  const weekFour = () => {
    const stday = days[0].date;
    const edday = stday.clone().weekday(6);
    let data = [];
    for (let i = parseInt(edday.format('DD')) + 14; i <= parseInt(edday.format('DD')) + 20; i++) {
      data.push(days[i]);
    }
    return data;
  };

  const weekFive = () => {
    const stday = days[0].date;
    const edday = stday.clone().weekday(6);
    let data = [];
    for (let i = parseInt(edday.format('DD')) + 21; i < days.length; i++) {
      data.push(days[i]);
    }
    return data;
  };

  const dataOne = data => {
    let dataTimeKeeping = [];
    const stday = days[0].date;
    const edday = stday.clone().weekday(6);
    const count = edday.diff(stday, 'days');
    for (let i = 0; i <= count; i++) {
      dataTimeKeeping.push(data[i]);
    }
    return dataTimeKeeping;
  };

  const dataTwo = data => {
    const stday = days[0].date;
    const edday = stday.clone().weekday(6);
    let dataTimeKeeping = [];
    for (let i = parseInt(edday.format('DD')); i <= parseInt(edday.format('DD')) + 6; i++) {
      dataTimeKeeping.push(data[i]);
    }
    return dataTimeKeeping;
  };

  const dataThree = data => {
    const stday = days[0].date;
    const edday = stday.clone().weekday(6);
    let dataTimeKeeping = [];
    for (let i = parseInt(edday.format('DD')) + 7; i <= parseInt(edday.format('DD')) + 13; i++) {
      dataTimeKeeping.push(data[i]);
    }
    return dataTimeKeeping;
  };

  const dataFour = data => {
    const stday = days[0].date;
    const edday = stday.clone().weekday(6);
    let dataTimeKeeping = [];
    for (let i = parseInt(edday.format('DD')) + 14; i <= parseInt(edday.format('DD')) + 20; i++) {
      dataTimeKeeping.push(data[i]);
    }
    return dataTimeKeeping;
  };

  const dataFive = data => {
    const stday = days[0].date;
    const edday = stday.clone().weekday(6);
    let dataTimeKeeping = [];
    for (let i = parseInt(edday.format('DD')) + 21; i < days.length; i++) {
      dataTimeKeeping.push(data[i]);
    }
    return dataTimeKeeping;
  };

  const [pageSizes] = React.useState([5, 10, 15]);
  const [pageSize, setPageSize] = useState(10);
  const [columns] = React.useState([{ stt: 'STT', name: 'Tên' }]);
  const [currentPage, setCurrentPage] = useState(0);

  const changeCurrentPage = value => {
    onPagingPanel({ limit: pageSize, page: value, tableId: data ? data._id : null, organizationId: data ? data.organizationUnitId._id : null });
    setCurrentPage(value);
  };

  const changePageSize = value => {
    onPagingPanel({ limit: value, page: 1, tableId: data ? data._id : null, organizationId: data ? data.organizationUnitId._id : null });
    setPageSize(value);
    setCurrentPage(0);
  };
  const onExportExcel = e => {
    e.preventDefault();
    setOpenExcel('Excel');
  };
  const handleCloseExcel = () => {
    const type = openExcel;
    setOpenExcel(null);
    const rowss = data && data.data
    const mont = parseInt(rowss && rowss.length > 0 && rowss[0] && rowss[0].month) + 1
    const yea = parseInt(rowss && rowss.length > 0 && rowss[0] && rowss[0].year)
    let title = "CHI TIẾT BẢNG CÔNG THÁNG " + mont.toString() + " NĂM " + yea.toString();
    switch (type) {
      case 'PDF':
        const { totalPage = 1, pageNumber = 1 } = {};
        const content = tableToPDF('excelTableBosReport1', listPageRows[0].month + 1, 'PDF', title);
        setHtml(e => [...e, { content, pageNumber }]);
        setHtmlTotal(totalPage);
        break;
      default:
        tableToExcelCustom('excelTableBosReport1', 'W3C Example Table', undefined, undefined, title);
    }
  };
  useEffect(() => {
    const rowss = data && data.data
    const mont = parseInt(rowss && rowss.length > 0 && rowss[0] && rowss[0].month) + parseInt(1)
    const yea = parseInt(rowss && rowss.length > 0 && rowss[0] && rowss[0].year)
    let title = "CHI TIẾT BẢNG CÔNG THÁNG " + mont.toString() + " NĂM " + yea.toString();
    console.log("title: ", title)
    if (isNaN(mont) === false && isNaN(yea) === false)
      setTitleExcell(title)
    else setTitleExcell("CHI TIẾT BẢNG CÔNG")
  }, [data])
  useEffect(() => {
    const rowss = data && data.data
    // rows
    let dat = []
    // rowss && rowss.length > 0 && rows.map((row, index) => {
    //   let das = {}
    //   let da = []
    //   da.push({ symbol: index + 1 })
    //   da.push({ symbol: row.hrmEmployeeId.name })
    //   row.timekeepingData && row.timekeepingData.map((el) => {
    //     da.push({ symbol: el.symbol })
    //   })
    //   timekeepTypes && timekeepTypes.length > 0 && timekeepTypes.map((elt) => {
    //     let val = fillTimekeepingTypeCount(row.timekeepingData, allSymbol, timekeepTypes)[elt.code]
    //     da.push({ symbol: val })
    //   })
    //   da.push({ symbol: getAll(row.timekeepingData) })
    //   da.push({ symbol: getDayOff(row.timekeepingData) })
    //   da.push({ symbol: getDayOn(row.timekeepingData) })
    //   dat.push(da)

    // })
    // console.log("ddddđ: ", dat)
    // colum
    const col = [{ type: "Number", title: "STT", width: 80 }, { type: "String", title: "Tên", code: 4 }]
    rowss && rowss.length > 0 && rowss[0].timekeepingData && rowss[0].timekeepingData.map((el, index) => {
      col.push({ type: "String", title: (index + 1).toString(), width: 80 })
    })
    timekeepTypes && timekeepTypes.length > 0 && timekeepTypes.map((elt) => {
      col.push({ type: "Number", title: elt.name, })
    })
    col.push({ type: "Number", title: "Tổng cộng" })
    col.push({ type: "Number", title: "Ngày nghỉ" })
    col.push({ type: "Number", title: "Ngày đi" })

    setColumns(col)
    // setListPageRows(dat)
  }, [rows])
  useEffect(() => {
    const { organizationUnitId, tableId } = props
    let dataExcel
    let dat = []

    if (organizationUnitId && tableId)
      fetchData(`${API_TIMEKEEPING}/${tableId}?organizationId=${organizationUnitId}`).then((res) => {
        if (res.status === 1) {
          res.data && res.data.data && res.data && res.data.data.length > 0 && res.data && res.data.data.map((row, index) => {
            let da = []
            da.push({ symbol: index + 1 })
            da.push({ symbol: row.hrmEmployeeId.name })
            row.timekeepingData && row.timekeepingData.map((el) => {
              da.push({ symbol: el.symbol })
            })
            timekeepTypes && timekeepTypes.length > 0 && timekeepTypes.map((elt) => {
              let val = fillTimekeepingTypeCount(row.timekeepingData, allSymbol, timekeepTypes)[elt.code]
              da.push({ symbol: val })
            })
            da.push({ symbol: getAll(row.timekeepingData) })
            da.push({ symbol: getDayOff(row.timekeepingData) })
            da.push({ symbol: getDayOn(row.timekeepingData) })
            dat.push(da)
          })
          setListPageRows(dat)
          setDisabledMenuItem(false)
        }
      })

  }, [])
  const [listPageRows, setListPageRows] = useState([]);
  const [columnss, setColumns] = useState([]);
  const [openExcel, setOpenExcel] = useState(null);
  const [dataExcel, setDataExcel] = useState([]);
  const [disabledMenuItem, setDisabledMenuItem] = useState(true);



  return (
    <>
      <Grid item xs={12} style={{ marginTop: "-35px" }}  >
        <Fab onClick={e => setExportAnchor(e.currentTarget)} disabled={disabledMenuItem}>
          <Tooltip title="Xuất dữ liệu">
            <Archive style={{ color: 'white' }} />
          </Tooltip>
        </Fab>
      </Grid>
      <Grid className={classes.root} style={{ height: 'calc(100vh - 250px)' }}>
        {/* xuất excel */}

        <Menu keepMounted open={Boolean(exportAnchor)} onClose={() => setExportAnchor(null)} anchorEl={exportAnchor} >
          <MenuItem onClick={e => onExportExcel(e)} >Xuất Excel</MenuItem>
        </Menu>
        <ExportTable exportType={openExcel} open={openExcel} onClose={handleCloseExcel}
          row={listPageRows}
          col={columnss}
          department={props.department}
          employee={props.employee}
          currentPage={currentPage}
          pageSize={data ? Math.ceil(data.count / pageSize) : 1}
          titleExcel={titleExcell} />
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.fixRowSTT} rowSpan={3}>
                STT
              </TableCell>
              <TableCell className={classes.fixRowName} rowSpan={3}>
                Tên
              </TableCell>
              {tabWeek.one && (
                <TableCell
                  style={{ cursor: 'pointer' }}
                  className={classes.fixRow}
                  colSpan={weekOne().length}
                  onClick={() => setTabWeek({ ...tabWeek, one: false })}
                >
                  Tuần 1
                </TableCell>
              )}
              {!tabWeek.one && (
                <TableCell
                  style={{ cursor: 'pointer' }}
                  className={classes.fixRowWeek}
                  rowSpan={3}
                  onClick={() => setTabWeek({ ...tabWeek, one: true })}
                >
                  Tuần 1
                </TableCell>
              )}
              {tabWeek.two && (
                <TableCell
                  style={{ cursor: 'pointer' }}
                  className={classes.fixRow}
                  colSpan={weekTwo().length}
                  onClick={() => setTabWeek({ ...tabWeek, two: false })}
                >
                  Tuần 2
                </TableCell>
              )}
              {!tabWeek.two && (
                <TableCell
                  style={{ cursor: 'pointer' }}
                  className={classes.fixRowWeek}
                  rowSpan={3}
                  onClick={() => setTabWeek({ ...tabWeek, two: true })}
                >
                  Tuần 2
                </TableCell>
              )}
              {tabWeek.three && (
                <TableCell
                  style={{ cursor: 'pointer' }}
                  className={classes.fixRow}
                  colSpan={weekThree().length}
                  onClick={() => setTabWeek({ ...tabWeek, three: false })}
                >
                  Tuần 3
                </TableCell>
              )}
              {!tabWeek.three && (
                <TableCell
                  style={{ cursor: 'pointer' }}
                  className={classes.fixRowWeek}
                  rowSpan={3}
                  onClick={() => setTabWeek({ ...tabWeek, three: true })}
                >
                  Tuần 3
                </TableCell>
              )}
              {tabWeek.four && (
                <TableCell
                  style={{ cursor: 'pointer' }}
                  className={classes.fixRow}
                  colSpan={weekFour().length}
                  onClick={() => setTabWeek({ ...tabWeek, four: false })}
                >
                  Tuần 4
                </TableCell>
              )}
              {!tabWeek.four && (
                <TableCell
                  style={{ cursor: 'pointer' }}
                  className={classes.fixRowWeek}
                  rowSpan={3}
                  onClick={() => setTabWeek({ ...tabWeek, four: true })}
                >
                  Tuần 4
                </TableCell>
              )}
              {tabWeek.five && (
                <TableCell
                  style={{ cursor: 'pointer' }}
                  className={classes.fixRow}
                  colSpan={weekFive().length}
                  onClick={() => setTabWeek({ ...tabWeek, five: false })}
                >
                  Tuần 5
                </TableCell>
              )}
              {!tabWeek.five && (
                <TableCell
                  style={{ cursor: 'pointer' }}
                  className={classes.fixRowWeek}
                  rowSpan={3}
                  onClick={() => setTabWeek({ ...tabWeek, five: true })}
                >
                  Tuần 5
                </TableCell>
              )}
              {timekeepTypes.map(item => (
                <TableCell className={classes.fixRow} rowSpan={3}>
                  {item.name}
                </TableCell>
              ))}
              <TableCell className={classes.fixRow} rowSpan={3}>
                Tổng cộng
              </TableCell>
              <TableCell className={classes.fixRow} rowSpan={3}>
                Ngày nghỉ
              </TableCell>
              <TableCell className={classes.fixRow} rowSpan={3}>
                Ngày đi
              </TableCell>
            </TableRow>
            <TableRow>
              {tabWeek.one &&
                weekOne().map(day => (
                  <TableCell style={{ cursor: 'pointer' }} className={classes.fixRowOne} onClick={() => setTabWeek({ ...tabWeek, one: false })}>
                    {day.dayInMonth}
                  </TableCell>
                ))}
              {tabWeek.two &&
                weekTwo().map(day => (
                  <TableCell style={{ cursor: 'pointer' }} className={classes.fixRowOne} onClick={() => setTabWeek({ ...tabWeek, two: false })}>
                    {day.dayInMonth}
                  </TableCell>
                ))}
              {tabWeek.three &&
                weekThree().map(day => (
                  <TableCell style={{ cursor: 'pointer' }} className={classes.fixRowOne} onClick={() => setTabWeek({ ...tabWeek, three: false })}>
                    {day.dayInMonth}
                  </TableCell>
                ))}
              {tabWeek.four &&
                weekFour().map(day => (
                  <TableCell style={{ cursor: 'pointer' }} className={classes.fixRowOne} onClick={() => setTabWeek({ ...tabWeek, four: false })}>
                    {day.dayInMonth}
                  </TableCell>
                ))}
              {tabWeek.five &&
                weekFive().map(day => (
                  <TableCell style={{ cursor: 'pointer' }} className={classes.fixRowOne} onClick={() => setTabWeek({ ...tabWeek, five: false })}>
                    {day.dayInMonth}
                  </TableCell>
                ))}

              {/* {days.map(day => (
                <TableCell   className={classes.fixRow}>{day.dayInMonth}</TableCell>
              ))} */}
            </TableRow>
            <TableRow>
              {tabWeek.one &&
                weekOne().map(day => (
                  <TableCell style={{ cursor: 'pointer' }} className={classes.fixRowTwo} onClick={() => setTabWeek({ ...tabWeek, one: false })}>
                    {day.dayInWeek}
                  </TableCell>
                ))}
              {tabWeek.two &&
                weekTwo().map(day => (
                  <TableCell style={{ cursor: 'pointer' }} className={classes.fixRowTwo} onClick={() => setTabWeek({ ...tabWeek, two: false })}>
                    {day.dayInWeek}
                  </TableCell>
                ))}
              {tabWeek.three &&
                weekThree().map(day => (
                  <TableCell style={{ cursor: 'pointer' }} className={classes.fixRowTwo} onClick={() => setTabWeek({ ...tabWeek, three: false })}>
                    {day.dayInWeek}
                  </TableCell>
                ))}
              {tabWeek.four &&
                weekFour().map(day => (
                  <TableCell style={{ cursor: 'pointer' }} className={classes.fixRowTwo} onClick={() => setTabWeek({ ...tabWeek, four: false })}>
                    {day.dayInWeek}
                  </TableCell>
                ))}
              {tabWeek.five &&
                weekFive().map(day => (
                  <TableCell style={{ cursor: 'pointer' }} className={classes.fixRowTwo} onClick={() => setTabWeek({ ...tabWeek, five: false })}>
                    {day.dayInWeek}
                  </TableCell>
                ))}
              {/* {days.map(day => (
                <TableCell className={classes.fixRow2}>{day.dayInWeek}</TableCell>
              ))} */}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.filter(roww => roww.hrmEmployeeId && roww.hrmEmployeeId.name.toUpperCase().includes(filterName.toUpperCase())).map((row, index) => (
              <TableRow key={index + 1}>
                <TableCell className={classes.tablecellSTT}>{currentPage * pageSize + index + 1}</TableCell>
                <TableCell className={classes.fixColumnName}>
                  <Typography className={classes.name}>{row.hrmEmployeeId ? row.hrmEmployeeId.name : 'Không có dữ liệu'}</Typography>
                </TableCell>
                {tabWeek.one &&
                  dataOne(row.timekeepingData).map(day => (
                    <TimekeepingTableCell
                      Padding="none"
                      symbols={allSymbol}
                      onSymbolChange={handleChange}
                      onCellClick={handleCellClick}
                      day={day}
                      row={row}
                    />
                  ))}
                {!tabWeek.one && <TableCell className={classes.tablecellWeek} />}
                {tabWeek.two &&
                  dataTwo(row.timekeepingData).map(day => (
                    <TimekeepingTableCell
                      Padding="none"
                      symbols={allSymbol}
                      onSymbolChange={handleChange}
                      onCellClick={handleCellClick}
                      day={day}
                      row={row}
                    />
                  ))}
                {!tabWeek.two && <TableCell className={classes.tablecellWeek} />}
                {tabWeek.three &&
                  dataThree(row.timekeepingData).map(day => (
                    <TimekeepingTableCell
                      Padding="none"
                      symbols={allSymbol}
                      onSymbolChange={handleChange}
                      onCellClick={handleCellClick}
                      day={day}
                      row={row}
                    />
                  ))}
                {!tabWeek.three && <TableCell className={classes.tablecellWeek} />}

                {tabWeek.four &&
                  dataFour(row.timekeepingData).map(day => (
                    <TimekeepingTableCell
                      Padding="none"
                      symbols={allSymbol}
                      onSymbolChange={handleChange}
                      onCellClick={handleCellClick}
                      day={day}
                      row={row}
                    />
                  ))}
                {!tabWeek.four && <TableCell className={classes.tablecellWeek} />}

                {tabWeek.five &&
                  dataFive(row.timekeepingData).map(day => (
                    <TimekeepingTableCell
                      Padding="none"
                      symbols={allSymbol}
                      onSymbolChange={handleChange}
                      onCellClick={handleCellClick}
                      day={day}
                      row={row}
                    />
                  ))}
                {!tabWeek.five && <TableCell className={classes.tablecellWeek} />}

                {/* {row.timekeepingData.map(day => (
                  <TimekeepingTableCell
                    Padding="none"
                    symbols={allSymbol}
                    onSymbolChange={handleChange}
                    onCellClick={handleCellClick}
                    day={day}
                    row={row}
                  />
                ))} */}
                {timekeepTypes.map(item => (
                  <TableCell className={classes.tablecell}>
                    {fillTimekeepingTypeCount(row.timekeepingData, allSymbol, timekeepTypes)[item.code]}
                  </TableCell>
                ))}
                <TableCell className={classes.tablecell} >{getAll(row.timekeepingData)}</TableCell>
                <TableCell className={classes.tablecell} >{getDayOff(row.timekeepingData)}</TableCell>
                <TableCell className={classes.tablecell} >{getDayOn(row.timekeepingData)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
      <GridItem md={12} css={{ flexDirection: 'none', height: 10 }}>
        <Grids rows={rows} columns={columns}>
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={value => changeCurrentPage(value)}
            pageSize={pageSize}
            onPageSizeChange={value => changePageSize(value)}
          />
          <CustomPaging totalCount={data ? data.count : 5} />
          <PagingPanel messages={{ rowsPerPage: 'Số dòng hiển thị' }} pageSizes={pageSizes} />
        </Grids>
      </GridItem>
      <CellEditingModal
        symbols={allSymbol}
        open={openCellEditingModal}
        cellData={selectedCellData}
        onSave={handleSaveCellData}
        onClose={handleCloseCellEditingModal}
      />
    </>
  );
}

TimekeepTable.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({});

function mapDispatchToProps(dispatch) {
  return {
    onPagingPanel: data => dispatch(pagingPanel(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default compose(
  injectIntl,
  withConnect,
  withStyles(styles),
  memo,
)(TimekeepTable);

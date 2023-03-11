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
import './TimekeepTable.css';
//  import { generateTimekeepingData } from '../../../../../../utils/common';
import { generateTimekeepingData } from '../../utils/common';
//  import TimekeepingTableCell from './TimekeepingTableCell';
//  import CellEditingModal from '../CellEditingModal';
import _ from 'lodash';
import { API_HRM_TIMEKEEPPTABLE } from '../../config/urlConfig';
import { makeSelectProfile } from '../../containers/Dashboard/selectors';
import { Grid as Grids, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { Fab } from 'components/LifetekUi';
import { Archive } from '@material-ui/icons';
//  import ExportTable from './exportTable';
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
//  import { pagingPanel } from '../../actions';
import { AirlineSeatReclineNormalOutlined } from '@material-ui/icons';
//  import { API_HRM_SHIFT, API_HRM_SYMBOL, API_TIMEKEEPING } from '../../../../../../config/urlConfig';
//  import { fetchData } from '../../../../../../helper';
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
        width: '15%',
        textAlign: 'center',
        // padding: '0px 16px',
    },
    tablecellSTT: {
        border: '1px solid rgba(224, 224, 224, 1)',
        width: '15%',
        textAlign: 'center',
        padding: '0px 16px',
    },

    table: {
        minWidth: 600,
    },
});

function TimekeepTable(props) {
    const { profile } = props;
    // console.log(profile._id,'profileprofile');
    const dayOfWeeks = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const today = moment();
    const [dayOfMonths, setDayOfMonths] = useState([]);
    const [dataDates, setDataDates] = useState([]);
    const [dataDate, setData] = useState({
            month: 3,
            year: 2022,
            timekeepingData: [
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 1,
                    color: 'rgb(255, 255, 102)',
                    symbol: "X"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 2,
                    color: 'rgb(255, 204, 0)',
                    symbol: "P"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 3,
                    color: 'rgb(255, 255, 255)',
                    symbol: "V"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 4,
                    color: 'rgb(255, 255, 255)',
                    symbol: "XX"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 5,
                    color: 'rgb(255, 255, 102)',
                    symbol: "X"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 6,
                    color: 'rgb(255, 204, 0)',
                    symbol: "P"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 7,
                    color: 'rgb(255, 255, 255)',
                    symbol: "V"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 8,
                    color: 'rgb(255, 255, 255)',
                    symbol: "XX"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 9,
                    color: 'rgb(255, 255, 102)',
                    symbol: "X"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 10,
                    color: 'rgb(255, 204, 0)',
                    symbol: "P"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 11,
                    color: 'rgb(255, 255, 255)',
                    symbol: "V"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 12,
                    color: 'rgb(255, 255, 255)',
                    symbol: "XX"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 13,
                    color: 'rgb(255, 255, 102)',
                    symbol: "X"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 14,
                    color: 'rgb(255, 204, 0)',
                    symbol: "P"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 15,
                    color: 'rgb(255, 255, 255)',
                    symbol: "V"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 16,
                    color: 'rgb(255, 255, 255)',
                    symbol: "XX"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 17,
                    color: 'rgb(255, 255, 102)',
                    symbol: "X"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 18,
                    color: 'rgb(255, 204, 0)',
                    symbol: "P"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 19,
                    color: 'rgb(255, 255, 255)',
                    symbol: "V"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 20,
                    color: 'rgb(255, 255, 255)',
                    symbol: "XX"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 21,
                    color: 'rgb(255, 255, 102)',
                    symbol: "X"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 22,
                    color: 'rgb(255, 204, 0)',
                    symbol: "P"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 23,
                    color: 'rgb(255, 255, 255)',
                    symbol: "V"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 24,
                    color: 'rgb(255, 255, 255)',
                    symbol: "XX"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 25,
                    color: 'rgb(255, 255, 102)',
                    symbol: "X"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 26,
                    color: 'rgb(255, 204, 0)',
                    symbol: "P"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 27,
                    color: 'rgb(255, 255, 255)',
                    symbol: "V"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 28,
                    color: 'rgb(255, 255, 255)',
                    symbol: "XX"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 29,
                    color: 'rgb(255, 255, 102)',
                    symbol: "X"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 30,
                    color: 'rgb(255, 204, 0)',
                    symbol: "P"
                },
                {
                    shifts: {
                        data: false,
                        OTTime: {
                            endTime: null,
                            startTime: null
                        },
                        name: null
                    },
                    verified: false,
                    faceTk: [],
                    fingerTk: [],
                    equipData: [],
                    _id: "62675dba7446531a774875e9",
                    date: 31,
                    color: 'rgb(255, 255, 255)',
                    symbol: "V"
                }
            ],
            createdAt: "2022-04-26T02:49:30.828Z",
            updatedAt: "2022-05-25T22:00:25.855Z",
            __v: 0          
    })

    useEffect(() => {
        let currentMonth = new Date().getMonth();
        let currentYear = new Date().getFullYear();
        fetch(`${API_HRM_TIMEKEEPPTABLE}/${profile._id}?month=${currentMonth+1}&year=${currentYear}`, {
        // fetch(`${API_HRM_TIMEKEEPPTABLE}/61a743680710c12baefb76d6?month=1&year=2022`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
            .then(response => response.json())
            .then(data => {
                // console.log(data,'datadata');
                if(data && data.data && data.data[0].timekeepingData && Array(data.data[0].timekeepingData) && data.data[0].timekeepingData.length)
                {
                    var newData = [];
                    var listData = [];
                    var vacuityDate = new Date(data.data[0].year, data.data[0].month, 0).getDay();
                    for (let x = 0; x < vacuityDate; x++) {
                        newData.push('')
                    }
                    for (var c = 0; c < data.data[0].timekeepingData.length; c++) {
                        data.data[0].timekeepingData[c]={...data.data[0].timekeepingData[c], index: c+1}
                    }
                    for (var c = 0; c < data.data[0].timekeepingData.length; c++) {
                        newData.push(data.data[0].timekeepingData[c]);
                    }
                    // console.log(newData,'newData2');
                    for (var c = 0; c < newData.length; c += 7) {
                        var news = newData.slice(c, c+7);
                        listData.push(news);
                    }
                    setDataDates(listData)
                    // console.log(listData,'listData');
                }
                else{}
                // if(data.data === null) {
                //     let newData = [];
                //     let listData = [];
                //     var date = new Date();
                //     let startDay = today.clone().startOf('month');
                //     let endDay = today.endOf('month');
                //     let count = endDay.diff(startDay, "days")
                //     let currentMonth = new Date().getMonth();
                //     let currentYear = new Date().getFullYear();
                //     var date = new Date(currentYear, currentMonth, 0).getDay();
                //     // console.log(date,'datedate');
                //     for (let x = 0; x < date; x++) {
                //         newData.push('')
                //     }
                //     for (let i = 1; i <= count + 1; i++) {
                //         newData.push(i)
                //     }
                //     for (var c = 0; c < newData.length; c += 7) {
                //         var news = newData.slice(c, c+7);
                //         listData.push(news);
                //     }
                //     setDayOfMonths(listData)
                //     console.log(listData,'listData');
                // }
            })
            .catch((error) => {
                console.log(error,'errorerror');
            });
    }, [])
    // console.log(dataDates,'dataDatesdataDates');
    var newData = [];
    var listData = [];
    // var date = new Date();
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    var date = new Date(currentYear, currentMonth, 0).getDay();
    // var current_day = date.getDay();
        for (let x = 0; x < date; x++) {
            newData.push('')
        }
        for (var c = 0; c < dataDate.timekeepingData.length; c++) {
            newData.push(dataDate.timekeepingData[c]);
        }
    for (var c = 0; c < newData.length; c += 7) {
        var news = newData.slice(c, c+7);
        listData.push(news);
    }
    // console.log(dataDates,'dataDatesdataDates');
    // console.log(dayOfMonths,'dayOfMonthsdayOfMonthsdayOfMonths');
    const classes = styles();
    return (
        <>
        <table className='tableCustom'>
            <tr>
                {dayOfWeeks.map( i => (
                <td className='tdCustomDate text'>
                    {i}
                </td>
                ))}
            </tr>
            {Array(dataDates) && dataDates.length?
                dataDates.map((i) => (
                    <tr>
                    {i.map((x,index) => (
                        <td className='tdCustom'
                            style={{
                                cursor: 'pointer',
                                backgroundColor: `${x.symbol === 'XX'?'white':
                                x.symbol === 'XX15'?'white':
                                x.symbol === 'V'?'white':
                                x.symbol === 'CNL'?'white':
                                x.symbol === 'OO'?'white':
                                x.symbol === 'X'?'rgb(255, 255, 102)':
                                x.symbol === 'P'?'rgb(255, 204, 0)':
                                x.symbol === ''||x.symbol === null||x.symbol === undefined?'white':'white'}`
                        }}>
                            <p style={{  color: 'rgb(0, 0, 0)', fontSize: 16, fontWeight: 500, position: 'absolute', top: 5, left: 5 }}>{x !== ''?x.index:''}</p>
                            <p style={{  color: 'rgb(0, 0, 0)', fontSize: 12, fontWeight: 500 ,textAlign: 'center' }}>{x.symbol !== ''||x.symbol !== null||x.symbol !== undefined?x.symbol:''}</p>
                        </td>
                    ))}
                    </tr>
                ))
                : dayOfMonths.map((i) => (
                    <tr>
                    {i.map((x,index) => (
                        <td className='tdCustom'
                            style={{
                                cursor: 'pointer',
                                backgroundColor: `${x.symbol === 'XX'?'white':
                                x.symbol === 'XX15'?'white':
                                x.symbol === 'V'?'white':
                                x.symbol === 'CNL'?'white':
                                x.symbol === 'OO'?'white':
                                x.symbol === 'X'?'rgb(255, 255, 102)':
                                x.symbol === 'P'?'rgb(255, 204, 0)':
                                x.symbol === ''||x.symbol === null||x.symbol === undefined?'white':'white'}`
                        }}>
                            <p style={{  color: 'rgb(0, 0, 0)', fontSize: 16, fontWeight: 500, position: 'absolute', top: 5, left: 5 }}>{x !== ''?x:''}</p>
                            <p style={{  color: 'rgb(0, 0, 0)', fontSize: 12, fontWeight: 500 ,textAlign: 'center' }}>{x.symbol !== ''||x.symbol !== null||x.symbol !== undefined?x.symbol:''}</p>
                        </td>
                    ))}
                    </tr>
                ))
            }
        </table>
        {/* <ul class="weekdays">
        {dayOfWeeks.map( i => (
            <li>
                {i}
            </li>
        ))}
        </ul>
        <ul class="days">
        {newData.map(x => (
            <li style={{ cursor: 'pointer', backgroundColor: `${x.color}` }}>
                <p style={{  color: 'rgb(0, 0, 0)', fontSize: 12, fontWeight: 500 }}>{x.date}</p>
                <p style={{  color: 'rgb(0, 0, 0)', fontSize: 16, fontWeight: 500 ,textAlign: 'center' }}>{x.symbol}</p>
            </li>
        ))}
            <li><span class="active">10</span></li>
        </ul> */}
        {/* <Grid className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {dayOfWeeks.map( i => (
                    // <TableCell style={{ cursor: 'pointer' }}>
                    <TableCell>
                        {i}
                    </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody> */}
            {/* {newDayOfMonths.map( (i) => (
                 <TableRow>
                {i.map(x => (
                    <TableCell className={classes.tablecell} style={{ cursor: 'pointer' }}>
                        {x}
                    </TableCell>
                ))}
                </TableRow>
            ))} */}
            {/* {newData.map((i) => (
                <TableRow>
                {i.map(x => (
                    <TableCell className={classes.tablecell} style={{ cursor: 'pointer', backgroundColor: `${x.color}` }}>
                        <p style={{  color: 'rgb(0, 0, 0)', fontSize: 12, fontWeight: 500 }}>{x.date}</p>
                        <p style={{  color: 'rgb(0, 0, 0)', fontSize: 16, fontWeight: 500 ,textAlign: 'center' }}>{x.symbol}</p>
                    </TableCell>
                ))}
                </TableRow>
            ))} */}
            
            {/* <TableRow>
                <TableCell className={classes.fixRow} rowSpan={3}>
                Tổng cộng
              </TableCell>
              <TableCell className={classes.fixRow} rowSpan={3}>
                Ngày nghỉ
              </TableCell>
              <TableCell className={classes.fixRow} rowSpan={3}>
                Ngày đi
              </TableCell>
              </TableRow> */}
          {/* </TableBody>
        </Table>
      </Grid> */}
        </>
    );
}

TimekeepTable.propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
    profile: makeSelectProfile(),
  });

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

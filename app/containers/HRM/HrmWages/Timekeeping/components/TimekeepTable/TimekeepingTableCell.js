/**
 *
 * TimekeepTable
 *
 */

import React, { memo, useState, useEffect, useCallback } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import { Grid, MenuItem, TextField, Typography, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@material-ui/core';
import _ from 'lodash'
import { Done } from '@material-ui/icons';

/* eslint-disable react/prefer-stateless-function */

const styles = theme => ({
  root: {
    width: '100px',
    overflowX: 'auto',
    paddingBottom: 10,
    paddingRight: 5,
  },
  tablecell: {
    border: '1px solid rgba(224, 224, 224, 1)',
    width: '100px',
    textAlign: 'center',
    // padding: 8
  },
  table: {
    minWidth: 700,
  },
  name: {
    width: 150,
  },
});

function TimekeepTable(props) {
  const { symbols, onSymbolChange, onCellClick, day, row, classes, onShow } = props;
  const lastindex = day.faceTk.filter(item => item && item.out)
  const lastindexFinger = Array.isArray(day.fingerTk) && day.fingerTk.filter(item => item && item.out)
  const last = _.last(lastindex)
  const lastFinger = _.last(lastindexFinger)

  const arrIn = day.fingerTk && day.fingerTk.filter(item => item && item.in)
  const arrOut = day.fingerTk && day.fingerTk.filter(item => item && item.out)
  let dataInOutFinger = [];
  if (arrIn) {
    let Obj = {}
    for (let i = 0; i < arrIn.length; i++) {
      Obj.in = arrOut && arrIn[i] ? arrIn[i].in : ''
      Obj.out = arrOut && arrOut[i] ? arrOut[i].out : ''
      dataInOutFinger.push(Obj)
    }
  }

  const arrInFace = day.faceTk && day.faceTk.filter(item => item && item.in)
  const arrOutFace = day.faceTk && day.faceTk.filter(item => item && item.out)
  let dataInOutFace = [];
  if (arrIn) {
    let Obj = {}
    for (let i = 0; i < arrIn.length; i++) {
      Obj.in = arrOutFace && arrOutFace[i] ? arrInFace[i].in : ''
      Obj.out = arrOutFace && arrOutFace[i] ? arrOutFace[i].out : ''
      dataInOutFace.push(Obj)
    }
  }

  const handleChange = e => {
    onSymbolChange(e, day, row);
  };
  const handleClick = e => {
    onCellClick(e, day, row);
  };
  function handleInfo() {
    let data = [];
    if (day.faceTk) {
      data = day.faceTk
    }
    return (
      <>
        {
          data.length > 0 ? data.map(
            item => (
              <>
                <div>Giờ vào: {item.in}</div>
                <div>Giờ ra:{item.out} </div>
              </>
            )
          ) : (<div>Không có thông tin giờ vào giờ ra</div>)}
      </>
    )
  }
  // useEffect(()=>{
  //   if(day.faceTk.time){
  //     console.log('aaaaaaaaaaa')
  //   }
  // },[])
  const colorCell = () => {
    if (day) {
      switch (day.symbol) {
        case "X":
          return '#FFFF66';
        case "4X":
          return '#99FFFF';
        case "P":
          return '#FFCC00';
        default:
          return '#FFFFFF';
      }
    }
  }
  return (
    <>
      {/* <Tooltip title={handleInfo()}> */}
      <TableCell style={{ backgroundColor: colorCell(), textAlign: "center", paddingLeft: 45 }} onClick={handleClick} align="center" className={classes.tablecell}

      >
        <>
          {day.verified && (
            <Tooltip title="Đã xác nhận" style={{ transform: day.symbol ? 'translate(380%, -50%)' : 'translate(380%, -130%)', width: 14, height: 14, borderRadius: '50%', color: 'white', backgroundColor: '#2bd02b' }}>
              <Done />
            </Tooltip>
          )}
          {day && day.symbol ? day.symbol : ''}
          {Array.isArray(dataInOutFace) && dataInOutFace.length > 0 ? dataInOutFace.map((item, index) => {
            if (item.in) {
              return <div style={{ width: 75 }}>{item.in} - {item.out}</div>
            }
          }) : null}
          {Array.isArray(dataInOutFinger) && dataInOutFinger.length > 0 ? dataInOutFinger.map((item, index) => {
            return <div style={{ width: 75 }}>{item.in} - {item.out}</div>
          }) : null}
        </>
      </TableCell>
      {/* </Tooltip> */}
    </>
  );
}

TimekeepTable.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  // dispatch: PropTypes.func.isRequired,
};

export default compose(
  withStyles(styles),
  memo,
)(TimekeepTable);

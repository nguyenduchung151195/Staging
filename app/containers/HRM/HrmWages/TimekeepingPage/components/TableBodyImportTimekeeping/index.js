import React, { memo, useEffect, useState } from 'react';
import { TableBody, TableRow, TableCell, TextField, Checkbox } from '@material-ui/core';
import { generateTimekeepingData } from 'utils/common';
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';

const TextFields = memo((props) => {
  const { value, ...rest } = props;

  return (
    <TableCell style={{ marginLeft: '10px', padding: 0 }}>
      <TextField style={{ width: '180px', padding: '3px 12px' }} margin="normal" variant="outlined" value={value} {...rest} />
    </TableCell>
  )
})

function TableBodyImportTimekeeping(props) {
  const { data, month, year, handleChangeImport, classes } = props;
  const formatDay = d => {
    const dayFormat = d.date();
    const date = d.format('MM/DD/YYYY');
    return { date_format: `${dayFormat}`, date };
  };
  const [days, setDays] = useState();

  useEffect(() => {
    if (month && year) {
      setDays(generateTimekeepingData(month - 1, year).map(item => ({ ...item, ...formatDay(item.date) })))
    }
  }, [month, year])

  function mapValue(data) {
    let xhtml = "";
    Array.isArray(data) && data.length && data.map((item, index) => {
      index = index + 1;
      xhtml += `vào ${index}: ${item.in}, ra ${index}: ${item.out},`;
    });
    return xhtml;
  }



  return (
    <TableBody>
      {Array.isArray(data) && data.length && data.map((item, index) => (
        <TableRow key={index} style={{ height: '60px' }} className="tbl_Value">
          <div className={classes.freezeHorizontal}>
            <TableCell style={{ padding: '0 8px', }}>
              <Checkbox className={classes.checkBox} disabled={index === 0} checked={item.checked ? true : false} name="checked" onChange={(e) => handleChangeImport(e, index)} />
            </TableCell>
            <TextFields value={item.code} name="code" disabled={item.checked ? true : false} onChange={(e) => handleChangeImport(e, index)} />
            <TextFields value={item.codeEmployee} />
            <TextFields value={item.name} />
          </div>


          {/* hien thi ngay cham cong */}
          {Array.isArray(days) && days.length && days.map((day) => {
            if (index === 0) {
              return (
                // <TextFields value={day.date_format} />
                <TableCell className={classes.tableCell}>
                  <TextField className={classes.textField} margin="normal" variant="outlined" value={day.date_format} />
                </TableCell>
              );
            } else {
              const found = Array.isArray(item.data) && item.data.length && item.data.filter((it) => it.date === day.date);
              if (found && found.length) {
                return (
                  // <TextFields value={mapValue(found[0].rest)} />
                  <TableCell className={classes.tableCell}>
                    <TextField className={classes.textField} margin="normal" variant="outlined" value={mapValue(found[0].data)} />
                  </TableCell>
                );
              } else {
                return (
                  <TableCell className={classes.tableCell}>
                    <TextField className={classes.textField} margin="normal" variant="outlined" value="" />
                  </TableCell>
                );
              }
            }
          })}
        </TableRow>
      ))}
    </TableBody>
  )
}

export default compose(
  memo,
  withStyles(styles),
)(TableBodyImportTimekeeping);
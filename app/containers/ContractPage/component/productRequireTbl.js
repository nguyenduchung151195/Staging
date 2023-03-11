import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

function SpanningTable(props) {
  const { classes } = props;
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell align="left">Tên</TableCell>
            <TableCell align="right">Gía</TableCell>
            <TableCell align="right">Số lượng</TableCell>
            <TableCell align="right">Đơn vị tính</TableCell>
            <TableCell align="right">Chiết khấu</TableCell>
            <TableCell align="right">Thành tiền</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* eslint react/prop-types: 0 */
          props.dataSource.map(row => (
            <TableRow key={row.name}>
              <TableCell align="left">{row.name}</TableCell>
              <TableCell align="right">{row.price}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>

              <TableCell align="right">{row.unit}</TableCell>

              <TableCell align="right">{row.discount}</TableCell>

              <TableCell align="right">{row.total}</TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell rowSpan={3} colSpan={3} />
            <TableCell colSpan={2}>Tổng tiền</TableCell>
            <TableCell align="right">0 VNĐ</TableCell>
          </TableRow>

          <TableRow>
            <TableCell />
            <TableCell align="right">10.0000% VAT </TableCell>
            <TableCell align="right">10,000,000 VNĐ</TableCell>
          </TableRow>

          <TableRow>
            <TableCell colSpan={2}>Tổng giá trị đơn hàng</TableCell>
            <TableCell align="right">1000000000 VNĐ</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}

SpanningTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SpanningTable);

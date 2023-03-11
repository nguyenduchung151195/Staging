import React, { Component } from 'react';
import { makeStyles } from '@material-ui/styles';
import { withStyles } from '@material-ui/styles';
import { Grid, DragDropProvider, Table, TableHeaderRow, TableColumnReordering, TableFixedColumns } from '@devexpress/dx-react-grid-material-ui';
const useStyles = makeStyles({
  root: {
    fontWeight: 'bold',
    color: 'black',
  },
});
function RowComponent(props) {
  const classes = useStyles();
  return <TableHeaderRow.Row {...props} className={classes.root} />;
}
export default RowComponent;

/**
 *
 * InventoryDetailPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import {
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  withStyles,
  TextField,
  Paper,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
} from '@material-ui/core';
import { Breadcrumbs } from '@material-ui/lab';
import { Print } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import makeSelectInventoryDetailPage from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';

import styles from './styles';

function PrintElem(elem) {
  const mywindow = window.open('', 'PRINT');

  mywindow.document.write('</head><body >');
  mywindow.document.write(document.getElementById(elem).innerHTML);
  mywindow.document.write('</body></html>');

  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/

  mywindow.print();
  mywindow.close();

  return true;
}
/* eslint-disable react/prefer-stateless-function */
export class InventoryDetailPage extends React.Component {
  state = {
    data: [
      {
        id: 1,
        time: '23-04-2019 16:34',
        people: 'Hỗ trợ LifeTek',
        change: '	234',
        note: 'abc',
      },
      {
        id: 2,
        time: '23-04-2019 16:34',
        people: 'Hỗ trợ LifeTek',
        change: '	234',
        note: 'abc',
      },
      {
        id: 3,
        time: '23-04-2019 16:34',
        people: 'Hỗ trợ LifeTek',
        change: '	234',
        note: 'abc',
      },
      {
        id: 4,
        time: '23-04-2019 16:34',
        people: 'Hỗ trợ LifeTek',
        change: '	234',
        note: 'abc',
      },
    ],
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.breadcrumbs}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/stock">
              Kho
            </Link>
            <Typography color="textPrimary">Sản phẩm tồn kho</Typography>
          </Breadcrumbs>
        </Paper>
        {/* <FormattedMessage {...messages.header} /> */}
        <div id="print">
          <Card>
            <CardHeader title="Thông tin hàng tồn kho" />
            <CardContent>
              <Grid container style={{ width: '100%' }}>
                <Grid item md={6} spacing={40} className={classes.groupInput}>
                  <TextField className={classes.textField} label="Chuẩn mã vạch" margin="normal" />
                  <TextField className={classes.textField} label="Tên HH, DV" margin="normal" />
                  <TextField className={classes.textField} label="Danh mục" margin="normal" />
                  <TextField className={classes.textField} label="Số lượng hiện tại" margin="normal" />
                </Grid>
                <Grid item md={6} spacing={40} className={classes.groupInput}>
                  <TextField className={classes.textField} label="Thêm bớt" margin="normal" />
                  <TextField className={classes.textField} label="Ghi chú" margin="normal" multiline />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button style={{ marginLeft: 20 }} color="primary" variant="outlined">
                Lưu
              </Button>
              <Button variant="outlined" color='secondary'>Hủy</Button>
            </CardActions>
          </Card>

          <Card style={{ marginTop: 30 }}>
            <TextField className={classes.textField} label="Số mã vạch" margin="normal" />
            <Button style={{ margin: 30 }} color="primary" variant="outlined" size="small">
              Bảng mã vạch
            </Button>
            <Button style={{ margin: 30 }} color="primary" variant="outlined" size="small">
              Nhãn mã vạch
            </Button>
            <Button style={{ margin: 30 }} color="primary" variant="outlined">
              Tạo mã vạch
            </Button>
          </Card>
          <Card style={{ marginTop: 30 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Theo dõi dữ liệu hàng tồn kho</TableCell>
                  <TableCell>Nhân viên</TableCell>
                  <TableCell>Thêm bớt số lượng</TableCell>
                  <TableCell>Các chú thích</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.data.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.time}</TableCell>
                    <TableCell>{item.people}</TableCell>
                    <TableCell>{item.change}</TableCell>
                    <TableCell>{item.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div style={{ display: 'flex' }}>
              <Button onClick={() => PrintElem('print')} style={{ margin: '15px auto' }} color="primary" variant="outlined">
                <Print />
                In
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }
}

InventoryDetailPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  inventoryDetailPage: makeSelectInventoryDetailPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'inventoryDetailPage', reducer });
const withSaga = injectSaga({ key: 'inventoryDetailPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(InventoryDetailPage);

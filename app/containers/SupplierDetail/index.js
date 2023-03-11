/**
 *
 * SupplierDetail
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Toolbar, AppBar, Typography, IconButton, Table, TableCell, TableRow, TableBody } from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Close, Edit } from '@material-ui/icons';
import { Paper, Grid } from '../../components/LifetekUi';
import makeSelectSupplierDetail from './selectors';
import reducer from './reducer';
import saga from './saga';

/* eslint-disable react/prefer-stateless-function */
export class SupplierDetail extends React.Component {
  render() {
    const { suppliers } = this.props;
    return (
      <div>
        <AppBar>
          <Toolbar>
            <IconButton color="inherit" onClick={this.props.onClose} aria-label="Close">
              <Close />
            </IconButton>
            <Typography variant="h6" color="inherit">
              Chi tiết nhà cung cấp
              {/* {intl.formatMessage(messages.chitietduan || { id: 'chitietduan', defaultMessage: 'chitietduan' })} */}
            </Typography>
          </Toolbar>
        </AppBar>
        <div>
          <Paper>
            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
              <Edit />
              <Typography style={{ fontWeight: 'bold', fontSize: 18 }}>
                Thông tin chi tiết
                {/* {intl.formatMessage(messages.thongtinchitiet || { id: 'thongtinchitiet', defaultMessage: 'thongtinchitiet' })} */}
              </Typography>
            </Grid>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Name
                    {/* {intl.formatMessage(messages.ten || { id: 'ten', defaultMessage: 'ten' })} */}
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {suppliers.name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Code
                    {/* {intl.formatMessage(messages.khachhang || { id: 'khachhang', defaultMessage: 'khachhang' })} */}
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {suppliers.code}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Email
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {suppliers.email}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Website
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {suppliers.website}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Phone
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {suppliers.phone}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Adress
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {suppliers.adress}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    BankAccountNumber
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {suppliers.bankAccountNumber}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    TaxCode
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {suppliers.taxCode}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    CreatedAtSupplier
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {suppliers.createdAtSupplier}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    CharterCapital
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {suppliers.charterCapital}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    businessRegistrationNumber
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {suppliers.businessRegistrationNumber}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    DateRange
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {suppliers.dateRange}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Note
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {suppliers.note}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </div>
      </div>
    );
  }
}

SupplierDetail.propTypes = {};

const mapStateToProps = createStructuredSelector({
  supplierDetail: makeSelectSupplierDetail(),
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

const withReducer = injectReducer({ key: 'supplierDetail', reducer });
const withSaga = injectSaga({ key: 'supplierDetail', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SupplierDetail);

/**
 *
 * LiabilitiesCustomer
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import { TrendingFlat } from '@material-ui/icons';
import { Button, Typography } from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import Buttons from '../CustomButtons/Button';
import { Grid } from '../LifetekUi';
import { liabilitiesColumns, liabilitiesContractColumns } from '../../variable';
import ListPage from '../List';
import { API_REPORT } from '../../config/urlConfig';
import LiabilitiesChart from '../../containers/LiabilitiesReport/LiabilitiesChart';
import { tableToExcel, serialize } from '../../helper';

/* eslint-disable react/prefer-stateless-function */
const GridRight = ({ children }) => <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0px' }}>{children}</div>;

class LiabilitiesCustomer extends React.Component {
  state = {
    tab: 0,
    circleColumns: [
      {
        country: 'Tổng công nợ bán hàng',
        value: 4234,
      },
      {
        country: 'Tổng ông nợ hợp đồng',
        value: 343,
      },
    ],
    circleColumnsContract: [],
    reports: {},
    reportContract: {},
    startDate: new Date(`${new Date().getFullYear()}-01-01`),
    endDate: new Date(),
    filter: { customerId: this.props.report['customer.id'] },
  };

  componentDidMount() {
    this.getData(this.state.filter);
  }

  getData = filter => {
    const queryClient = serialize({ filter });
    fetch(`${API_REPORT}/detailDebtSaleCustomer/detailDebtSaleCustomer?${queryClient}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        const circleColumns = [
          {
            country: 'Bán hàng',
            value: data.totalSell,
          },
          {
            country: 'Đặt hàng',
            value: data.totalOrder,
          },
        ];
        this.setState({ reports: data, circleColumns });
      });

    fetch(`${API_REPORT}/detailDebtContractCustomer/detailDebtContractCustomer?${queryClient}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        const circleColumns = [
          {
            country: 'Đã nghiệm thu',
            value: data.total,
          },
        ];
        this.setState({ reportContract: data, circleColumnsContract: circleColumns });
      });
  };

  handleTab(tab) {
    this.setState({ tab });
  }

  mapLiabilitiReport = item => ({
    ...item,
    customer: item.nameCustomer,
  });

  handleChangeDate = value => {
    const start = this.state.startDate;
    // const { filter } = this.state;
    if (new Date(start) > new Date(value)) {
      alert('Thời gian kết thúc phải lớn hơn thời gian bắt đầu');
      return;
    }
    this.setState({
      endDate: value,
      filter: {
        customerId: this.props.report['customer.id'],
        startDate: new Date(start).toISOString(),
        endDate: new Date(value).toISOString(),
      },
    });
    this.getData({
      customerId: this.props.report['customer.id'],
      startDate: new Date(start).toISOString(),
      endDate: new Date(value).toISOString(),
    });
  };

  render() {
    const { tab, reports, reportContract, filter } = this.state;
    const ButtonCus = props => (
      <Buttons onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'} left round size="md">
        {props.children}
      </Buttons>
    );
    const tilte = `BÁO CÁO CÔNG NỢ KHÁCH HÀNG: ${this.props.report['customer.name']} `;

    return (
      <div>
        <Grid container sm={12}>
          <Grid item sm={12}>
            <ButtonCus tab={0}>Báo cáo chi tiết công nợ theo bán hàng</ButtonCus>
            <ButtonCus tab={1}>Báo cáo chi tiết công nợ theo hợp đồng</ButtonCus>
          </Grid>
        </Grid>{' '}
        {tab === 0 ? (
          <div>
            <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
              <Grid item md={12}>
                <LiabilitiesChart
                  titles={tilte}
                  data={this.state.circleColumns}
                  id="chart2"
                  style={{ width: '100%', height: '50vh', marginTop: 30 }}
                />
              </Grid>
              <Grid item md={2} style={{ marginLeft: 30, marginTop: 30 }}>
                <GridRight>
                  <Typography color="primary">Tổng công nợ:</Typography>
                  <p>{reports.total}</p>
                </GridRight>
                <GridRight>
                  <Typography color="primary">Tổng công nợ bán hàng:</Typography>
                  <p> {reports.totalSell}</p>
                </GridRight>
                <GridRight>
                  <Typography color="primary">Tổng ông nợ đặt hàng:</Typography>
                  <p> {reports.totalOrder}</p>
                </GridRight>
              </Grid>
            </Grid>

            <MuiPickersUtilsProvider utils={MomentUtils}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 20 }}>
                <DateTimePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY HH:mm"
                  label="Từ Ngày"
                  value={this.state.startDate}
                  name="startDate1"
                  error={false}
                  helperText={null}
                  variant="outlined"
                  margin="dense"
                  onChange={value => this.setState({ startDate: value })}
                  style={{ padding: 10 }}
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingFlat color="primary" />
                </div>

                <DateTimePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY HH:mm"
                  label="Đến"
                  error={false}
                  helperText={null}
                  value={this.state.endDate}
                  name="endDate"
                  margin="dense"
                  variant="outlined"
                  onChange={value => this.handleChangeDate(value)}
                  style={{ padding: 10 }}
                />
              </div>
            </MuiPickersUtilsProvider>
            <div id="report-task1">
              <ListPage
                disableEdit
                disableAdd
                disableConfig
                columns={liabilitiesColumns}
                apiUrl={`${API_REPORT}/detailDebtSaleCustomer/detailDebtSaleCustomer`}
                filter={filter}
                mapFunction={this.mapLiabilitiReport}
              />
            </div>
            <Button
              variant="outlined"
              color="primary"
              style={{ cursor: 'pointer', marginRight: 70, float: 'right', marginBottom: 40 }}
              type="button"
              onClick={() => tableToExcel('report-task1', 'W3C Example Table')}
            >
              Xuất File Excel
            </Button>
          </div>
        ) : null}
        {tab === 1 ? (
          <div>
            <Grid style={{ display: 'flex', alignItems: 'stretch', padding: '10px 0px' }} container>
              <Grid item md={12}>
                <LiabilitiesChart
                  titles={tilte}
                  data={this.state.circleColumnsContract}
                  id="chart3"
                  style={{ width: '100%', height: '50vh', marginTop: 30 }}
                />
              </Grid>
              <Grid item md={2} style={{ marginLeft: 30, marginTop: 30 }}>
                <GridRight>
                  <Typography color="primary">Tổng hợp đồng:</Typography>
                  <p>{reportContract.total}</p>
                </GridRight>
              </Grid>
            </Grid>

            <MuiPickersUtilsProvider utils={MomentUtils}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 20 }}>
                <DateTimePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY HH:mm"
                  label="Từ Ngày"
                  value={this.state.startDate}
                  name="startDate1"
                  error={false}
                  helperText={null}
                  variant="outlined"
                  margin="dense"
                  onChange={value => this.props.mergeData({ startDate: value })}
                  style={{ padding: 10 }}
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingFlat color="primary" />
                </div>

                <DateTimePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY HH:mm"
                  label="Đến"
                  error={false}
                  helperText={null}
                  value={this.state.endDate}
                  name="endDate"
                  margin="dense"
                  variant="outlined"
                  onChange={value => this.handleChangeDate(value)}
                  style={{ padding: 10 }}
                />
              </div>
            </MuiPickersUtilsProvider>
            <div id="report-task1">
              <ListPage
                disableEdit
                disableAdd
                disableConfig
                columns={liabilitiesContractColumns}
                apiUrl={`${API_REPORT}/detailDebtContractCustomer/detailDebtContractCustomer`}
                filter={filter}
              />
            </div>
            <Button
              variant="outlined"
              color="primary"
              style={{ cursor: 'pointer', marginRight: 70, float: 'right', marginBottom: 40 }}
              type="button"
              onClick={() => tableToExcel('report-task1', 'W3C Example Table')}
            >
              Xuất File Excel
            </Button>
          </div>
        ) : null}
      </div>
    );
  }
}

LiabilitiesCustomer.propTypes = {};

export default LiabilitiesCustomer;

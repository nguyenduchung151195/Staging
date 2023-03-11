/**
 *
 * ProductPage
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Grid, Paper } from '@material-ui/core';
import Buttons from 'components/CustomButtons/Button';
import makeSelectProductPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { Grid as GridLT, AsyncAutocomplete, ButtonUI } from '../../../components/LifetekUi';
import { API_CUSTOMERS, API_PERSONNEL } from '../../../config/urlConfig';
import ListPage from '../../../components/List';

function ProductPage(props) {
  const [tabIndex, setTabIndex] = useState(0);
  const [filter, setFilter] = useState({});

  const mapFunctionProject = item => item;

  const addTowerContract = () => {
    props.history.push('/Stock/product/add');
  };

  const ButtonUI = props => (
    <Buttons onClick={() => setTabIndex(props.index)} color={props.index === tabIndex ? 'gradient' : 'simple'}>
      {props.children}
    </Buttons>
  );

  return (
    <Paper>
      <GridLT container spacing={16}>
        <Grid item xs={6}>
          <AsyncAutocomplete
            name="Chọn khách hàng..."
            label="Tầng"
            // onChange={value => this.handleCustomer(value)}
            // suggestions={customers.data}
            url={API_CUSTOMERS}

            // value={this.props.customerBos ? this.props.customerBos : addProjects.customer}
          />
        </Grid>
        <Grid item sm={12}>
          <Grid container>
            <Grid item>
              <ButtonUI index={0}>Danh sách</ButtonUI>
            </Grid>
            <Grid item>
              <ButtonUI index={1}>Trên hạn mức</ButtonUI>
            </Grid>
            <Grid item>
              <ButtonUI index={2}>Dưới hạn mức</ButtonUI>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <ListPage code="TowerContract" apiUrl={API_PERSONNEL} mapFunction={mapFunctionProject} filter={filter} addFunction={addTowerContract} />
        </Grid>
      </GridLT>
    </Paper>
  );
}

ProductPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  productPage: makeSelectProductPage(),
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

const withReducer = injectReducer({ key: 'productPage', reducer });
const withSaga = injectSaga({ key: 'productPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ProductPage);

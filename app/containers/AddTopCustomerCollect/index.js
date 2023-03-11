import React from 'react';
import { Grid } from '../../components/LifetekUi';
import { Typography } from 'components/LifetekUi';
import { makeSelectProfile, makeSelectMiniActive } from '../Dashboard/selectors';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
const AddTopCusTomerCollect = props => {
  const { miniActive } = props;
  return (
    <Grid container spacing={16} style={{ width: !miniActive ? 'calc(100vw - 240px)' : 'calc(100vw - 65px)' }}>
      <Typography>Báo cáo top khách hàng thu tiền nhiều nhất trong tháng </Typography>
    </Grid>
  );
};
const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect)(AddTopCusTomerCollect);

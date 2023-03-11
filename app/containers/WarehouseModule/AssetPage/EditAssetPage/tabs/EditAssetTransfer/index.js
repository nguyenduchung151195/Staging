/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/**
 *
 * EditAssetTransfer
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { FileUpload, AsyncAutocomplete, TextField } from 'components/LifetekUi';

import { Grid } from '@material-ui/core';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import { API_PERSONNEL } from 'config/urlConfig';
import ListPage from 'components/List';
import SimpleListPage from '../../../../../../components/List/SimpleListPage';
import { API_USERS } from '../../../../../../config/urlConfig';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

/* eslint-disable react/prefer-stateless-function */

const columns = [
  {
    name: 'from',
    title: 'Người quản lý hiện tại',
    width: 400,
  },
  {
    name: 'to',
    title: 'Người quản lý mới',
    width: 400,
  },
  {
    name: 'date',
    title: 'Thời gian',
    width: 400,
  }
]

class EditAssetTransfer extends React.PureComponent {
  state = {
    newPersonManage: null,
    tranferPersonHistory: [],
    isSubmit: false,
  };

  componentDidMount() {
    this.props.onRef ? this.props.onRef(this) : null;
  }

  handleChangePersonManager = (newPersonManage) => {
    this.setState({ newPersonManage });
  }

  getData = () => {
    this.setState({ isSubmit: true });
    console.log(this.props.personManage);
    const { asset } = this.props;
    return {
      personManage: this.state.newPersonManage ? this.state.newPersonManage._id : (asset && asset.personManage && asset.personManage._id),
      tranferPersonHistory: asset ? (asset.tranferPersonHistory || []) : [],
    }
  };

  mapFunction = (item) => {
    if (item)
      return {
        ...item,
        from: item.from && item.from.name,
        to: item.to && item.to.name,
      }
    return item;
  }

  render() {
    const { asset } = this.props;

    return (
      <div>
        <Grid item md={12} container spacing={24}>
          <Grid item md={12}>
            <Grid container spacing={8} alignItems="center">
              <Grid item xs>
                <TextField label="Người quản lý" fullWidth disabled value={asset && asset.personManage ? asset.personManage.name : ''} />
              </Grid>
              <Grid item xs={1}>
                <SwapHorizIcon />
              </Grid>
              <Grid item xs>
                <AsyncAutocomplete
                  name="Chọn quản lý mới..."
                  label="Người quản lý"
                  onChange={value => this.handleChangePersonManager(value)}
                  url={API_USERS}
                  value={this.state.newPersonManage}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <SimpleListPage
              columns={columns}
              rows={asset ? asset.tranferPersonHistory : []}
              showAction={false}
              mapFunction={this.mapFunction}
            />
          </Grid>
        </Grid>
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }
}

EditAssetTransfer.propTypes = {};

export default EditAssetTransfer;

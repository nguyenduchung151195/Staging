/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/**
 *
 * EditAssetAdditionalInfo
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { TextField } from 'components/LifetekUi';

import { Grid } from '@material-ui/core';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
class EditAssetAdditionalInfo extends React.Component {
  state = {
    fieldAdded: this.props.fieldAdded,
  };


  componentDidMount() {
    this.props.onRef ? this.props.onRef(this) : null;
  }

  getData = () => {
    return this.state;
  };

  handleChangeAddedField = (index, e) => {
    const { fieldAdded } = this.state;
    const fields = [...fieldAdded];
    fieldAdded[index].value = e.target.value;
    this.setState({ fieldAdded: fields });
  };

  componentDidUpdate(preProps) {

    const { asset } = this.props;
    if (asset && asset.others !== preProps.others) {
      const { fieldAdded } = this.state;
      const keys = Object.keys(asset.others);
      console.log('others', asset.others);
      console.log('keys', keys);

      fieldAdded.forEach(item => {
        const index = keys.findIndex(n => n === item.name.replace('others.', ''));
        if (index > -1) {
          item.value = asset.others[keys[index]];
        }
      });
      this.state.fieldAdded = fieldAdded;
      console.log('fieldAdded', fieldAdded);
    }
  }

  render() {
    return (
      <div>
        <Grid item md={12} container spacing={24}>
          {this.state.fieldAdded.length > 0 &&
            this.state.fieldAdded.map((item, index) => {
              if (item.checked) {
                return (
                  <Grid item md={6} key={item.name}>
                    <TextField
                      label={item.title}
                      type={item.type === 'string' ? 'text' : item.type}
                      value={item.value}
                      onChange={event => this.handleChangeAddedField(index, event)}
                      style={{ width: '100%' }}
                    />
                  </Grid>
                );
              }
            })}
        </Grid>
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }
}

EditAssetAdditionalInfo.propTypes = {};

export default EditAssetAdditionalInfo;

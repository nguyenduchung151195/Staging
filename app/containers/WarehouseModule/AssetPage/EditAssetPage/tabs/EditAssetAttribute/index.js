/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/**
 *
 * EditAssetAttribute
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import classNames from 'classnames';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  MenuItem,
  withStyles,
  TextField,
  Grid,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormControlLabel,
  Select,
} from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import messages from './messages';
import styles from './styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
/* eslint-disable react/prefer-stateless-function */
class EditAssetAttribute extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn = React.createRef();
  }

  state = {
    specification: '',
    attributesId: '',
    attributes: [],
    isSubmit: false,
  };

  componentDidMount() {
    this.props.onRef(this);
    this.state.isSubmit = false;
  }

  handleChangeInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };


  componentDidUpdate(preProps) {
    const { propertiesSet, asset } = this.props;
    // console.log(propertiesSet, preProps.propertiesSet);
    if (propertiesSet && propertiesSet.length > 0 && propertiesSet !== preProps.propertiesSet) {
      this.state.attributes = propertiesSet.filter(attribute => {
        // console.log(attribute);
        return attribute.objects && attribute.objects.Product;
      })
    }

    if (asset && !this.state.isSubmit && asset !== preProps.asset) {
      this.state.specification = asset.specification;
      this.state.attributesId = asset.attributesId;
    }
    this.isSubmit = true;
  }


  getData = () => {
    this.setState({ isSubmit: true });
    return {
      specification: this.state.specification,
      attributesId: this.state.attributesId,
    };
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;
    // console.log(this.state);
    return (
      <Grid container>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Thông số kĩ thuật"
            multiline
            rows={4}
            variant="outlined"
            value={this.state.specification}
            name="specification"
            onChange={this.handleChangeInput}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Chọn bộ thuộc tính"
            name="attributesId"
            style={{ marginLeft: 0, textAlign: 'left' }}
            variant="outlined"
            value={this.state.attributesId}
            onChange={this.handleChangeInput}
            // helperText="Please select your currency"
            margin="normal"
          >
            {this.state.attributes.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    );
  }
}

EditAssetAttribute.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(EditAssetAttribute);

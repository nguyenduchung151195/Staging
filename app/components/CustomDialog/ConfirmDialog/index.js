/**
 *
 * ConfirmDialog
 *
 */

import React, { memo } from 'react';
import { compose } from 'redux';
import { Dialog, DialogActions, Button, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import CustomButton from '../../Button/CustomButton';
// import styled from 'styled-components';

function ConfirmDialog(props) {
  const {
    title = props.intl.formatMessage({ id: 'dialog.defaultTitle' }),
    confirmText = props.intl.formatMessage({ id: 'dialog.confirm' }),
    cancelText = props.intl.formatMessage({ id: 'dialog.cancel' }),
  } = props;
  return (
    <div>
      <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{props.description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={props.handleSave} color="primary" autoFocus>
            {confirmText}
          </CustomButton>
          <CustomButton onClick={props.handleClose} color="secondary">
            {cancelText}
          </CustomButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

ConfirmDialog.propTypes = {
  title: PropTypes.string,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  handleSave: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default compose(
  memo,
  injectIntl,
)(ConfirmDialog);

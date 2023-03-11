/* eslint-disable react/no-danger */
import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { Dialog, DialogContent, DialogTitle, DialogActions, Button } from '@material-ui/core';
// import { PagingState, IntegratedPaging } from '@devexpress/dx-react-grid';
// import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
// import { Done, Clear, HourglassEmpty } from '@material-ui/icons';

const ApproveDialog = props => (
  <div>
    <Dialog
      fullWidth
      maxWidth="lg"
      open={props.open}
      onClose={() => {
        props.callBack('form-close');
      }}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle id="max-width-dialog-title">Biểu mẫu</DialogTitle>
      <DialogContent>
        <div dangerouslySetInnerHTML={{ __html: props.content }} />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.callBack('form-close');
          }}
          color="primary"
          variant="outlined"
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);

export default ApproveDialog;

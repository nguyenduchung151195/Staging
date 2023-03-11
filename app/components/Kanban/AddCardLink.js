import React from 'react';

import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
export default ({ onClick }) => (
  <Button onClick={onClick} style={{ color: 'white' }}>
    <Add /> Thêm mới
  </Button>
);

import React, { useEffect, memo, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Fab, Button } from '@material-ui/core';
import styles from './styles';
import { Add, Close, Edit, Reorder, Delete } from '@material-ui/icons';
// import VerticalTabs from '../VerticalTabs'
const VerticalTabs = withStyles(() => ({
  flexContainer: {
    flexDirection: 'column',
    '& div': {
      '& div': {
        padding: '5px 4px 0 4px',
      },
    },
  },
  indicator: {
    display: 'none',
  },
}))(Tabs);

const VerticalTab = withStyles(() => ({
  selected: {
    color: 'white',
    backgroundColor: `#2196F3`,
    borderRadius: '5px',
    boxShadow: '3px 5.5px 7px rgba(0, 0, 0, 0.15)',
  },
  root: {},
}))(Tab);

function CustomerVerticalTabList(props) {
  const { onChange, onChangeAdd, onChangeEdit, onChangeDelete, onChangeUndo, data, value } = props;
  // console.log('data', data);
  // console.log('data', value)
  return (
    <>
      <div>
        <Button onClick={() => onChangeAdd('', false)} className="my-3 mx-3" color="primary" size="small" variant="outlined">
          <Add /> Thêm mới
        </Button>
        <Button onClick={onChangeUndo} className="my-3 mx-3" color="primary" size="small" variant="outlined">
          <Reorder /> Hoàn tác
        </Button>
      </div>
      <div>
        <VerticalTabs onReset={data} style={{ display: 'inline-block' }} value={value} onChange={onChange}>
          {data && data.map(item => <VerticalTab key={item._id} style={{ textAlign: 'left', textTransform: 'none' }} label={item.title} />)}
        </VerticalTabs>

        <VerticalTabs style={{ display: 'inline-block' }}>
          {data &&
            data.map(item => (
              <Fab
                color="warning"
                aria-label="Edit"
                // disabled={!item.canDelete}
                size="small"
                className="mb-2"
                onClick={() => onChangeEdit(item, true)}
              >
                <Edit />
              </Fab>
            ))}
        </VerticalTabs>

        <VerticalTabs style={{ display: 'inline-block' }}>
          {data &&
            data.map(item => (
              <Fab disabled={!item.canDelete} color="warning" aria-label="Delete" size="small" className="mb-2" onClick={() => onChangeDelete(item)}>
                <Delete />
              </Fab>
            ))}
        </VerticalTabs>
        <br />
      </div>
    </>
  );
}

export default withStyles(styles)(CustomerVerticalTabList);

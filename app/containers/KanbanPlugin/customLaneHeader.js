/* eslint-disable array-callback-return */
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import React from 'react';
import { formatNumber } from '../../utils/common';
const LaneHeader = props => (
  <div style={{ display: 'table', position: 'relative', width: '300px', whiteSpace: 'none !important' }}>
    <div style={{ backgroundColor: props.labelStyle.color, height: 32, alignItems: 'center', display: 'table-row' }}>
      <span style={{ display: 'table-cell', verticalAlign: 'middle', fontSize: '16px' }}>
        {props.title} ({(props.count && props.count[props.id]) || 0})
      </span>
      <span style={{ position: 'absolute', right: -14, top: 0 }}>
        <svg xmlns="ApproveGroupDetailPage" width="18" height="32" viewBox="0 0 13 32">
          <path fill={props.labelStyle.color} fillOpacity="1" d="M0 0h3c2.8 0 4 3 4 3l6 13-6 13s-1.06 3-4 3H0V0z" />
        </svg>
      </span>
    </div>
    {/* {props.labelStyle.enableTotal ? (
      <div style={{ display: 'table-row', width: '300px' }}>
        <div
          className="py-3"
          style={{ borderLeft: '1px dashed rgba(255,255,255,.55)', fontSize: 20, width: '300px', color: '#1d1d1f', padding: '0 !important' }}
        >
          {getTotal(props.cards)}
          <Button
            onClick={() => {
              props.onClick();
            }}
            style={{ color: '#000', width: '300px', display: 'block' }}
          >
            <Add />
          </Button>
        </div>
      </div>
    ) : (
      ''
    )} */}
    {/* {props.labelStyle.enableAdd ? (
      <div style={{ display: 'table-row', width: '300px' }}>
        <div
          className="py-3"
          style={{ borderLeft: '1px dashed rgba(255,255,255,.55)', fontSize: 20, width: '300px', color: '#1d1d1f', padding: '0 !important' }}
        >
          {getTotal(props.cards)}
          <Button
            onClick={() => {
              props.onClick();
              props.history.push('/crm/Customer/add');
            }}
            style={{ color: '#2196F3', width: '300px', display: 'block' }}
          >
            <Add />
          </Button>
        </div>
      </div>
    ) : (
      ''
    )} */}
     <div style={{ display: 'table-row', width: '300px' }}>
        <div
          className="py-3"
          style={{ borderLeft: '1px dashed rgba(255,255,255,.55)', fontSize: 20, width: '300px', color: '#1d1d1f', padding: '0 !important' }}
        >
          <Button
            // onClick={() => {
            //   props.handleAddBo()
            // }}
            onClick={() => {
              props.onClick()
            }}
            style={{ color: '#2196F3', width: '300px', display: 'block' }}
          >
            <Add />
          </Button>
        </div>
      </div>
  </div>
);
const getTotal = listMoney => {
  let total = 0;
  listMoney.map(item => {
    if (item.data['value.amount']) {
      total += item.data['value.amount'];
    } else if (item.data['amount']) {
      total += item.data['amount'];
    } else if (item.data['total']) {
      total += item.data['total'];
    }
  });
  return `${formatNumber(total) || 0} `;
};
export default LaneHeader;

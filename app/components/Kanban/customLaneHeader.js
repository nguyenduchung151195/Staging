/* eslint-disable array-callback-return */
import React from 'react';
import { formatNumber } from '../../utils/common';
const LaneHeader = props => (
  <div style={{ display: 'table', position: 'relative', width: '300px' }}>
    {/* {console.log(props)} */}
    <div style={{ backgroundColor: props.labelStyle.color, height: 32, alignItems: 'center', display: 'table-row' }}>
      <span style={{ display: 'table-cell', verticalAlign: 'middle' }}>{props.title}</span>
      <span style={{ position: 'absolute', right: -14, top: 0 }}>
        <svg xmlns="ApproveGroupDetailPage" width="18" height="32" viewBox="0 0 13 32">
          <path fill={props.labelStyle.color} fillOpacity="1" d="M0 0h3c2.8 0 4 3 4 3l6 13-6 13s-1.06 3-4 3H0V0z" />
        </svg>
      </span>
    </div>
    {props.labelStyle.enableTotal ? (
      <div style={{ display: 'table-row', width: '300px' }}>
        <div className="py-3" style={{ borderLeft: '1px dashed rgba(255,255,255,.55)', fontSize: 20, width: '300px', color: '#000' }}>
          {getTotal(props.cards)}
        </div>
      </div>
    ) : (
      ''
    )}
  </div>
);
const getTotal = listMoney => {
  let total = 0;
  listMoney.map(item => {
    if (item.data['value.amount']) {
      total += item.data['value.amount'];
    }
  });
  return `${formatNumber(total)} $`;
};
export default LaneHeader;

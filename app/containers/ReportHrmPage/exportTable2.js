import React, { useEffect, useState } from 'react';
import { API_ORIGANIZATION } from 'config/urlConfig';
import moment from 'moment';
import { Loading } from 'components/LifetekUi';
import { fetchData, serialize } from 'helper';

const formatExportDate = date => {
  if (!date) return '';
  if (moment.isMoment(date)) return date.format('DD/MM/YYYY');
  if (moment(date, 'YYYY-MM-DD').isValid()) return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
  return date.toString();
};
const LIMIT_REPORT_DATA = 500;

const code = 'reportStatsHrm';

function ExportExcel(props) {
  const {
    filter,
    open,
    onClose,
    exportDate,
    startDate,
    endDate,
    department,
    employee,
    maxLimit,
    row,
    col,
    currentPage,
    pageSize,
    titleExcel,
    listTitle,
    listDataSmall,
    dataRevenueRxpend,
  } = props;
  // const url = `${props.url}/export`
  useEffect(
    () => {
      if (open) {
       
        getDataFirstTime();
      }
    },
    [ open],
  );


  const getDataFirstTime = async () => {
    
    onClose();
  };





 

  
  return (
    <React.Fragment>
    
        <div id="ExportTable2" style={{ display: 'none' }}>
          <table>
            <tbody>
              {/* <tr>
                <td>Phòng ban/chi nhánh:</td>
                <td>{department && departments ? (departments.find(e => e.id === department) || { name: '' }).name : ''}</td>
              </tr>
              <br />
              <tr>
                <td>Nhân viên:</td>
                <td>{employee && employee.name}</td>
              </tr>
              <br />
              <tr>
                <td>Ngày tháng:</td>
                <td>
                  {`${formatExportDate(startDate)}`}-{`${formatExportDate(endDate)}`}
                </td>
              </tr>
              <br /> */}
              <tr>
                <td>Ngày xuất báo cáo:</td>
                <td>{`${formatExportDate(exportDate)}`}</td>
              </tr>
            </tbody>
          </table>
          <br />
          <table>
            <thead>
              <tr style={{ background: '#959a95' }}>
                <th>STT</th>
                <th>THÁNG</th>
                <th>NGÀY BẮT ĐẦU</th>
                <th>NGÀY KẾT THÚC</th>
                <th>MỨC LƯƠNG CƠ SỞ</th>
              </tr>
            </thead>
            <tbody>
              {row &&
              Array.isArray(row) &&
              row.length > 0 &&
              row.map((item, index) => (
                <tr>
                  
                  <td style={{textAlign: 'center'}}>{index + 1}</td>
                  <td style={{textAlign: 'center'}}>{item.month}</td>
                  <td>{item.startDate}</td>
                  <td>{item.endDate}</td>
                  <td style={{textAlign: 'center'}}>{item.wage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
     
    </React.Fragment>
  );
}

export default ExportExcel;

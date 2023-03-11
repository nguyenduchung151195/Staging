import React, { useEffect, useState } from 'react';
import moment from 'moment';

const formatExportDate = date => {
  if (!date) return '';
  if (moment.isMoment(date)) return date.format('DD/MM/YYYY');
  if (moment(date, 'YYYY-MM-DD').isValid()) return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
  return date.toString();
};
function ExportExcel(props) {
  const { filter, open, onClose, exportDate, startDate, endDate, department, employee, maxLimit, row, col, currentPage, pageSize, titleExcel } = props;
  // const url = `${props.url}/export`


  useEffect(
    () => {
      if (open) {
        getDataFirstTime();
      }
    },
    [open],
  );
  const getDataFirstTime = async () => {
    onClose();
  };
  const getRowPage = () => {
    let TD = []
    for (let index = 0; index < col.length + 1; index++) {
      TD.push(<td />)
    }
    return TD
  }
  return (
    <React.Fragment>
      <div id="excelTableBosReport1" style={{ display: 'none' }}>
        <table>
          <tbody />
        </table>
        <br />
        <table>
          <tr style={{ height: "40px", textAlign: "center" }}>
            <td colspan={col.length + 3}> {titleExcel}</td>
          </tr>

          {(employee !== undefined && department !== undefined) ?
            <>
              <tr>
                <td colspan="2">Nhân Viên Phụ Trách: </td>
                <td colspan={col.length + 1}>{employee.toString().trim()}</td>
              </tr>
              <tr>
                <td colspan="2" >Phòng Ban: </td>
                <td colspan={col.length + 1}>{department}</td>
              </tr>
            </> : null
          }
        </table>
        <br />
        <table>
          <thead>
            <tr style={{ background: '#959a95', height: "20px" }}>
              {col.map(item => (
                <th colSpan={item.code}>{item.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {row.map((row, index) => {
              return (
                <tr>
                  {col.map((cols, index) => (
                    <td
                      style={{
                        columnWidth: cols.width,
                        textAlign: cols.type === 'Date' || cols.type === 'Number' || cols.name === 'order' || cols.name !== 'name' ? 'center' : null,
                        paddingTop: cols.type === 'Number' ? '10px' : null,
                        paddingRight: cols.type === 'Number' ? 0 : null,
                      }}
                      colSpan={cols.code ? cols.code : 1}
                    >
                      {row[index] && row[index].symbol ? row[index].symbol : " "}
                    </td>
                  ))}
                </tr>
              );
            })}

          </tbody>
          {/* <tfoot>
            <tr>
              {getRowPage().map((rl) => {
                return rl
              })}
              <td style={{ textAlign: 'center', background: '#959a95' }}>Trang số </td>
              <td style={{ textAlign: 'center', background: '#959a95' }}>{currentPage + 1}</td>
            </tr>
            <tr>
              {getRowPage().map((rl) => {
                return rl
              })}
              <td style={{ textAlign: 'center', background: '#959a95' }}>Tổng số trang</td>
              <td style={{ textAlign: 'center', background: '#959a95' }}>{pageSize}</td>
            </tr>
          </tfoot> */}
        </table>
      </div>
    </React.Fragment>
  );
}

export default ExportExcel;

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

const code = 'reportsBusinessOpportunities';

function ExportExcel(props) {
  const { filter, open, onClose, exportDate, startDate, endDate, department, employee, maxLimit, row, col } = props;
  const url = `${props.url}`;
  // const url = `${props.url}/export`

  const [departments, setDepartments] = useState();
  const [dataPageExcell, setDataPageExcell] = useState({
    data: [],
    totalPage: 1,
    pageNumber: 1,
    numberOrderFirstPage: 1,
  });

  const { data, totalPage, pageNumber, numberOrderFirstPage } = dataPageExcell;

  useEffect(
    () => {
      if (open) {
        getDataFirstTime();
      }
    },
    [open],
  );

  useEffect(() => {
    fetchData(API_ORIGANIZATION, 'GET', null).then(departmentsData => {
      const mapItem = array => {
        array.forEach(item => {
          if (item && item._id) result.push({ id: item._id, name: item.name });
          if (item.child) mapItem(item.child);
        });
      };

      let result = [];
      mapItem(departmentsData);
      setDepartments(result);
    });
  }, []);

  const getDataFirstTime = async () => {
    onClose();
  };

  const getDataPagination = async (skip, limit, totalPage, pageNumber) => {
    try {
      const newFilter = {
        ...filter,
        skip,
        limit,
        modelName: code,
      };
      const query = serialize(newFilter);
      const apiUrl = `${url}?${query}`;

      const res = await fetchData(apiUrl);
      if (!res.data) throw res;
      setDataPageExcell({ ...dataPageExcell, data: res.data, totalPage, pageNumber, numberOrderFirstPage: skip + 1 });

      onClose({ totalPage, pageNumber });
    } catch (err) {
      onClose({ error: true });
    }
  };
  return (
    <React.Fragment>
      <div id="excelTableBosReport1" style={{ display: 'none' }}>
        <table>
          <tbody />
        </table>
        <br />
        <table>
          <thead>
            <tr style={{ background: '#959a95' }}>
              {col.map(item => (
                <th>{item.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {row.map((row, index) => {
              return (
                <tr>
                  {col.map(cols => (
                    <td
                      style={{
                        width: cols.width,
                        textAlign: cols.type === 'Date' || cols.type === 'Number' || cols.name === 'order' || cols.name !== 'name' ? 'center' : null,
                        paddingTop: cols.type === 'Number' ? '10px' : null,
                        paddingRight: cols.type === 'Number' ? 0 : null,
                      }}
                    >
                      {typeof row[cols.name] === 'string' || typeof row[cols.name] === 'number' ? row[cols.name] : ''}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td />
              <td />
              <td />
              <td />
              <td />
              <td />
              <td />
              <td style={{ textAlign: 'center', background: '#959a95' }}>Trang số </td>
              <td style={{ textAlign: 'center', background: '#959a95' }}>{pageNumber}</td>
            </tr>
            <tr>
              <td />
              <td />
              <td />
              <td />
              <td />
              <td />
              <td />
              <td style={{ textAlign: 'center', background: '#959a95' }}>Tổng số trang</td>
              <td style={{ textAlign: 'center', background: '#959a95' }}>{totalPage}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </React.Fragment>
  );
}

export default ExportExcel;

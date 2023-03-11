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
  const { filter, open, onClose, exportDate, startDate, endDate, department, employee, maxLimit } = props;
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
      if (url && open) {
        getDataFirstTime();
      }
    },
    [filter, open],
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
    try {
      const numberRecordLimitBackEnd = maxLimit || LIMIT_REPORT_DATA;

      const query = serialize({
        ...filter,
        // modelName: code,
        // startDate: typeof filter.startDate === 'string' ? filter.startDate : moment(filter.startDate).format('YYYY-MM-DD'),
        // endDate: typeof filter.endDate === 'string' ? filter.endDate : moment(filter.endDate).format('YYYY-MM-DD'),
      });
      const apiUrl = `${url}`;

      const res = await fetchData(apiUrl);
      if (!res.data) throw res;

      const numberTotalPageLimitBackEnd = Math.ceil(res.count / numberRecordLimitBackEnd);
      setDataPageExcell({
        ...dataPageExcell,
        data: res.data,
        stageList: res.stageList,
        numberTotalPageLimitBackEnd,
        pageNumber: 1,
        numberOrderFirstPage: 1,
      });
      onClose({ totalPage: numberTotalPageLimitBackEnd || 1, pageNumber: 1 });

      if (res.count > numberRecordLimitBackEnd) {
        for (let i = 1; i < numberTotalPageLimitBackEnd; i++) {
          await getDataPagination(numberRecordLimitBackEnd * i, numberRecordLimitBackEnd, numberTotalPageLimitBackEnd, i + 1);
        }
      }
    } catch (err) {
      onClose({ res: err, error: true });
    }
  };

  const numberWithCommas = x => {
    return  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getDataPagination = async (skip, limit, totalPage, pageNumber) => {
    try {
      const newFilter = {
        ...filter,
        modelName: code,
        // startDate: typeof filter.startDate === 'string' ? filter.startDate : moment(filter.startDate).format('YYYY-MM-DD'),
        // endDate: typeof filter.endDate === 'string' ? filter.endDate : moment(filter.endDate).format('YYYY-MM-DD'),
      };
      const query = serialize(newFilter);
      const apiUrl = `${url}`;

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
      {open ? (
        <Loading />
      ) : (
        <div id="excelTableOrg" style={{ display: 'none' }}>
          <table>
            <tbody>
              <tr>
                <td>Phòng ban/chi nhánh:</td>
                <td>{department && departments ? (departments.find(e => e.id === department) || { name: '' }).name : ''}</td>
              </tr>
              <br />
              <br />
              <tr>
                <td>Kỳ báo cáo:</td>
                <td>
                  {`${formatExportDate(startDate)}`} - {`${formatExportDate(endDate)}`}
                </td>
              </tr>
              <br />
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
                <th>Phòng ban</th>
                <th>Tổng số nhân viên</th>
                <th>Tổng số nam</th>
                <th>Tổng số nữ</th>
              </tr>
            </thead>
            <tbody>
           
              {data.map((item, index) => (
                <tr>
                  <td>{index + numberOrderFirstPage}</td>
                  {/* <td>{index + 1}</td> */}
                  <td>{item.name}</td>
                  <td>{numberWithCommas(item.total)}</td>
                  <td>{numberWithCommas(item.totalMale)}</td>
                  <td>{numberWithCommas(item.totalFemale)}</td>
                </tr>
              ))}
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
      )}
    </React.Fragment>
  );
}

export default ExportExcel;

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
        modelName: code,
        limit: numberRecordLimitBackEnd,
        // startDate: typeof filter.startDate === 'string' ? filter.startDate : moment(filter.startDate).format('YYYY-MM-DD'),
        // endDate: typeof filter.endDate === 'string' ? filter.endDate : moment(filter.endDate).format('YYYY-MM-DD'),
      });
      const apiUrl = `${url}?${query}`;

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

  const getDataPagination = async (skip, limit, totalPage, pageNumber) => {
    try {
      const newFilter = {
        ...filter,
        skip,
        limit,
        modelName: code,
        // startDate: typeof filter.startDate === 'string' ? filter.startDate : moment(filter.startDate).format('YYYY-MM-DD'),
        // endDate: typeof filter.endDate === 'string' ? filter.endDate : moment(filter.endDate).format('YYYY-MM-DD'),
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
      {open ? (
        <Loading />
      ) : (
        <div id="reportTaskWeek" style={{ display: 'none' }}>
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
              <br /> */}
              {/* <tr>
                <td>Ngày tháng:</td>
                <td>
                  {`${formatExportDate(startDate)}`}-{`${formatExportDate(endDate)}`}
                </td>
              </tr> */}
              <br />
              <tr>
                <td>Ngày xuất báo cáo:</td>
                <td>{`${moment().format('DD/MM/YYYY')}`}</td>
              </tr>
            </tbody>
          </table>
          <br />
          <table>
            <thead>
              <tr style={{ background: '#959a95' }}>
                <th>STT</th>
                <th>Mã CVDA</th>
                <th>Tên dự án</th>
                <th>Khách hàng</th>
                <th>Giá trị HĐ</th>
                <th>Tiến độ thực hiện</th>
                <th>Cán bộ theo dõi</th>
                <th>Trong tuần</th>
                {/* <th>Tình trạng</th> */}
                <th>Tới tuần</th>
                <th>Kiến nghị</th>
                {/* <th>Chức vụ</th> */}
                {/* <th>Thử thách</th>
                <th>Thưởng kinh doanh</th>
                <th>Dừng dải ngân</th>
                <th>Vi phạm</th>
                <th>Nghỉ không lương</th> */}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr>
                  <td>{index + numberOrderFirstPage}</td>
                  {/* <td>{index + 1}</td> */}
                  <td>{item.code}</td>
                  <td>{item.name}</td>
                  <td>{item.customer}</td>
                  <td>{item.totalContractValue}</td>
                  <td>{item.duration}</td>
                  <td>{item.inCharge}</td>
                  <td>
                    {Array.isArray(item.weekTasks)
                      ? item.weekTasks.map(t => (
                          <div>
                            <div>
                              <b>{t.name}</b>
                            </div>
                            {Array.isArray(t.comments)
                              ? t.comments.map(c => (
                                  <div style={{ paddingLeft: 10 }}>
                                    {`${c.user ? c.user.name : ''} - ${c.user && c.user.organizationUnit ? c.user.organizationUnit.name : ''} : ${
                                      c.content
                                    }`}
                                  </div>
                                ))
                              : null}
                          </div>
                        ))
                      : null}
                  </td>
                  {/* <td>{item.employeeId && item.employeeId.typeEmp}</td> */}
                  <td>
                    {Array.isArray(item.nextWeekTasks)
                      ? item.nextWeekTasks.map(t => (
                          <div>
                            <div>
                              <b>{t.name}</b>
                            </div>
                            {Array.isArray(t.comments)
                              ? t.comments.map(c => (
                                  <div style={{ paddingLeft: 10 }}>
                                    {`${c.user ? c.user.name : ''} - ${c.user && c.user.organizationUnit ? c.user.organizationUnit.name : ''} : ${
                                      c.content
                                    }`}
                                  </div>
                                ))
                              : null}
                          </div>
                        ))
                      : null}
                  </td>
                  <td />
                  {/* <td>{item.employeeId && item.employeeId.positions}</td> */}
                  {/* <td>{item.employeeId && item.employeeId.challengeInformation}</td>
                  <td>{item.employeeId && item.employeeId.businessBonus}</td>
                  <td>{item.employeeId && item.employeeId.disbursementPause}</td>
                  <td>{item.employeeId && item.employeeId.violate}</td>
                  <td>{item.employeeId && item.employeeId.vacation}</td> */}
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

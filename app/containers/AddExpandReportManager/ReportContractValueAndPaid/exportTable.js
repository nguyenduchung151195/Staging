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
const formatExportDate1 = date => {
  return date.format('DD/MM/YYYY');
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
        <div id="reportContractValueAndPaid" style={{ display: 'none' }}>
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
              </tr>
              <br /> */}
              <tr>
                <td>Ngày xuất báo cáo:</td>
                <td>{`${formatExportDate1(moment())}`}</td>
              </tr>
            </tbody>
          </table>
          <br />
          <table>
            <thead>
              <tr style={{ background: '#959a95' }}>
                <th>STT</th>
                <th>Nội dung</th>
                <th>Số lượng</th>
                <th>Giá trị</th>
                <th>Thông tin hợp đồng/ Biện pháp xử lý</th>
              </tr>
            </thead>
            {/* <tbody>
              {data.map((item, index) => (
                <tr>
                  <td>{index + numberOrderFirstPage}</td>
                  <td>{item.name}</td>
                  <td>{item.amount}</td>
                  <td>{item.value}</td>
                  <td>{item.information ? iten.information : ''}</td>
                </tr>
              ))}
            </tbody> */}
            <tbody>
              <tr>
                <td>1</td>
                <td>Tổng giá trị Hợp đồng</td>
                <td>{data.contractAmount}</td>
                <td>{data.contractValue}</td>
                <td>{''}</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Lũy kế tiền về</td>
                <td />
                <td />
                <td>{''}</td>
              </tr>
              <tr>
                <td />
                <td> - Tuần trước</td>
                <td>-</td>
                <td>{data.lastWeekIncome}</td>
                <td>{''}</td>
              </tr>
              <tr>
                <td />
                <td> - Tuần này</td>
                <td>-</td>
                <td>{data.currentWeekIncom}</td>
                <td>{''}</td>
              </tr>
              <tr>
                <td>3</td>
                <td> Giá trị cần thanh toán</td>
                <td>{data.debtAmount}</td>
                <td>{data.debtValue}</td>
                <td>{''}</td>
              </tr>
              <tr>
                <td>3.1</td>
                <td> Tình trạng xuất hóa đơn</td>
                <td>-</td>
                <td>-</td>
                <td>{''}</td>
              </tr>
              <tr>
                <td />
                <td>- Các công trình đã xuất hóa đơn VAT</td>
                <td>{data.hasBillAmount}</td>
                <td>-</td>
                <td>{''}</td>
              </tr>
              <tr>
                <td />
                <td>- Chưa xuất hóa đơn</td>
                <td>{data.notBillAmount}</td>
                <td>-</td>
                <td>{''}</td>
              </tr>
              <tr>
                <td>3.2</td>
                <td>Tình trạng thanh toán</td>
                <td>-</td>
                <td>-</td>
                <td>{''}</td>
              </tr>
              {data &&
                data.paidState && (
                  <>
                    {data.paidState.map((item, index) => {
                      return (
                        <tr key={item.title}>
                          <td />
                          <td>{item.title}</td>
                          <td>{item.value}</td>
                          <td />
                          <td />
                        </tr>
                      );
                    })}
                  </>
                )}
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

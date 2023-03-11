import React, { memo, useState, useEffect } from 'react';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import { API_TIMEKEEPING_LOG } from '../../../../../../config/urlConfig'

function TimekeepLog(props) {
    const { cellData } = props;
    const [notifications, setNotifications] = useState([]);

    useEffect(
        () => {
            const cellId = cellData ? cellData.day._id : ''
            if (cellData) {
                fetch(`${API_TIMEKEEPING_LOG}/${cellId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                })
                    .then(result => result.json())
                    .then(data => {
                        // setCount(data.count);
                        const newDt = data.data
                        newDt.forEach(val => {
                            val.newRecord = JSON.parse(val.newRecord)
                            val.oldRecord = JSON.parse(val.oldRecord)
                        })
                        setNotifications(newDt);
                    });
            }
        },
        [cellData],
    );

    return (
        <>
            <p style={{ fontWeight: 'bold', marginRight: 5, fontSize: 20 }}>Lịch sử cập nhật:</p>
            <div style={{ maxHeight: 200, overflow: 'auto' }}>
                {notifications.length !== 0
                    ? notifications.map(elm => (
                        <div >
                            <div style={{ display: 'flex' }}>
                                <p style={{ fontWeight: 'bold', marginRight: 5, fontSize: 14 }}>{elm.employeeId ? elm.employeeId.name : 'Admin'}:</p>
                                <p style={{ fontSize: 12, marginRight: 3 }}>{elm.log}.</p>
                                <p style={{ fontSize: 12 }}>{`Giá trị cũ ${elm.oldRecord.symbol ? elm.oldRecord.symbol : 'không có dữ liệu '} đổi thành giá trị mới: ${elm.newRecord.symbol ? elm.newRecord.symbol : 'không có dữ liệu '}`}</p>
                            </div>
                            <p style={{ fontSize: 12 }}>{`Ngày cập nhật: ${moment(elm.updatedAt).format('DD-MM-YYYY')}`}</p>
                        </div>
                    ))
                    : 'Chưa có chỉnh sửa'
                }
            </div>
        </>
    )
}

export default compose(
    memo,
    injectIntl,
)(TimekeepLog);
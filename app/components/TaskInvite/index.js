/**
 *
 * TaskInvite
 *
 */

import React, { useEffect } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Avatar, Typography } from '@material-ui/core';
import { Dialog, TextField } from '../LifetekUi';
import { fetchData, serialize } from '../../helper';
import { API_TASK_PROJECT } from '../../config/urlConfig';

import Snackbar from '../Snackbar';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
const arrType = ['Người tham gia', 'Người phụ trách', 'Người hỗ trợ'];
function TaskInvite() {
  const [limit, setLimit] = React.useState(10);
  const [data, setData] = React.useState([]);
  const [snackbar, setSnackbar] = React.useState({ open: false, variant: 'success', message: '' });
  const [state, setState] = React.useState({ dialog: false, id: null, reason: '' });

  async function getData() {
    const query = serialize({ limit: { limit }, filterUser: true });
    try {
      const respon = await fetchData(`${API_TASK_PROJECT}/invite?${query}`);
      setData(respon.data);
    } catch (error) {
      setSnackbar({ open: true, variant: 'error', message: 'Lấy dữ liệu thất bại' });
    }
  }

  async function replyInvite(id, isAccept) {
    try {
      await fetchData(`${API_TASK_PROJECT}/invite`, 'POST', {
        id,
        isAccept,
        reason: state.reason,
      });
      getData();
      setSnackbar({ open: true, variant: 'success', message: 'Cập nhật thành công' });
    } catch (error) {
      setSnackbar({ open: true, variant: 'error', message: 'Cập nhật không thành công' });
    }
  }

  useEffect(
    () => {
      getData();
    },
    [limit],
  );

  function refuseInvite() {
    if (state.reason.trim()) {
      setState({ ...state, dialog: false });
      replyInvite(state.id, false);
    }
  }

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tên công việc</TableCell>
            <TableCell>Vai trò</TableCell>
            <TableCell>Người mời</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(i => (
            <TableRow>
              <TableCell>{i.taskId.name}</TableCell>
              <TableCell>{arrType[i.type * 1 - 1]}</TableCell>
              <TableCell>
                <Avatar src="https://vnn-imgs-f.vgcloud.vn/2019/05/03/11/co-gai-khien-hot-girl-tram-anh-bi-lu-mo-vi-qua-xinh-dep-3.jpg" />
              </TableCell>
              <TableCell>
                <Button onClick={() => replyInvite(i._id, true)} color="primary" variant="outlined">
                  Chấp nhận
                </Button>
                <Button onClick={() => setState({ dialog: true, id: i._id, reason: '' })} color="secondary" variant="outlined">
                  Từ chối
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog saveText="Gửi" onSave={refuseInvite} maxWidth="sm" onClose={() => setState({ ...state, dialog: false })} open={state.dialog}>
        <Typography>Nhập lý do </Typography>
        <TextField
          helperText={state.reason.trim() ? null : 'Không được bỏ trống'}
          error={!state.reason.trim()}
          onChange={e => setState({ ...state, reason: e.target.value })}
          value={state.reason}
          multiline
          rows={3}
        />
      </Dialog>
      <Button style={{ float: 'right' }} color="primary" onClick={() => setLimit(limit + 10)}>
        Xem thêm
      </Button>
      <Snackbar
        onClose={() => setSnackbar({ open: false, variant: 'success', message: '' })}
        message={snackbar.message}
        open={snackbar.open}
        variant={snackbar.variant}
      />
    </div>
  );
}

TaskInvite.propTypes = {};

export default TaskInvite;

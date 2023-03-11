import React, { useEffect, memo, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import CustomInputBase from '../../Input/CustomInputBase';
import CustomButton from '../../Button/CustomButton';

function DialogCreateEdit(props) {
  const { openModal, handleClose, handleEdit, handleAdd, title, label, isEdit, value, onChangeInput, error, data } = props;
  const [oldItem, setOldItem] = useState({})
  useEffect(() => {
    console.log(value, 'value')
    const old = data.find(it => it.title === value) || {}
    setOldItem(old)
  }, [])
  return (
    <Dialog open={openModal} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">{isEdit ? 'Cập nhật ' + title : 'Thêm mới ' + title}</DialogTitle>
      <DialogContent style={{ width: 600 }}>
        <CustomInputBase
          fullWidth
          id="standard-name"
          label={label}
          value={value}
          inputProps={{ maxLength: 250 }}
          onChange={e => onChangeInput(e.target.value)}
          margin="normal"
          // name={value}
          // error={error && error.title}
          // helperText={error && error.title}
          error={value === ''}
          helperText={value === '' ? 'Không được để trống' + ' ' + label : ''}
        />
      </DialogContent>
      <DialogActions>
        <CustomButton
          onClick={() => {
            // handleClose()
            // if (isEdit) {
            //   // handleEdit();
            //   if(data){
            //     const title1 = data.map(item => item.title);
            //     if(title1.includes(value.trim())){
            //       alert('Tên cấu hình danh mục đã tồn tại')
            //     }else {
            //       handleEdit();
            //     }
            //   }
            // } else {
            //   if(data){
            //     const title1 = data.map(item => item.title);
            //     // console.log('title', title1);
            //     // console.log('value', value);
            //     if(title1.includes(value.trim())){
            //       alert('Tên cấu hình danh mục đã tồn tại')
            //     }else {
            //       handleAdd();
            //     }
            //   }
            // }
            if (data) {
              const title1 = data.map(item => item.title);
              let check = true
              check = data.find(it => it.title === value && it._id !== oldItem._id)
              console.log(check, "check", "oldItem", oldItem)
              // if (title1.includes(value.toLowerCase().trim()) || title1.includes((value.charAt(0).toUpperCase() + value.slice(1)).trim())) {
              if (check) {
                props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Tên cấu hình danh mục đã tồn tại', variant: 'warning' });
                // alert('Tên cấu hình danh mục đã tồn tại')
              } else if (isEdit) {
                handleEdit();
              } else handleAdd();
            }
            else props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Cập nhật thất bại!', variant: 'error' });
          }}
          color="primary"
        >
          {isEdit ? 'LƯU' : 'LƯU'}
        </CustomButton>
        <CustomButton onClick={handleClose} color="secondary" autoFocus>
          Hủy
        </CustomButton>
      </DialogActions>
    </Dialog >
  );
}

export default memo(DialogCreateEdit);

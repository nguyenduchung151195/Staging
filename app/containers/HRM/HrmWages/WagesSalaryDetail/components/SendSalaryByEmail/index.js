import React, { memo, useState, useEffect } from 'react';
import { compose } from 'redux';
import { DialogContent, Grid, Button, Dialog, DialogTitle, Typography, MenuItem, DialogActions } from '@material-ui/core';
import CustomInputBase from 'components/Input/CustomInputBase';
import { formatTemplateSendEmailSalary } from 'helper';

function ModalSalaryCalculationDetails(props) {
  const { open, onClose, onSendMail, rows, templates, listTitle, wageTable, formulaId } = props;
  const [localData, setLocalData] = useState({
    title: '',
    template: '0',
    content: '',
    data: [],
  });
  const [localMessages, setLocalMessages] = useState('Không được để trống tiêu đề');

  useEffect(
    () => {
      if (localData.template != 0) {
        const viewConfigData = JSON.parse(localStorage.getItem('viewConfig'));
        const viewConfig = viewConfigData && viewConfigData.filter(item => (item.code === localData.template.moduleCode ? item : null));
        formatTemplateSendEmailSalary(localData.template.content, localData.data, localData.template.moduleCode, listTitle).then(result =>
          setLocalData({
            ...localData,
            moduleCode: localData.template.moduleCode,
            viewConfig: viewConfig ? viewConfig[0] : null,
            content: result,
          }),
        );
      }
    },
    [localData.template],
  );

  const handleChange = e => {
    const {
      target: { value, name },
    } = e;
    setLocalData({ ...localData, [name]: value });
  };

  const handleSendMail = () => {
    if (onSendMail) {
      onSendMail({
        ...localData,
        hrmWageId: wageTable
      });
    }
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle id="alert-dialog-title">Gửi phiếu lương</DialogTitle>
        <DialogContent style={{ width: 600 }}>
          <CustomInputBase
            type="text"
            label="Tiêu đề"
            name="title"
            value={localData.title}
            onChange={handleChange}
            error={localData.title ? '' : localMessages}
            helperText={localData.title ? '' : localMessages}
          />
          <CustomInputBase select label="Biểu mẫu động" name="template" onChange={handleChange} value={localData.template}>
            <MenuItem value={0}>--- Chọn biểu mẫu động ---</MenuItem>
            {Array.isArray(templates) &&
              templates.length &&
              templates.filter(t => t.formulaId === formulaId).map(template => {
                return <MenuItem value={template}>{template.title}</MenuItem>;
              })}
          </CustomInputBase>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSendMail} variant="outlined" color="primary">
            Gửi
          </Button>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default compose(memo)(ModalSalaryCalculationDetails);

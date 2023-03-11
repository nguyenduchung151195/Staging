import React, { memo, useEffect, useState } from 'react';
import { chunk } from 'lodash';
import moment from 'moment';
import ImportFile from 'components/ImportFile';
import XLSX from 'xlsx';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Icon,
  FormLabel,
  Paper,
  withStyles,
  Button,
  StepLabel,
  Table,
  Stepper,
  Step,
  StepContent,
  MenuItem,
  Grid,
} from '@material-ui/core';
import styles from './styles';
import { compose } from 'redux';
import CustomInputBase from 'components/Input/CustomInputBase';
import TableBodyImportTimekeeping from './../TableBodyImportTimekeeping/Loadable';
import { isArray } from 'helper';
import CustomAppBar from 'components/CustomAppBar';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { mergeData as MergeData } from '../../../../../Dashboard/actions';
import PropTypes from 'prop-types';

function mapCodeEquipmentToEmployee(data, hrm2equipment) {
  let newData = [];
  if (isArray(hrm2equipment) && hrm2equipment.length) {
    isArray(data) &&
      data.length &&
      data.map((item, index) => {
        const found = hrm2equipment.filter(it => it.codeEmployee === item.codeEmployee);
        if (index === 0) {
          newData.push({ ...item });
        } else {
          if (found && found.length) {
            newData.push({ ...item, code: found[0].hrmEmployeeId.code, checked: true });
          } else {
            newData.push({ ...item, code: '', checked: false });
          }
        }
      });
  }
  return newData;
}

function ImportHrmTimeKeeping(props) {
  const { classes, timekeepingEquipment, hrm2equipment, getTimekeepingToEquipment, importTimeKeeping, onMergeData, onChangeSnackbar } = props;
  const [steps, setSteps] = useState(['Bước 1: Tải lên tệp tin chấm công của bạn', 'Bước 2: Hiện kết quả tải tệp excel, lọc danh sách cần thêm và thực hiện tải']);
  const [activeStep, setActiveStep] = useState(0);
  const [localData, setLocalData] = useState({ month: 1, year: 2020, equipment: 0, file: null, data: [] });

  useEffect(
    () => {
      if (localData.equipment != 0) {
        getTimekeepingToEquipment(localData.equipment);
      }
    },
    [localData.equipment],
  );

  useEffect(
    () => {
      if (hrm2equipment) {
        const data = mapCodeEquipmentToEmployee(localData.data, hrm2equipment);
        setLocalData({ ...localData, data });
      }
    },
    [hrm2equipment],
  );
  // const exportFile = () => {
  //   const data = this.getExportFields(this.state.fields).map(item => item.title);

  //   /* convert state to workbook */
  //   const ws = XLSX.utils.aoa_to_sheet([data]);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
  //   /* generate XLSX file and send to client */
  //   XLSX.writeFile(wb, `${this.state.modelName}_ImportTemplate.xlsx`);
  // };

  function handleFile(file /* :File */) {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = e => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }).filter(item => item.length !== 0);
      const newData = formatTimekeepingToData(data);
      setLocalData({ ...localData, data: newData, file });
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  }

  const importData = () => {
    const { equipment, month, year, data } = localData;
    let newData = [];
    data && data.map(item => item.checked && newData.push(item));
    if (newData && newData.length) {
      importTimeKeeping({ equipmentId: equipment, month, year, dataTimekeepings: newData });
    }
    else onChangeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' });
  };

  const handleNext = () => {
    if (activeStep === 0) {
      document.querySelector('#dialog').style.display = 'block';
    }
    setTimeout(() => {
      setActiveStep(activeStep + 1);
      document.querySelector('#dialog').style.display = 'none';
    }, 100);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  function formatTimekeepingToData(timekeeping) {
    const data = timekeeping.map(([date, day, codeEmployee, name, department, position, ...rest]) => ({
      date,
      day,
      codeEmployee,
      name,
      department,
      position,
      data: [...rest],
    }));

    let newData = [];
    data.map(item => {
      if (item.data.length) {
        newData = [...newData, { ...item, data: item.data.map((it, index) => it) }];
      }
    });

    newData = groupBy(newData, 'codeEmployee');

    let newGroupByCode = [];
    newData.map(item => {
      const newItem = { codeEmployee: item[0].codeEmployee, name: item[0].name, data: item.map(it => ({ date: it.date, data: it.data })) };
      newGroupByCode.push(newItem);
    });

    /*
    *	kiem tra ngay:gio
    *	param: "08:30"
    * result: true or false
    */
    const CheckHoursAndMinutes = hoursAndMinutes => {
      return /^\d{2}:\d{2}$/.test(hoursAndMinutes);
    };
    /*
    * chuyen doi array array to array object
    * hoursAndMinutes = ["08:36", "18:09", "18:30", "21:30"]
    * result = [{in: "08:36", out: "18:09"}, {in: "18:30", out: "21:30"}]
    */
    function convertTimes(hoursAndMinutes) {
      let newHoursAndMinutes = [];
      if (isArray(hoursAndMinutes) && hoursAndMinutes.length) {
        for (let i = 0; i < hoursAndMinutes.length; i++) {
          if (CheckHoursAndMinutes(hoursAndMinutes[i])) {
            newHoursAndMinutes.push(hoursAndMinutes[i]);
          }
        }
        newHoursAndMinutes = chunk(newHoursAndMinutes, 2);
        newHoursAndMinutes = Object.keys(newHoursAndMinutes).map(key => ({
          in: newHoursAndMinutes[key][0] ? newHoursAndMinutes[key][0] : '',
          out: newHoursAndMinutes[key][1] ? newHoursAndMinutes[key][1] : '',
        }));
      }
      return newHoursAndMinutes;
    }

    /*
    *	gop cac array array to array object
    * params: 
    * 	params 1: array = [[44172, "Tư", "00002", "Trương Đức Hùng", "Phòng Hành chính - Kế toán", "Chưa SX", "08:22", "18:06"], [44172, "Tư", "00002", "Trương Đức Hùng", "Phòng Hành chính - Kế toán", "Chưa SX", "08:22", "18:06"],]
    * 	params 2: prop = "code" // ten gop
    *		``
    */
    function groupBy(arr, prop) {
      const map = new Map(Array.from(arr, obj => [obj[prop], []]));
      arr.forEach(obj => map.get(obj[prop]).push(obj));
      return Array.from(map.values());
    }

    function formatDate(d) {
      return moment()
        .set('y', 1900)
        .startOf('y')
        .add(d, 'd')
        .format('MM/DD/YYYY');
    }

    const newDataFormat = newGroupByCode.map(item => ({
      ...item,
      data: item.data.map(it => ({ ...it, date: formatDate(it.date), data: convertTimes(it.data) })),
    }));
    return newDataFormat;
  }

  const handleChange = e => {
    if (e.target.name === 'month' && e.target.value > -1 && e.target.value < 13) {
      e.target.value = e.target.value.replace(/^(0|\+?[1-9][0-9][3-9]\d*)$/);
      const {
        target: { value, name },
      } = e;
      setLocalData({ ...localData, [name]: value });
    }
    if (e.target.name === 'year') {
      e.target.value = e.target.value.replace(/^(0|\+?[1-9][0-9][0-9][0-9][0-9]\d*)$/);
      const {
        target: { value, name },
      } = e;
      setLocalData({ ...localData, [name]: value });
    }
    if (e.target.name === 'equipment') {
      const {
        target: { value, name },
      } = e;
      setLocalData({ ...localData, [name]: value });
    }
  };

  const handleChangeImport = (e, index) => {
    const newData = [...localData.data];
    if (e.target.name === 'checked') {
      newData[index] = {
        ...newData[index],
        [e.target.name]: e.target.checked,
      };
    } else {
      newData[index] = {
        ...newData[index],
        [e.target.name]: e.target.value,
      };
    }

    setLocalData({ ...localData, data: newData });
  };

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <div>
            <FormLabel>Vui lòng chọn file để tiếp tục bước tiếp theo </FormLabel>
            <ImportFile handleFile={handleFile} fileName={localData.file ? localData.file.name : ''} />
          </div>
        );
      case 1:
        return (
          <div>
            <Grid container spacing={16} md={6}>
              <Grid item xs={4}>
                <CustomInputBase
                  type="number"
                  value={localData.month}
                  onChange={handleChange}
                  name="month"
                  label="Tháng"
                  error={localData.month ? '' : 'không được để trống trường tháng'}
                  helperText={localData.month ? '' : 'không được để trống trường tháng'}
                />
              </Grid>
              <Grid item xs={4}>
                <CustomInputBase
                  type="number"
                  value={localData.year}
                  onChange={handleChange}
                  name="year"
                  label="Năm"
                  error={localData.year ? '' : 'không được để trống trường năm'}
                  helperText={localData.year ? '' : 'không được để trống trường năm'}
                />
              </Grid>
              <Grid item xs={4}>
                <CustomInputBase
                  select
                  label="Chọn máy chấm công"
                  name="equipment"
                  onChange={handleChange}
                  value={localData.equipment}
                  error={localData.equipment !== 0 ? '' : 'chọn máy chấm công'}
                  helperText={localData.equipment !== 0 ? '' : 'chọn máy chấm công'}
                >
                  <MenuItem value={0}>Chọn máy chấm công</MenuItem>
                  {isArray(timekeepingEquipment) &&
                    timekeepingEquipment.length &&
                    timekeepingEquipment.map(equipment => {
                      return <MenuItem value={equipment._id}>{equipment.name}</MenuItem>;
                    })}
                </CustomInputBase>
              </Grid>
            </Grid>
            <Paper
              style={{
                width: '100%',
                maxHeight: '700px',
                overflow: 'scroll',
              }}
            >
              <Table>
                <TableBodyImportTimekeeping
                  data={localData.data}
                  month={localData.month}
                  year={localData.year}
                  handleChangeImport={handleChangeImport}
                />
              </Table>
            </Paper>
          </div>
        );
      default:
        return 'Unknown step';
    }
  };
  useEffect(() => {
    return () => {
      setTimeout(() => {
        onMergeData({ hiddenHeader: false });
      });
    };
  }, []);
  return (
    <div style={{ width: "calc( 100vw - 260px)" }}>
      <CustomAppBar
        title="Tải lên tập tin"
        onGoBack={() => props.onClose && props.onClose()}
        disableAdd
      // onSubmit={this.onSubmit}
      />
      <Grid style={{ marginTop: 50 }} ></Grid>
      <Paper>
        <Dialog id="dialog" style={{ display: 'none' }} open aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Đang xử lý tệp Excel , vui lòng chờ ...</DialogContentText>
            <DialogContentText style={{ textAlign: 'center' }}>
              <Icon style={{ margin: 10, color: 'green' }} className="fa fa-spinner fa-pulse" />
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                {getStepContent(activeStep)}
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Trở lại
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={activeStep !== 1 ? handleNext : importData}
                  disabled={(!localData.file && activeStep === 0) || (activeStep === 1 && !localData.equipment)}
                >
                  {activeStep === steps.length - 1 ? 'Tiến hành import' : 'Tiếp theo'}
                </Button>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </div>
  );
}

ImportHrmTimeKeeping.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};
const mapStateToProps = createStructuredSelector({});
function mapDispatchToProps(dispatch) {
  return {
    onMergeData: data => dispatch(MergeData(data)),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default compose(
  memo,
  withConnect,
  withStyles(styles),
)(ImportHrmTimeKeeping);

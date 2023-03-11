import React, { memo, useState, useEffect, useCallback } from 'react';
// import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import { Dialog, TextField, Button, DialogTitle, DialogActions, Checkbox, Tooltip } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import GridMUI from '@material-ui/core/Grid';

const fakeData = [
  {
    name: 'Phụ cấp ăn trưa',
    group: 'Phụ cấp',
    checkShow: true,
    checkDisable: false,
  },
  {
    name: 'Phụ cấp xăng xe',
    group: 'Phụ cấp',
    checkShow: true,
    checkDisable: false,
  },
  {
    name: 'Lương dự án 1',
    group: 'Lương',
    checkShow: true,
    checkDisable: false,
  },

  {
    name: 'Lương dự án 2',
    group: 'Lương',
    checkShow: true,
    checkDisable: false,
  },
  {
    name: 'Thưởng tết',
    group: 'Thưởng',
    checkShow: true,
    checkDisable: false,
  },

  {
    name: 'Lương dự án 3',
    group: 'Lương',
    checkShow: true,
    checkDisable: false,
  },

  {
    name: 'Thưởng Nghỉ lễ lao động',
    group: 'Thưởng',
    checkShow: true,
    checkDisable: false,
  },

  {
    name: 'Phụ cấp điện thoại',
    group: 'Phụ cấp',
    checkShow: true,
    checkDisable: false,
  },
  {
    name: 'Lương dự án 4',
    group: 'Lương',
    checkShow: true,
    checkDisable: false,
  },
];

function DialogViewConfig(props) {
  const { open, onClose, listTitle, on } = props;
  const [rawData, setRawData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    // localStorage.setItem ('fakeData', JSON.stringify(fakeData));
    // setRawData(JSON.parse(localStorage.getItem ('fakeData')))

    arrayProcessing(fakeData);
  }, []);
  // console.log('check>>>>,rawData', rawData)
  const arrayProcessing = val => {
    // console.log('check>>>>>', val)
    const newList = [];
    var count = 1;
    val.map(item => {
      if (item.checkShow) {
        if (!newList.find(elem => elem.name === item.group)) {
          newList.push({
            name: item.group,
            children: [item],
            lenght: 1,
            groupNumber: count,
            parent: null,
            checkShow: true,
          });
          count += 1;
        } else {
          const data = newList.find(elem => elem.name === item.group);
          data.children.push(item);
          data.lenght += 1;
        }
      }
    });
    setColumns(newList);
  };

  const findChildren = data => {
    const newData = data.filter(item => item.parent === null);
    getLevel(newData, 0);
    return newData;
  };

  const getLevel = (arr, lvl) => {
    arr.forEach(item => {
      item.level = lvl;
      if (item.children) {
        getLevel(item.children, lvl + 1);
      }
    });
  };

  const mapItem = (array, result = []) => {
    array.map((item, index) => {
      result.push(
        <GridMUI container alignItems="center">
          <GridMUI item sm={10}>
            <TextField
              variant="outlined"
              fullWidth
              value={item.name}
              className="mb-3 ml-4 mr-4"
              style={{ paddingLeft: 25 * item.level }}
              InputProps={{
                readOnly: true,
              }}
            />
          </GridMUI>
          <GridMUI item sm={2}>
            {/* <FormControlLabel
              className="px-3"
              control={ */}
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Checkbox
                disabled={item.checkDisable}
                checked={item.checkShow}
                onChange={() => {
                  handleChecked(index, item);
                }}
                value="checked"
                color="primary"
              />
              {/* <Checkbox
                inputProps={{
                  name: [item.name],
                }}
                onChange={this.handleCheckedRequireForm}
                checked={item.isRequire ? true : item.checkedRequireForm}
                color="primary"
                disabled={item.isRequire}
              />
              <Checkbox
                inputProps={{
                  name: [item.name],
                }}
                onChange={this.handleCheckedShowForm}
                checked={(item.isRequire || item.checkedRequireForm) ? true : item.checkedShowForm}
                color="primary"
                disabled={item.isRequire || item.checkedRequireForm}
              /> */}
            </div>
          </GridMUI>
        </GridMUI>,
      );
      if (item.children) mapItem(item.children, result);
    });
    return result;
  };

  const handleChecked = (index, item) => {
    const newList = [...columns];
    if (item.level === 0) {
      newList[index].checkShow = !newList[index].checkShow;
      const listChildrent = item.children;
      listChildrent.forEach(item => {
        item.checkShow = newList[index].checkShow;
        item.checkDisable = !newList[index].checkShow;
      });
      setColumns(newList);
    } else {
      const parent = newList.find(elem => elem.name === item.group);
      const listChildrent = parent.children;
      listChildrent[index].checkShow = !listChildrent[index].checkShow;
      setColumns(newList);
    }
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle id="form-dialog-title">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flexGrow: 1 }}>Cấu hình bảng</span>
          <div style={{ display: 'flex', justifyContent: 'space-around', width: '12%', padding: '0px 2%' }}>
            <Tooltip title="Ẩn/Hiện trường thông tin trong bảng">
              <VisibilityIcon />
            </Tooltip>
            {/* <Tooltip title="Bắt buộc phải nhập thông tin">
              <InputIcon />
            </Tooltip>
            <Tooltip title="Ẩn/Hiện trường thông tin trong form thêm mới dự án">
              <FormatIndentIncreaseIcon />
            </Tooltip> */}
          </div>
        </div>
      </DialogTitle>

      {mapItem(findChildren(columns))}
      <DialogActions>
        <div className="mr-3">
          <Button variant="outlined" color="primary">
            Lưu
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default compose(memo)(DialogViewConfig);

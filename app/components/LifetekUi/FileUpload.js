import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Grid, Tooltip, Link, DialogTitle } from '@material-ui/core';
import { Delete, CloudUpload, Folder, Add, Visibility, CloudDownload } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Dialog } from '.';
import { fetchData, isArray } from '../../helper';
import { UPLOAD_APP_URL, APP_URL, HRM_UPLOAD_AVATAR, API_UPLOAD_IMAGE_AI, UPLOAD_FILE_METADATA } from '../../config/urlConfig';
import { clientId, allowedFileExts } from '../../variable';
import moment from 'moment';
import CustomGroupInputField from '../Input/CustomGroupInputField';
import Snackbar from 'components/Snackbar';

const SheetJSFT = allowedFileExts.join(',');

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  tableCell: {
    padding: '4px 20px',
    textWrap: 'wrap',
  },
  txtRight: {
    textAlign: 'right',
  },
});

function downloadFile(url, fileName) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(this.response);
    const tag = document.createElement('a');
    tag.href = imageUrl;
    tag.download = fileName;
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
  };
  xhr.send();
}

function FileUpload({
  code,
  id,
  name,
  hiddenPadding,
  classes,
  disableWhenApproved,
  taskId,
  size,
  employee,
  viewOnly,
  reload,
  disableEdit,
  disableDelete,
  nameFile,
  profile
}) {
  const [files, setFiles] = React.useState([]);
  const [list, setList] = React.useState([]);
  const [state, setState] = React.useState({ display: false, select: null, type: 0, name: 'root', dialog: false, img: false, dialogtext: false });
  const [parentFolder, setParentFolder] = React.useState(name);
  const [localState, setLocalState] = React.useState({
    others: {},
  });
  const [fileId, setFileId] = React.useState(null);
  const [canShowModal, setCanShowModal] = React.useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    variant: 'success',
    message: '',
  });
  async function getFiles() {
    try {
      if (!code || !id || id === 'add') return;
      const url = `${UPLOAD_APP_URL}/file-system/company?clientId=${clientId}&code=${code}&id=${taskId || id}`;
      const result = await fetchData(url, 'GET', null, 'token_03');
      const midPath = result.find(i => i.mid);
      if (midPath) {
        const listFiles = result.filter(i => i.parentPath === midPath.fullPath && !i.isFile);
        if (listFiles.length) setList(listFiles);
      }
      if (isArray(result)) setFiles(result.filter(i => i.isFile));
    } catch (error) {
      console.log(error);
    }
  }

  async function getProjectTree() {
    try {
      if (!code || !id || id === 'add' || !taskId || id === taskId) return;
      const url = `${APP_URL}/api/tasks/getProjectTree?projectId=${id}&taskId=${taskId}`;
      const result = await fetchData(url, 'GET', null, 'token');

      if (result && result.status && result.data && result.data.parentTaskNames && result.data.parentTaskNames.length) {
        setParentFolder(result.data.parentTaskNames.join('/'));
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteFile(id, name) {
    const answer = confirm('Bạn có chắc chắc muốn xóa file này không?');
    if (!answer) return;
    try {
      const urlHistory = `${APP_URL}/api/modulehistory`;
      const head = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // id: taskId ? taskId : idData,
          id: taskId ? taskId : id,
          content: `Xóa file ${name}`,
          actionType: `Xóa file`,
          file: [{ fileId: id, fileName: name }],
        }),
      };
      await fetch(urlHistory, head);
      const url = `${UPLOAD_APP_URL}/file-system/company?clientId=${clientId}&code=${code}&id=${id}`;
      await fetchData(url, 'DELETE', { id }, 'token_03');
      await getFiles();
    } catch (error) {
      console.log(error);
    }
  }

  // async function openFolder(){
  //   await fetchData(url, 'DELETE', { id }, 'token_03');
  // }

  const convertBase64 = file =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = error => {
        reject(error);
      };
    });

  const wrapperFn = e => {
    if (state.select === 0 && code === 'hrm') {
      uploadFile(e);
    } else {
      uploadManyFile(e);
    }
  };

  async function uploadManyFile(e) {
    if (!code || !id || !name || id === 'add') return;

    // const rex = /^[^.]+$|\.(?!(js|exe)$)([^.]+$)/;
    let filesInput = [...e.target.files];
    filesInput &&
      filesInput.map(async file => {
        const form = new FormData();
        let exts = file.name.split('.');
        const ext = exts[exts.length - 1];
        if (allowedFileExts.indexOf(`.${ext}`) === -1) return;
        form.append('fileUpload', file);

        let fname = state.name;
        let ftype = state.type;
        if (code === 'Task' && taskId && state.select === null && id !== taskId) {
          fname = parentFolder;
          ftype = 1;
        }
        let url = `${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&code=${code}&mid=${id}&mname=${name}&fname=${fname}&ftype=${ftype}&childTaskId=${taskId}`;
        if (profile) {
          const fullName = profile.name || ""
          const currentName = profile.username || ""
          // url = `${url}&fullName=${fullName}&currentName=${currentName}`
          form.append('fullName', fullName);
          form.append('currentName', currentName);
        }
        const head = {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token_03')}`,
          },
          body: form,
        };
        if (canShowModal) {
          setState({ ...state, dialogtext: true });
        } else {
          setState({ ...state, dialogtext: false });
        }

        const res = await fetch(url, head);
        if (res) {
          res.json().then(response => {
            if (response && response.success && response.data && response.data[0]) {
              setFileId(response.data[0]._id);
              const urlHistory = `${APP_URL}/api/modulehistory`;
              const head = {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  id: id,
                  actionType: `Thêm mới file`,
                  content: `Tải file lên ${response.data[0].name}`,
                  file: [{ fileId: response.data[0]._id, fileName: response.data[0].name }],
                }),
              };
              fetch(urlHistory, head);
            }
          });
        }

        await getFiles();
      });
  }

  async function uploadFile(e) {
    if (!code || !id || !name || id === 'add') return;
    const form = new FormData();
    const file = e.target.files[0];
    let exts = file.name.split('.');
    const ext = exts[exts.length - 1];
    if (allowedFileExts.indexOf(`.${ext}`) === -1) return;
    form.append('fileUpload', file);
    let fname = state.name;
    let ftype = state.type;
    if (code === 'Task' && taskId && state.select === null && id !== taskId) {
      fname = parentFolder;
      ftype = 1;
    }
    const url = `${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&code=${code}&mid=${id}&mname=${name}&fname=${fname}&ftype=${ftype}&childTaskId=${taskId}`;
    const head = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token_03')}`,
      },
      body: form,
    };
    if (canShowModal) {
      setState({ ...state, dialogtext: true });
    } else {
      setState({ ...state, dialogtext: false });
    }

    const res = await fetch(url, head);
    if (res) {
      res.json().then(response => {
        if (response && response.success && response.data && response.data[0]) {
          setFileId(response.data[0]._id);
          const urlHistory = `${APP_URL}/api/modulehistory`;
          const head = {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: id,
              actionType: `Thêm mới file`,
              content: `Tải file lên ${response.data[0].name}`,
              file: [{ fileId: response.data[0]._id, fileName: response.data[0].name }],
            }),
          };
          fetch(urlHistory, head);
        }
      });
    }
    if (state.select === 0 && code === 'hrm') {
      try {
        const dataBase64 = await convertBase64(file);
        const dataUpload = {
          data: [dataBase64.split(',')[1]],
          person_id: [id],
          table_name: `_${clientId}`,
        };
        const res = await fetchData(API_UPLOAD_IMAGE_AI, 'POST', dataUpload);
      } catch (e) {
        console.log('e', e);
      }
    }

    await getFiles();
  }

  useEffect(
    () => {
      getFiles();
      getProjectTree();
      try {
        const view = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === code);
        const fileColumns = view.listDisplay.type.fields.type.fileColumns;
        if (fileColumns && fileColumns.length) {
          setCanShowModal(true);
        }
      } catch (error) { }
    },
    [code, id],
  );

  useEffect(
    () => {
      if (!isNaN(reload)) {
        console.log('getFiles();');
        getFiles();
      }
    },
    [reload],
  );

  const handleCheck = (item, index) => {
    let newSelect;
    if (state.select === index) {
      newSelect = null;
    } else {
      newSelect = index;
    }
    if (index === 0) {
      setState({ ...state, select: newSelect, type: 0 });
    } else {
      setState({ ...state, select: newSelect, type: 1, name: item.name });
    }
  };

  function dialogSave() {
    setState({ ...state, dialogtext: false });

    const body = {
      id: fileId,
      model: 'FileManager',
      metaData: {
        others: localState.others,
      },
    };
    onCreateApprove(body);
  }

  function onCreateApprove(body) {
    fetch(UPLOAD_FILE_METADATA, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(() => {
        setSnackbar({ open: true, message: 'Thêm file thành công', variant: 'success' });
      })
      .catch(() => {
        setSnackbar({ open: false, message: 'Thêm file thất bại', variant: 'error' });
      });
  }

  const handleList = e => { };

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );

  return (
    <React.Fragment>
      {' '}
      {!code || !id || !name || id === 'add' ? null : (
        <div>
          <input onChange={wrapperFn} multiple id="fileUpload" style={{ display: 'none' }} name="fileUpload" type="file" accept={SheetJSFT} />
          {/* <input onChange={uploadFile}  id="fileUpload" style={{ display: 'none' }} name="fileUpload" type="file" accept={SheetJSFT} /> */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCell || ''}>Tên file</TableCell>
                <TableCell className={classes.tableCell || ''}>Người tạo</TableCell>
                <TableCell className={classes.tableCell || ''}>Ngày tạo</TableCell>
                <TableCell className={classes.tableCell || ''}>Loại file</TableCell>
                {disableWhenApproved && <TableCell className={classes.tableCell || ''}>Trạng thái</TableCell>}
                {viewOnly ? <TableCell className={classes.tableCell || ''}>Người phê duyệt</TableCell> : null}

                <TableCell className={classes.tableCell || ''}>Xem chi tiết</TableCell>
                <TableCell className={classes.tableCell || ''}>Tải file</TableCell>
                {!viewOnly ? <TableCell className={classes.tableCell || ''}>Hành động</TableCell> : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {code === 'hrm' ? (
                <TableRow>
                  <Grid container alignItems="center">
                    <Grid item>
                      <Add style={{ fontSize: '1rem', cursor: 'pointer' }} onClick={() => setState({ ...state, display: !state.display })} />
                      <Folder style={{ color: '#d8d877' }} />
                      <span className="ml-2"> {nameFile ? nameFile : `Ảnh đại diện`} </span>
                    </Grid>
                    <Grid item className={classes.txtRight}>
                      <Checkbox checked={state.select === 0} onClick={() => handleCheck(null, 0)} />
                      {state.display
                        ? list.map((i, idx) => (
                          <div>
                            <Folder />
                            {i.name} <Checkbox checked={state.select === idx + 1} onClick={() => handleCheck(i, idx + 1)} />
                          </div>
                        ))
                        : null}
                    </Grid>
                  </Grid>
                </TableRow>
              ) : null}

              {files.map(file => (
                <TableRow>
                  <TableCell className={classes.tableCell || ''}>{file.name}</TableCell>
                  <TableCell className={classes.tableCell || ''}>{file.username}</TableCell>
                  <TableCell className={hiddenPadding ? classes.tableCell : ''}>{moment(file.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
                  <TableCell className={classes.tableCell || ''}>{file.type}</TableCell>
                  {viewOnly ? <TableCell className={classes.tableCell || ''}>{file.approver ? file.approver.name : ''}</TableCell> : null}
                  {disableWhenApproved && (
                    <TableCell className={classes.tableCell || ''}>{file.isApprove === true ? 'Đã duyệt' : 'Chưa duyệt'}</TableCell>
                  )}
                  <TableCell className={classes.tableCell || ''}>
                    <Visibility
                      onClick={() => {
                        let url;
                        let img;
                        if (['.jpg', '.png', '.jpeg'].includes(file.type)) {
                          url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}`;
                          img = true;
                        } else {
                          url = `https://docs.google.com/viewer?url=${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}`;
                          img = false;
                        }
                        setState({
                          ...state,
                          dialog: true,
                          url,
                          img,
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell className={classes.tableCell || ''}>
                    <CloudDownload onClick={() => downloadFile(`${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}`, file.name)} />
                  </TableCell>
                  {!viewOnly && !disableDelete ? (
                    <TableCell className={classes.tableCell || ''}>
                      {disableWhenApproved && file.isApprove ? '' : <Delete onClick={() => deleteFile(file._id, file.name)} />}
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {code === 'Task' && !viewOnly ? (
            <Grid container alignItems="center">
              <Grid item xs={3}>
                <Add style={{ fontSize: '1rem' }} onClick={() => setState({ ...state, display: !state.display })} />
                <Folder />
                <span className="ml-2"> {name} </span>
              </Grid>
              <Grid item xs={9} className={classes.txtRight}>
                <Checkbox checked={state.select === 0} onClick={() => handleCheck(null, 0)} />
                {state.display
                  ? list.map((i, idx) => (
                    <div>
                      <Folder />
                      {i.name} <Checkbox checked={state.select === idx + 1} onClick={() => handleCheck(i, idx + 1)} />
                    </div>
                  ))
                  : null}
              </Grid>
            </Grid>
          ) : null}

          {!viewOnly && !disableEdit ? (
            <label htmlFor="fileUpload" style={{ cursor: 'pointer', display: 'flex', marginLeft: 20 }}>
              <Tooltip title="Import">
                <CloudUpload color="primary" />
              </Tooltip>
            </label>
          ) : null}
        </div>
      )}
      <Dialog maxWidth={false} fullScreen open={state.dialog} onClose={() => setState({ ...state, dialog: false })}>
        <div style={{ height: '1000px' }}>
          {state.img ? (
            <img alt="HHH" src={state.url} />
          ) : (
            <iframe title="Excel" src={`${state.url}&embedded=true`} width="100%" style={{ height: '100%' }} value="file" />
          )}
        </div>
      </Dialog>
      <Dialog maxWidth="md" fullWidth open={state.dialogtext} onSave={dialogSave} onClose={() => setState({ ...state, dialogtext: false })}>
        <DialogTitle style={{ padding: '0 0 20px 0' }} id="form-dialog-title1">
          Thông tin đính kèm file
        </DialogTitle>
        <CustomGroupInputField code={code} columnPerRow={2} source="fileColumns" value={localState.others} onChange={handleOtherDataChange} />
      </Dialog>
      <Snackbar
        open={snackbar.open}
        variant={snackbar.variant}
        message={snackbar.message}
        onClose={() =>
          setSnackbar({
            open: false,
            message: '',
            variant: '',
          })
        }
      />
    </React.Fragment>
  );
}

FileUpload.propTypes = {
  classes: PropTypes.object.isRequired,
  disableWhenApproved: PropTypes.bool,
};

FileUpload.defaultProps = {
  disableWhenApproved: false,
};

export default withStyles(styles)(FileUpload);

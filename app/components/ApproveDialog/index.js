/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/**
 *
 * ApproveDialog
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import {
  Fab as Fa,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Grid as GridMaterialUI,
  TextField,
  Button,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  Tooltip
} from '@material-ui/core';
// import { PagingState, IntegratedPaging } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import { Done, Clear, HourglassEmpty, CloudDownload, SpeakerNotesOff , SpeakerNotes, UsbOutlined , UsbTwoTone } from '@material-ui/icons';
import { Grid as GridUI, Comment, FileUpload } from 'components/LifetekUi';
import CustomButton from 'components/CustomButtons/Button';
import ViewContent from 'components/ViewContent/Loadable'
import { clientId } from '../../variable';
import { UPLOAD_APP_URL } from '../../config/urlConfig';
import { fetchData,toVietNamDate, getDataBeforeSend } from '../../helper';
import ApproveFormDialog from '../../containers/ApprovePage/approveFormDialog';
import { concat } from '@amcharts/amcharts4/.internal/core/utils/Iterator';
import _ from 'lodash'
/* eslint-disable react/prefer-stateless-function */
const columns = [
  { name: 'name', title: 'Nhân viên' },
  { name: 'order', title: 'Thứ tự phê duyệt' },
  { name: 'approve', title: 'Trạng thái' },
  { name: 'reason', title: 'Lý do' },
  // { name: 'actions', title: 'Hành động' },
];
const Fab = props => <Fa {...props} />;
Fab.defaultProps = {
  size: 'small',
  color: 'primary',
  style: { margin: '5px', float: 'right' },
};
class ApproveDialog extends React.Component {
  state = {
    reason: '',
    openSelectFileDialog: false,
    files: [],
    selectedFiles: [],
    tabIndex: 0
  };

  componentDidMount() {
    this.getFiles();
    const { dialogData: data } = this.props;
    getDataBeforeSend({
      templateId: data.dynamicForm,
      dataId: data.dataInfo ? (data.dataInfo.idOb ? data.dataInfo.idOb : data.dataInfo._id) : null,
      moduleCode: data.collectionCode,
    }).then(html => {
      this.setState({ openForm: true, formContent: html });
    });
  }

  downloadFile = (url, fileName) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    // eslint-disable-next-line func-names
    xhr.onload = function() {
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
  };

  checkCurrentUserTurn = (currentUser, dialogData) => {
    if (dialogData.groupInfo) {
      const approveTurn = dialogData.groupInfo.find(d => d.order === dialogData.approveIndex);

      if (approveTurn && currentUser.userId === approveTurn.person && approveTurn.approve === 0) {
        return true;
      }
    }

    return false;
  };

  handleGetFiles = () => {
    this.setState({ openSelectFileDialog: true });
  };

  getFiles = async () => {
    const { dialogData } = this.props;

    const { _id, projectId, name } = dialogData.dataInfo;
    const isTask = projectId && projectId !== _id;
    const mid = isTask ? projectId : _id;
    try {
      const url = `${UPLOAD_APP_URL}/file-system/company?clientId=${clientId}&code=${dialogData.collectionCode}&id=${mid}`;
      const result = await fetchData(url, 'GET', null, 'token_03');
      const listFiles = result.filter(i => {
        if (!i.isFile) return false;
        if (isTask && i.parentPath && i.parentPath.indexOf(name) === -1) {
          return false;
        }
        return true;
      });
      if (listFiles.length) this.setState({ files: listFiles });
      // if (isArray(result)) setFiles(result.filter(i => i.isFile));
    } catch (error) {
      console.log(error);
    }
  };

  handleToggle = value => () => {
    const { selectedFiles } = this.state;
    const currentIndex = selectedFiles.indexOf(value);
    const newChecked = [...selectedFiles];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({ selectedFiles: newChecked });
  };

  render() {
    const { open, dialogData, currentUser } = this.props;
    const viewConfig = JSON.parse(localStorage.getItem("viewConfig"))
    const list = viewConfig.find(item => item.code === dialogData.collectionCode)
    let data = [];
    if (list) {
      data = list.listDisplay.type.fields.type.columns.filter(i => i.checked);
    }
    const dataInfo = this.props.dialogData.dataInfo || {};
    const { files, selectedFiles, tabIndex } = this.state;
    const rows = dialogData.groupInfo || [];
    const newRows = rows.map(item => {
      const newItem = Object.assign({}, item);
      newItem.order = item.order + 1;
      if (item.approve === 0) {
        newItem.approve = (
          <div style={{ color: ' #f37736' }}>
            <HourglassEmpty style={{ color: ' #f37736' }} /> Đang chờ phê duyệt
          </div>
        );
      } else if (item.approve === 1) {
        newItem.approve = (
          <div style={{ color: '#7bc043' }}>
            <Done style={{ color: '#7bc043' }} /> Đã phê duyệt
          </div>
        );
      } else {
        newItem.approve = (
          <div style={{ color: '#ee4035' }}>
            <Clear style={{ color: '#ee4035' }} /> Không phê duyệt
          </div>
        );
      }

      return newItem;
    });

    const ButtonUI = props => (
      <CustomButton
        onClick={() => this.setState({ tabIndex: props.tabIndex })}
        {...props}
        color={props.tabIndex === tabIndex ? 'gradient' : 'simple'}
        
        size="sm"
      >
        {props.children}
      </CustomButton>
    );
    const TypographyDetail = ({ children, data }) => {
      return (
        <div className="task-info-detail">
          <p>{children}:</p>
          <p>{data}</p>
        </div>
      );
    }

    // const ButtonUI = props => (
    //   <Buttons onClick={() => this.setState({ tabIndex: props.tabIndex })} color={props.tabIndex === tabIndex ? 'gradient' : 'simple'}>
    //     {props.children}
    //   </Buttons>
    // );

    // console.log(dialogData);
    return (
      <div>
        <Dialog
          fullWidth
          maxWidth="lg"
          open={open}
          onClose={() => {
            this.props.callBack('close');
          }}
          aria-labelledby="max-width-dialog-title"
        >
          <GridUI item sm={12}>
            <ButtonUI tabIndex={0}>Thông tin phê duyệt</ButtonUI>
            <ButtonUI tabIndex={1}>Nội dung</ButtonUI>
            <ButtonUI tabIndex={2}>Tài liệu</ButtonUI>
            <ButtonUI tabIndex={3}>Bình luận</ButtonUI>
            <ButtonUI tabIndex={4}>Biểu mẫu</ButtonUI>
          </GridUI>
          {/* <DialogTitle id="max-width-dialog-title">Thông tin phê duyệt</DialogTitle> */}
          <DialogContent>
            {tabIndex === 0 ? (
              <>
              <Grid rows={newRows} columns={columns}>
              {/* <PagingState defaultCurrentPage={0} pageSize={5} />
              <IntegratedPaging /> */}
              <Table />
              <TableHeaderRow />
              {/* <PagingPanel /> */}
            </Grid>
            {this.checkCurrentUserTurn(currentUser, dialogData) ? (
              <GridMaterialUI container justify="center" alignItems="center">
                <GridMaterialUI item sm={6}>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Lý do"
                    multiline
                    // rowsMax="4"
                    rows={4}
                    fullWidth
                    value={this.state.reason}
                    onChange={event => {
                      this.setState({ reason: event.target.value });
                    }}
                    // className={classes.textField}
                    margin="normal"
                    variant="outlined"
                  />
                </GridMaterialUI>

                {/* <GridMaterialUI item sm={2} className="text-center">
                  <Button
                    variant="outlined"
                    className="border-danger text-danger"
                    onClick={() => {
                      if (this.state.reason === '') {
                        const r = confirm('Bạn chưa nhập lý do. Tiếp túc phê duyệt ? ');
                        if (r) {
                          this.props.callBack('approve-result', { reason: this.state.reason, approveCommand: 2, clientId });
                        }
                      } else {
                        this.props.callBack('approve-result', { reason: this.state.reason, approveCommand: 2, clientId });
                      }
                    }}
                  >
                    Không phê duyệt
                  </Button>
                </GridMaterialUI> */}
                <Fab
                style = {{marginLeft : '40px',background:'white'}} 
                onClick={()=>{
                  if (this.state.reason === '') {
                    const r = confirm('Bạn chưa nhập lý do. Tiếp tục phê duyệt ? ');
                    if (r) {
                      this.props.callBack('approve-result', {
                        approveData: { reason: this.state.reason, approveCommand: 2, clientId },
                        selectedFiles,
                      });
                    }
                  } else {
                    this.props.callBack('approve-result', {
                      approveData: { reason: this.state.reason, approveCommand: 2, clientId },
                      selectedFiles,
                    });
                  }
                }}>
                  <Tooltip title="Không phê duyệt">
                    <SpeakerNotesOff style={{color: "red"}}/>
                  </Tooltip>
                </Fab>
                <Fab
                 style = {{marginLeft : '40px'}} 
                 onClick={()=>{
                  if (this.state.reason === '') {
                    const r = confirm('Bạn chưa nhập lý do. Tiếp tuc phê duyệt ? ');
                    if (r) {
                      this.props.callBack('approve-result', {
                        approveData: { reason: this.state.reason, approveCommand: 1, clientId },
                        selectedFiles,
                      });
                    }
                  } else {
                    this.props.callBack('approve-result', {
                      approveData: { reason: this.state.reason, approveCommand: 1, clientId },
                      selectedFiles,
                    });
                  }
                }}>
                  <Tooltip title="Phê duyệt">
                    <SpeakerNotes style={{color: "while"}}/>
                  </Tooltip>
                </Fab>
                <Fab 
                style = {{marginLeft : '40px'}} 
                onClick={()=>{
                  if (this.state.reason === '') {
                    const r = confirm('Bạn chưa có chữ ký số. Tiếp tục ? ');
                    if (r) {
                      this.props.callBack('approve-result', {
                        approveData: { reason: this.state.reason, approveCommand: 1, clientId },
                        selectedFiles,
                      });
                    }
                  } else {
                    this.props.callBack('approve-result', {
                      approveData: { reason: this.state.reason, approveCommand: 1, clientId },
                      selectedFiles,
                    });
                  }
                }}>
                  <Tooltip title="Phê duyệt chữ ký số">
                    <UsbOutlined style={{color: "while"}}/>
                  </Tooltip>
                </Fab>
                <Fab
                style = {{marginLeft : '40px'}}  
                onClick={()=>{
                  if (this.state.reason === '') {
                    const r = confirm('Bạn chưa có USB Token. Tiếp tục ?');
                    if (r) {
                      this.props.callBack('approve-result', {
                        approveData: { reason: this.state.reason, approveCommand: 1, clientId },
                        selectedFiles,
                      });
                    }
                  } else {
                    this.props.callBack('approve-result', {
                      approveData: { reason: this.state.reason, approveCommand: 1, clientId },
                      selectedFiles,
                    });
                  }
                }}>
                  <Tooltip title="Phê duyệt USB Token">
                    <UsbTwoTone style={{color: "while"}}/>
                  </Tooltip>
                </Fab>
                {/* <GridMaterialUI item sm={2} className="text-center">
                  <Button
                    fullWidth
                    style={{marginTop: '15px'}}
                    variant="outlined"
                    className="border-success text-success"
                    onClick={() => {
                      if (this.state.reason === '') {
                        const r = confirm('Bạn chưa nhập lý do. Tiếp túc phê duyệt ? ');
                        if (r) {
                          this.props.callBack('approve-result', {
                            approveData: { reason: this.state.reason, approveCommand: 1, clientId },
                            selectedFiles,
                          });
                        }
                      } else {
                        this.props.callBack('approve-result', {
                          approveData: { reason: this.state.reason, approveCommand: 1, clientId },
                          selectedFiles,
                        });
                      }
                    }}
                  >
                    Phê duyệt
                  </Button>
                  <Button
                    style={{marginTop: '15px'}}
                    variant="outlined"
                    className="border-success text-success"
                    onClick={() => {
                      if (this.state.reason === '') {
                        const r = confirm('Bạn chưa nhập lý do. Tiếp túc phê duyệt ? ');
                        if (r) {
                          this.props.callBack('approve-result', { reason: this.state.reason, approveCommand: 1, clientId });
                        }
                      } else {
                        this.props.callBack('approve-result', { reason: this.state.reason, approveCommand: 1, clientId });
                      }
                    }}
                  >
                    Phê duyệt chữ kí số
                  </Button>
                  <Button
                    style={{marginTop: '15px'}}
                    variant="outlined"
                    className="border-success text-success"
                    onClick={() => {
                      if (this.state.reason === '') {
                        const r = confirm('Bạn chưa nhập lý do. Tiếp túc phê duyệt ? ');
                        if (r) {
                          this.props.callBack('approve-result', { reason: this.state.reason, approveCommand: 1, clientId });
                        }
                      } else {
                        this.props.callBack('approve-result', { reason: this.state.reason, approveCommand: 1, clientId });
                      }
                    }}
                  >
                    Phê duyệt chữ kí số
                  </Button>
                </GridMaterialUI> */}
                {files.length > 0 ? (
                  <GridMaterialUI item sm={2} className="text-center">
                    <Button variant="outlined" className="border-default text-default" onClick={this.handleGetFiles}>
                      Chọn File
                    </Button>
                  </GridMaterialUI>
                ) : (
                  <GridMaterialUI item sm={2} />
                )}
              </GridMaterialUI>
            ) : (
              ''
            )}
              </>
            ) : null}
            {/* {tabIndex === 1 && dialogData ? (
             <GridMaterialUI container>
               {console.log(dataInfo,data,'ddddd')}
                 {data.map(item => (
                      <GridMaterialUI item xs={6}>
                       <TypographyDetail data={Array.isArray(dataInfo[item.name]) ? (dataInfo[item.name].length > 0 ? dataInfo[item.name].map(i => {
                                 typeof(i) === Object ? (i ? `${i.name}`: []) : (i ? `${i}` : [])
                               } ) : []) :
                               (dataInfo[item.name] 
                                 ?  (dataInfo[item.name] && dataInfo[item.name].name ? (`${dataInfo[item.name].name}`)
                                 : (dataInfo[item.name] && typeof dataInfo[item.name].search ==='function' && dataInfo[item.name].search('000Z') === -1 ? `${dataInfo[item.name]}`: `${toVietNamDate(dataInfo[item.name])}` )
                                 ) 
                                 : dataInfo[item.name] )
                               }>
                                   {item.title}
                         </TypographyDetail>
                       </GridMaterialUI>
                 ))}
             </GridMaterialUI>) : null} */}
             {/* {console.log(this.props,this.state,'dasdas')} */}
             {tabIndex === 1 && dialogData ? <ViewContent code={dialogData.collectionCode} dataInfo={dataInfo} id={dialogData.dataInfo._id}/> : null}
             
            {tabIndex === 2 && dialogData && dialogData.dataInfo ? (<>
              <FileUpload code={dialogData.subCode} name={dialogData.dataInfo.name} viewOnly id={dialogData.subCode ? dialogData.dataInfo._id : ''} />
            </>) : null}
            {tabIndex === 3 && dialogData && dialogData.dataInfo ? (<>
              <Comment profile={currentUser} code={dialogData.subCode} id={dialogData.dataInfo._id} />
            </>) : null}
            {tabIndex === 4 && dialogData && dialogData.dataInfo ? (<>
              <div dangerouslySetInnerHTML={{ __html: this.state.formContent }} />
            </>) : null}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.props.callBack('close');
              }}
              color="primary"
              variant="outlined"
            >
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.openSelectFileDialog}
          onClose={() => {
            this.setState({ openSelectFileDialog: false });
          }}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogTitle id="max-width-dialog-title">Chọn file cần phê duyệt</DialogTitle>
          <DialogContent>
            {files &&
              files.map(file => (
                <ListItem key={file._id} dense button>
                  <ListItemIcon>
                    <Checkbox
                      onClick={this.handleToggle(file)}
                      edge="start"
                      checked={selectedFiles.find(f => f._id === file._id) != null}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': file._id }}
                    />
                  </ListItemIcon>
                  <ListItemText id={file._id} primary={file.name} />
                  <CloudDownload onClick={() => this.downloadFile(`${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}`, file.name)} />
                </ListItem>
              ))}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ openSelectFileDialog: false });
              }}
              color="primary"
              variant="outlined"
            >
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ApproveDialog.propTypes = {};

export default ApproveDialog;

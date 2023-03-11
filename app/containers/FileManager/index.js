import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import axios from 'axios';
import { FileManagerComponent, Inject, NavigationPane, DetailsView, Toolbar, ContextMenu } from '@syncfusion/ej2-react-filemanager';
import swal from '@sweetalert/with-react';
import PropTypes from 'prop-types';
import { UPLOAD_FILE_METADATA } from 'config/urlConfig';
import { Tab, Tabs, Grid, Card, MenuItem, Fab as Fa, Tooltip, Typography, Button } from '@material-ui/core';
import GridItem from 'components/Grid/ItemGrid';
import { FilterList, Search, CardTravel, NextWeek, Receipt } from '@material-ui/icons';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import * as gregorian from 'cldr-data/main/vi/ca-gregorian.json';
import * as numbers from 'cldr-data/main/vi/numbers.json';
import * as timeZoneNames from 'cldr-data/main/vi/timeZoneNames.json';
import { setCulture, loadCldr, L10n } from '@syncfusion/ej2-base';
import { makeSelectProfile, makeSelectRole } from '../Dashboard/selectors';
import makeSelectFileManager from './selectors';
import { language } from './messages';
import reducer from './reducer';
import ColumnXYChart, { ProfitChart } from 'components/Charts/ColumnXYChart';
import saga from './saga';
import ShareFileContentDialog from '../../components/ShareFileContentDialog';
import CreateProjectContentDialog from '../../components/CreateProjectContentDialog';
import Scanfile from './ScanFile';
import SearchImage from './SearchImage';
import { SampleBase } from '../../components/SampleBase/sample-base';
import { serialize, clearWidthSpace, formatNumber } from '../../utils/common';
import CustomChartWrapper from 'components/Charts/CustomChartWrapper';
import './styles.scss';
import FilesChart from './DashboardFiles';
import CustomChartFiles from './CustomChartFiles';
import { Dialog as DialogUI } from 'components/LifetekUi';
import MicIcon from '@material-ui/icons/Mic';
// import './custom-boostrap.css';
import { UPLOAD_APP_URL, API_PROFILE, API_REPORT_USED, API_REPORT_USED_REPORT, SEARCH_IMAGE, SEARCH_VIDEO } from '../../config/urlConfig';
/* eslint-disable react/prefer-stateless-function */
import { inorgesign } from '../../utils/common';

import { clientId, allowedFileExts } from '../../variable';
import { fetchData } from '../../helper';
import ScanFileText from './ScanFileText';
import moment from 'moment';

import Btn from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import SearchVoice from './searchVoice';
const allowedExtensions = allowedFileExts.join(',');
const sharedFileModel = {
  path: '',
  permissions: [],
  type: '',
  users: [],
  id: '',
  fullPath: '',
};
L10n.load(language);

// const useStyles = makeStyles({
//   input: {
//     display: 'none',
//   },
// });
const Fab = props => <Fa {...props} />;
Fab.defaultProps = {
  size: 'small',
  color: 'primary',
  style: { margin: '5px', float: 'right' },
};

const ReportBox = props => (
  <div
    item
    md={4}
    spacing={4}
    style={{ background: props.color, borderRadius: '3px', padding: '25px 10px', width: '26%', position: 'relative', marginLeft: 10 }}
  >
    <div style={{ padding: 5, zIndex: 999 }}>
      <Typography style={{ color: 'white' }} variant="h4">
        {`${props.number} GB`}
      </Typography>
      <Typography variant="body1">{props.text}</Typography>
    </div>
    {/* <div
      className="hover-dashboard"
      style={{
        position: 'absolute',
        background: props.backColor,
        textAlign: 'center',
        padding: 'auto',
        display: 'block',
        textDecoration: 'none',
        width: '100%',
        bottom: 0,
        left: 0,
        right: 0,
        cursor: 'pointer',
        zIndex: 555,
      }}
    >
      Xem chi tiết
    </div> */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.2,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 88,
        fontSize: '70px',
        padding: 5,
      }}
    >
      {props.icon}
    </div>
  </div>
);

export class FileManager extends SampleBase {
  constructor(props) {
    super(props);
    this.fileManager = React.createRef();
    this.timeout = 0;

    this.hostUrl = `${UPLOAD_APP_URL}/file-system`;
    this.state = {
      cabin: 'company',
      sharedFileInfor: sharedFileModel,
      reload: 0,
      username: '',
      others: '',
      dialogAllFilter: false,
      localState: '',
      apiUrl: '',
      reload: false,
      dataUsed: {},
      filterType: 1,
      searchClient: '',
      otherLength: null,
      columnXYRevenueChart: [],
      loading: false,
      searchImage: null,
      searchVideo: null,
      numberImage: 10,
      reset: false,
      distance : [],
      typeSearch: '',
      reloadVoice: false,
      searchContent: ""
    };
  }

  convertUrl = path => path.replace(/\s/gi, '@zz_zz@');

  componentWillMount() {
    setCulture('vi');
    loadCldr(null, gregorian, numbers, timeZoneNames);
    if (this.props.match.params.id) {
      this.hostUrl = `${UPLOAD_APP_URL}/file-system/${this.props.match.params.id}`;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState && nextState.reload !== this.state.reload) {
      return true;
    }
    if (
      nextProps &&
      nextProps.role &&
      nextProps.role.roles &&
      nextProps.role.roles.length &&
      (!this.props.role.roles || nextProps.role.roles.length !== this.props.role.roles.length)
    ) {
      return true;
    }

    if (this.state.cabin !== nextState.cabin) {
      return true;
    }
    if (this.state.otherLength !== nextState.otherLength) {
      return true;
    }
    if (this.state.columnXYRevenueChart !== nextState.columnXYRevenueChart) {
      return true;
    }
    if (this.state.dataUsed !== nextState.dataUsed) {
      return true;
    }
    if (this.state.reset !== nextState.reset) {
      return true;
    }
    if (this.state.reloadVoice !== nextState.reloadVoice) {
      return true;
    }
    if (this.state.searchContent !== nextState.searchContent) {
      return true;
    }

    // Rendering the component only if
    // passed props value is changed
    return false;
  }

  getData = async () => {
    const x = await fetchData(API_PROFILE);
    this.setState({ username: x.username });
  };
  getDataReport = () => {
    fetch(`${API_REPORT_USED_REPORT}?clientId=${clientId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ dataUsed: data.data });
      });
  };
  getDataUsed = (amount, type, typeData) => {
    fetch(`${API_REPORT_USED}?type=${type}&amount=${amount}&clientId=${clientId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        data.data = data.data.map(item => {
          if (type === 'days') {
            item.index = moment()
              .subtract(item.index, type)
              .format('DD/MM');
          }
          if (type === 'months') {
            item.index =
              'Th. ' +
              (moment()
                .subtract(item.index, type)
                .get('months') +
                1);
          }
          if (type === 'weeks') {
            item.index =
              'Tuần ' +
              moment()
                .subtract(item.index, type)
                .get('weeks');
          }
          if (type === 'quarters') {
            item.index =
              'Qúy ' +
              moment()
                .subtract(item.index, type)
                .get('quarters') +
              ` ${moment()
                .subtract(item.index, type)
                .get('years')}`;
          }
          if (type === 'years') {
            item.index = moment()
              .subtract(item.index, type)
              .get('years')
              .toString();
          }
          if (typeData === 'B') {
            item.used = item.used;
            item.typeOfData = typeData;
          }
          if (typeData === 'KB') {
            item.used = Number.isInteger(item.used / 1024) ? item.used / 1024 : (item.used / 1024).toFixed(6);
            item.typeOfData = typeData;
          }
          if (typeData === 'MB') {
            item.used = Number.isInteger(item.used / 1048576) ? item.used / 1048576 : (item.used / 1048576).toFixed(6);
            item.typeOfData = typeData;
          }
          if (typeData === 'GB') {
            item.used = Number.isInteger(item.used / 1073741824) ? item.used / 1073741824 : (item.used / 1073741824).toFixed(6);
            item.typeOfData = typeData;
          }
          if (typeData === 'T') {
            item.used = Number.isInteger(item.used / 1099511627776) ? item.used / 1099511627776 : (item.used / 1099511627776).toFixed(6);
            item.typeOfData = typeData;
          }
          return item;
        });
        this.setState({ columnXYRevenueChart: data.data });
      });
  };

  componentDidMount() {
    this.getData();
    this.getDataUsed(7, 'days', 'GB');
    this.getDataReport();
  }
  formatData = number => {
    let result = number / 1099511627776;
    if (Number.isInteger(result)) {
      return result;
    } else {
      return (number / 1099511627776).toFixed(6);
    }
  };

  toolbarClick = args => {
    const folder = args.fileDetails[0];
    if (args.item.id === `${this.fileObj.element.id}_tb_createproject`) {
      swal({
        closeOnClickOutside: false,
        title: 'Thêm mới folder dự án',
        content: (
          <CreateProjectContentDialog
            onChangeNewProject={data => {
              this.newProject = data;
            }}
            onSubmit={value => {
              if (value !== 'cancel') {
                if (this.newProject.users.lenght !== 0) {
                  this.newProject.users = this.newProject.users.map(item => item.userId);
                } else {
                  this.newProject.users = [];
                }
                const self = this;
                this.newProject.clientId = clientId;
                axios({
                  method: 'post',
                  url: `${UPLOAD_APP_URL}/projects`,
                  data: this.newProject,
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token_03')}`,
                  },
                })
                  .then(response => {
                    this.newSharedFileInfor = undefined;
                    swal('Tạo mới folder dự án thành công!', '', 'success');
                    this.setState({ reload: this.state.reload + 1 });
                    setTimeout(() => {
                      swal.close();
                    }, 3000);
                  })
                  .catch(err => {
                    this.newSharedFileInfor = undefined;
                    swal('Tạo mới folder dự án thất bại!', err.response.data.message, 'error');
                  });
              } else {
                swal.close();
              }
            }}
          />
        ),
        button: false,
      });
    }
    if (args.item.text === 'OCR') {
      swal({
        closeOnClickOutside: false,
        title: 'OCR tài liệu',
        content: (
          <>
            <Scanfile
              onChangeNewProject={data => {
                this.newProject = data;
              }}
              onSubmit={value => {
                if (value !== 'cancel') {
                  // const folder = args.fileDetails[0];
                  const data = folder || { name: this.state.cabin, clientId, fullPath: `${clientId}/${this.state.cabin}/`, filterPath: '' };
                  let file = document.getElementById('fileUpload').files[0];
                  if (typeof file === 'undefined') {
                    alert('Không tìm thấy tài liệu');
                    swal('Thực hiện OCR tài liệu thất bại!', '', 'error');
                    this.setState({ reload: this.state.reload + 1 });
                  } else {
                    this.setState({ loading: true });
                    swal({
                      title: 'OCR tài liệu',
                      text: 'Đang OCR tài liệu. Vui lòng đợi',
                      showConfirmButton: false,
                      showCancelButton: false,
                      buttons: false,
                    });
                    const form = new FormData();
                    let path = '/';
                    if (folder) {
                      const paths = folder.fullPath.split('/');
                      path = `/${paths
                        .filter((i, idx) => {
                          return idx > 1;
                        })
                        .join('/')}/`;
                    }
                    form.append('uploadFiles', file);
                    form.append('path', path);
                    form.append('action', 'save');
                    form.append('data', JSON.stringify(data));
                    form.append('isScan', true);
                    // this.newProject.clientId = clientId;
                    // this.newProject.data
                    fetch(`${this.hostUrl}/${this.state.cabin}/Upload?clientId=${clientId}`, {
                      method: 'POST',
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem('token_03')}`,
                      },
                      body: form,
                    })
                      .then(response => {
                        this.newSharedFileInfor = undefined;
                        this.setState({ loading: false });
                        swal('Thực hiện OCR tài liệu thành công!', '', 'success');
                        this.setState({ reload: this.state.reload + 1 });
                        setTimeout(() => {
                          swal.close();
                        }, 3000);
                      })
                      .catch(err => {
                        this.newSharedFileInfor = undefined;
                        swal('Thực hiện OCR tài liệu thất bại!', err.response.data.message, 'error');
                      });
                  }
                } else {
                  swal.close();
                }
              }}
            />
          </>
        ),
        button: false,
      });
    }
    if (args.item.text === 'Trích xuất văn bản') {
      swal({
        closeOnClickOutside: false,
        title: 'Trích xuất văn bản',
        content: (
          <>
            <div style={{ maxHeight: 500, overflowY: 'auto' }} >
              <ScanFileText
                onChangeNewProject={data => {
                  this.newProject = data;
                }}
                onSubmit={(value, e) => {
                  if (value !== 'cancel') {
                    // const folder = args.fileDetails[0];
                    const data = folder || { name: this.state.cabin, clientId, fullPath: `${clientId}/${this.state.cabin}/`, filterPath: '' };
                    let file = document.getElementById('fileUpload').files[0];
                    if (typeof file === 'undefined') {
                      alert('Không tìm thấy tài liệu');
                      swal('Tải file thất bại!', '', 'error');
                      this.setState({ reload: this.state.reload + 1 });
                    } else {
                      this.setState({ loading: true });
                      swal({
                        title: 'Tải file',
                        text: 'Đang tải file. Vui lòng đợi',
                        showConfirmButton: false,
                        showCancelButton: false,
                        buttons: false,
                      });
                      const form = new FormData();
                      let path = '/';
                      if (folder) {
                        const paths = folder.fullPath.split('/');
                        path = `/${paths
                          .filter((i, idx) => {
                            return idx > 1;
                          })
                          .join('/')}/`;
                      }
                      form.append('uploadFiles', file);
                      form.append('path', path);
                      form.append('action', 'save');
                      form.append('data', JSON.stringify(data));
                      console.log('form', form);
                      // form.append('isScan', true);
                      // this.newProject.clientId = clientId;
                      // this.newProject.data
                      fetch(`${this.hostUrl}/${this.state.cabin}/Upload?clientId=${clientId}`, {
                        method: 'POST',
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem('token_03')}`,
                        },
                        body: form,
                      })
                        .then(response => response.json())
                        .then(res => {
                          let body = {
                            id: res && res.data && res.data[0] && res.data[0]._id,
                            model: 'FileManager',
                            metaData: {
                              others: e,
                            },
                          };
                          fetch(UPLOAD_FILE_METADATA, {
                            method: 'PUT',
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem('token')}`,
                              'Content-type': 'application/json',
                            },
                            body: JSON.stringify(body),
                          })
                            .then(response => response.json())
                            .then(res => {
                              console.log('res', res);
                              // setSnackbar({ open: true, message: 'Thêm file thành công', variant: 'success' });
                            })
                            .catch(() => {
                              // setSnackbar({ open: false, message: 'Thêm file thất bại', variant: 'error' });
                            });
                          this.newSharedFileInfor = undefined;
                          this.setState({ loading: false });
                          swal('Lưu file thành công!', '', 'success');
                          this.setState({ reload: this.state.reload + 1 });
                          setTimeout(() => {
                            swal.close();
                          }, 3000);
                        })
                        .catch(err => {
                          this.newSharedFileInfor = undefined;
                          swal('Lưu file thất bại!', err.response.data.message, 'error');
                        });
                    }
                  } else {
                    swal.close();
                  }
                }}
              />
            </div>

          </>
        ),
        button: false,
      });
    }
    if (args.item.text === 'Tìm kiếm hình ảnh/video') {
      swal({
        closeOnClickOutside: false,
        title: 'Tìm kiếm hình ảnh/video',
        content: (
          <>
            <SearchImage
              onChangeNewProject={data => {
                this.newProject = data;
              }}
              numberImage={this.state.numberImage}
              handleChangeNumberImage={this.handleChangeNumberImage}
              handleChangeType={this.handleChangeType}
              onSubmit={value => {
                if (value !== 'cancel') {
                  // const folder = args.fileDetails[0];
                  const data = folder || { name: this.state.cabin, clientId, fullPath: `${clientId}/${this.state.cabin}/`, filterPath: '' };
                  let file = document.getElementById('fileUpload').files[0];
                  if (typeof file === 'undefined' || this.state.numberImage === null || this.state.typeSearch === '') {
                    alert('Không tìm thấy dữ liệu');
                    swal('Thực hiện tìm kiếm thất bại!', '', 'error');
                    this.setState({ reload: this.state.reload + 1 });
                  } else {
                    this.setState({ loading: true });
                    swal({
                      title: 'Tìm kiếm hình ảnh',
                      text: 'Đang tìm kiếm. Vui lòng đợi',
                      showConfirmButton: false,
                      showCancelButton: false,
                      buttons: false,
                    });

                    if (this.state.typeSearch === 'image') {
                      const form = new FormData();

                      form.append('file', file, file.name);
                      form.append('meta', JSON.stringify({ topk: this.state.numberImage }));
                      axios
                        .post(`${SEARCH_IMAGE}`, form, {
                          headers: {
                            // 'Content-Type': 'application/json',
                          },
                        })
                        .then(response => {
                          console.log('response',response);
                          this.newSharedFileInfor = undefined;
                          this.setState({ loading: false, searchImage: response.data && response.data.id,distance : response.data && response.data.distance  ,reset: false });
                          swal('Tìm kiếm thành công!', '', 'success');
                          this.setState({ reload: this.state.reload + 1 });
                          setTimeout(() => {
                            swal.close();
                          }, 3000);
                        })
                        .catch(err => {
                          console.log('err', err);
                          this.newSharedFileInfor = undefined;
                          swal('Tìm kiếm thất bại!', err.response.data.message, 'error');
                        });
                    } else {
                      const form = new FormData();
                      form.append('file', file, file.name);
                      axios
                        .post(`${SEARCH_VIDEO}`, form, {
                          headers: {
                            // 'Content-Type': 'application/json',
                          },
                        })
                        .then(response => {
                          this.newSharedFileInfor = undefined;
                          let arrayId = [];
                          if (response.data) {
                            arrayId.push(response.data.id);
                          }
                          this.setState({ loading: false, searchImage: arrayId, reset: false });
                          swal('Tìm kiếm thành công!', '', 'success');
                          this.setState({ reload: this.state.reload + 1 });
                          setTimeout(() => {
                            swal.close();
                          }, 3000);
                        })
                        .catch(err => {
                          console.log('err', err);
                          this.newSharedFileInfor = undefined;
                          swal('Tìm kiếm thất bại!', err.response.data.message, 'error');
                        });
                    }
                  }
                } else {
                  swal.close();
                }
              }}
            />
          </>
        ),
        button: false,
      });
    }
    if (args.item.text === 'Reset') {
      this.setState({ reset: true, reloadVoice: false, searchContent: "" });

      swal('Làm mới thành công!', '', 'success');
    }
    if (args.item.text === 'Mic') {
      // this.setState({ reset: true });
      // swal('Làm mới thành công!', '', 'success');
      console.log("nhdfvhdfbv")

      swal({
        closeOnClickOutside: false,
        title: 'Tìm kiếm bằng giọng nói',
        content: (
          <>
            <SearchVoice
              onSubmit={value => {
                this.setState({ searchContent: value })
              }}
              onStartVoice={() => this.setState({ reloadVoice: false })}
              setVoice={(value) => this.setState({ voice: value })}
              setReloadVoice={() => this.setState({ reloadVoice: true })}
              onClose={value => {
                swal.close();
              }}
            />
          </>
        ),
        button: false,
      });
    }
  };

  toolbarCreate = args => {
    for (let i = 0; i < args.items.length; i++) {
      if (args.items[i].id === `${this.fileObj.element.id}_tb_createproject`) {
        args.items[i].text = 'Thêm mới dự án';
        args.items[i].prefixIcon = 'e-sub-total';
      }
    }
    for (let i = 0; i < args.items.length; i++) {
      if (args.items[i].id === this.fileObj.element.id + '_tb_scan') {
        args.items[i].prefixIcon = 'e-fe-tick';
      }
      if (args.items[i].id === this.fileObj.element.id + '_tb_ocr') {
        args.items[i].prefixIcon = 'e-icons e-view-side';
      }
      if (args.items[i].id === this.fileObj.element.id + '_tb_trích xuất văn bản') {
        args.items[i].prefixIcon = 'e-icons e-fe-details';
      }
      if (args.items[i].id === this.fileObj.element.id + '_tb_tìm kiếm hình ảnh/video') {
        args.items[i].prefixIcon = 'e-icons e-fe-search';
      }
      if (args.items[i].id === this.fileObj.element.id + '_tb_reset') {
        args.items[i].prefixIcon = 'e-icons e-fe-refresh';
      }
      if (args.items[i].id === this.fileObj.element.id + '_tb_mic') {
        args.items[i].prefixIcon = 'e-icons e-fe-search';
      }
    }
  };

  // <div id="watermark">
  //   <img src="http://www.topchinatravel.com/pic/city/dalian/attraction/people-square-1.jpg">
  //   <p>This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark. This is a watermark.</p>
  // </div>
  downloadFile(url, fileName) {
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

  menuClick = args => {
    if (args.item.text === 'Xem trích xuất') {
      if (args.fileDetails[0].metaData && args.fileDetails[0].metaData.others) {
        let dataScan = args.fileDetails && args.fileDetails[0] && args.fileDetails[0].metaData && args.fileDetails[0].metaData.others
        let values = Object.values(dataScan);
        let keys = Object.keys(dataScan);
        console.log('keys', keys);
        console.log('values', values);

        swal({
          content: (
            <div style={{ height: 'calc(80vh - 100px)' }}>
              {keys && keys.map((item, index) => {
                return <>
                  <p style={{ fontSize: '30px' }}>{keys[index].toUpperCase() + ' : ' + values[index]}</p>
                </>
              })}
            </div>
          ),
          className: 'swal-document',
          button: true,
        });

      } else {
        swal('Không có file đính kèm', '', 'warning');
      }

    }
    if (args.item.text === 'Open') {
      args.fileDetails.forEach(element => {
        if (['.xlsx', '.docx', '.csv', '.pdf', '.xls', '.doc'].includes(element.type)) {
          swal({
            content: (
              <div id="watermark" style={{ height: 'calc(80vh - 100px)' }}>
                <iframe
                  title="Excel"
                  src={`https://docs.google.com/viewer?url=${this.hostUrl}/GetImage/${clientId}?id=${args.fileDetails[0]._id}&embedded=true`}
                  width="100%"
                  style={{ height: '100%' }}
                  value="file"
                />
                <p>{this.state.username}</p>
              </div>
            ),
            className: 'swal-document',
            button: true,
          });
          // window.open(`/Document?path=${element.filterPath + this.fileObj.pathNames[0]}/${element.name}&cabin=${this.state.cabin}`);
        } else if (element.isFile && element.type !== '.jpg' && element.type !== '.png' && element.type !== '.jpeg') {
          swal('Không có bản xem trước', 'Vui lòng tải về để mở file!', 'warning');
        }
      });
    }

    if (args.item.text === 'Download') {
      const url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${args.fileDetails[0]._id}`;
      this.downloadFile(url, args.fileDetails[0].name);
      return;
    }

    if (args.item.text === 'Paste') {
      this.fileObj.refreshLayout();
    }
    if (args.item.id === 'filemanager_cm_share') {
      const fullPath = args.fileDetails[0].fullPath;

      axios({
        method: 'get',
        url: `${UPLOAD_APP_URL}/share/${args.fileDetails[0]._id}`,
        headers: { Authorization: `Bearer ${localStorage.getItem('token_03')}` },
      })
        .then(res => {
          let sharedFileInfor;
          if (res.data) {
            sharedFileInfor = res.data;
            return sharedFileInfor;
          }

          return axios({
            method: 'post',
            url: `${UPLOAD_APP_URL}/share`,
            data: {
              public: 1,
              users: [],
              permissions: ['copy', 'download', 'edit', 'editContents', 'read', 'upload'],
              path: fullPath,
              fullPath,
            },
            headers: { Authorization: `Bearer ${localStorage.getItem('token_03')}` },
          }).then(res => {
            this.setState({
              sharedFileInfor: res.data,
            });
            return res.data;
          });
        })
        .then(fileInfor => {
          this.newSharedFileInfor = fileInfor;
          swal({
            closeOnClickOutside: false,
            content: (
              <ShareFileContentDialog
                updateSharedFileInfor={data => {
                  this.newSharedFileInfor = data;
                }}
                path={fullPath}
                sharedFileInfor={this.newSharedFileInfor}
              />
            ),
            buttons: {
              cancel: 'Hủy',
              ok: { value: true, text: 'Đồng ý' },
            },
            className: 'custom-swal',
          })
            .then(isOk => {
              if (isOk) {
                this.newSharedFileInfor.users = this.newSharedFileInfor.users.map(item => item.username);
                this.newSharedFileInfor.fullPath = fullPath;
                return axios({
                  method: 'put',
                  url: `${UPLOAD_APP_URL}/share/${this.newSharedFileInfor._id}`,
                  data: this.newSharedFileInfor,
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token_03')}`,
                  },
                });
              }
            })
            .then(res => {
              if (res) {
                this.newSharedFileInfor = undefined;
                swal({
                  title: 'Chia sẻ file thành công',
                  icon: 'success',
                });
              }
            })
            .catch(err => {
              this.newSharedFileInfor = undefined;
              swal('Đã xảy ra lỗi khi chia sẻ', JSON.stringify(err.response.data.message), 'error');
            });
        });
    }
  };
  dialogSave = e => {
    console.log('12');
    const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = listViewConfig.filter(item => item.listDisplay.type.fields.type && item.listDisplay.type.fields.type.fileColumns) || [];
    let others = [];
    currentViewConfig.forEach(item => {
      const other = item.listDisplay.type.fields.type.fileColumns;
      others = others.concat(other);
    });
    const filteredOthers = others.filter(item => item.checkedShowForm).map(i => ({ ...i, name: i.name ? i.name.split('.')[1] : '' }));
    const filter = {};
    filter.$and = filteredOthers
      .map(
        i =>
          !this.state.localState[i.name]
            ? null
            : i.type === 'text'
              ? { [`metaData.others.${i.name}`]: { $regex: this.state.localState[i.name] || '', $options: 'gi' } }
              : { [`metaData.others.${i.name}.value`]: this.state.localState[i.name].value },
      )
      .filter(i => !!i);

    let newFilter = { filter: { ...filter }, clientId: clientId };
    const body = serialize(newFilter);
    const apiUrl = `${UPLOAD_FILE_METADATA}?${body}`;
    this.setState({ apiUrl: apiUrl }, () => {
      this.setState({ reload: this.state.reload + 1 });
    });
  };
  handleChangeSearch = () => {

  }
  menuOpen = args => {
    this.handleOpenMenuRole();

    if (this.fileObj.getSelectedFiles().length > 1) {
      this.fileObj.disableMenuItems(['Share', 'Download', 'Open']);
    }

    let condition = false;
    const ele = args.fileDetails[0];
    if (ele) {
      condition = (ele.public === 2 && ele.users.includes(this.state.username)) || ele.public === 4 || ele.username === this.state.username;
    }

    if (this.state.cabin === 'share' && !condition) {
      this.fileObj.disableMenuItems(['Share', 'Delete', 'Rename']);
    }

    if (args.fileDetails[0].filterPath === '/' && this.state.cabin === 'projects') {
      args.cancel = true;
    }
    if (args.fileDetails[0].permission && !args.fileDetails[0].permission.editContents) {
      this.fileObj.disableMenuItems(['Copy', 'Delete', 'Rename']);
    }
    for (const i in args.items) {
      if (args.items[i].id === `${this.fileObj.element.id}_cm_download`) {
        args.items[i].text = 'Download';
      }
      if (args.items[i].id === `${this.fileObj.element.id}_cm_share`) {
        args.items[i].text = 'Chia sẻ';
        args.items[i].iconCss = 'e-icons e-create-link';
      }
      if (args.items[i].id === `${this.fileObj.element.id}_cm_rename`) {
        args.items[i].text = 'Đổi tên';
      }
      if (args.items[i].id === `${this.fileObj.element.id}_cm_copy`) {
        args.items[i].text = 'Bản sao';
      }
      if (args.items[i].id === `${this.fileObj.element.id}_cm_delete`) {
        args.items[i].text = 'Xóa';
      }
      if (args.items[i].id === `${this.fileObj.element.id}_cm_viewdetail`) {
        args.items[i].text = 'Xem trích xuất';
        args.items[i].iconCss = 'e-icons e-create-view';
      }
    }
  };

  // changeSearch = (e) => {
  //   let dataSearch = e.target.value
  //   if (this.timeout) clearTimeout(this.timeout);
  //   this.timeout = setTimeout(() => {
  //     this.setState({ searchClient: dataSearch });

  //     const body = {
  //       action: "search",
  //       path: "/",
  //       showHiddenItems: false,
  //       caseSensitive: false,
  //       data: [
  //         {
  //           filterPath: "",
  //           _id: "5faa6ade3853661eac0707cc",
  //           updatedAt: "2020-11-10T10:26:38.719Z",
  //           createdAt: "2020-11-10T10:26:38.719Z",
  //           name: "company",
  //           fullPath: "20_CRM/company/",
  //           isFile: false,
  //           clientId: "20_CRM",
  //           __v: 0,
  //           status: 1,
  //           isApprove: false,
  //           public: 0,
  //           permissions: [],
  //           users: [],
  //           _fm_id: "fe_tree"
  //         }
  //       ],
  //       searchContent: dataSearch,
  //     };
  //     const urlApi = `https://g.lifetek.vn:203/api/file-system/company?clientId=20_CRM`
  //     fetch(urlApi, {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('token_03')}`,
  //         'Content-type': 'application/json',
  //       },
  //       body: JSON.stringify(body),
  //     })
  //       .then(() => {
  //         this.setState({ reload: this.state.reload + 1 });
  //       })
  //       .catch(() => {
  //       });
  //   }, 500);
  // }

  handleChange = (event, value) => {
    this.setState({ cabin: value, apiUrl: '', localState: { others: {} } });
  };
  handleChangeNumberImage = value => {
    this.setState({ numberImage: value });
  };
  handleOpenMenuRole() {
    const { roles } = this.props.role;

    const r = roles.find(e => e.codeModleFunction === 'file-manager');
    if (!r) this.fileObj.disableMenuItems(['Rename', 'Delete']);
    else {
      if (!r.methods.find(e => e.name === 'POST').allow) this.fileObj.disableMenuItems(['Rename']);
      if (!r.methods.find(e => e.name === 'DELETE').allow) this.fileObj.disableMenuItems(['Delete']);
    }
  }
  // icon =()=>{
  //   return(
  //     <CleaningServicesIcon />
  //   )
  // }
  customFileSize = size => {
    if (size < 1024) {
      return `${size} B`;
    } else if (1024 <= size && size < 1048576) {
      const amount = size / 1024;
      return `${amount.toFixed(2)} KB`;
    } else if (1048576 <= size && size < 1073741824) {
      const amount = size / 1048576;
      return `${amount.toFixed(2)} MB`;
    } else if (1073741824 <= size && size < 1099511627776) {
      const amount = size / 1073741824;
      return `${amount.toFixed(2)} GB`;
    }
  };
  handleChangeType = value => {
    this.setState({
      typeSearch: value,
    });
  };
  handleOpenDialog = () => {
    this.setState({ dialogAllFilter: true });
  };
  handleChangeFilter = newOther => {
    this.setState({ ...this.state, localState: newOther });
  };
  changeFilter = e => {
    this.setState({ filterType: e.target.value });
  };
  handleReload = () => {
    this.setState({ apiUrl: '', localState: { others: {} } }, () => {
      this.setState({ reload: this.state.reload + 1 });
    });
  };

  render() {
    const { cabin } = this.state;
    const { roles = [] } = this.props.role || {};
    const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = listViewConfig.filter(item => item.listDisplay.type.fields.type && item.listDisplay.type.fields.type.fileColumns) || [];
    let others = [];
    currentViewConfig.forEach(item => {
      const other = item.listDisplay.type.fields.type.fileColumns;
      others = others.concat(other);
    });

    const usedStorage = this.state.dataUsed && this.state.dataUsed.usedStorage ? this.state.dataUsed.usedStorage : 0;
    const storageCapacity = this.state.dataUsed && this.state.dataUsed.storageCapacity ? this.state.dataUsed.storageCapacity : 1;
    const percentDataUsed = usedStorage / storageCapacity;

    const r = roles && roles.find(e => e.codeModleFunction === 'file-manager');
    const canDelete = r && r.methods.find(e => e.name === 'DELETE') && r.methods.find(e => e.name === 'DELETE').allow;
    // const classes = useStyles();
    return (
      <div>

        {!this.props.match.params.id ? (
          <Tabs value={cabin} onChange={this.handleChange} aria-label="simple tabs example" indicatorColor="primary" textColor="primary">
            <Tab value="company" label="Drive công ty" />
            <Tab value="users" label="Drive của tôi" />
            <Tab value="share" label="Được chia sẻ với tôi " />
            <Tab value="dashboard" label="Dashboard" />
          </Tabs>
        ) : (
          ''
        )}
        {this.state.cabin === 'dashboard' && (
          <>
            {percentDataUsed !== 0 && percentDataUsed > 0.8 ? (
              <Typography style={{ marginLeft: 10, marginTop: 5, color: 'red' }}>
                {`Bạn đã sử dụng quá 80% dung lượng, mua thêm dung lượng`} <a style={{ textDecoration: 'underline', cursor: 'pointer' }}> tại đây </a>{' '}
              </Typography>
            ) : null}
            <Grid style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }} container>
              <ReportBox
                icon={<CardTravel style={{ fontSize: 50 }} />}
                number={this.formatData(this.state.dataUsed ? this.state.dataUsed.storageCapacity : 0) || 0}
                text="Gói dữ liệu"
                color="linear-gradient(to right, #03A9F4, #03a9f4ad)"
                backColor="rgb(0, 126, 255)"
              // openDetail={this.openContract}
              />
              <ReportBox
                icon={<NextWeek style={{ fontSize: 50 }} />}
                number={this.formatData(this.state.dataUsed ? this.state.dataUsed.usedStorage : 0) || 0}
                text="Đã sử dụng"
                color="linear-gradient(to right, rgb(76, 175, 80), rgba(76, 175, 80, 0.68))"
                backColor="#237f1c"
              // openDetail={this.openProject}
              />
              <ReportBox
                icon={<Receipt style={{ fontSize: 50 }} />}
                number={this.formatData(this.state.dataUsed ? this.state.dataUsed.storageCapacity - this.state.dataUsed.usedStorage : 0) || 0}
                text="Dung lượng còn lại"
                color="linear-gradient(to right, #FF5722, rgba(255, 87, 34, 0.79))"
                backColor="red"
              // openDetail={this.openBusiness}
              />
            </Grid>
            <Grid style={{ marginTop: 20 }}>
              <CustomChartFiles height="650px" getDataUsed={this.getDataUsed}>
                <FilesChart style={{ height: '100%' }} data={this.state.columnXYRevenueChart} id="chart1" />
              </CustomChartFiles>
            </Grid>
          </>
        )}
        {this.state.cabin === 'company' ? (
          <GridItem container style={{ marginTop: 5, marginLeft: -55 }}>
            {others.length ? (
              <>
                <GridItem xs={9} style={{ marginLeft: 10 }}>
                  <CustomGroupInputField
                    allModule
                    columnPerRow={6}
                    source="fileColumns"
                    onChange={this.handleChangeFilter}
                    value={this.state.localState.others}
                    othersLength={this.state.otherLength}
                    onChangeSearch={this.dialogSave}
                    handleReload={this.handleReload}
                  />
                </GridItem>
                {this.state.otherLength >= 6 ? (
                  <GridItem x2={3}>
                    <div style={{ display: 'flex', width: 130 }}>
                      <div style={{ marginLeft: -35, marginTop: 15, height: 50 }}>
                        <Button variant="outlined" color="primary" onClick={this.dialogSave} style={{ height: 47 }}>
                          Tìm kiếm
                        </Button>
                      </div>
                      <div style={{ marginLeft: 5, marginTop: 15, height: 50 }}>
                        <Button variant="outlined" color="secondary" onClick={this.handleReload} style={{ height: 47, width: 100 }}>
                          Xóa tìm kiếm
                        </Button>
                      </div>
                    </div>
                  </GridItem>
                ) : null}
              </>
            ) : null}
          </GridItem>
        ) : null}
        {this.state.cabin !== 'dashboard' && (
          <Card>
            {this.state.cabin === 'shares' ? (
              'We have nothing to share'
            ) : (
              <FileManagerComponent
                locale="vn"
                // navigationPaneSettings={{ visible: false }}
                navigationPaneSettings={{ visible: true, maxWidth: '200px', minWidth: '100px' }}
                height={700}
                ref={s => (this.fileObj = s)}
                id="filemanager"
                toolbarClick={this.toolbarClick}
                toolbarCreate={this.toolbarCreate}
                toolbarSettings={{
                  items:
                    cabin === 'shares'
                      ? []
                      : canDelete
                        ? ['NewFolder', 'Upload', 'View', ` OCR`, ` Trích xuất văn bản`, 'Delete', 'Tìm kiếm hình ảnh/video', 'Reset',
                          // '<div class="tooltip">Hover over me<span class="tooltiptext">Tooltip text</span></div>'
                          'Mic'
                        ]
                        : ['NewFolder', 'Upload', 'View', ` OCR`, ` Trích xuất văn bản`, 'Tìm kiếm hình ảnh/video', 'Reset', 'Mic'],
                  visible: true,
                }}
                view="Details"
                allowMultiSelection
                detailsViewSettings={{
                  columns: [
                    {
                      field: 'name',
                      headerText: 'Thư mục',
                      minWidth: 250,
                      width: '250',
                      customAttributes: { class: 'e-fe-grid-name' },
                      template: '<div><div>${name}</div><div><i>${scanStatus}</i></div><div><i>${searchInfo}</i></div></div>',
                    },
                    {
                      field: 'approverName',
                      headerText: 'Người phê duyệt',
                      minWidth: 50,
                      width: '250',
                    },
                    {
                      field: 'approvedDate',
                      headerText: 'Ngày phê duyệt',
                      minWidth: 50,
                      width: '250',
                      format: 'dd/MM/yyyy',
                    },
                    {
                      field: 'isApprove',
                      headerText: 'Phê duyệt',
                      minWidth: 200,
                      width: '250',
                      template: '${isApprove == "true" && "Đã phê duyệt"}',
                    },
                    { field: 'size', headerText: 'Kích cỡ', minWidth: 50, width: '110', template: '${size}' },
                    { field: 'createdAt', headerText: 'Ngày tạo', minWidth: 50, width: '110', template: '${createdAt}', format: 'DD/MM/YYYY' },
                    { field: '_fm_modified', headerText: 'Ngày sửa đổi', minWidth: 50, width: '190', format: 'dd/MM/yyyy' },
                  ],
                }}
                success={args => {
                  // document.getElementById('filemanager_search').placeholder = 'Tìm kiếm nội dung trong file'
                  let ele = null;
                  ele = args.result.cwd;
                  if (this.state.cabin === 'share') {
                    let condition = false;
                    if (ele) {
                      condition =
                        (ele.public === 2 && ele.users.includes(this.state.username)) || ele.public === 4 || ele.username === this.state.username;
                    }
                    if (condition) this.fileObj.enableToolbarItems(['NewFolder', 'Upload']);
                    else this.fileObj.disableToolbarItems(['NewFolder', 'Upload']);
                  }

                  // this.fileObj.disableToolbarItems(['Create Project']);

                  if (args.action === 'Upload' && args.name === 'success') {
                    const result = JSON.parse(args.result.e.currentTarget.response);
                    if (result.data[0] === null) {
                      this.setState({ reload: this.state.reload + 1 });
                      alert('File đã tồn tại!');
                    } else {
                      setTimeout(() => {
                        document.getElementsByClassName('e-dlg-closeicon-btn')[0].click();
                        this.setState({ reload: this.state.reload + 1 });
                      }, 3000);
                    }
                  }
                  args.result &&
                    args.result.files &&
                    args.result.files.forEach(item => {
                      let size = '';
                      if (item.isFile) size = this.customFileSize(item.size);
                      item.size = size;
                      item.approvedDate = item.approvedDate && moment(item.approvedDate).format('DD/MM/YYYY');
                      item.createdAt = moment(item.createdAt).format('DD/MM/YYYY');
                    });
                }}
                failure={args => { }}
                contextMenuSettings={{
                  // file: ['Open', '|', 'Download', 'Share', '|', 'Rename', 'Copy', 'Delete'],
                  // folder: ['Open', '|', 'Download', 'Share', '|', 'Rename', 'Copy', 'Delete'],
                  // layout: ['Paste'],
                  file: ['Open', '|', 'Share', 'Download', '|', 'Rename', 'ViewDetail', 'Delete'],
                  folder: ['Open', '|', 'Share', '|', 'Rename', 'Delete'],
                  layout: [],
                }}
                menuClick={this.menuClick}
                menuOpen={this.menuOpen}
                fileOpen={args => {
                  if (
                    args.fileDetails.isFile &&
                    ['.xlsx', '.csv', '.docx', '.doc', '.png', '.jpg', '.jpeg'].findIndex(d => d === args.fileDetails.type) === -1
                  ) {
                    swal('Không có bản xem trước', 'Vui lòng tải về để mở file!', 'warning');
                  }
                }}
                uploadSettings={{
                  maxFileSize: 4000000000,
                  allowedExtensions,
                }}
                beforeImageLoad={args => {
                  args.imageUrl = `${args.imageUrl}&id=${args.fileDetails[0]._id}`;
                }}
                ajaxSettings={{
                  url: `${this.hostUrl}/${this.props.match.params.id ? '' : cabin}`,
                  getImageUrl: `${this.hostUrl}/GetImage/${clientId}`,
                  uploadUrl: `${this.hostUrl}/${cabin}/Upload?clientId=${clientId}`,
                  downloadUrl: `${this.hostUrl}/download/file`,
                }}
                beforeSend={args => {
                  if (args.action === 'search') {
                    const dataSearch = JSON.parse(args.ajaxSettings.data);
                    const stringData = dataSearch.searchString.split('*').join('');
                    const filter = {};
                    filter.$or = [{ name: { $regex: stringData, $options: 'gi' } }];
                    delete dataSearch.searchString;
                    // dataSearch.filter = filter;
                    dataSearch.searchContent = stringData;
                    const filterData = JSON.stringify(dataSearch);
                    args.ajaxSettings.url = `${args.ajaxSettings.url}`;

                    args.ajaxSettings.data = filterData;
                    args.ajaxSettings.beforeSend = args => {
                      args.httpRequest.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token_03')}`);
                    };
                  }
                  // search voice
                  if (args.action === 'read' && this.state.reloadVoice && this.state.searchContent) {
                    // this.setState({ reloadVoice: false, searchContent: "" })

                    let dataSearch = JSON.parse(args.ajaxSettings.data);
                    let stringData = this.state.searchContent
                    const filter = {};
                    filter.$or = [{ name: { $regex: stringData, $options: 'gi' } }];
                    delete dataSearch.searchString;
                    dataSearch.searchContent = stringData
                    const filterData = JSON.stringify(dataSearch);
                    args.ajaxSettings.url = `${args.ajaxSettings.url}`;
                    args.ajaxSettings.data = filterData;
                    args.ajaxSettings.beforeSend = args => {
                      args.httpRequest.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token_03')}`);
                    };
                    // this.state.reloadVoice = false
                    // this.state.searchContent = ""
                  } else {
                    this.state.reloadVoice = false
                    this.state.searchContent = ""
                  }
                  if (args.action === 'read' && this.state.searchImage !== null && !this.state.reloadVoice) {
                    const dataSearch = JSON.parse(args.ajaxSettings.data);
                    let arrayImage = []
                    
                    if( Array.isArray(this.state.searchImage)){
                      arrayImage = this.state.searchImage.filter(item => {
                        return item.length === 24;
                      });

                    }
                    if(Array.isArray(this.state.distance)){
                      this.state.distance.forEach((item,index)=>{
                        if(item < 50){
                          arrayImage.splice(index,1)
                        }
                      })
                    }
                    console.log('arrayImage',arrayImage);

                    // filter.$or = [{ name: { $regex: stringData, $options: 'gi' } }];
                    delete dataSearch.searchString;
                    delete dataSearch.searchContent;
                    // dataSearch.filter = filter;
                    // dataSearch.searchContent = stringData;
                    dataSearch.filter = { _id: { $in: arrayImage } };
                    const filterData = JSON.stringify(dataSearch);

                    args.ajaxSettings.url = `${args.ajaxSettings.url}`;
                    args.ajaxSettings.data = filterData;
                    args.ajaxSettings.beforeSend = args => {
                      args.httpRequest.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token_03')}`);
                    };
                  }
                  if (args.action === 'read' && this.state.reset === true && !this.state.reloadVoice) {
                    const dataSearch = JSON.parse(args.ajaxSettings.data);

                    // filter.$or = [{ name: { $regex: stringData, $options: 'gi' } }];
                    delete dataSearch.searchString;
                    delete dataSearch.searchContent;
                    delete dataSearch.filter;
                    // dataSearch.filter = filter;
                    // dataSearch.searchContent = stringData;
                    const filterData = JSON.stringify(dataSearch);

                    args.ajaxSettings.url = `${args.ajaxSettings.url}`;
                    args.ajaxSettings.data = filterData;
                    args.ajaxSettings.beforeSend = args => {
                      args.httpRequest.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token_03')}`);
                    };
                  }
                  // } else if (args.action === 'search' && this.state.filterType === 1) {
                  //   const dataSearch = JSON.parse(args.ajaxSettings.data);
                  //   const string = dataSearch.searchString.split('*').join('');
                  //   delete dataSearch.searchString;
                  //   dataSearch.searchContent = string;
                  //   const filterData = JSON.stringify(dataSearch);
                  //   args.ajaxSettings.url = `${args.ajaxSettings.url}`;
                  //   args.ajaxSettings.data = filterData;
                  //   args.ajaxSettings.beforeSend = args => {
                  //     args.httpRequest.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token_03')}`);
                  //   };
                  // }

                  args.ajaxSettings.url = this.state.apiUrl ? this.state.apiUrl : `${args.ajaxSettings.url}?clientId=${clientId}`;
                  args.ajaxSettings.beforeSend = args => {
                    args.httpRequest.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token_03')}`);
                  };
                }}
              >
                <Inject services={[NavigationPane, DetailsView, Toolbar, ContextMenu]} />
              </FileManagerComponent>
            )}
          </Card>
        )}
      </div>
    );
  }
}

FileManager.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  filemanager: makeSelectFileManager(),
  profile: makeSelectProfile(),
  role: makeSelectRole(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'fileManager', reducer });
const withSaga = injectSaga({ key: 'fileManager', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(FileManager);

ReportBox.defaultProps = {
  color: 'linear-gradient(to right, #03A9F4, #03a9f4ad)',
  icon: 'CardTravel',
};

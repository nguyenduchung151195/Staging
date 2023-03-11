/* eslint-disable no-unused-vars */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * DashboardHome
 *
 */

import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Button, withStyles, Avatar, Tooltip, MenuItem, Menu, CardMedia, InputLabel, TextField, DialogTitle } from '@material-ui/core';
import { CardTravel, NextWeek, Receipt, PermContactCalendar, Add } from '@material-ui/icons';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import * as am4core from '@amcharts/amcharts4/core';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import makeSelectDashboardHome from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  mergeData,
  getApi,
  getKpi,
  getRevenueChartData,
  getProfitChart,
  handleChangeTitle,
  getTemplate,
  handleChange,
  postTemplate,
  getAllTemplate,
} from './actions';
import { Paper, Grid, Typography, Steper, RadarChart, Comment, Dialog } from '../../components/LifetekUi';
import { mergeDataProject } from '../ProjectPage/actions';
import { mergeData as mergeDataTask } from '../TaskPage/actions';
import { mergeData as mergeDataRelate } from '../TaskRelatePage/actions';
import { mergeDataContract } from '../ContractPage/actions';
import { formatNumber, serialize } from '../../utils/common';
import { ThumbUpAltOutlined, Share, ChatBubbleOutline } from '@material-ui/icons';
import { API_NEWS_FEED, API_HRM_EMPLOYEE, UPLOAD_APP_URL } from '../../config/urlConfig';
import { fetchData, convertDateFb } from '../../helper';
import CalendarComponent from '../../components/Calendar';
import { clientId } from '../../variable';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
import makeSelectAddTemplatePage from './selectors';
import './index.css';
import Calendar from 'react-calendar';
import { changeSnackbar } from '../Dashboard/actions';
import { makeSelectProfile } from '../Dashboard/selectors';
const newsTypes = [{ title: 'Tin tức', value: 'tin-tuc' }, { title: 'Topic', value: 'topic' }, { title: 'Album', value: 'album' }];
const styles = {
  textField: {
    marginBottom: '25px',
    color: 'black',
  },
};
const {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  OrderedList,
  UnorderedList,
  Undo,
  Redo,
  FontSize,
  FontName,
  FormatBlock,
  Link: EditorLink,
  Unlink,
  InsertImage,
  ViewHtml,
  InsertTable,
  AddRowBefore,
  AddRowAfter,
  AddColumnBefore,
  AddColumnAfter,
  DeleteRow,
  DeleteColumn,
  DeleteTable,
  MergeCells,
  SplitCell,
} = EditorTools;
/* eslint-disable react/prefer-stateless-function */
am4core.useTheme(Am4themesAnimated);

// const ReportBox = props => (
//   <div item md={3} spacing={4} style={{ background: props.color, borderRadius: '3px', padding: '25px 10px', width: '23%', position: 'relative' }}>
//     <div style={{ padding: 5, zIndex: 999 }}>
//       <Typography style={{ color: 'white' }} variant="h4">
//         {props.number}
//       </Typography>
//       <Typography variant="body1">{props.text}</Typography>
//     </div>
//     <div
//       className="hover-dashboard"
//       style={{
//         position: 'absolute',
//         background: props.backColor,
//         textAlign: 'center',
//         padding: 'auto',
//         display: 'block',
//         textDecoration: 'none',
//         width: '100%',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         cursor: 'pointer',
//         zIndex: 555,
//       }}
//       onClick={props.openDetail}
//     >
//       Xem chi tiết
//     </div>
//     <div
//       style={{
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         opacity: 0.2,
//         display: 'flex',
//         justifyContent: 'flex-end',
//         alignItems: 'center',
//         zIndex: 88,
//         fontSize: '70px',
//         padding: 5,
//       }}
//     >
//       {props.icon}
//     </div>
//   </div>
// );

export class DashboardHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabTask: 0,
      tabs: 0,
      isExportRevenueChart: false,
      content: '',
      newfeed: [],
      peoples: [],
      images: [],
      albumName: '',
      realname: [],
      open: false,
      indexShow: -1,
      selectDate: new Date(),
      albums: [],
    };
  }

  getNews() {
    const queryNews = {
      skip: 0,
      limit: 10,
      filter: {
        type: 'tin-tuc',
      },
    };

    fetchData(`${API_NEWS_FEED}?${serialize(queryNews)}`).then(response => {
      this.setState({
        newfeed: [...response.data],
      });
      Promise.all(
        response.data.map(res =>
          fetchData(`${UPLOAD_APP_URL}/file-system/company?clientId=${clientId}&code=NewsFeed&id=${res._id}`, 'GET', null, 'token_03'),
        ),
      ).then(results => {
        const newsFeed = this.state.newfeed.map((item, index) => {
          item.images = Array.isArray(results[index]) ? results[index].filter(img => img.isFile) : [];
          return item;
        });
        this.setState({
          realname: results[0],
          newfeed: newsFeed,
        });
      });
    });
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.getTemplate(id, this.setHtml);
    this.props.getAllTemplate();
    this.getNews();

    const query = {
      skip: 0,
      limit: 5,
      filter: {
        avatar: { $exists: true },
      },
    };
    fetchData(`${API_HRM_EMPLOYEE}?${serialize(query)}`)
      .then(response => {
        this.setState({
          peoples: [...response.data],
        });
      })
      .catch(err => console.log('err', err));
    const queryAlbum = {
      skip: 0,
      limit: 6,
      filter: {
        type: 'album',
      },
    };
    fetchData(`${API_NEWS_FEED}?${serialize(queryAlbum)}`).then(response => {
      const data = response.data;
      Promise.all(
        data.map(res => fetchData(`${UPLOAD_APP_URL}/file-system/company?clientId=${clientId}&code=NewsFeed&id=${res._id}`, 'GET', null, 'token_03')),
      ).then(results => {
        const newAlbums = data.map((item, index) => {
          item.images = Array.isArray(results[index]) ? results[index].filter(img => img.isFile) : [];
          return item;
        });
        this.setState({
          albums: newAlbums,
        });
      });
    });
  }
  ZoomImg = id => {
    // Get the modal
    let modal = document.getElementById('myModal');

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    let img = document.getElementById(id);
    let modalImg = document.getElementById('img01');
    let captionText = document.getElementById('caption');
    img.onclick = function() {
      modal.style.display = 'block';
      modalImg.src = this.src;
      modalImg.alt = this.alt;
      captionText.innerHTML = this.alt;
    };

    // When the user clicks on <span> (x), close the modal
    modal.onclick = function() {
      img01.className += ' out';
      setTimeout(function() {
        modal.style.display = 'none';
        img01.className = 'modal-content';
      }, 100);
    };
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSave = () => {
    const view = this.editor.view;
    const id = this.props.match.params.id;
    const templateData = this.props.addTemplatePage;
    const data = {
      title: templateData.title,
      content: EditorUtils.getHtml(view.state),
      type: templateData.type,
    };
    this.props.postTemplate(data);
    // if (id === 'add') this.props.postTemplate(data);
    // // if (id === 'add') this.props.postTemplate(data);
    // // else this.props.putTemplate(id, data);
  };

  setHtml = () => {
    const view = this.editor.view;
    EditorUtils.setHtml(view, this.props.addTemplatePage.content);
    this.setState({ filterField: this.props.addTemplatePage.filterField, filterFieldValue: this.props.addTemplatePage.filterFieldValue });
  };

  referenceDialog = (code = 'Customer', name) => {
    this.props.mergeData({ codeRef: code, dialogRef: true, name });
  };

  Reply = () => {
    this.setState({ open: true });
  };

  componentDidUpdate(preProp, preState) {
    const { dashboardHome, addTemplatePage, classes } = this.props;
    const { postTemplateSuccess } = addTemplatePage;
    if (preProp.addTemplatePage.postTemplateSuccess !== postTemplateSuccess) {
      // đóng dialog
      this.setState({ open: false });
      //reload tin tuc
      this.getNews();
    }
  }

  render() {
    const { dashboardHome, addTemplatePage, classes } = this.props;
    const { peoples, albumName, images, realname } = this.state;
    return (
      <div>
        <Grid container>
          <Grid item sm={6}>
            {/* <Typography variant="h6" style={{ margin: '20px 20px 0px 20px' }}>
              Tin Tức
            </Typography> */}

            <div style={{ maxHeight: '900px', overflowY: 'auto' }}>
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#fff',
                  margin: '20px',
                  border: '1px solid #e0e0eb',
                  borderRadius: '5px',
                  padding: '20px',
                }}
              >
                <Avatar
                  style={{ width: 40, height: 40, display: 'inline-block' }}
                  src={this.props.profile ? `${this.props.profile.avatar}?allowDefault=true` : null}
                />
                <div
                  style={{ padding: '10px', marginLeft: '10px', borderRadius: '20px', backgroundColor: '#e0e0eb', width: '100%' }}
                  onClick={this.Reply}
                >
                  Chia sẻ cảm xúc suy nghĩ với mọi người!
                </div>
                {/* <TextField
                  placeholder="Nhập nội dung bài viết"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  onClick={this.Reply}
                  disabled
                /> */}
              </div>
              {this.state.newfeed.map((it, index) => (
                <div style={{ border: '1px solid #e0e0eb', backgroundColor: '#fff', borderRadius: '5px', margin: '20px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Avatar
                      style={{ width: 40, height: 40, display: 'inline-block' }}
                      alt={it.createdBy ? it.createdBy.name : null}
                      src={it.createdBy ? `${it.createdBy.avatar}?allowDefault=true` : null}
                    />

                    <span style={{ padding: '0 10px', fontSize: '16px' }}>
                      <span style={{ display: 'block' }}>
                        <span style={{ fontWeight: 'bold' }}>{it.createdBy ? it.createdBy.name : ''}</span> {it.title}
                      </span>

                      <span style={{ display: 'block', fontSize: '12px' }}>{convertDateFb(it.createdAt)}</span>
                    </span>
                  </div>
                  <span
                    dangerouslySetInnerHTML={{ __html: it.content }}
                    style={{ padding: '0 20px', fontSize: '14px', width: '100%', height: '100%' }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', overflowX: 'auto' }}>
                    {it.images
                      ? it.images.map(img => {
                          if (img.mimetype.indexOf('image') !== -1) {
                            return (
                              <Button
                                onClick={() => {
                                  this.ZoomImg(`image_feed_id_${img._id}`);
                                }}
                                style={{ justifyContent: 'flex-start' }}
                              >
                                <img
                                  id={`image_feed_id_${img._id}`}
                                  src={`${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${img._id}`}
                                  alt="Ảnh"
                                  style={{ height: 200, width: '100%', display: 'inline-block' }}
                                />
                                <div id="myModal" class="modal">
                                  <img class="modal-content" id="img01" />
                                  <div id="caption" />
                                </div>
                              </Button>
                            );
                          } else {
                            return (
                              <div
                                style={{
                                  border: '1px solid #e0e0eb',
                                  borderRadius: '5px',
                                  margin: '0 10px 10px 10px',
                                  padding: '20px',
                                  cursor: 'pointer',
                                  display: 'inline',
                                }}
                                onClick={() => {
                                  const url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${img._id}`;
                                  const xhr = new XMLHttpRequest();
                                  xhr.open('GET', url, true);
                                  xhr.responseType = 'blob';
                                  xhr.onload = function() {
                                    const urlCreator = window.URL || window.webkitURL;
                                    const imageUrl = urlCreator.createObjectURL(this.response);
                                    const tag = document.createElement('a');
                                    tag.href = imageUrl;
                                    tag.download = img.realName.split('/').pop();
                                    document.body.appendChild(tag);
                                    tag.click();
                                    document.body.removeChild(tag);
                                  };
                                  xhr.send();
                                }}
                              >
                                <div>
                                  <p style={{ fontWeight: 'bold' }}>Tải xuống</p>
                                  <div>{img.realName.split('/').pop()}</div>
                                </div>
                              </div>
                            );
                          }
                        })
                      : null}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {it.countLike && it.countLike.length ? <span style={{ paddingRight: '10px' }}>{it.countLike.length} lượt thích</span> : null}
                    {it.countComment ? <span style={{ paddingRight: '10px' }}>{it.countComment} bình luận</span> : null}
                    {it.countShare && it.countShare.length ? <span>{it.countShare.length} chia sẻ</span> : null}
                  </div>
                  <hr style={{ border: '1px solid #e0e0eb', marginTop: '10px', marginBottom: '10px' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        cursor: 'pointer',
                        color:
                          Array.isArray(it.countLike) && it.countLike.find(i => this.props.profile && i === this.props.profile._id) ? '#006edc' : '',
                      }}
                      onClick={() => {
                        const currNews = this.state.newfeed;
                        const newNews = currNews[index];
                        if (!Array.isArray(newNews.countLike)) {
                          newNews.countLike = [];
                        }
                        if (newNews.countLike.find(i => i === this.props.profile._id)) {
                          newNews.countLike = newNews.countLike.filter(i => i !== this.props.profile._id);
                        } else {
                          newNews.countLike.push(this.props.profile._id);
                        }
                        this.setState({ newfeed: currNews });
                        fetchData(`${API_NEWS_FEED}/updateField`, 'POST', {
                          field: 'countLike',
                          newValue: newNews.countLike,
                          newId: it._id,
                        })
                          .then(response => {
                            console.log('response', response);
                          })
                          .catch(err => console.log('err', err));
                      }}
                    >
                      <ThumbUpAltOutlined />
                      Thích
                    </span>
                    <span style={{ cursor: 'pointer' }} onClick={() => this.setState({ indexShow: index })}>
                      <ChatBubbleOutline />
                      Bình luận
                    </span>
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        const currNews = this.state.newfeed;
                        const newNews = currNews[index];
                        if (!Array.isArray(newNews.countShare)) {
                          newNews.countShare = [];
                        }
                        if (!newNews.countShare.find(i => i === this.props.profile._id)) {
                          newNews.countShare.push(this.props.profile._id);
                          this.setState({ newfeed: currNews });
                          fetchData(`${API_NEWS_FEED}/updateField`, 'POST', {
                            field: 'countShare',
                            newValue: newNews.countShare,
                            newId: it._id,
                          })
                            .then(response => {
                              this.props.onChangeSnackbar(true, 'Chia sẻ bài viết thành công', 'success');
                              console.log('response', response);
                            })
                            .catch(err => console.log('err', err));
                        }
                      }}
                    >
                      <Share />
                      Chia sẻ
                    </span>
                  </div>

                  {this.state.indexShow === index ? (
                    <>
                      <hr style={{ border: '1px solid #e0e0eb', marginTop: '10px', marginBottom: '10px' }} />
                      <Comment
                        code="NewsFeed"
                        id={it._id}
                        onCommentCreate={() => {
                          const currNews = this.state.newfeed;
                          const newNews = currNews[index];
                          newNews.countComment = (newNews.countComment || 0) + 1;
                          this.setState({ newfeed: currNews });
                        }}
                      />
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          </Grid>
          <Grid item sm={6} style={{ padding: '0 10px' }}>
            <Grid container style={{ overflowY: 'auto', padding: '0' }}>
              <Grid item sm={6} style={{ padding: '0 10px' }}>
                <div style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '5px', height: '100%' }}>
                  <Typography variant="h6">Nhân viên tiêu biểu tháng 6</Typography>
                  <div style={{ display: 'flex' }}>
                    <div>
                      <Avatar
                        src={peoples.length ? `${peoples[0].avatar}?allowDefault=true` : ''}
                        style={{ width: 100, height: 100, display: 'inline-block', border: '1px solid #00ACC1' }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ padding: '0 15px' }}>
                        <p style={{ fontSize: '24px', fontWeight: 'normal' }}>{peoples.length ? peoples[0].name : ''}</p>
                        <p style={{ fontSize: '16px' }}>{peoples.length && peoples[0].position ? peoples[0].position.title : ''}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', marginTop: 20 }}>
                    {peoples.map(p => (
                      <Avatar src={`${p.avatar}?allowDefault=true`} style={{ display: 'inline-block', border: '1px solid #e2e2e2' }} />
                    ))}
                  </div>
                </div>
              </Grid>
              <Grid item sm={6} style={{ padding: ' 0 10px' }}>
                <div style={{ padding: '10px', backgroundColor: '#fff', minHeight: '260px', borderRadius: '5px', height: 'auto' }}>
                  <Typography variant="h6">Bộ sưu tập</Typography>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {this.state.albums.map((alb, index) => (
                      <Button
                        onClick={() => {
                          this.setState({
                            newfeed: [this.state.albums[index]],
                          });
                        }}
                      >
                        <img
                          src={alb.images && alb.images[0] ? `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${alb.images[0]._id}` : ''}
                          alt={alb.title}
                          title={alb.title}
                          style={{ width: '100%', height: '80px', display: 'inline-block' }}
                        />
                      </Button>
                    ))}
                  </div>
                </div>
              </Grid>
              <Grid container sm={12} style={{ padding: '20px 0 0 0 ' }}>
                <Grid item sm={6} style={{ padding: '0 10px' }}>
                  <div style={{ backgroundColor: '#fff', borderRadius: '5px', height: '100%', padding: '10px' }}>
                    <Typography variant="h6">Hoạt động</Typography>
                    <div>
                      <div>
                        <Typography style={{ display: 'block', textAlign: 'center', background: '#e2e2e2' }} variant="subtitle1">
                          Hôm nay
                        </Typography>
                        <div>
                          <Typography style={{ display: 'inline-block' }} variant="body2">
                            8.00 AM - 9.00 AM
                          </Typography>
                          <Typography style={{ display: 'inline-block' }} variant="body2">
                            Họp đầu giờ
                          </Typography>
                        </div>
                        <div>
                          <Typography style={{ display: 'inline-block' }} variant="body2">
                            9.30 AM - 10.30 AM
                          </Typography>
                          <Typography style={{ display: 'inline-block' }} variant="body2">
                            Họp giao ban
                          </Typography>
                        </div>
                      </div>

                      <div>
                        <Typography style={{ display: 'block', textAlign: 'center', background: '#e2e2e2' }} variant="subtitle1">
                          Ngày mai
                        </Typography>
                        <div>
                          <Typography style={{ display: 'inline-block' }} variant="body2">
                            8.00 AM - 9.00 AM
                          </Typography>
                          <Typography style={{ display: 'inline-block' }} variant="body2">
                            Họp PGbank
                          </Typography>
                        </div>
                        <div>
                          <Typography style={{ display: 'inline-block' }} variant="body2">
                            9.30 AM - 11.00 AM
                          </Typography>
                          <Typography style={{ display: 'inline-block' }} variant="body2">
                            Họp dự án mới
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid item sm={6} style={{ padding: ' 0 10px' }}>
                  {/* <CalendarComponent /> */}
                  <div className="Sample">
                    <div className="Sample__container" style={{ marginBottom: 0 }}>
                      <main className="Sample__container__content">
                        <Calendar
                          onChange={val => {
                            this.setState({ selectDate: val });
                          }}
                          value={this.state.selectDate}
                          showWeekNumbers
                        />
                      </main>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Dialog
          maxWidth="md"
          fullWidth
          open={this.state.open}
          onSave={this.handleSave}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title1"
        >
          <DialogTitle style={{ padding: '0 0 20px 0' }} id="form-dialog-title1">
            Viết bài
          </DialogTitle>
          <TextField
            value={addTemplatePage.title}
            onChange={this.props.handleChange('title')}
            required
            className={classes.textField}
            label="Tiêu đề"
            fullWidth
          />
          <TextField
            required
            className={classes.textField}
            label="Loại tin"
            value={addTemplatePage.type}
            select
            onChange={this.props.handleChange('type')}
            fullWidth
            InputLabelProps={{ shrink: true }}
          >
            {newsTypes.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.title}
              </MenuItem>
            ))}
          </TextField>
          <Editor
            tools={[
              [Bold, Italic, Underline, Strikethrough],
              [Subscript, Superscript],
              [AlignLeft, AlignCenter, AlignRight, AlignJustify],
              [Indent, Outdent],
              [OrderedList, UnorderedList],
              FontSize,
              FontName,
              FormatBlock,
              [Undo, Redo],
              [EditorLink, Unlink, InsertImage, ViewHtml],
              [InsertTable],
              [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
              [DeleteRow, DeleteColumn, DeleteTable],
              [MergeCells, SplitCell],
            ]}
            contentStyle={{ height: 300 }}
            contentElement={addTemplatePage.content}
            ref={editor => (this.editor = editor)}
          />
        </Dialog>
      </div>
    );
  }
}

// DashboardHome.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  addTemplatePage: makeSelectAddTemplatePage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    mergeData: data => dispatch(mergeData(data)),
    getApi: () => dispatch(getApi()),
    getKpi: () => dispatch(getKpi()),
    onGetRevenueChartData: () => dispatch(getRevenueChartData()),
    mergeDataProject: data => dispatch(mergeDataProject(data)),
    mergeDataTask: data => dispatch(mergeDataTask(data)),
    mergeDataRelate: data => dispatch(mergeDataRelate(data)),
    mergeDataContract: data => dispatch(mergeDataContract(data)),
    getProfitChart: () => dispatch(getProfitChart()),
    getTemplate: (id, getTem) => dispatch(getTemplate(id, getTem)),
    handleChange: name => e => dispatch(handleChange({ name, value: e.target.value })),
    postTemplate: data => dispatch(postTemplate(data)),
    getAllTemplate: () => dispatch(getAllTemplate()),
    onChangeSnackbar: (status, message, variant) => {
      dispatch(changeSnackbar({ status, message, variant }));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addNewsFeed', reducer });
const withSaga = injectSaga({ key: 'addNewsFeed', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(DashboardHome);

// ReportBox.defaultProps = {
//   color: 'linear-gradient(to right, #03A9F4, #03a9f4ad)',
//   icon: 'CardTravel',
// };

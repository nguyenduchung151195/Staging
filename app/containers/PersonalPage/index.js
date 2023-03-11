/**
 *
 * PersonalPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Grid, Avatar, Paper, withStyles, Button, DialogTitle, TextField, MenuItem } from '@material-ui/core';
import { Call, Work, Email, AccessTime, AddCircle, Accessibility, ThumbUpAltOutlined, Share, ChatBubbleOutline } from '@material-ui/icons';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
import makeSelectPersonalPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import SearchIcon from '@material-ui/icons/Search';
import CustomInputBase from 'components/Input/CustomInputBase';
import { clientId } from '../../variable';
import { Tabs, Tab, Typography, Dialog, Comment } from '../../components/LifetekUi';
import { fetchData, serialize, convertDateFb } from '../../helper';
import { makeSelectProfile } from '../Dashboard/selectors';
import { Link } from 'react-router-dom';
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
  getIsUserFollowed,
  putUserFollow,
  getListFollowSuggest,
  deleteListFollowSuggest,
  sendAddFriend,
  getsendAddFriend,
  addFriend,
  getListFriend,
  unFriend,
  getRelationship
} from './actions';
import { API_USERS, UPLOAD_APP_URL, API_NEWS_FEED, API_HRM_EMPLOYEE, API_FOLLOWED_EMPLOYEE, API_GET_EMPLOYEE_BY_USER } from '../../config/urlConfig';
/* eslint-disable react/prefer-stateless-function */
const newsTypes = [{ title: 'Tin tức', value: 'tin-tuc' }, { title: 'Topic', value: 'topic' }, { title: 'Album', value: 'album' }];
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
export class PersonalPage extends React.Component {
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
      tab: 0,
      avatar: 'https://img.thuthuattinhoc.vn/uploads/2019/02/18/hinh-nen-dep-dem-sao_110817536.jpg',
      name: 'Tên người dùng ... ',
      email: 'trungtuyen3009@gmail.com',
      phoneNumber: '0973424277',
      cover: 'http://coverstimeline.com/app/template/492.jpg',
      reload: true,
      filterName: ""
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
    this.loadData();
    this.getNews();
    this.handleGetIsUserFollowed()
    this.props.onGetsendAddFriend()
    this.props.onGetListFriend()
    this.props.onGetListFollowSuggest(this.state.filterName)

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
    img.onclick = function () {
      modal.style.display = 'block';
      modalImg.src = this.src;
      modalImg.alt = this.alt;
      captionText.innerHTML = this.alt;
    };

    // When the user clicks on <span> (x), close the modal
    modal.onclick = function () {
      img01.className += ' out';
      setTimeout(function () {
        modal.style.display = 'none';
        img01.className = 'modal-content';
      }, 100);
    };
  };
  handleSave = () => {
    const view = this.editor.view;
    const id = this.props.match.params.id;
    const templateData = this.props.personalPage;
    const data = {
      title: templateData.title,
      content: EditorUtils.getHtml(view.state),
      type: templateData.type,
    };
    this.props.postTemplate(data);
    templateData.title && templateData.type !== '' ? this.setState({ open: false }) : null;
    // if (id === 'add') this.props.postTemplate(data);
    // // if (id === 'add') this.props.postTemplate(data);
    // // else this.props.putTemplate(id, data);
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  setHtml = () => {
    const view = this.editor.view;
    EditorUtils.setHtml(view, this.props.personalPage.content);
    this.setState({ filterField: this.props.personalPage.filterField, filterFieldValue: this.props.personalPage.filterFieldValue });
  };

  referenceDialog = (code = 'Customer', name) => {
    this.props.mergeData({ codeRef: code, dialogRef: true, name });
  };

  Reply = () => {
    this.setState({ open: true });
  };

  componentDidUpdate(preProp, preState) {
    const { dashboardHome, personalPage, classes } = this.props;
    const { postTemplateSuccess, listSendAddFriend } = personalPage;
    if (preProp.personalPage.postTemplateSuccess !== postTemplateSuccess) {
      // đóng dialog
      this.setState({ open: false });
      //reload tin tuc
      this.getNews();
    }
  }

  loadData = () => {
    try {
      const filter = { username: this.props.match.params.id };
      const userID = this.props.match.params.id
      const query = serialize({ filter });
      fetchData(`${API_GET_EMPLOYEE_BY_USER}?username=${userID}`).then(data => {
        if (data && data.user) {
          console.log("data: ", data)
          const a1 = 'http://topcoverphoto.com/app/template/220.jpg';
          const a2 = 'http://coverstimeline.com/app/template/390.jpg';
          const a3 = 'http://coverstimeline.com/app/template/398.jpg';
          const items = [a1, a2, a3];
          const cover = items[Math.floor(Math.random() * items.length)];
          this.setState({ name: data.user.name, email: data.user.email, phoneNumber: data.user.phoneNumber, avatar: data.user.avatar, cover, employeeId: data.user._id });
        }
      });
      // eslint-disable-next-line no-empty
    } catch (error) { }
  };
  componentDidUpdate(next) {
    if (this.props.match.params.id !== next.match.params.id) {
      this.loadData();
      this.handleGetIsUserFollowed()
      this.props.onGetsendAddFriend()
      this.props.onGetListFriend()
      this.props.onGetListFollowSuggest(this.state.filterName)
    }
  }
  handleGetIsUserFollowed = () => {
    try {
      const userID = this.props.match.params.id
      fetchData(`${API_GET_EMPLOYEE_BY_USER}?username=${userID}`).then(data => {
        if (data && data.user && data.user._id) {
          this.props.onGetIsUserFollowed(data.user._id)
          this.props.onGetRelationship(data.user._id)
        }
      });
    } catch (error) { }
  }
  putUserFollow = (id, isSend, isFollowed) => {
    try {
      const filter = { username: this.props.match.params.id };
      const query = serialize({ filter });
      const userID = this.props.match.params.id
      fetchData(`${API_GET_EMPLOYEE_BY_USER}?username=${userID}`).then(data => {
        if (data && data.user && data.user._id) {
          if (isSend === "add") this.props.onSendAddFriend(data.user._id, isFollowed)
          else {
            if (id === null)
              this.props.onPutUserFollow(data.user._id, false)
            else if (id !== null) {
              if (id === data.user._id)
                this.props.onPutUserFollow(id, false)
              else
                this.props.onPutUserFollow(id, true)
            }
          }
        }
      });
    } catch (error) { }
  }

  addFollow = (id) => {
    this.putUserFollow(id, null, null)
  }
  deleteFollowList = (id) => {
    this.props.onDeleteListFollowSuggest(id)
  }
  onSendAddFriendd = (isFollowed, relationship) => {
    let empID = null
    try {
      const userID = this.props.match.params.id
      fetchData(`${API_GET_EMPLOYEE_BY_USER}?username=${userID}`).then(data => {
        if (data && data.user && data.user._id) {
          empID = data.user._id
        }
      });
    } catch (error) { }


    switch (relationship) {
      case "No":
        this.putUserFollow(null, "add", isFollowed)
      case "Yes":
        return this.props.onUnFriend(empID, "Itseft")
      case "Reply":
        this.replyAddFriend(empID, true, relationship)
        return
      case "Wait":
        return "Hủy lời mời kết bạn"
      default:
        return "Kết bạn"
    }
  }
  replyAddFriend = (id, accept, ItSelf) => {
    let itself = true
    if (ItSelf === "Itself") itself = false
    this.props.onAddFriend(id, accept, itself)
  }
  checkRelationship = (status) => {
    switch (status) {
      case "No":
        return "Kết bạn"
      case "Yes":
        return "Hủy kết bạn"
      case "Reply":
        return "Chấp nhận kết bạn"
      case "Wait":
        return "Đã gửi lời mời kết bạn"
      case "Itseft":
      default:
        return false
    }
  }
  getNewListSuggest = (e) => {
    this.setState({ filterName: e.target.value })
    this.props.onGetListFollowSuggest(e.target.value)
  }
  render() {
    const { tab, avatar, name, phoneNumber, email, cover, peoples, albumName, images, realname, search, listSuggest, } = this.state;
    const { state } = this.props.location
    const viewProfile = state && state.viewProfile ? state.viewProfile : false
    const { dashboardHome, personalPage, classes } = this.props;
    const { isFollowed, listFollowSuggest, listSendAddFriend, listFriend, relationship } = personalPage
    return (
      <>
        <div>
          <Paper
            style={{
              backgroundImage: ` url(${cover})`,
              width: '100%',
              backgroundSize: 'cover',
              zIndex: -1
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                minHeight: "170px",
              }}
            >
              {
                (relationship !== "Itself" && relationship !== undefined) ? <>
                  <Button style={{ marginTop: '8%', marginRight: 20, background: "white" }} variant="outlined" onClick={() => this.addFollow(null)} >
                    {
                      isFollowed === true ? "Hủy theo dõi" : "Theo dõi"
                    }
                  </Button>
                  <Button style={{ marginRight: 30, background: "white" }} variant="outlined" onClick={() => this.onSendAddFriendd(isFollowed, relationship)}>
                    {
                      this.checkRelationship(relationship)
                    }

                  </Button>
                </> : null
              }
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}
            >
              <Avatar alt="Ảnh đại diện" src={avatar} style={{ width: 100, height: 100, marginTop: '-40px', marginLeft: 25 }} />
              <p
                style={{
                  color: '#d1d1d1',
                  fontWeight: 'bold',
                  margin: 3,
                  fontSize: '1.4rem',
                }}
              >
                {name}
              </p>
            </div>
          </Paper>
        </div>

        <Tabs value={tab} onChange={(e, tab) => this.setState({ tab })} style={{ marginLeft: 60 }}>
          <Tab value={0} label="THÔNG TIN CHUNG" />
          <Tab value={3} label="BẠN BÈ" />
          {viewProfile === true ? null :
            <Tab value={4} label="LỜI MỜI KẾT BẠN" />}
          <Tab value={1} label="DÒNG THỜI GIAN" />
          <Tab value={2} label="ẢNH" />
        </Tabs>
        {tab === 0 ? (
          <Grid container md={12}>
            <Grid item md={8} container>
              <Grid item md={12}>
                <Typography
                  component="p"
                  style={{
                    fontWeight: 550,
                    fontSize: '20px',
                    marginLeft: '30px',
                    marginTop: '30px',
                  }}
                >
                  THÔNG TIN CHUNG
                </Typography>
              </Grid>
              <Grid item md={12} container>
                <Grid item md={6}>
                  <Typography
                    component="p"
                    style={{
                      fontWeight: 550,
                      fontSize: '20px',
                      marginTop: '30px',
                    }}
                  />
                  <Call style={{ fontSize: '20px', marginBottom: '5px', marginLeft: '30px' }} />
                  {phoneNumber}
                  <Typography
                    component="p"
                    style={{
                      fontWeight: 550,
                      fontSize: '20px',
                      marginTop: '30px',
                    }}
                  />
                  <Email style={{ fontSize: '20px', marginBottom: '5px', marginLeft: '30px' }} />
                  {email}
                  <Typography
                    component="p"
                    style={{
                      fontWeight: 550,
                      fontSize: '20px',
                      marginTop: '30px',
                    }}
                  />
                  <AddCircle style={{ fontSize: '20px', marginBottom: '5px', marginLeft: '30px' }} />
                  Thêm địa chỉ
                </Grid>
                <Grid item md={6}>
                  <Typography
                    component="p"
                    style={{
                      fontWeight: 550,
                      fontSize: '20px',
                      marginTop: '30px',
                    }}
                  />
                  <Work style={{ fontSize: '20px', marginBottom: '5px', marginLeft: '30px' }} />
                  Lập trình viên Web
                  <Typography
                    component="p"
                    style={{
                      fontWeight: 550,
                      fontSize: '20px',
                      marginTop: '30px',
                    }}
                  />
                  <AccessTime style={{ fontSize: '20px', marginBottom: '5px', marginLeft: '30px' }} />
                  Thời gian có sẵn
                  <Typography
                    component="p"
                    style={{
                      fontWeight: 550,
                      fontSize: '20px',
                      marginTop: '30px',
                    }}
                  />
                  <Accessibility style={{ fontSize: '20px', marginBottom: '5px', marginLeft: '30px' }} />
                  Thêm hồ sơ cá nhân
                </Grid>
              </Grid>
            </Grid>

            {/* follow */}
            <Grid item md={4}>
              <Grid container item md={12} style={{ display: "flex" }}>
                <Grid item md={5}>
                  <Typography
                    component="p"
                    style={{
                      fontWeight: 550,
                      fontSize: '20px',
                      // marginLeft: '30px',
                      marginTop: '30px',
                    }}
                  >
                    Gợi ý theo dõi
                  </Typography>
                </Grid>
                <Grid item md={7} style={{ display: "flex", justifyContent: "center" }}>
                  {
                    search === true ? <CustomInputBase
                      label="Search"
                      name="keySearch"
                      autoFocus={true}
                      onBlur={() => { this.setState({ search: false }) }}
                      onChange={(e) => this.getNewListSuggest(e)}
                      value={this.state.filterName}
                    /> : <SearchIcon
                      onClick={() => { this.setState({ search: true }) }}
                      style={{
                        fontWeight: 'bold',
                        fontSize: '30px',
                        // marginLeft: '30px',
                        marginTop: '35px'
                      }} />
                  }
                </Grid>
              </Grid>
              {
                <Grid container item md={12} >
                  {
                    listFollowSuggest && listFollowSuggest.data && Array.isArray(listFollowSuggest.data) && listFollowSuggest.data.length > 0 && listFollowSuggest.data.map((el) => {
                      return (
                        <>
                          <Grid item md={3} sm={3} style={{ marginTop: "20px" }}>
                            <Avatar alt="avatar user" src={el.avatar ? el.avatar : avatar} style={{ width: 65, height: 65 }}
                              onClick={() => this.props.history.push(
                                {
                                  pathname: `/userprofile/${el.username}`,
                                  state: {
                                    viewProfile: true
                                  }
                                }
                              )}
                            />
                          </Grid>
                          <Grid item md={9} sm={9} style={{ marginTop: "-25px" }}>
                            <Grid container item md={12} >
                              {/* <Link to={{
                                 pathname: `/userprofile/${el.username}`,
                                 state: {
                                   viewProfile: true
                                 }
                               }}> */}
                              <Typography
                                component="p"
                                style={{
                                  fontWeight: 550,
                                  fontSize: '15px',
                                  marginTop: "20px"
                                }}
                                onClick={() => this.props.history.push(
                                  {
                                    pathname: `/userprofile/${el.username}`,
                                    state: {
                                      viewProfile: true
                                    }
                                  }
                                )}
                              >
                                {el.name}
                              </Typography>
                              {/* </Link> */}
                            </Grid>
                            <Grid container item md={12} >

                              <Button
                                color="primary"
                                variant="contained"
                                // style={{ width: "100px" }}
                                onClick={() => this.addFollow(el._id)}
                              >Theo Dõi</Button>
                              <Button
                                variant="contained"
                                style={{ width: "100px", marginLeft: "5px" }}
                                onClick={() => this.deleteFollowList(el._id)}
                              >Gỡ</Button>

                            </Grid>
                          </Grid>
                        </>
                      )
                    })
                  }
                </Grid>
              }
            </Grid>
          </Grid>
        ) : null
        }
        {
          tab === 1 ? (
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
                                xhr.onload = function () {
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
          ) : null
        }
        {
          tab === 2 ? (
            <Grid container md={12}>
              <div style={{ padding: '10px', backgroundColor: '#fff', minHeight: '260px', borderRadius: '5px', height: 'auto' }}>
                <Typography variant="h6">Bộ sưu tập</Typography>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {this.state.albums.map((alb, index) => (
                    // <Button
                    //   onClick={() => {
                    //     this.setState({
                    //       newfeed: [this.state.albums[index]],
                    //     });
                    //   }}
                    // >
                    <img
                      src={alb.images && alb.images[0] ? `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${alb.images[0]._id}` : ''}
                      alt={alb.title}
                      title={alb.title}
                      style={{ width: '100%', height: '80px', display: 'inline-block' }}
                    />
                    // </Button>
                  ))}
                </div>
              </div>
            </Grid>
          ) : null
        }
        {
          tab === 3 ? (
            <Grid container md={12}>
              <Typography
                component="p"
                style={{
                  fontWeight: 550,
                  fontSize: '20px',
                  marginLeft: '30px',
                  marginTop: '30px',
                }}
              >
                DANH SÁCH BẠN BÈ
              </Typography>
              <Grid container item md={12} >
                {
                  listFriend && listFriend.data && Array.isArray(listFriend.data) && listFriend.data.length > 0 && listFriend.data.map((el) => {
                    return (
                      <>
                        <Grid container item md={4} >
                          <Grid item md={1} sm={1} >

                          </Grid>
                          <Grid item md={3} sm={3} style={{ marginTop: "20px" }}>
                            <Avatar alt="avatar user" src={el.avatar ? el.avatar : avatar} style={{ width: 65, height: 65 }}
                              onClick={() => this.props.history.push(
                                {
                                  pathname: `/userprofile/${el.username}`,
                                  state: {
                                    viewProfile: true
                                  }
                                }
                              )} />
                          </Grid>
                          <Grid item md={8} sm={8} style={{ marginTop: "-25px" }}>
                            <Grid container item md={12} >
                              <Typography
                                component="p"
                                style={{
                                  fontWeight: 550,
                                  fontSize: '15px',
                                  marginTop: "20px"
                                }}
                                onClick={() => this.props.history.push(
                                  {
                                    pathname: `/userprofile/${el.username}`,
                                    state: {
                                      viewProfile: true
                                    }
                                  }
                                )}
                              >
                                {el.name}
                              </Typography>
                              {/* </Link> */}
                            </Grid>
                            <Grid container item md={12} >

                              <Button
                                color="primary"
                                variant="contained"
                                // style={{ width: "100px" }}
                                onClick={() => this.props.onUnFriend(el.id, relationship)}
                              >Hủy kết bạn</Button>

                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    )
                  })
                }
              </Grid>
            </Grid>
          ) : null
        }

        {
          tab === 4 ? (
            <Grid container md={12}>
              <Typography
                component="p"
                style={{
                  fontWeight: 550,
                  fontSize: '20px',
                  marginLeft: '30px',
                  marginTop: '30px',
                }}
              >
                DANH SÁCH NGƯỜI GỬI LỜI MỜI KẾT BẠN
              </Typography>

              <Grid container item md={12} >
                {
                  listSendAddFriend && Array.isArray(listSendAddFriend) && listSendAddFriend.length > 0 && listSendAddFriend.map((el) => {
                    return (
                      <>
                        <Grid container item md={4} >
                          {/* <Grid item md={3} style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                            <Avatar alt="avatar user" src={el.avatar ? el.avatar : avatar} style={{ width: 65, height: 65, marginLeft: 25 }} />
                          </Grid>
                          <Grid item md={9} style={{ marginTop: "-25px" }}>
                            <Grid container item md={12} >
                              <Link to={{
                                pathname: `/userprofile/${el.username}`,
                                state: {
                                  viewProfile: true
                                }
                              }}>
                                <Typography
                                  component="p"
                                  style={{
                                    fontWeight: 550,
                                    fontSize: '20px',
                                    marginTop: "20px"
                                  }}
                                >
                                  {el.name}
                                </Typography>
                              </Link>
                            </Grid>
                            <Grid container item md={12} >

                              <Button
                                color="primary"
                                variant="contained"
                                // style={{ width: "100px" }}
                                onClick={() => this.replyAddFriend(el.id, true, relationship)}
                              >Chấp nhận</Button>
                              <Button
                                variant="contained"
                                style={{ width: "100px", marginLeft: "5px" }}
                                onClick={() => this.replyAddFriend(el.id, false, relationship)}
                              >Từ chối</Button>
                            </Grid>
                          </Grid> */}

                          <Grid item md={1} sm={1} >

                          </Grid>
                          <Grid item md={3} sm={3} style={{ marginTop: "20px" }}>
                            <Avatar alt="avatar user" src={el.avatar ? el.avatar : avatar} style={{ width: 65, height: 65 }}
                              onClick={() => this.props.history.push(
                                {
                                  pathname: `/userprofile/${el.username}`,
                                  state: {
                                    viewProfile: true
                                  }
                                }
                              )} />
                          </Grid>
                          <Grid item md={8} sm={8} style={{ marginTop: "-25px" }}>
                            <Grid container item md={12} >
                              <Typography
                                component="p"
                                style={{
                                  fontWeight: 550,
                                  fontSize: '15px',
                                  marginTop: "20px"
                                }}
                                onClick={() => this.props.history.push(
                                  {
                                    pathname: `/userprofile/${el.username}`,
                                    state: {
                                      viewProfile: true
                                    }
                                  }
                                )}
                              >
                                {el.name}
                              </Typography>
                              {/* </Link> */}
                            </Grid>
                            <Grid container item md={12} >
                              <Button
                                color="primary"
                                variant="contained"
                                // style={{ width: "100px" }}
                                onClick={() => this.replyAddFriend(el.id, true, relationship)}
                              >Chấp nhận</Button>
                              <Button
                                variant="contained"
                                style={{ width: "100px", marginLeft: "5px" }}
                                onClick={() => this.replyAddFriend(el.id, false, relationship)}
                              >Từ chối</Button>

                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    )
                  })
                }
              </Grid>
            </Grid>
          ) : null
        }
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
            value={personalPage.title}
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
            value={personalPage.type}
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
            contentElement={personalPage.content}
            ref={editor => (this.editor = editor)}
          />
        </Dialog>
      </>
    );
  }
}

PersonalPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  personalPage: makeSelectPersonalPage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
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
    onChangeSnackbar: (status, message, variant) => { dispatch(changeSnackbar({ status, message, variant })) },
    onGetIsUserFollowed: body => dispatch(getIsUserFollowed(body)),
    onPutUserFollow: (id, status) => dispatch(putUserFollow(id, status)),
    onGetListFollowSuggest: (filterName) => dispatch(getListFollowSuggest(filterName)),
    onDeleteListFollowSuggest: (body) => dispatch(deleteListFollowSuggest(body)),
    onSendAddFriend: (id, isFollowed) => dispatch(sendAddFriend(id, isFollowed)),
    onGetsendAddFriend: () => dispatch(getsendAddFriend()),
    onAddFriend: (id, accept, itself) => dispatch(addFriend(id, accept, itself)),
    onGetListFriend: () => dispatch(getListFriend()),
    onUnFriend: (id, relationship) => dispatch(unFriend(id, relationship)),
    onGetRelationship: (id) => dispatch(getRelationship(id)),
  }
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'personalPage', reducer });
const withSaga = injectSaga({ key: 'personalPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(PersonalPage)

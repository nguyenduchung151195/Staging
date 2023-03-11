/* eslint-disable no-alert */
import React from 'react';

import {
  AppBar,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Slide,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  Close,
  Videocam,
  Phone,
  Settings,
  Image,
  AttachFile,
  Send,
  GetApp,
  PictureAsPdf,
  ZoomIn,
  ZoomOut,
  MoreHoriz,
  Delete,
  InsertEmoticon,
  Edit,
} from '@material-ui/icons';

import { API_CONVERSATION, API_REMOVE_MESSAGE, API_UPDATE_EMOTION, API_UPDATE_MESSAGE, UPLOAD_IMG_SINGLE } from '../../../config/urlConfig';
import { fetchData } from '../../../helper';
import xlsx from '../../../assets/img/xlsx.svg';
import docx from '../../../assets/img/docx.svg';
import ppt from '../../../assets/img/ppt.svg';
import like from '../../../assets/img/like.svg';
import love from '../../../assets/img/love.svg';
import angry from '../../../assets/img/angry.svg';
import sad from '../../../assets/img/sad.svg';
import haha from '../../../assets/img/haha.svg';
import wow from '../../../assets/img/wow.svg';
import care from '../../../assets/img/care.svg';

import _ from 'lodash';

export default class ChatWindowFullScreen extends React.Component {
  constructor(props) {
    super(props);
    this.refContent = React.createRef(null);
    this.state = {
      hide: false,
      messages: [],
      input: '',
      data: { name: '', join: [], type: 1, names: [] },
      iconBlock: 3,
      messageBlock: 9,
      linkFile: '',
      valueMessage: '',
      nameFile: [],
      attachFile: [],
      imageDialogOpen: false,
      actionButton: null,
      index: null,
      tagName: null,
      messagesId: null,
      emotion: null,
      typeSubmit: 'add',
      emotionOption: null,
    };
  }

  appendMessage = message => {
    const { messages } = this.state;
    const newMessages = messages.concat(message);

    this.setState({ messages: newMessages }, () => (this.refContent.current.scrollTop = this.refContent.current.scrollHeight));
  };

  componentDidMount() {
    this.props.socket.on('chat', dt => {
      const message = {
        content: dt.content,
        updateAt: new Date().toISOString(),
        time: new Date().toLocaleString(),
        user: { _id: dt.userId, name: dt.userName, avatar: dt.userAvatar },
        attachFile: dt.attachFile,
      };
      this.appendMessage(message);
    });
    this.getConversation();
    this.getMessages('scroll');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      setTimeout(() => {
        this.props.socket.on('chat', dt => {
          const message = {
            content: dt.content,
            updateAt: new Date().toISOString(),
            time: new Date().toLocaleString(),
            user: { _id: dt.userId, name: dt.userName, avatar: dt.userAvatar },
            attachFile: dt.attachFile,
          };
          this.appendMessage(message);
        });
        this.getConversation();
        this.getMessages('scroll');
      }, 500);
    }
  }

  getMessages = type => {
    fetchData(`${API_CONVERSATION}/message/${this.props.id}`).then(result => {
      if (type === 'scroll') {
        this.setState({ messages: result.data });
        try {
          this.refContent.current.scrollTop = this.refContent.current.scrollHeight;
        } catch (e) {}
      } else {
        this.setState({ messages: result.data });
      }
    });
  };

  getConversation = () => {
    const { profile, id } = this.props;
    fetchData(`${API_CONVERSATION}/${id}`).then(result => {
      const names = result.join.map(i => i.name);
      const join = result.join.map(i => i._id);
      if (result.type === 0) {
        const name = result.join.find(i => i._id !== profile._id);
        if (!name) {
          alert('Không thể tạo cuộc trò chuyện này');
          return;
        }
        result.name = name.name;
      }
      result.join = join;
      this.setState({ data: result, names });
    });
  };

  hideChatWindown = () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    this.setState({ hide: !this.state.hide });
  };

  changeInput = e => {
    if (e.target.value.slice(e.target.value.length - 1, e.target.value.length) === '@' && this.state.names.length >= 3) {
      this.setState({ tagName: e.currentTarget });
    }
    this.setState({ valueMessage: e.target.value });
  };

  async submitInput() {
    if (this.state.valueMessage !== '' && this.state.valueMessage !== ' ') {
      const { profile, id } = this.props;
      const { data } = this.state;

      if (!this.props.profile._id || this.state.data.join.length < 2) {
        alert('Có lỗi với cuộc trò chuyện, Bạn không thể trả lời bây giờ!');
        return;
      }
      const join = this.state.data.join.filter(i => i !== profile._id);
      this.props.socket.emit('conversation', {
        data: {
          id,
          content: this.state.valueMessage,
          userName: profile.name,
          userAvatar: profile.avatar,
          userId: profile._id,
          type: data.type,
          join,
          name: data.name,
          time: new Date().toLocaleString('vi'),
          attachFile: this.state.attachFile,
          emotion: null,
        },
        type: 'CHAT',
        Authorization: localStorage.getItem('token'),
      });
      this.getMessages('scroll');
      this.setState({ valueMessage: '', nameFile: [], attachFile: [] });
      const messAppend = { content: this.state.valueMessage, createdAt: new Date(), user: { _id: profile._id }, attachFile: this.state.attachFile };
      this.appendMessage(messAppend);
    }
  }
  async onsubmitInput(e) {
    if (e.keyCode === 13 && (this.state.attachFile.length > 0 || this.state.valueMessage !== '')) {
      if (this.state.typeSubmit === 'add') {
        const { profile, id } = this.props;
        const { data } = this.state;

        if (!this.props.profile._id || this.state.data.join.length < 2) {
          alert('Có lỗi với cuộc trò chuyện, Bạn không thể trả lời bây giờ!');
          return;
        }
        const join = this.state.data.join.filter(i => i !== profile._id);
        this.props.socket.emit('conversation', {
          data: {
            id,
            content: this.state.valueMessage,
            userName: profile.name,
            userAvatar: profile.avatar,
            userId: profile._id,
            type: data.type,
            join,
            name: data.name,
            time: new Date().toLocaleString('vi'),
            attachFile: this.state.attachFile,
            emotion: null,
          },
          type: 'CHAT',
          Authorization: localStorage.getItem('token'),
        });
        this.getMessages('scroll');
        this.setState({ valueMessage: '', nameFile: [], attachFile: [] });
        const messAppend = { content: this.state.valueMessage, createdAt: new Date(), user: { _id: profile._id }, attachFile: this.state.attachFile };
        this.appendMessage(messAppend);
      } else {
        fetch(`${API_UPDATE_MESSAGE}/${this.state.messagesId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emotion: this.state.emotion,
            content: this.state.valueMessage,
          }),
        }).then(response => {
          if (response.status === 200) {
            this.getMessages('notScroll');
            this.setState({ actionButton: null, typeSubmit: 'add', valueMessage: '' });
          }
        });
      }
    }
  }

  async handleSendEmotion(item) {
    fetch(`${API_UPDATE_EMOTION}/${this.state.messagesId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emotion: item,
        content: this.state.contentMessage,
      }),
    }).then(response => {
      if (response.status === 200) {
        this.getMessages('notScroll');
        this.setState({ emotionOption: null });
      }
    });
  }

  closeChatWindow = () => {
    this.props.closeChat(this.props.id);
  };

  removeItem = index => {
    let newList = this.state.nameFile;
    let newData = this.state.attachFile;
    newList.splice(index, 1);
    newData.splice(index, 1);
    this.setState({ nameFile: newList, attachFile: newData });
  };
  pasteHandler = async evt => {
    evt.stopPropagation();
    evt.preventDefault();
    if (evt.clipboardData.files.length !== 0) {
      // FileList object.
      var files = evt.clipboardData.files;
      if (files.length !== 1) {
        resetLog();
        appendLog('Dán 1 file vào đây!');
        return;
      }
      var file = files[0];
      if (file.size > 1073741824) {
        // setErrorImageMesssage('Dung lượng file không được quá 1GB');
        return;
      } else {
        let listAttch = this.state.nameFile;
        listAttch.push(file.name);
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(UPLOAD_IMG_SINGLE, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });
        const fileData = await res.json();
        let listUrl = this.state.attachFile;
        listUrl.push({ attachFile: fileData.url, name: file.name, size: file.size, type: file.type });
        this.setState({ nameFile: listAttch, attachFile: listUrl });
      }
    }
  };
  dropHandler = async evt => {
    evt.stopPropagation();
    evt.preventDefault();

    // FileList object.
    var files = evt.dataTransfer.files;
    if (files.length !== 1) {
      resetLog();
      appendLog('Kéo 1 file vào đây!');
      return;
    }
    var file = files[0];
    if (file.size > 1073741824) {
      // setErrorImageMesssage('Dung lượng file không được quá 1GB');
      return;
    } else {
      let listAttch = this.state.nameFile;
      listAttch.push(file.name);
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      const fileData = await res.json();
      let listUrl = this.state.attachFile;
      listUrl.push({ attachFile: fileData.url, name: file.name, size: file.size, type: file.type });
      this.setState({ nameFile: listAttch, attachFile: listUrl });
    }
  };

  handleUploadFile = async e => {
    const file = e.target.files[0];
    if (file.size > 1073741824) {
      return;
    } else {
      let listAttch = this.state.nameFile;
      listAttch.push(file.name);
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      const fileData = await res.json();
      let listUrl = this.state.attachFile;
      listUrl.push({ attachFile: fileData.url, name: file.name, size: file.size, type: file.type });
      this.setState({ nameFile: listAttch, attachFile: listUrl });
    }
  };

  sizeFormat(bytes, decimalPoint) {
    if (bytes == 0) return '0 Bytes';
    var k = 1000,
      dm = decimalPoint || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  renderIconFile(type) {
    let icon;
    // console.log(type.includes('pdf'));

    ['sheet', 'wordprocessingml', 'presentation', 'pdf', 'excel'].map((item, index) => {
      if (type.includes(item) === true) {
        switch (item) {
          case 'pdf':
            icon = <PictureAsPdf />;
            break;
          case 'sheet':
            icon = <img src={xlsx} width="55px" />;
            break;
          case 'excel':
            icon = <img src={xlsx} width="55px" />;
            break;
          case 'wordprocessingml':
            icon = <img src={docx} width="55px" />;
            break;
          case 'presentation':
            icon = <img src={ppt} width="55px" />;
            break;
          default:
            break;
        }
      }
    });
    return icon;
  }

  renderIconEmotion(emotion, type) {
    let icon;
    switch (emotion) {
      case 0:
        icon = (
          <Tooltip title="Yêu thích">
            <img src={love} className={type === 'picker' ? 'chat-emotion-picker-full' : 'chat-emotion'} />
          </Tooltip>
        );
        break;
      case 1:
        icon = (
          <Tooltip title="Haha">
            <img src={haha} className={type === 'picker' ? 'chat-emotion-picker-full' : 'chat-emotion'} />
          </Tooltip>
        );
        break;
      case 2:
        icon = (
          <Tooltip title="WoW">
            <img src={wow} className={type === 'picker' ? 'chat-emotion-picker-full' : 'chat-emotion-full'} />
          </Tooltip>
        );
        break;
      case 3:
        icon = (
          <Tooltip title="Buồn">
            <img src={sad} className={type === 'picker' ? 'chat-emotion-picker-full' : 'chat-emotion-full'} />
          </Tooltip>
        );
        break;
      case 4:
        icon = (
          <Tooltip title="Phẫn nộ">
            <img src={angry} className={type === 'picker' ? 'chat-emotion-picker-full' : 'chat-emotion-full'} />
          </Tooltip>
        );
        break;
      case 5:
        icon = (
          <Tooltip title="Thích">
            <img src={like} className={type === 'picker' ? 'chat-emotion-picker-full' : 'chat-emotion-full'} />
          </Tooltip>
        );
        break;
      default:
        break;
    }
    return icon;
  }

  onDeleteMessage() {
    // let newData = this.state.messages;
    // newData.splice(this.state.index, 1);
    // this.setState({ messages: newData, actionButton: null });

    fetch(`${API_REMOVE_MESSAGE}/${this.state.messagesId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(response => {
      if (response.status === 200) {
        this.getMessages();
        this.setState({ actionButton: null });
      }
    });
  }

  handleEditMessage() {
    this.setState({ valueMessage: this.state.contentMessage, actionButton: null, typeSubmit: 'edit' });
  }

  renderTagname(content, type) {
    if (content.includes('@')) {
      let data;
      let dataContent = _.cloneDeep(content);
      let r = Math.random();
      let newData = dataContent.trim();
      let arrayNames = [];

      this.state.names &&
        this.state.names.map(element => {
          arrayNames.push(`@${element}`);
        });

      arrayNames.forEach(item => {
        if (dataContent.includes(item)) {
          newData = newData.replaceAll(item, `${r}${item}${r}`);
        }
      });
      let data1 = newData.split(`${r}`);
      data = (
        <>
          {data1.map(item => {
            let check = false;
            arrayNames.map(i => {
              if (item === i) {
                check = true;
              }
            });

            if (check && item.includes('@')) {
              return (
                <span
                  style={
                    type === 'myMessage'
                      ? { color: '#03a9f4', backgroundColor: 'white', padding: 2 }
                      : { color: '#03a9f4', backgroundColor: 'white', padding: 2 }
                  }
                >{`${item}`}</span>
              );
            } else {
              return <span style={{ padding: 0 }}>{`${item}`}</span>;
            }
          })}
        </>
      );
      return data;
    } else {
      return content;
    }
  }

  render() {
    const { messages, data, hide, input, names } = this.state;
    const { profile } = this.props;
    return (
      <Grid item xs={12} style={{ height: '100vh' }}>
        <Grid
          container
          style={{
            backgroundColor: '#2196f3',
            padding: 10,
            color: 'white',
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            height: 55,
          }}
        >
          <Grid item xs={8}>
            <Tooltip placement="top" title={<Names names={names} />}>
              <Typography variant="h5" style={{ color: 'white' }}>
                {data.name}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={4} container style={{ justifyContent: 'flex-end' }}>
            <Tooltip placement="top" title="Gọi video">
              <Videocam style={{ fontSize: '2rem', fontWeight: 'bold', margin: 2, color: 'white' }} />
            </Tooltip>
            <Tooltip placement="top" title="Gọi thoại">
              <Phone style={{ fontSize: '2rem', fontWeight: 'bold', margin: 2, color: 'white' }} />
            </Tooltip>
            <Tooltip placement="top" title="Cài đặt">
              <Settings style={{ fontSize: '2rem', fontWeight: 'bold', margin: 2, color: 'white' }} />
            </Tooltip>
            <Tooltip placement="top" title="Đóng lại">
              <Close onClick={() => this.props.onClose()} style={{ fontSize: '2rem', fontWeight: 'bold', margin: 2 }} />
            </Tooltip>
          </Grid>
          <div
            ref={this.refContent}
            style={
              this.state.nameFile.length === 0
                ? { height: 'calc(100vh - 114px)', width: '100%', overflow: 'auto', marginTop: 10 }
                : { height: 'calc(100vh - 138px)', width: '100%', overflow: 'auto', marginTop: 10 }
            }
          >
            {messages.map(
              (it, index) =>
                profile._id === it.user._id ? (
                  <div className="my-messege">
                    <div className="more-option" style={{ justifyContent: 'center', flexDirection: 'column' }}>
                      <Tooltip title="Khác">
                        <MoreHoriz
                          onClick={e =>
                            this.setState({ actionButton: e.currentTarget, index: index, messagesId: it._id, contentMessage: it.content })
                          }
                          style={{ cursor: 'pointer', color: '#03a9f4', fontSize: 30 }}
                        />
                      </Tooltip>
                    </div>
                    <Tooltip title={new Date(it.createdAt).toLocaleString('vi')}>
                      <span>
                        <Grid>
                          <Grid item xs={12} style={{ fontSize: 18, padding: 3 }}>
                            {this.renderTagname(it.content, 'myMessage')}
                          </Grid>
                          <Grid item xs={12}>
                            {it.attachFile !== null &&
                              it.attachFile.map((item, index) => {
                                return (
                                  <>
                                    {item.type && item.type.includes('image') ? (
                                      <img
                                        src={item.attachFile}
                                        width="100px"
                                        style={{ margin: 2, cursor: 'pointer' }}
                                        onClick={() => this.setState({ imageDialogOpen: true, linkImg: item.attachFile, uploadFilename: item.name })}
                                      />
                                    ) : (
                                      <Grid container item xs={12} style={{ justifyContent: 'center' }}>
                                        <Grid item xs={'auto'} style={{ justifyContent: 'center' }}>
                                          {item.type && this.renderIconFile(item.type)}
                                        </Grid>
                                        <Grid item xs={'auto'} style={{ justifyContent: 'center' }}>
                                          <Typography style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }} noWrap>
                                            {item.name}
                                          </Typography>
                                          <Typography style={{ color: 'white', fontSize: 15 }} noWrap>
                                            {this.sizeFormat(item.size)}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={'auto'} style={{ justifyContent: 'center' }}>
                                          <Tooltip title="Tải xuống">
                                            <GetApp
                                              onClick={() => window.open(`${item.attachFile}`, '_parent')}
                                              style={{ color: 'white', marginTop: 5, cursor: 'pointer', fontSize: 25 }}
                                            />
                                          </Tooltip>
                                        </Grid>
                                      </Grid>
                                    )}
                                  </>
                                );
                              })}
                          </Grid>
                          {it.emotion &&
                            it.emotion.length !== 0 && (
                              <Grid item xs={12} style={{ textAlign: 'right' }}>
                                <div
                                  style={{
                                    boder: 'solid thin #03a9f4',
                                    backgroundColor: 'white',
                                    borderRadius: '10px',
                                    justifyContent: 'center',
                                    display: 'inline-block',
                                    width: 'auto',
                                    padding: '0px 2px',
                                  }}
                                >
                                  {_.uniq(it.emotion).map((item, index) => {
                                    return (
                                      <div
                                        style={{
                                          margin: '0px 2px',
                                          display: 'inline-block',
                                        }}
                                      >
                                        {this.renderIconEmotion(item.emotion)}
                                      </div>
                                    );
                                  })}
                                  <div
                                    style={{
                                      display: 'inline-block',
                                      color: '#03a9f4',
                                      margin: '0px 2px',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    {it.emotion.length}
                                  </div>
                                </div>
                              </Grid>
                            )}
                        </Grid>
                      </span>
                    </Tooltip>
                  </div>
                ) : (
                  <div className="friend-message">
                    <>
                      <Avatar style={{ width: 25, height: 25, marginRight: 3 }} src={it.user.avatar} />
                    </>

                    <Tooltip title={new Date(it.createdAt).toLocaleString('vi')}>
                      <span>
                        <Grid>
                          <Grid item xs={12}>
                            {this.renderTagname(it.content, 'friendMessage')}
                          </Grid>
                          <Grid item xs={12}>
                            {it.attachFile !== null &&
                              it.attachFile.map((item, index) => {
                                return (
                                  <>
                                    {item.type && item.type.includes('image') ? (
                                      <img
                                        src={item.attachFile}
                                        width="50px"
                                        style={{ margin: 2 }}
                                        onClick={() => this.setState({ imageDialogOpen: true, linkImg: item.attachFile, uploadFilename: item.name })}
                                      />
                                    ) : (
                                      <Grid container>
                                        <Grid item xs={'auto'} style={{ justifyContent: 'center' }}>
                                          {item.type && this.renderIconFile(item.type)}
                                        </Grid>
                                        <Grid item xs={'auto'} style={{ justifyContent: 'center' }}>
                                          <Typography style={{ color: '#03a9f4', fontWeight: 'bold', fontSize: 18 }} noWrap>
                                            {item.name}
                                          </Typography>
                                          <Typography style={{ color: '#03a9f4', fontSize: 15 }} noWrap>
                                            {this.sizeFormat(item.size)}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={'auto'} style={{ justifyContent: 'center' }}>
                                          <Tooltip title="Tải xuống">
                                            <GetApp
                                              onClick={() => window.open(`${item.attachFile}`, '_parent')}
                                              style={{ color: '#03a9f4', marginTop: 5, cursor: 'pointer', fontSize: 25 }}
                                            />
                                          </Tooltip>
                                        </Grid>
                                      </Grid>
                                    )}
                                  </>
                                );
                              })}
                          </Grid>
                          <Grid item xs={12}>
                            {it.emotion &&
                              it.emotion.length !== 0 && (
                                <Grid item xs={12} style={{ textAlign: 'right' }}>
                                  <div
                                    style={{
                                      boder: 'solid thin #03a9f4',
                                      backgroundColor: 'white',
                                      borderRadius: '10px',
                                      justifyContent: 'center',
                                      display: 'inline-block',
                                      width: 'auto',
                                      padding: '0px 2px',
                                    }}
                                  >
                                    {_.uniq(it.emotion).map((item, index) => {
                                      return (
                                        <div
                                          style={{
                                            margin: '0px 2px',
                                            display: 'inline-block',
                                          }}
                                        >
                                          {this.renderIconEmotion(item.emotion)}
                                        </div>
                                      );
                                    })}
                                    <div
                                      style={{
                                        display: 'inline-block',
                                        color: '#03a9f4',
                                        margin: '0px 2px',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      {it.emotion.length}
                                    </div>
                                  </div>
                                </Grid>
                              )}
                          </Grid>
                        </Grid>
                      </span>
                    </Tooltip>
                    <div className="more-option" style={{ justifyContent: 'center', flexDirection: 'column' }}>
                      <Tooltip title="Khác">
                        <MoreHoriz
                          onClick={e =>
                            this.setState({ actionButton: e.currentTarget, index: index, messagesId: it._id, contentMessage: it.content })
                          }
                          style={{ cursor: 'pointer', color: '#03a9f4' }}
                        />
                      </Tooltip>
                    </div>
                  </div>
                ),
            )}
          </div>
          <Grid xs={12} item>
            <Grid item xs={12} container>
              {this.state.nameFile.map((item, index) => {
                return (
                  <Grid item xs={3} container>
                    <Grid item xs={8}>
                      <Typography noWrap>{item}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Close style={{ color: 'black' }} onClick={() => this.removeItem(index)} />
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
            <TextField
              fullWidth
              size="medium"
              placeholder="Nhập tin nhắn..."
              inputProps={{
                style: {
                  height: 50,
                  lineHeight: 50,
                  fontSize: 20,
                },
              }}
              InputProps={{
                style: {
                  height: 50,
                },
                endAdornment: (
                  <Tooltip title="Gửi">
                    <Send style={{ cursor: 'pointer', color: '#03a9f4', fontSize: 25 }} onClick={() => this.submitInput()} />
                  </Tooltip>
                ),
                startAdornment: (
                  <>
                    <InputAdornment>
                      <label htmlFor="uploadImage" style={{ cursor: 'pointer' }} position="end">
                        <Tooltip title="Đính kèm">
                          <Image style={{ fontWeight: 'bold', color: '#03a8f4ad', fontSize: 25 }} />
                        </Tooltip>
                      </label>
                      <input id="uploadImage" onChange={this.handleUploadFile} type="file" accept="image/*" style={{ display: 'none' }} />
                    </InputAdornment>
                    <InputAdornment>
                      <label htmlFor="uploadFile" style={{ cursor: 'pointer' }} position="end">
                        <Tooltip title="Đính kèm tệp">
                          <AttachFile style={{ fontWeight: 'bold', color: '#03a8f4ad', fontSize: 25 }} />
                        </Tooltip>
                      </label>
                      <input id="uploadFile" onChange={this.handleUploadFile} type="file" style={{ display: 'none' }} />
                    </InputAdornment>
                  </>
                ),
              }}
              onKeyUp={event => this.onsubmitInput(event)}
              onPaste={e => this.pasteHandler(e)}
              onDrop={e => this.dropHandler(e)}
              value={this.state.valueMessage}
              onChange={this.changeInput}
              // onKeyUp={this.submitInput}
              onFocus={() => this.setState({ iconBlock: 0, messageBlock: 12, hiddenIconBlock: true })}
              onBlur={() => this.setState({ iconBlock: 3, messageBlock: 9, hiddenIconBlock: false })}
            />
          </Grid>
        </Grid>

        <Menu
          style={{ borderRadius: '30%' }}
          id="simple-menu"
          anchorEl={this.state.actionButton}
          keepMounted
          open={Boolean(this.state.actionButton)}
          anchorOrigin={{
            vertical: 'left',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'left',
            horizontal: 'center',
          }}
          onClose={() => this.setState({ actionButton: null })}
        >
          <Tooltip title="Thu hồi">
            <Delete onClick={() => this.onDeleteMessage()} style={{ cursor: 'pointer', color: 'red', fontSize: 25 }} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Edit onClick={() => this.handleEditMessage()} style={{ cursor: 'pointer', color: '#03a9f4', fontSize: 25 }} />
          </Tooltip>
          <Tooltip title="Cảm xúc">
            <InsertEmoticon
              onClick={e => this.setState({ emotionOption: e.currentTarget, actionButton: null })}
              style={{ cursor: 'pointer', color: '#03a9f4', fontSize: 25 }}
            />
          </Tooltip>
        </Menu>
        {/* tagName */}
        <Menu
          id="simple-menu"
          anchorEl={this.state.tagName}
          keepMounted
          open={Boolean(this.state.tagName)}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onClose={() => this.setState({ tagName: null })}
        >
          {names &&
            names.map((item, index) => {
              return (
                <MenuItem onClick={() => this.setState({ valueMessage: this.state.valueMessage + item, tagName: null, tagNamevalue: item })}>
                  {item}
                </MenuItem>
              );
            })}
        </Menu>
        {/* emotion */}
        <Menu
          id="simple-menu"
          anchorEl={this.state.emotionOption}
          keepMounted
          open={Boolean(this.state.emotionOption)}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          style={{ maxHeight: 300 }}
          onClose={() => this.setState({ emotionOption: null })}
          className="formatCss-full"
        >
          <Grid container>
            {[0, 1, 2, 3, 4, 5].map((item, index) => {
              return (
                <Grid onClick={() => this.handleSendEmotion(item)} item xs={2} style={{ padding: '0px 2px' }}>
                  {this.renderIconEmotion(item, 'picker')}
                </Grid>
              );
            })}
          </Grid>
        </Menu>
        <ImageDialog
          open={this.state.imageDialogOpen}
          onClose={() => this.setState({ imageDialogOpen: false })}
          linkImg={this.state.linkImg}
          nameImage={this.state.uploadFilename}
        />
      </Grid>
    );
  }
}

function Names({ names }) {
  return (
    <div>
      {names.map(i => (
        <p>{i}</p>
      ))}
    </div>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export const ImageDialog = props => {
  const { open, onClose, onDownload, nameImage, linkImg } = props;
  const [localState, setLocalState] = React.useState({
    sizeImg: 100,
  });

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        // TransitionComponent={Transition}
        fullWidth
        maxWidth="xl"
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          <Grid container>
            <Grid item xs={8}>
              <Typography noWrap variant="h6">
                {nameImage}
              </Typography>
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'right' }}>
              <IconButton onClick={() => setLocalState({ ...localState, sizeImg: localState.sizeImg + 5 })} color="primary">
                <Tooltip title="Phóng to">
                  <ZoomIn />
                </Tooltip>
              </IconButton>
              <IconButton onClick={() => setLocalState({ ...localState, sizeImg: localState.sizeImg - 5 })} color="primary">
                <Tooltip title="Thu nhỏ">
                  <ZoomOut />
                </Tooltip>
              </IconButton>
              <IconButton onClick={() => window.open(`${linkImg}`, '_parent')} color="primary">
                <Tooltip title="Tải xuống">
                  <GetApp />
                </Tooltip>
              </IconButton>
              <IconButton onClick={onClose} color="primary">
                <Tooltip title="Đóng">
                  <Close />
                </Tooltip>
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent style={{ height: 'calc(100vh - 100px)' }}>
          <DialogContentText style={{ width: `${localState.sizeImg}%` }} id="alert-dialog-slide-description">
            <img src={linkImg} />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

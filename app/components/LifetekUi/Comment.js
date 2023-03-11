/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  Fab as Fa,
  Avatar,
  Button,
  InputAdornment,
  IconButton,
  FormHelperText,
  Grid,
  Tooltip,
  Menu,
  Checkbox,
  MenuItem,
  Icon,
  //  Tooltip
} from '@material-ui/core';
import { TextField } from 'components/LifetekUi';
// import { ThumbUpAltRounded } from '@material-ui/icons';
// import { useHistory } from 'react-router-dom';
import { AttachFile, Image, Clear, GetApp, Visibility, Delete } from '@material-ui/icons';
import Axios from 'axios';
import { convertDateFb, convertDateFacebook, findChildren, serialize, fetchData } from '../../helper';
import { API_PROFILE, API_COMMENT, UPLOAD_IMG_SINGLE } from '../../config/urlConfig';
import { makeSelectNewComment } from '../../containers/Dashboard/selectors';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import avatarDefault from '../../images/default-avatar.png';

const Fab = props => <Fa {...props} />;
Fab.defaultProps = {
  size: 'small',
  color: 'primary',
  style: { margin: '5px', float: 'right' },
};

function Comments({ id, code, limit = 10, newComment, fix }) {
  const [input, setInput] = React.useState('');
  const [comments, setComments] = React.useState([]);
  const [skip, setSkip] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [profile, setProfile] = React.useState({});
  const [errorImageMesssage, setErrorImageMesssage] = React.useState();
  const [imageList, setImageList] = useState([]);
  const [fileName, setFileName] = useState('');
  useEffect(() => {
    getProfile();
  }, []);

  useEffect(
    () => {
      if (newComment && profile) {
        if (newComment.from !== profile._id) {
          const query = { limit: 10, skip: 0, code, id };
          const queryString = serialize(query);
          fetchData(`${API_COMMENT}?${queryString}`).then(data => {
            setCount(data.count);
            const newDt = [].concat(data.data.map(i => convertDateFacebook(i)));
            // console.log(44444, data);
            const newCm = findChildren(newDt);
            setComments(newCm);
          });
        } else {
          console.log('no need to refresh');
        }
      }
    },
    [newComment],
  );

  const clearItem = () => {
    setInput('');
    setImageList([]);
  };
  // useEffect(() => {
  //   console.log("sssss")
  // }, [])
  function reply(id) {
    const newComment = comments.map(i => (i._id === id ? { ...i, reply: true } : { ...i, reply: false }));
    // console.log(id, newComment);
    setComments(newComment);
  }

  function addComment() {
    if (!input && imageList.length === 0) return;

    fetchData(`${API_COMMENT}`, 'POST', { id, content: input, code, image: imageList }).then(result => {
      setComments([
        { content: result.content, user: profile, _id: result._id, time: convertDateFb(result.createdAt), image: result.image },
        ...comments,
      ]);
      clearItem();
    });
  }

  function changeInput(e) {
    setInput(e.target.value);
  }
  function deleteComment(status, itemId) {
    if (status === 1) {
      setComments(comments.filter(x => x._id !== itemId));
    } else {
      alert('Bạn không có quyền xóa');
    }
  }
  useEffect(
    () => {
      if (!id) return;
      const query = { limit, skip, code, id };
      const queryString = serialize(query);
      fetchData(`${API_COMMENT}?${queryString}`).then(data => {
        setCount(data.count);
        const newDt = comments.concat(data.data.map(i => convertDateFacebook(i)));
        const newCm = findChildren(newDt);
        setComments(newCm);
      });
    },
    [id, skip],
  );

  function getProfile() {
    try {
      fetchData(API_PROFILE).then(data => {
        if (!data) {
          errorToken();
          return;
        }
        setProfile(data);
      });
    } catch (error) {
      errorToken();
    }
  }

  function errorToken() {
    // eslint-disable-next-line no-alert
    alert('Sai token');
    localStorage.clear();
    window.location.href = '/';
  }

  function handleSkipComent() {
    setSkip(skip + (parseInt(limit, 10) || 10));
  }

  const handleUploadFile = async e => {
    setErrorImageMesssage(null);
    const file = e.target.files[0];
    if (file.size > 1073741824) {
      setErrorImageMesssage('Dung lượng file không được quá 1GB');
      return;
    }
    const newImageList = [...imageList, { file: 'Đang tải lên...', fileName: file.name }];
    setImageList(newImageList);
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
    // console.log('newImageList', newImageList);
    // setFileName(file.name);
    setImageList(
      newImageList.map(item => {
        if (item.fileName === file.name) {
          item.file = fileData.url;
        }
        return item;
      }),
    );
  };

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
  return (
    <>
      <div
        className="dialog-ct"
        style={
          fix
            ? { height: '31vh', overflow: 'auto', marginBottom: '1rem' }
            : code === 'DaskBoard'
              ? {
                  height: '54vh',
                  overflow: 'auto',
                  marginBottom: '1rem',
                }
              : {
                  height: '31vh',
                  overflow: 'auto',
                  marginBottom: '1rem',
                }
        }
      >
        {/* {console.log(comments)} */}
        {comments.map(i => (
          <Comment
            addComment={addComment}
            profile={profile}
            reply={reply}
            item={i}
            idComment={i._id}
            id={id}
            code={code}
            limit={limit}
            deleteComment={deleteComment}
          />
        ))}
        {count > skip + limit ? (
          <p style={{ color: '#1127b8', cursor: 'pointer' }} onClick={handleSkipComent}>
            Xem thêm bình luận
          </p>
        ) : null}

        {imageList && (
          <Grid container spacing={8}>
            {imageList.map((img, index) => (
              <Grid item xs={2}>
                {img.file === 'Đang tải lên...' ? <span>{img.file}</span> : <a href={img.file}>{img.fileName}</a>}
                <span onClick={() => setImageList(imageList.filter((e, i) => i !== index))}>
                  <Clear />
                </span>
              </Grid>
            ))}
          </Grid>
        )}

        {errorImageMesssage && (
          <FormHelperText id="component-error-text1" style={{ color: 'red', display: 'inline' }}>
            {errorImageMesssage}
          </FormHelperText>
        )}
      </div>
      {profile._id && (
        <div
          className="reply-commnent"
          style={
            fix
              ? {
                  cursor: 'pointer',
                  width: '43vw',
                  marginLeft: '1.5rem',
                }
              : code === 'DaskBoard'
                ? {
                    cursor: 'pointer',
                    width: '27vw',
                  }
                : {
                    cursor: 'pointer',
                  }
          }
        >
          <Avatar
            style={{ width: 30, height: 30 }}
            alt={profile.name}
            src={profile && profile.avatar ? `${profile.avatar}?allowDefault=true` : avatarDefault}
          />
          <TextField
            multiline
            style={{ marginLeft: 10 }}
            fullWidth
            value={input}
            onChange={changeInput}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (e.ctrlKey) {
                  setInput(`${e.target.value} \n`);
                } else {
                  addComment();
                }
              }
            }}
            InputProps={{
              endAdornment: (
                <>
                  <InputAdornment>
                    <IconButton onClick={clearItem}>
                      <Clear color="primary" />
                    </IconButton>
                  </InputAdornment>
                  {/* 
                  <InputAdornment>
                    <label htmlFor="uploadImage" style={{ cursor: 'pointer', marginRight: 10 }} position="end">
                      <Image color="primary" />
                    </label>
                    <input id="uploadImage" type="file" accept="image/*" onChange={handleUploadFile} style={{ display: 'none' }} />
                  </InputAdornment> */}

                  <InputAdornment>
                    <label htmlFor="uploadImage" style={{ cursor: 'pointer', marginRight: 10 }} position="end">
                      <AttachFile color="primary" />
                    </label>
                    <input id="uploadImage" type="file" onChange={handleUploadFile} style={{ display: 'none' }} />
                  </InputAdornment>

                  <InputAdornment onClick={addComment}>
                    <span style={{ color: '#2196F3', fontWeight: 'bold' }}>GỬI </span>
                  </InputAdornment>
                </>
              ),
            }}
          />
        </div>
      )}
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  newComment: makeSelectNewComment(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(Comments);

function Comment({ item, reply, profile, code, idComment, id, limit, deleteComment }) {
  // console.log('item', profile);
  const [isInit, setInit] = useState(true);
  const [childComments, setChildComments] = useState([]);
  const [skip, setSkip] = useState(0);
  const [imageShow, setImageShow] = useState(null);
  const [localMessages, setLocalMessages] = useState({});
  const [likeButton, setLikeButton] = useState(false);
  // const [load, setLoad] = useState(false)
  function postComment(value) {
    if (!value) return;
    sendComment({ content: value, parentId: item._id, replyUser: item.user._id });
  }
  function sendComment(data) {
    try {
      data.id = id;
      data.code = code;
      fetchData(`${API_COMMENT}`, 'POST', data).then(result => {
        const it = [
          {
            ...result,
            user: { name: profile.name, avatar: profile.avatar ? `${profile.avatar}?allowDefault` : avatarDefault, _id: profile._id },
            time: convertDateFb(result.createdAt),
          },
        ];
        const newChildComments = childComments.concat(it);
        // console.log(newChildComments, newChildComments);
        setChildComments(newChildComments);
      });
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }

  function likeComment(_id) {
    fetchData(`${API_COMMENT}/like/${_id}`, 'POST');
  }

  useEffect(
    () => {
      if (item && item.likeds && item.likeds.includes(profile._id)) {
        setLikeButton(true);
      }
    },
    [profile, item],
  );
  function fetchComments() {
    const query = { limit, skip, code, id, parentId: item._id };
    const queryString = serialize(query);
    // console.log(7777, queryString);
    fetchData(`${API_COMMENT}?${queryString}`).then(data => {
      // console.log('data', data);
      setSkip(skip + limit);
      const newChildComments = [...data.data.reverse().map(i => convertDateFacebook(i)), ...childComments];
      setChildComments(newChildComments);
    });
  }
  const deleteComments = itemId => {
    fetchData(`${API_COMMENT}/${itemId}`, 'DELETE').then(res => {
      deleteComment(res.status, itemId);
      // setLoad(!load);
    });
  };

  function formatImage(item) {
    const format = ['PNG', 'JPG', 'JPEG'];
    const location = parseInt(item.lastIndexOf('.'));
    for (let i = 0; i < format.length; i++) {
      if (item.slice(location + 1).toUpperCase() === format[i]) {
        return true;
      }
    }
    return false;
  }

  return (
    <div style={{ borderRadius: '10px', marginTop: '15px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Grid container spacing={3}>
          <Grid item xs>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Avatar
                  style={{ width: 32, height: 32, marginRight: 5 }}
                  src={item.user && item.user.avatar ? `${item.user.avatar}?allowDefault=true` : avatarDefault}
                />
                <p>
                  <span style={{ fontWeight: 'bold', marginRight: 5 }}>{item.user ? item.user.name : 'Admin'}</span>
                  <br />
                  {item.content}
                  {item.image &&
                    item.image.length > 0 && (
                      <Grid container spacing={8}>
                        {item.image.map((image, idx) => (
                          <Grid container>
                            <Grid item xs>
                              <div style={{ width: '100%', textAlign: 'left' }}>
                                {formatImage(image.fileName) ? (
                                  <img
                                    title={image.file === imageShow ? '' : 'Phóng to'}
                                    onClick={() => {
                                      setImageShow(image.file);
                                    }}
                                    src={image.file}
                                    alt=""
                                    style={
                                      image.file === imageShow
                                        ? { display: imageShow ? 'block' : 'none', width: '100vh', height: 'auto' }
                                        : { height: 120, objectFit: 'contain', cursor: 'pointer' }
                                    }
                                  />
                                ) : null}
                                <p>
                                  <span style={{ color: 'blue' }}>{image.fileName}</span>
                                </p>
                              </div>
                            </Grid>
                          </Grid>
                        ))}
                        <br />
                      </Grid>
                    )}
                </p>
              </Grid>
              <Grid item xs>
                {item.image &&
                  item.image.length > 0 && (
                    <Grid container spacing={8}>
                      {item.image.map((image, idx) => (
                        <Grid container>
                          <Grid item xs={2}>
                            <div style={{ display: 'flex', alignItem: 'center', justifyContent: 'flex-end', marginRight: '-485%', float: 'right' }}>
                              {/* <div style={{ textAlign: 'right' }}> */}
                              <Fab color="primary" size="small">
                                <a href={image.file} download={image.fileName}>
                                  <Tooltip title="Tải xuống" onClick={() => {}}>
                                    {/* <button onClick={() => {}} type="button" style={{ cursor: 'pointer',  marginRight: 6, color: 'white' }}> */}
                                    <GetApp style={{ color: 'white' }} />
                                    {/* </button> */}
                                  </Tooltip>
                                </a>
                              </Fab>
                              {/* <button onClick={() => {}} type="button" style={{ cursor: 'pointer', marginRight: 6 }}>
                        <Visibility style={{ width: 32, height: 32, marginRight: 5 }}/></button> */}
                            </div>
                          </Grid>
                        </Grid>
                      ))}
                      <br />
                    </Grid>
                  )}
              </Grid>
              <Grid>
                <Fab onClick={() => deleteComments(item._id)} size="small" color="secondary" style={{ marginLeft: 5 }}>
                  <Tooltip title="Xóa bình luận">
                    <Delete />
                  </Tooltip>
                </Fab>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* <Tooltip title="Nguyexn Văn Khuong">
          <span style={{ width: 20, height: 20, borderRadius: 999, margin: '5px 0px 0px 5px' }}>
            <ThumbUpAltRounded style={{ fontSize: '1rem', color: '#385898', cursor: 'pointer' }} />
          </span>
        </Tooltip> */}
      </div>
      <div style={{ marginLeft: 20 }}>
        <div>
          <button
            onClick={() => {
              likeComment(idComment);
              setLikeButton(!likeButton);
            }}
            style={
              likeButton === false
                ? { marginRight: 6, cursor: 'pointer', color: 'black' }
                : { marginRight: 6, cursor: 'pointer', color: 'rgb(3, 169, 244)', fontWeight: 'bold' }
            }
          >
            Thích
          </button>
          <button onClick={() => reply(item._id)} type="button" style={{ cursor: 'pointer', color: '#385898', marginRight: 6 }}>
            Trả lời
          </button>
          <span>{item.time}</span>
        </div>
      </div>
      {isInit && item.totalReply ? (
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setInit(false);
            fetchComments();
          }}
        >
          xem {item.totalReply} câu trả lời...
        </span>
      ) : null}
      {childComments && childComments.length
        ? childComments.map(i => {
            if (item._id === i.parentId) {
              return (
                // console.log(i);
                <div style={{ borderRadius: '10px', margin: '15px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginLeft: 20 }}>
                    <Avatar style={{ width: 22, height: 22, marginRight: 5 }} src={i.user && i.user.avatar ? i.user.avatar : avatarDefault} />
                    {/* `${i.user.avatar}?allowDefault=true`  */}
                    <p>
                      <span style={{ cursor: 'pointer', fontWeight: 'bold', marginRight: 5 }}>{i.user ? i.user.name : 'Admin'}</span>
                      {i.content}
                    </p>
                    {/* <Tooltip title="Nguyexn Văn Khuong">
                      <span style={{ width: 20, height: 20, borderRadius: 999, margin: '5px 0px 0px 5px' }}>
                        <ThumbUpAltRounded style={{ fontSize: '1rem', color: '#385898', cursor: 'pointer' }} />
                      </span>
                    </Tooltip> */}
                  </div>
                  <div style={{ marginLeft: 30 }}>
                    <div>
                      <span
                        id={i._id}
                        style={{
                          marginRight: 6,
                          cursor: 'pointer',
                          color: i.likeds.includes(profile._id) ? 'rgb(3, 169, 244)' : 'black',
                          fontWeight: i.likeds.includes(profile._id) ? 'bold' : '400',
                        }}
                        onClick={() => {
                          const likeChild = document.getElementById(i._id);
                          if (likeChild.style.color === 'rgb(3, 169, 244)') {
                            likeChild.style.color = 'black';
                            likeChild.style.fontWeight = '400';
                          } else {
                            likeChild.style.color = 'rgb(3, 169, 244)';
                            likeChild.style.fontWeight = 'bold';
                          }
                          likeComment(i._id);
                        }}
                      >
                        Thích
                      </span>
                      <button
                        onClick={() => reply(item._id)}
                        type="button"
                        style={{
                          cursor: 'pointer',
                          color: '#385898',
                          marginRight: 6,
                        }}
                      >
                        Trả lời
                      </button>
                      <span>{i.time}</span>
                    </div>
                  </div>
                </div>
              );
            } else return null;
          })
        : null}
      {!isInit && item.totalReply > skip ? (
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setSkip(skip + limit);
            fetchComments();
          }}
        >
          xem thêm trả lời
        </span>
      ) : null}
      {item.reply ? <InputComment sendComment={postComment} avatar={profile.avatar ? `${profile.avatar}` : avatarDefault} /> : null}
    </div>
  );
}

function InputComment(props) {
  const [value, setValue] = React.useState('');
  // console.log(props, 'props');
  // console.log(props.avatar, 'props.avatar');
  function changeValue(e) {
    setValue(e.target.value);
  }
  function sendCm() {
    props.sendComment(value);
    setValue('');
  }
  return (
    <div className="input-container">
      {/* <Avatar style={{ width: 26, height: 26 }} src={props.avatar ? `${props.avatar}?allowDefault=true` : avatarDefault} /> */}
      <Avatar style={{ width: 26, height: 26 }} src={props.avatar ? props.avatar : avatarDefault} />
      <div className="commnent-input-container">
        <input
          multiline
          value={value}
          onChange={changeValue}
          className="input-comment"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (e.ctrlKey) {
                setValue(`${e.target.value}\n`);
              } else {
                sendCm();
              }
            }
          }}
        />

        <Button onClick={sendCm} color="primary">
          Gửi
        </Button>
      </div>
    </div>
  );
}

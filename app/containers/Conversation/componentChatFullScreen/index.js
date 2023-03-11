import React, { memo, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import { Avatar, Grid, IconButton, TextField, Tooltip } from '@material-ui/core';
import { Close, FiberManualRecord, GroupAddOutlined, Search } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { API_CONVERSATION, API_USERS } from '../../../config/urlConfig';
import { fetchData } from '../../../helper';
import reducer from '../reducer';
import saga from '../saga';
import ChatWindow from '../ChatWindow';
import { mergeData, getConversation, createConversation } from '../actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectConversation from '../selectors';
import makeSelectDashboardPage, { makeSelectProfile } from '../../Dashboard/selectors';
import ChatWindowFullScreen from './chatWindow';
import { Dialog as DialogUI, AsyncAutocomplete, TextField as TextFieldUI } from 'components/LifetekUi';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function searchEmployee(items, id, search, number = 10) {
  const newItem = items.filter(
    item =>
      item._id !== id &&
      Object.keys(item).some(
        key =>
          item[key]
            ? item[key]
                .toString()
                .toLowerCase()
                .indexOf(search.toLowerCase()) !== -1
            : false,
      ),
  );
  if (newItem.length > number) newItem.length = number;
  return newItem;
}
function FullScreenChat(props) {
  const {
    open,
    onClose,
    conversationGroup,
    profileId,
    search,
    employees,
    conversation,
    createConversation,
    profile,
    socket,
    getConversation,
    searchUser,
  } = props;
  const [localState, setLocalState] = useState({
    id: null,
    name: null,
    open: false,
    join: [],
  });

  useEffect(
    () => {
      console.log('mimimi');
    },
    [localState.id],
  );

  const makeConversation = item => {
    const conversations = conversation.conversations;
    const check = conversations.find(i => i.friendId === item._id);
    if (check) return;
    fetch(API_CONVERSATION, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ join: [item._id, profile._id], type: 0, name: item.name, friendId: item._id }),
    })
      .then(response => response.json())
      .then(data => {
        setLocalState({ ...localState, id: data.data._id });
        fetch(`${API_CONVERSATION}/${data.data._id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-type': 'application/json',
          },
        });
      });
  };

  const makeGroupConversation = item => {
    fetch(`${API_CONVERSATION}/${item._id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setLocalState({ ...localState, id: item._id });
        fetch(`${API_CONVERSATION}/message/${item._id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-type': 'application/json',
          },
        });
      });
  };

  function createConversationGroup() {
    const { join, name } = localState;
    const newJoin = join.map(i => i._id);
    const check = newJoin.includes(profileId);
    if (!check) newJoin.push(profileId);
    const data = { join: newJoin, name, type: 1 };
    fetch(API_CONVERSATION, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(dat => {
        setLocalState({ ...localState, id: dat.data._id });
        fetch(`${API_CONVERSATION}/${dat.data._id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-type': 'application/json',
          },
        }).then(response => {
          setLocalState({ ...localState, open: false });
          getConversation();
        });
      });
  }

  return (
    <div>
      <DialogUI
        onSave={() => createConversationGroup()}
        maxWidth="sm"
        onClose={() => setLocalState({ ...localState, open: false })}
        open={localState.open}
      >
        <TextFieldUI
          error={!localState.name}
          value={localState.name}
          onChange={e => setLocalState({ ...localState, name: e.target.value })}
          label="Tên nhóm"
        />
        <AsyncAutocomplete onChange={value => setLocalState({ ...localState, join: value })} isMulti value={localState.join} url={API_USERS} />
        <TextFieldUI multiline rows="4" label="Mô tả" />
      </DialogUI>
      <Dialog fullScreen open={open} onClose={() => onClose()} TransitionComponent={Transition}>
        <Grid container>
          <Grid item xs={2} style={{ height: '100vh' }}>
            <Grid item xs={12} style={{ borderRight: 'solid 1px #ababab8e', height: 'calc(100vh - 60px)', backgroundColor: '#03a8f41c', overflow: 'auto' }}>
              <Grid
                item
                xs={12}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: '#2196f3',
                  padding: 10,
                  color: 'white',
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                }}
              >
                <Typography variant="h5" style={{ color: 'white' }}>
                  Nhóm
                </Typography>
                <Tooltip title="Tạo nhóm">
                  <GroupAddOutlined onClick={() => setLocalState({ ...localState, open: true })} style={{ cursor: 'pointer', fontSize: 30 }} />
                </Tooltip>
              </Grid>
              <Grid item xs={12}>
                <List>
                  {searchEmployee(conversationGroup, profileId, search, 5).map((item, index) => (
                    <ListItem button onClick={() => makeGroupConversation(item)}>
                      <Typography style={{ fontSize: 20 }}>{item.name}</Typography>
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid
                item
                xs={12}
                style={{
                  backgroundColor: '#2196f3',
                  padding: 10,
                  color: 'white',
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                }}
              >
                <Typography variant="h5" style={{ color: 'white' }}>
                  Theo dõi
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <List>
                  {searchEmployee(employees, profileId, search)
                    .sort((a, b) => {
                      if (a.online && !b.online) return -1;
                      if (!a.online && b.online) return 1;
                      return 0;
                    })
                    .map(item => (
                      <ListItem button onClick={() => makeConversation(item)}>
                        <Grid xs={12} item container>
                          <Grid item xs={2} container style={{ alignItems: 'center' }}>
                            <Link to={`/userprofile/${item.username}`}>
                              <Avatar style={{ width: 30, height: 30 }} src={item.avatar} />
                            </Link>
                          </Grid>
                          <Grid item xs={9}>
                            <Typography noWrap style={{ fontSize: 20 }}>
                              {item.name}
                            </Typography>
                          </Grid>
                          <Grid item xs={1} style={{ textAlign: 'right' }}>
                            {item.online ? <FiberManualRecord style={{ color: 'green' }} /> : null}
                          </Grid>
                        </Grid>
                      </ListItem>
                    ))}
                </List>
              </Grid>
            </Grid>
            <Grid item={12}>
              <TextField
                placeholder="Tìm kiếm"
                variant="outlined"
                fullWidth
                onChange={e => searchUser(e)}
                InputProps={{
                  startAdornment: <Search style={{ cursor: 'pointer', color: '#03a9f4', fontSize: 25 }} />,
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={10} style={{ height: '100vh', backgroundColor: '#03a8f41c' }}>
            <Grid item xs={12} style={localState.id ? {} : { textAlign: 'right' }}>
              {localState.id ? (
                <ChatWindowFullScreen
                  id={localState.id}
                  employees={conversation.employees}
                  profile={profile}
                  socket={socket}
                  onClose={() => onClose()}
                />
              ) : (
                <IconButton onClick={() => onClose()}>
                  <Close />
                </IconButton>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
}
FullScreenChat.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  conversation: makeSelectConversation(),
  profile: makeSelectProfile(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getConversation: () => dispatch(getConversation()),
    createConversation: data => dispatch(createConversation(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'conversation', reducer });
const withSaga = injectSaga({ key: 'conversation', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(FullScreenChat);

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Input, InputAdornment, Avatar, Tooltip } from '@material-ui/core';
import { Search, GroupAddOutlined, Close, Fullscreen } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { Dialog, AsyncAutocomplete, TextField } from 'components/LifetekUi';
import makeSelectConversation from './selectors';
import makeSelectDashboardPage, { makeSelectProfile } from '../Dashboard/selectors';
import reducer from './reducer';
import saga from './saga';
import ChatWindow from './ChatWindow';
import { mergeData, getConversation, createConversation } from './actions';
import { API_CONVERSATION, API_USERS, API_CONVERSATION_MESSAGE_UNREADCONVERSASION } from '../../config/urlConfig';
import FullScreenChat from './componentChatFullScreen/index';

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

class Conversation extends React.Component {
  state = { open: false, name: '', join: [], zoomInMessage: false, countAll: [], dataCheck: [], currItem: null };

  componentDidMount() {
    this.props.getConversation();
    this.props.socket.on('docUpdated', msg => {
      this.props.getSocket(this.props.profile, msg, this.state.currItem)
      const { moduleCode, data } = msg;
      if (moduleCode === 'Employee' && data._id !== this.props.profile._id) {
        const newList = (this.props.conversation.employees || []).map(emp => ({
          ...emp,
          online: this.props.dashboardPage.docUpdated.data._id === emp._id ? this.props.dashboardPage.docUpdated.data.online : emp.online,
        }));
        this.props.mergeData({
          employees: newList.sort((a, b) => {
            if (a.online && !b.online) return -1;
            if (!a.online && b.online) return 1;
            return 0;
          }),
        });
      }
    });
    fetch(`${API_CONVERSATION_MESSAGE_UNREADCONVERSASION}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        // console.log('data', data);
        this.setState({ ...this.state, countAll: data.data });
      });

    fetch(`${API_CONVERSATION}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        // console.log('data', data);
        this.setState({ ...this.state, dataCheck: data.data });
      });
    // this.props.socket.OnMessage = (event) =>{
    //   console.log(event, message)
    //   this.props.getSocket(event)
    // }
    // this.props.socket.on('room', data =>{
    //   console.log(data, 'hhhhhhhhhhhhh')
    // });
  }

  // componentDidMount() {
  //   // const token = localStorage.getItem('token');
  //   fetch(`${API_CONVERSATION_MESSAGE_UNREADCONVERSASION}`, {
  //     method: 'GET',
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       // console.log('data', data);
  //       this.setState({...this.state, countAll: data.data });
  //     });
  // }

  componentWillUnmount() {
    this.props.socket.off('chat');
  }

  closeChat = id => {
    const conversations = this.props.conversation.conversations.filter(i => i._id !== id);

    this.props.mergeData({ conversations });
  };

  makeConversation = item => {
    console.log(item, 'itemitem')
    const conversations = this.props.conversation.conversations;
    const check = conversations.find(i => i.friendId === item._id);
    if (check) return;
    this.props.createConversation({ join: [item._id, this.props.profile._id], type: 0, name: item.name, friendId: item._id });
    // console.log('000', item._id, this.props.profile._id);
    // console.log(this.state.dataCheck.filter(i => i.type === 0).filter(j => j.join[0] === item._id)[0]._id);
    const newCountAll = [...this.state.countAll].filter(
      i => i._id !== this.state.dataCheck.filter(i => i.type === 0).filter(j => j.join[0] === item._id)[0]._id,
    );
    this.setState({ ...this.state, countAll: newCountAll, currItem: item });
    this.props.handleChechCount(
      [...this.state.countAll].filter(i => i._id === this.state.dataCheck.filter(i => i.type === 0).filter(j => j.join[0] === item._id)[0]._id)
        ? [...this.state.countAll].filter(i => i._id === this.state.dataCheck.filter(i => i.type === 0).filter(j => j.join[0] === item._id)[0]._id)
            .count
        : 0,
    );
  };

  createConversationGroup = () => {
    const { join, name } = this.state;
    const newJoin = join.map(i => i._id);
    const check = newJoin.includes(this.props.profile._id);
    if (!check) newJoin.push(this.props.profile._id);
    const data = { join: newJoin, name, type: 1 };

    // this.props.createConversation(data);
    fetch(API_CONVERSATION, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(res => {
      this.props.getConversation();
      this.setState({ open: false });
    });
  };

  makeGroupConversation = item => {
    const conversations = [...this.props.conversation.conversations];
    const check = conversations.find(i => i._id === item._id);

    if (check) return;
    conversations.push(item);
    this.props.mergeData({ conversations });
    const newCountAll = [...this.state.countAll].filter(i => i._id !== item._id);
    this.setState({ ...this.state, countAll: newCountAll });
    this.props.handleChechCount(
      [...this.state.countAll].filter(i => i._id === item._id)[0] ? [...this.state.countAll].filter(i => i._id === item._id)[0].count : 0,
    );
  };

  closeDialog = () => {
    this.setState({ open: false });
  };

  openDialog = () => {
    this.setState({ open: true, name: '', join: [] });
  };

  render() {
    const { profile, conversation, display } = this.props;
    // console.log('111', this.props);
    const { employees, conversations, search, conversationGroup } = conversation;
    const { open, name, join } = this.state;
    // console.log(this.state.countAll);
    // console.log(this.state.dataCheck.filter(i => i.type === 0).filter(j => this.state.countAll.map(k => k._id).includes(j._id)));
    return (
      <React.Fragment>
        <Dialog onSave={this.createConversationGroup} maxWidth="sm" onClose={this.closeDialog} open={open}>
          <TextField error={!name} value={name} onChange={e => this.setState({ name: e.target.value })} label="Tên nhóm" />
          <AsyncAutocomplete onChange={value => this.setState({ join: value })} isMulti value={join} url={API_USERS} />
          <TextField multiline rows="4" label="Mô tả" />
        </Dialog>
        <FullScreenChat
          open={this.state.zoomInMessage}
          onClose={() => this.setState({ zoomInMessage: false })}
          conversationGroup={conversationGroup}
          getConversation={() => this.props.getConversation()}
          profileId={profile._id}
          search={search}
          employees={employees}
          socket={this.props.socket}
          searchUser={e => this.props.mergeData({ search: e.target.value })}
        />
        <div className={display ? 'list-chat' : 'list-chat-close'}>
          <button
            type="button"
            className="list-chat-header"
            // style={{ cursor: 'pointer' }}
          >
            <Tooltip title="Toàn màn hình">
              <Fullscreen style={{ cursor: 'pointer' }} onClick={() => this.setState({ zoomInMessage: true })} />
            </Tooltip>
            <Tooltip title="Đóng">
              <Close style={{ cursor: 'pointer' }} onClick={this.props.setDisplay} />
            </Tooltip>
          </button>
          <div className={display ? 'main-chat' : 'main-chat-close'}>
            <div className="main-chat-content">
              <div className="main-chat-group">
                <div className="main-chat-group-header">
                  <span>NHÓM</span>
                  <GroupAddOutlined onClick={this.openDialog} style={{ cursor: 'pointer' }} />
                </div>

                {searchEmployee(conversationGroup, profile._id, search, 5).map(i => (
                  <div onClick={() => this.makeGroupConversation(i)} className="main-chat-item">
                    <span>{i.name}</span>
                    {/* <span className="sp-group-chat">20</span> */}
                    {this.state.countAll && this.state.countAll.map(i => i._id).indexOf(i._id) >= 0 ? (
                      <span className="sp-group-chat">{this.state.countAll[this.state.countAll.map(i => i._id).indexOf(i._id)].count}</span>
                    ) : null}
                  </div>
                ))}
                {/* {console.log('111', searchEmployee(conversationGroup, profile._id, search, 5).map(i => i._id))} */}
              </div>
              <div className="main-chat-group">
                <div className="main-chat-group-header">
                  <span>THEO DÕI</span>
                </div>
                {/* {console.log(
                  '222',
                  searchEmployee(employees, profile._id, search)
                    .sort((a, b) => {
                      if (a.online && !b.online) return -1;
                      if (!a.online && b.online) return 1;
                      return 0;
                    })
                    .map(i => i._id),
                )} */}
                {searchEmployee(employees, profile._id, search)
                  .sort((a, b) => {
                    if (a.online && !b.online) return -1;
                    if (!a.online && b.online) return 1;
                    return 0;
                  })
                  .map(item => (
                    <div className="main-chat-item">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to={`/userprofile/${item.username}`}>
                          <Avatar style={{ width: 30, height: 30 }} src={item.avatar} />
                          {/* <span className="sp-user-chat">10</span> */}
                          {/* {console.log(this.state.dataCheck.filter(i => i.type === 0).filter(j => j.join[0] === item._id)[0])} */}
                          {/* {this.state.dataCheck.filter(i => i.type === 0).filter(j => j.join[0] === item._id)[0] &&
                          this.state.countAll
                            .map(k => k._id)
                            .includes(this.state.dataCheck.filter(i => i.type === 0).filter(j => j.join[0] === item._id)[0]._id)
                            ? console.log(
                                this.state.countAll[
                                  this.state.countAll
                                    .map(k => k._id)
                                    .indexOf(this.state.dataCheck.filter(i => i.type === 0).filter(j => j.join[0] === item._id)[0]._id)
                                ],
                              )
                            : console.log('không có gì')} */}
                          {this.state.dataCheck.filter(i => i.type === 0).filter(j => j.join[0] === item._id)[0] &&
                          this.state.countAll
                            .map(k => k._id)
                            .includes(this.state.dataCheck.filter(i => i.type === 0).filter(j => j.join[0] === item._id)[0]._id) ? (
                            <span className="sp-user-chat">
                              {
                                this.state.countAll[
                                  this.state.countAll
                                    .map(k => k._id)
                                    .indexOf(this.state.dataCheck.filter(i => i.type === 0).filter(j => j.join[0] === item._id)[0]._id)
                                ].count
                              }
                            </span>
                          ) : null}
                          {/* <Avatar>
                            <ManIcon />
                          </Avatar> */}
                        </Link>
                        <span onClick={() => this.makeConversation(item)} style={{ marginLeft: 5 }}>
                          {item.name}
                        </span>
                      </div>
                      {item.online ? <span className="item-online" /> : null}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <Input
            className="chat-search"
            placeholder="search"
            id="input-with-icon-adornment"
            value={search}
            onChange={e => this.props.mergeData({ search: e.target.value })}
            startAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            }
          />
        </div>
        <div className="main-chat-window ">
          <div className="chat-window-list">
            {conversations.map(item => (
              <ChatWindow
                key={item._id}
                employees={this.props.conversation.employees}
                profile={this.props.profile}
                socket={this.props.socket}
                closeChat={this.closeChat}
                id={item._id}
              />
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

// eslint-disable-next-line react/no-multi-comp

Conversation.propTypes = {
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
)(Conversation);

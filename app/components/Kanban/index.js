/**
 *
 * Kanban
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import Board from 'react-trello/dist';
import { withStyles } from '@material-ui/core/styles';
// import { Button } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import styles from './styles';
import CardKanban from '../CardKanban';
// import NewCard from '../NewCard';
import CustomLaneHeader from './customLaneHeader';
/* eslint-disable react/prefer-stateless-function */

class Kanban extends React.Component {
  state = {
    kanbanStatus: { lanes: [] },
  };

  componentDidMount() {
    let listCrmStatus = [];
    listCrmStatus = JSON.parse(localStorage.getItem('crmStatus'));
    // const { kanbanStatus } = this.state;
    let sortedKanbanStatus = [];
    if (this.props.code) {
      // console.log(this.props.code);
      let listStatus = [];
      const currentStatusIndex = listCrmStatus.findIndex(d => d.code === this.props.code);
      if (currentStatusIndex !== -1) {
        listStatus = listCrmStatus[currentStatusIndex].data;
      } else {
        // eslint-disable-next-line no-alert
        alert('Trạng thái kanban đã bị xóa');
      }

      const laneStart = [];
      const laneAdd = [];
      const laneSucces = [];
      const laneFail = [];
      listStatus.forEach(item => {
        switch (item.code) {
          case 1:
            laneStart.push({
              id: item._id,
              title: item.name,
              style: {
                backgroundColor: 'transparent',
                color: '#fff',
                laneStyle: { color: item.color },
                // boxShadow: '2px 2px 4px 0px rgba(0,0,0,0.3)',
              },
              cards: [],
              labelStyle: { color: item.color, enableTotal: this.props.enableTotal },
              enableTotal: this.props.enableTotal,
            });
            break;
          case 2:
            laneAdd.push({
              id: item._id,
              title: item.name,
              style: {
                // width: 200,
                backgroundColor: 'transparent',
                color: '#fff',
                // boxShadow: '2px 2px 4px 0px rgba(0,0,0,0.3)',
              },
              labelStyle: { color: item.color, enableTotal: this.props.enableTotal },
              cards: [],
              index: item.index,
            });
            break;

          case 3:
            laneSucces.push({
              id: item._id,
              title: item.name,
              style: {
                // width: 200,
                backgroundColor: 'transparent',
                color: '#fff',

                // boxShadow: '2px 2px 4px 0px rgba(0,0,0,0.3)',
              },
              labelStyle: { color: item.color, enableTotal: this.props.enableTotal },
              cards: [],
            });
            break;

          case 4:
            laneFail.push({
              id: item._id,
              title: item.name,
              style: {
                // width: 200,
                backgroundColor: 'transparent',
                color: '#fff',
                // boxShadow: '2px 2px 4px 0px rgba(0,0,0,0.3)',
              },
              labelStyle: { color: item.color, enableTotal: this.props.enableTotal },
              cards: [],
            });
            break;

          default:
            break;
        }
      });
      sortedKanbanStatus = { lanes: [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail] };
    }

    if (this.props.data !== undefined) {
      const newKanbanStatus = JSON.parse(JSON.stringify(sortedKanbanStatus));

      this.props.data.forEach(element => {
        if (newKanbanStatus.lanes[element.kanbanStatus]) {
          newKanbanStatus.lanes[element.kanbanStatus].cards.push({
            id: element._id,
            title: this.props.titleField ? element[this.props.titleField] : element.name,
            action: ['call', 'email', 'sms'],
            style: { color: newKanbanStatus.lanes[element.kanbanStatus].labelStyle.color },
            data: element,
          });
        }
      });
      newKanbanStatus.lanes.forEach(n => {
        n.title = `${n.title} (${n.cards.length})`;
      });

      this.setState({ kanbanStatus: newKanbanStatus });
    }
  }

  componentWillReceiveProps(props) {
    if (props.data !== this.props.data && props.data !== undefined) {
      const { kanbanStatus } = this.state;
      const newKanbanStatus = JSON.parse(JSON.stringify(kanbanStatus));

      newKanbanStatus.lanes.forEach((element, index) => {
        newKanbanStatus.lanes[index].cards = [];
      });

      props.data.forEach(element => {
        if (newKanbanStatus.lanes[element.kanbanStatus]) {
          newKanbanStatus.lanes[element.kanbanStatus].cards.push({
            id: element._id,
            title: this.props.titleField ? element[this.props.titleField] : element.name,
            action: ['call', 'email', 'sms'],
            style: { color: newKanbanStatus.lanes[element.kanbanStatus].labelStyle.color },
            data: element,
          });
        }
      });
      this.setState({ kanbanStatus: newKanbanStatus });
    }
  }

  // onCardAdd = e => {
  //   // console.log(e);
  // };

  // onCardDelete = e => {
  //   console.log(e);
  // };

  onCardClick = cardId => {
    this.props.callBack('kanban-click', { cardId });
  };

  // onLaneAdd = e => {
  //   console.log(e);
  // };

  // onCardAdd = e => {
  //   console.log(e);
  // };

  // const handleCardDelete = (cardId, laneId) => {
  //   console.log(`Card: ${cardId} deleted from lane: ${laneId}`)
  // }

  render() {
    const { kanbanStatus } = this.state;
    // console.log(kanbanStatus)
    return (
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          padding: '30px',
          backgroundColor: 'transparent',
          background: 'linear-gradient(#A9E2F3, #3164F1)',
        }}
      >
        {kanbanStatus.lanes.length !== 0 ? (
          <Board
            style={{ backgroundColor: 'transparent' }}
            tagStyle={{ backgroundColor: 'red' }}
            data={kanbanStatus}
            draggable // cho phép kéo thả
            editable // cho phép chỉnh sửa
            onLaneAdd={this.onLaneAdd} // hàm thêm mới trạng thái
            onCardDelete={this.onCardDelete} //
            handleDragEnd={(cardId, targetLaneId, sourceLaneId) => {
              const newKanbanStatus = kanbanStatus.lanes.findIndex(d => d.id === sourceLaneId);
              this.props.callBack('kanban-dragndrop', { cardId, newKanbanStatus });
            }}
            laneStyle={{ borderLeft: '1px dashed rgba(255,255,255,.55)' }}
            hideCardDeleteIcon
            components={{
              AddCardLink: () => (
                <Button
                  onClick={() => {
                    this.props.callBack('quick-add');
                  }}
                  style={{ color: 'white', width: '300px' }}
                >
                  <Add /> Thêm mới
                </Button>
              ),
              Card: CardKanban,
              LaneHeader: CustomLaneHeader,
            }}
            onCardClick={this.onCardClick}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

Kanban.propTypes = {};

export default withStyles(styles)(Kanban);

/* eslint-disable react/prefer-stateless-function */
import React, { memo } from 'react';
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, Month, Inject } from '@syncfusion/ej2-react-schedule';
import { extend } from '@syncfusion/ej2-base';

import Paper from '@material-ui/core/Paper';
import { API_MEETING } from "../../config/urlConfig"
import { fetchData, serialize } from '../../helper';

function applyCategoryColor(args, currentView) {
  const categoryColor = args.data.CategoryColor;
  if (!args.element || !categoryColor) {
    return;
  }
  if (currentView === 'Agenda') {
    args.element.firstChild.style.borderLeftColor = categoryColor;
  } else {
    args.element.style.backgroundColor = categoryColor;
  }
}

export class Calendar extends React.Component {
  state = {
    dataSource: [],
  };

  componentDidMount() {
    // const list = [];
    // if (this.props.meetings !== undefined) {
    //   const { meetings } = this.props;
    //   meetings.forEach(item => {
    //     list.push({
    //       ...item,
    //       Id: item._id,
    //       CategoryColor: '#2196f3',
    //       Subject: item.name,
    //       Location: item.address,
    //       StartTime: new Date(item.timeStart),
    //       EndTime: new Date(item.timeEnd),
    //       Description: item.content,
    //     });
    //   });
    //   this.setState({ dataSource: extend([], list, null, true) });
    // }

    const { profile, filter} = this.props;
    console.log(33333, profile);
    
      // let  filter = {
      //   typeCalendar: '1',
      //   // people: { $in: [{ _id: profile && profile._id, name: profile && profile.name }] },
      // }
    fetchData(
      `${API_MEETING}?${serialize({ filter })}`,
    )
      .then(meetingCalendar => {
        const list = [];
        meetingCalendar.data.forEach(item => {
          list.push({
            ...item,
            Id: item._id,
            CategoryColor: '#2196f3',
            Subject: item.name,
            Location: item.address,
            StartTime: new Date(item.timeStart),
            EndTime: new Date(item.timeEnd),
            Description: item.content,
          });
        });
        this.setState({ dataSource: extend([], list, null, true) });
      })
      .catch(() => {
        // setState({ loading: false });
      });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.dataSource !== nextState.dataSource) {
      return true;
    } else {
      return false;
    }
  }

  // componentWillReceiveProps(props) {
  //   const meetings = [];
  //   const visits = [];
  //   if (props.meetings !== undefined && props.meetings !== this.props.meetings) {
  //     const { meetings } = props;
  //     meetings.forEach(item => {
  //       meetings.push({
  //         ...item,
  //         Id: item._id,
  //         CategoryColor: '#2196f3',
  //         Subject: item.name,
  //         Location: item.address,
  //         StartTime: new Date(item.timeStart),
  //         EndTime: new Date(item.timeEnd),
  //         Description: item.content,
  //       });
  //     });
  //     this.state.dataSource = extend([], meetings, null, true);
  //   }
  // }

  // content(props) {
  //   return (
  //     <div>
  //       {props.elementType === 'cell' ? (
  //         <div className="e-cell-content e-template">
  //           <form className="e-schedule-form">
  //             <div>
  //               <input className="subject e-field" type="text" name="Subject" placeholder="Title" />
  //             </div>
  //             <div>
  //               <input className="location e-field" type="text" name="Location" placeholder="Location" />
  //             </div>
  //           </form>
  //         </div>
  //       ) : (
  //         <div className="e-event-content e-template">
  //           <div className="e-subject-wrap">
  //             {props.Subject !== undefined ? <div className="subject">{props.Subject}</div> : ''}
  //             {props.Location !== undefined ? <div className="location">{props.Location}</div> : ''}
  //             {props.Description !== undefined ? <div className="description">{props.Description}</div> : ''}
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   );
  // }

  onPopupOpen = e => {
    if (e.type === 'DeleteAlert') {
      e.cancel = true;
      if (this.props.handleDelete) {
        console.log('hello', e.data.event)
        this.props.handleDelete(e.data.event);
      }
    }
    if (e.type === 'Editor') {
      if (this.props.handleAdd) {
        e.cancel = true;
        if (e.data.Id) {
          if (this.props.handleEdit) {
            this.props.handleEdit(e.data);
          }
        } else {
          this.props.handleAdd(e.data.StartTime);
        }
      }
    }
    if (e.type === 'QuickInfo') {
      if (!e.data.Id) {
        e.cancel = true;
      }
    }
    if (e.type === '"DeleteAlert"') {
      e.cancel = true;
    }
  };

  render() {
    return (
      <Paper>
        <ScheduleComponent
          width="100%"
          height="650px"
          popupOpen={this.onPopupOpen}
          eventSettings={{
            dataSource: this.state.dataSource,
          }}
          // readonly (thuco tinh cho sua hay k)
          ref={t => (this.scheduleObj = t)}
          // quickInfoTemplates={{ content: this.content.bind(this) }}
          selectedDate={new Date()}
          eventRendered={this.onEventRendered.bind(this)}
        >
          <ViewsDirective>
            <ViewDirective option="Day" displayName="Ngày" />
            <ViewDirective option="Week" displayName="Tuần" />
            <ViewDirective option="Month" displayName="Tháng" />
          </ViewsDirective>
          <Inject services={[Day, Week, Month]} />
        </ScheduleComponent>
      </Paper>
    );
  }

  onEventRendered = args => {
    // const categoryColor = args.data.CategoryColor;
    // if (!args.element || !categoryColor) {
    //   return;
    // }
    // if (this.scheduleObj.currentView === 'Agenda') {
    //   args.element.firstChild.style.borderLeftColor = categoryColor;
    // } else {
    //   args.element.style.backgroundColor = categoryColor;
    // }
    applyCategoryColor(args, this.scheduleObj.currentView);
  };
}

Calendar.propTypes = {};

export default memo(Calendar);

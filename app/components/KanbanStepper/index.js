/**
 *
 * KanbanStepper
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { Stepper, Step, StepButton, StepLabel, withStyles } from '@material-ui/core';

/* eslint-disable react/prefer-stateless-function */
const styles = {
  customStepper: {
    color: 'var(--kanban-color) !important',
  },
};
class KanbanStepper extends React.Component {
  state = { errMesssage: '', activeStep: 0, localListKanban: [] };

  componentDidMount() {
    // if (this.props.activeStep === 0) {
    //   this.setState({ activeStep: this.props.listStatus[0]._id });
    // }
    // if (typeof this.props.activeStep === 'string' && Number(this.props.activeStep) === )
  }

  componentWillReceiveProps(props) {
    // console.log(props.listStatus, props.activeStep, this.props.activeStep);
    // if (props !== this.props && props.activeStep !== this.props.activeStep) {
    // console.log(props.listStatus);

    const { listStatus } = props;
    const localListKanbanData = listStatus.sort((a, b) => a.code - b.code);
    this.setState({ localListKanban: localListKanbanData });

    const currentKanban = localListKanbanData.findIndex(n => String(n._id) === String(props.activeStep));
    if (currentKanban === -1 && this.props.activeStep === 0) {
      this.setState({ activeStep: 0 });
      this.setState({ errMesssage: '' });
    } else if (currentKanban !== -1) {
      this.setState({ activeStep: currentKanban });
      this.setState({ errMesssage: '' });
    } else {
      this.setState({ errMesssage: 'Trạng thái kanban đã bị xóa!' });
      // console.log('xxx');
    }
    // }
  }

  render() {
    const { onKabanClick, classes } = this.props;
    const { activeStep, localListKanban } = this.state;
    let { errMesssage } = this.state;
    return (
      <div>
        <Stepper nonLinear activeStep={activeStep}>
          {localListKanban.map((item, index) => {
            let color;
            if (index > activeStep) {
              color = 'black';
            } else if (localListKanban[activeStep]) {
              color = localListKanban[activeStep].color;
            } else {
              errMesssage = 'Trạng thái kanban đã bị xóa!';
            }
            return (
              <Step key={item._id}>
                <StepButton
                  onClick={() => {
                    onKabanClick(item._id);
                    this.setState({ errMesssage: '' });
                  }}
                  completed={index <= activeStep}
                >
                  <StepLabel
                    classes={{
                      label: classes.customStepper, // class name, e.g. `classes-nesting-label-x`
                    }}
                    style={{ '--kanban-color': color }}
                    StepIconProps={{
                      classes: {
                        completed: classes.customStepper,
                        active: classes.customStepper,
                      },
                    }}
                  >
                    {item.name}
                  </StepLabel>
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
        {/* <p style={{ color: 'red' }}> {errMesssage}</p> */}
      </div>
    );
  }
}

KanbanStepper.propTypes = {
  // listStatus: Array,
  activeStep: Number,
  onKabanClick: Function,
};

export default withStyles(styles)(KanbanStepper);

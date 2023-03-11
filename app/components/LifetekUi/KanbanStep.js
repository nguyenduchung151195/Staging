import React, { useEffect, useState } from 'react';
import { Stepper, Step, StepLabel, withStyles } from '@material-ui/core';
import axios from 'axios'

export default function KanbanStep({ kanbanStatus, code, typeStatus, handleStepper, Id, apiUrl }) {
  const status = JSON.parse(localStorage.getItem(typeStatus));
  const currentStatus = status.find(i => i.code === code) && status.find(i => i.code === code).data && status.find(i => i.code === code).data.sort((a, b) => a.code - b.code);
  const [currentIdx, setCurrentIdx] = useState(null);
  const [errMessage, setErrMessage] = useState('');
  const token = localStorage.getItem('token')
  useEffect(() => {
    if (!kanbanStatus) {
      handleStepper(currentStatus[0]);
    }
  }, [kanbanStatus]);

  useEffect(() => {
    if (Id && Id !== 'add') {
      axios({
        method: 'get',
        url: `${apiUrl}/${Id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).then(res => {
        const parseKanban = parseFloat(res.data.kanbanStatus)
        setCurrentIdx(parseKanban)
      })
        .catch(err =>
          console.log(err)
        )
    }
  })

  const idx = currentStatus && Array.isArray(currentStatus) && currentStatus.findIndex(i => i._id === kanbanStatus || i.type === kanbanStatus);
  const color = idx === -1 ? null : `${currentStatus && currentStatus[idx] && currentStatus[idx].color} !important`;
  function handleStep(item) {
    switch (code) {
      case 'ST15': {
        if (!currentIdx || (currentIdx >= 2 && Id && Id !== "add")) return setErrMessage('Bạn không thể thay đổi trạng thái của Kanban này');
        handleStepper(item);
        break;
      }
      default:
        handleStepper(item);
    }
    handleStepper(item);
  }

  const styles = {
    stepIcon: {
      color,
    },
    iconContainer: { color: 'red' },
  };

  const StepKanban = withStyles(styles)(props => {
    const { classes } = props;

    return (
      <div>
        <Stepper style={{ background: 'transparent' }} activeStep={idx}>
          {currentStatus.map(item => (
            <Step onClick={() => handleStep(item)} key={item.type}>
              <StepLabel StepIconProps={{ classes: { completed: classes.stepIcon, active: classes.stepIcon } }} style={{ cursor: 'pointer' }}>
                {item.name}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <p style={{ color: 'red' }}> {errMessage}</p>
      </div>
    );
  });

  return <StepKanban />;
}

KanbanStep.defaultProps = {
  typeStatus: 'crmStatus',
};

import React from 'react';
import { Typography } from '../../components/LifetekUi';
import { Button } from '@material-ui/core'

function FluctuationsMonth(props) {

  return (
    <Button
      style={{
        background: props.color,
        color: 'white',
        //   width: props.size ? props.size : '50%',
        // minHeight: '125px',
        width: '100%',
        marginTop: 10,
        height: 130,
      }}
      onClick={props.onClick}
    >
      <div style={{ padding: 5, zIndex: 999, textAlign: 'center', }}>
        {props.icon}
        <Typography onClick={props.openDetail} style={{ color: 'white', fontSize: 14}} variant="body1">{props.text}</Typography>
      </div>
      
    </Button>
  )

}

export default FluctuationsMonth
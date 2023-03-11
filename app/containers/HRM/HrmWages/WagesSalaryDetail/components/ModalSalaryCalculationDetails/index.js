import React, { memo } from 'react';
import { compose } from 'redux';
import { DialogContent, Grid, Button, Dialog, DialogTitle, Typography } from '@material-ui/core';

const LtTypography = memo(props => {
  const { children, ...rest } = props;
  return <Typography {...rest}>{children}</Typography>;
});

function ModalSalaryCalculationDetails(props) {
  const { open, onClose, salaryDetail } = props;

  function mapSalary(formula_, data) {
    let formula = formula_.slice();
    Array.isArray(data) && data.length && data.forEach(item => {
      formula = formula.replaceAll(`($${item.code})`, item.value)
    })
    return formula;
  }
  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle id="alert-dialog-title">Chi tiết lương: {props.salaryDetail.name} </DialogTitle>
        <DialogContent style={{ width: 600 }}>
          {/* {salaryDetail &&
            salaryDetail.map(item => {
              if (typeof item === 'object') {
                return (
                  <LtTypography>
                    {item.name}: {item.formula ?  <br /> : ''}
                    {item.formula ? `${item.code} = ${item.formula} = ${mapSalary(item.formula, salaryDetail)} = ${item.value}` : `${item.code} = ${item.value}`}
                  </LtTypography>
                );
              }
            })} */}
            {props.formulaAttributes &&
            props.formulaAttributes.map(item => {
              return (
                <LtTypography>
                  +{item.name}: {item.formula ?  <br /> : ''}
                  {item.formula ? `${item.code} = ${mapSalary(item.formula, salaryDetail)} = ${salaryDetail[item.code]}` : `${item.code} = ${salaryDetail[item.code]}`}
                </LtTypography>
              );
            })}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default compose(memo)(ModalSalaryCalculationDetails);

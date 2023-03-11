import { Dialog, DialogContent, DialogTitle, Grid, Button, DialogActions, TextField } from '@material-ui/core';
import React, { memo, useEffect, useState } from 'react';
import CustomInputBase from 'components/Input/CustomInputBase';
import { Parser } from "hot-formula-parser";

function DialogSalaryFormual(props) {
  const { handleCloseDialog, openDialog, salaryFormulaRunTest } = props;
  const [data, setData] = useState({})

  useEffect(() => {
    setData(salaryFormulaRunTest);
  }, [salaryFormulaRunTest])

  const handleOnchange = (e) => {
    const { target: { value, name } } = e;
    let newSourceAttribute = [];
    data.sourceAttribute && data.sourceAttribute.map(item => {
      if (item._id === name) {
        newSourceAttribute.push({ ...item, value });
      } else {
        newSourceAttribute.push(item)
      }
    })
    setData({ ...data, sourceAttribute: newSourceAttribute })
  }

  const handleChangeRecipe = (e) => {
    const { target: { value, name } } = e;
    setData({ ...data, [name]: value })
  }

  const handleRunTest = () => {
    const { formula: recipe } = data;
    const sourceAttribute = [...data.sourceAttribute];

    let formula = recipe.slice();
    sourceAttribute.forEach(item => {
      formula = formula.replaceAll(`($${item.code})`, item.value)
    })

    const parser = new Parser();
    const convert = parser.parse(`${formula}`);

    if (convert.result) {
      alert(convert.result);
    } else {
      alert(recipe)
    }
  }

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle id="alert-dialog-title">Chạy thử công thức {data.name}</DialogTitle>
      <DialogContent style={{ width: 600 }}>
        <Grid container spacing={16}>
          {Object.keys(data).length && (
            <React.Fragment>
              {data.sourceAttribute && data.sourceAttribute.map(item => (
                <Grid item xs={12}>
                  <CustomInputBase
                    label={`($${item.code}) ${item.name}`}
                    type="number"
                    name={item._id}
                    value={item.value}
                    onChange={e => handleOnchange(e)}
                  />
                </Grid>
              ))}
              <Grid item xs={12}>
                <CustomInputBase
                  label={data.name}
                  type="text"
                  name="formula"
                  value={data.formula}
                  onChange={e => handleChangeRecipe(e)}
                />
              </Grid>
            </React.Fragment>
          )}

        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleRunTest}
          variant="outlined"
          color="primary"
        >
          Chạy
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(DialogSalaryFormual);
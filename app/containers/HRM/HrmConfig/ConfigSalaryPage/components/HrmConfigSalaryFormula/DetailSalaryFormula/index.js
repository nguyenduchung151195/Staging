import { Grid, TextField, Typography } from '@material-ui/core';
import React, { memo, useState, useEffect, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { compose } from 'redux';
import { Edit, Menu, Save } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

// test
import DroppableSalary from './droppableSalary';

function ConfigSalaryFormula(props) {
  const { attributeFormula, listAttributeFormula, onUpdateAttribute, attributeFormulaId, addSingleAttributeFormula, updateSingleAttributeFormula } = props;

  const [search, setSearch] = useState('');
  const [salaryCategory, setSalaryCategory] = useState([]);
  const [salaryFormula, setSalaryFormula] = useState([]);

  useEffect(
    () => {
      if (attributeFormula) {
        setSalaryFormula(formatAttributeFormula(attributeFormula));
      }
    },
    [attributeFormula],
  );

  useEffect(
    () => {
      if (listAttributeFormula) {
        setSalaryCategory(formatSalaryCategory(listAttributeFormula));
      }
    },
    [listAttributeFormula],
  );

  // console.log(1, salaryFormula);

  const formatAttributeFormula = data => {
    return data.map(item => ({ ...item, id: item._id, sourceAttribute: item.sourceAttribute.map(it => ({ ...it, id: it._id })) }));
  };
  const formatSalaryCategory = data => {
    return data.map(item => ({ ...item, id: `${item._id}1` }));
  };

  const handleAdd = () => {
    const _id = `_${Math.random()
      .toString(36)
      .substr(2, 9)}${Math.random()
        .toString(36)
        .substr(2, 9)}`;
    const newSalaryFormula = [{ _id, name: '', code: '', sourceAttribute: [], formula: '', groupName: '', formulaId: attributeFormulaId || '' }, ...salaryFormula];
    setSalaryFormula(newSalaryFormula);
  };

  const handleUpdate = () => {
    if (salaryFormula) onUpdateAttribute(salaryFormula);
  };

  const handleSearch = e => {
    const { target } = e;
    const { value, name } = target;
    setSearch(value);
    if (value) {
      const newSalaryCateogry = formatSalaryCategory(listAttributeFormula);
      const foundSalaryCategory = newSalaryCateogry.filter(item => (item.name.toLowerCase().trim().indexOf(value.toLowerCase().trim()) !== -1 || item.code.toLowerCase().trim().indexOf(value.toLowerCase().trim()) !== -1));
      setSalaryCategory(foundSalaryCategory);
    } else setSalaryCategory(formatSalaryCategory(listAttributeFormula));
  };

  const onDragEnd = useCallback(
    result => {
      const { source, destination } = result;
      console.log('result', result);
      const { droppableId: salaryFormulaId } = destination;

      if (source.droppableId === 'droppableSalary') {
        const { draggableId } = result;
        const foundSalaryFormula = salaryFormula.find(salary => salary._id === salaryFormulaId);

        if (destination && destination.index === 0) {
          const foundSalaryCategory = salaryCategory.filter(s => s.id === draggableId);
          // foundSalaryFormula.targetAttribute._id = foundSalaryCategory[0].id;
          foundSalaryFormula.name = foundSalaryCategory[0].name;
          // foundSalaryFormula.code = foundSalaryCategory[0].code;
        } else if (Object.keys(foundSalaryFormula).length > 0) {
          const foundSalaryCategory = salaryCategory.filter(s => s.id === draggableId);
          const checkItemSalary = foundSalaryFormula.sourceAttribute.findIndex(
            i => i.code === foundSalaryCategory[0].code
          );
          const newSalaryCateogry = { ...foundSalaryCategory[0], id: foundSalaryCategory[0].id, _id: `${foundSalaryCategory[0].id}1` };
          if (foundSalaryCategory && checkItemSalary === -1) {
            let newSalaryFormula = [];
            salaryFormula.map(s => {
              if (s._id === salaryFormulaId) {
                newSalaryFormula.push({ ...s, sourceAttribute: [...s.sourceAttribute, newSalaryCateogry] });
              } else {
                newSalaryFormula.push(s);
              }
            });
            setSalaryFormula(newSalaryFormula);
          }
        }
      }
    },
    [salaryFormula],
  );

  const handleDeleteSalary = salary => {
    let newSalaryFormula = [...salaryFormula];
    const index = newSalaryFormula.findIndex(item => item._id === salary._id || item._id === salary.id);
    delete newSalaryFormula.splice(index, 1);

    setSalaryFormula(newSalaryFormula);
  };

  const handleDeleteSubItem = (salaryFormulaId, item) => {
    let newSalaryFormula = [...salaryFormula];
    const index = newSalaryFormula.findIndex(salary => salary._id === salaryFormulaId);
    if (index !== -1) {
      const subItemIndex = newSalaryFormula[index].sourceAttribute.findIndex(subItem => subItem.id === item._id || subItem._id === item._id);
      newSalaryFormula[index].sourceAttribute.splice(subItemIndex, 1);
    }
    setSalaryFormula(newSalaryFormula);
  };

  const handleChangeFormula = (salary, e) => {
    let newSalaryFormula = [];
    if (salary && salary._id) {
      salaryFormula.map(item => {
        if (item._id === salary._id) {
          newSalaryFormula.push({ ...item, [e.target.name]: e.target.value });
        } else {
          newSalaryFormula.push(item);
        }
      });
    }
    setSalaryFormula(newSalaryFormula);
  };

  const handleSaveSingleAttributeFormula = (salary) => {
    if (salary && !salary.id) {
      addSingleAttributeFormula(salary);
    } else {
      updateSingleAttributeFormula(salary)
    }
  }

  const handleChangeTitle = (e, salary) => {
    const {
      target: { value, name },
    } = e;
    let newSalaryFormula = [];
    if (salary && salary._id) {
      salaryFormula.map(item => {
        if (item._id === salary._id) {
          newSalaryFormula.push({ ...item, [name]: value });
        } else {
          newSalaryFormula.push(item);
        }
      });
    }
    setSalaryFormula(newSalaryFormula);
  };

  return (
    <>
      <Grid container spacing={16} direction="row" style={{ width: "calc(100vw - 260px)" }}  >
        <Grid item xs={6}>
          <Grid container justify="space-between">
            <Grid item>
              <Typography>
                <Menu /> Công thức lương
              </Typography>
            </Grid>
            <Grid item>
              <Grid container spacing={16}>
                <Grid item>
                  <Button variant="outlined" color="primary" onClick={handleAdd}>
                    {' '}
                    <AddIcon /> Thêm mới
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary" onClick={handleUpdate}>
                    {' '}
                    <Save /> Cập nhật
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid
            container
            direction="row"
            justify="space-between"
            //  alignItems="flex-end"
            item xs={11}
          >
            <Typography>
              <Menu /> Tất cả thuộc tính
            </Typography>
            <TextField type="text" value={search} name="search" variant="outlined" onChange={handleSearch} placeholder="Tìm kiếm..." />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <DroppableSalary
            salaryCategory={salaryCategory}
            salaryFormula={salaryFormula}
            onDragEnd={onDragEnd}
            handleDeleteSalary={handleDeleteSalary}
            handleDeleteSubItem={handleDeleteSubItem}
            handleChangeFormula={handleChangeFormula}
            handleChangeTitle={handleChangeTitle}
            handleSave={handleSaveSingleAttributeFormula}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default memo(ConfigSalaryFormula);

import { Grid, TextField } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import { Edit, Save } from '@material-ui/icons';
import InputAdornment from '@material-ui/core/InputAdornment';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import DialogSalaryFormual from './dialogSalaryFormula';

const ContainerColumn = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDragDisabled ? '#ccc' : props.isDragging ? '#ccc' : 'white')};
`;

const ConatinerTitle = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDragDisabled ? 'lightgrey' : props.isDragging ? 'lightgreen' : '')};
`;

const ContainerColumnSalary = styled.div`
  height: 600px;
  overflow-y: scroll;
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDragDisabled ? '#ccc' : props.isDragging ? '#ccc' : 'white')};
`;

const ContainerColumnAttribute = styled.div`
  height: 600px;
  overflow-y: scroll;
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDragDisabled ? '#ccc' : props.isDragging ? '#ccc' : 'white')};
`;
// const ColummnProperty = styled.div`
//   position: static;
//   padding: 8px;
//   transition: background-color 0.2s ease;
//   background-color: ${props => (props.isDragDisabled ? 'green' : props.isDragging ? 'lightgreen' : '')};
// `;

function DropDrapSalary(props) {
  const { handleDeleteSalary, onDragEnd, handleDeleteSubItem, handleChangeFormula, handleChangeTitle, handleSave } = props;
  const [dialog, setDialog] = useState(false);
  const [editTitle, setEditTitle] = useState(null);
  const [salaryCategory, setSalaryCategory] = useState([])
  const [salaryFormula, setSalaryFormula] = useState([])
  const [salaryFormulaRunTest, setSalaryFormulaRunTest] = useState({});

  useEffect(() => {
    setSalaryCategory(props.salaryCategory);
  }, [props.salaryCategory])

  useEffect(() => {
    setSalaryFormula(props.salaryFormula);
  }, [props.salaryFormula])



  const handleCloseDialog = () => {
    setDialog(false);
  }

  const handleOpenRunTest = (salary) => {
    setDialog(true);
    setSalaryFormulaRunTest(salary);
  }

  const handleEditTitle = (e, salary) => {
    setEditTitle(salary)
  }

  return (
    <React.Fragment>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={16}>
          <Grid item xs={6}>

            {
              Array.isArray(salaryFormula) && salaryFormula.length ? (
                <ContainerColumnSalary>
                  {salaryFormula.map((salary, i) => (
                    <Droppable key={i} droppableId={salary._id}>
                      {
                        (provided, snapshot) => (
                          <React.Fragment>

                            <ContainerColumn ref={provided.innerRef} >
                              <Draggable key={salary._id} draggableId={salary._id} index={i} isDragDisabled={true}>
                                {
                                  (provided, snapshot) => (
                                    <ConatinerTitle ref={
                                      provided.innerRef
                                    }
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      isDragging={
                                        snapshot.isDragging
                                      }
                                      style={
                                        provided
                                          .draggableProps
                                          .style
                                      }
                                    >
                                      <Grid container direction="row" justify="space-between">
                                        <Grid item>
                                          {/* {salary.targetAttribute.name} */}
                                          {editTitle && editTitle._id === salary._id ? (<TextField name="name" value={salary.name} onChange={(e) => handleChangeTitle(e, salary)} autoFocus onBlur={() => setEditTitle(null)} fullWidth />)
                                            : salary.name}
                                        </Grid>
                                        <Grid item>
                                          <Edit type="button" style={{ cursor: 'pointer' }} onClick={(e) => handleEditTitle(e, salary)} />
                                          {/* <Save type="button" style={{ cursor: 'pointer' }} onClick={(e) => handleSave(salary)} /> */}  {/* them moi ban ghi cap nhat lai cong thuc tinh tai website */}
                                          <CloseIcon type="button" style={{ cursor: 'pointer' }} onClick={(e) => handleDeleteSalary(salary)} />
                                        </Grid>
                                      </Grid>
                                    </ConatinerTitle>
                                  )
                                }
                              </Draggable>
                              {salary.sourceAttribute.map((item, index) => (
                                <Draggable key={item._id} draggableId={item._id} index={index + 1} isDragDisabled={true}>
                                  {(provided, snapshot) => (
                                    <ContainerColumn
                                      ref={
                                        provided.innerRef
                                      }
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      isDragging={
                                        snapshot.isDragging
                                      }
                                    // style={
                                    //   provided
                                    //     .draggableProps
                                    //     .style
                                    // }
                                    >
                                      <Grid container direction="row" justify="space-between">
                                        {`($${item.code}) ${item.name}`}
                                        <CloseIcon type="button" style={{ cursor: 'pointer' }} onClick={(e) => handleDeleteSubItem(salary._id, item)} />
                                      </Grid>
                                    </ContainerColumn>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                              <TextField type="text" variant="outlined" fullWidth onChange={(e) => handleChangeFormula(salary, e)}
                                value={salary.formula}
                                name="formula"
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="start">
                                      <PlayArrowIcon style={{ cursor: 'pointer' }} onClick={() => handleOpenRunTest(salary)} />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </ContainerColumn>
                          </React.Fragment>
                        )
                      }
                    </Droppable>
                  ))}
                </ContainerColumnSalary>
              )
                :
                null
            }


          </Grid>
          <Grid item xs={6}>
            <Droppable droppableId="droppableSalary" isDropDisabled={true}>
              {
                (provided, snapshot) => (
                  <ContainerColumnAttribute ref={provided.innerRef} >
                    {
                      salaryCategory.map((item, index) => {
                        return (
                          <Draggable
                            key={item.id} draggableId={item.id} index={index}
                          >
                            {
                              (provided, snapshot) => (
                                <React.Fragment>
                                  <ContainerColumn
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    isDragging={snapshot.isDragging}
                                    style={
                                      provided.draggableProps
                                        .style
                                    }>
                                    {`($${item.code}) ${item.name}`}
                                  </ContainerColumn>
                                  {snapshot.isDragging && (
                                    <ContainerColumn>
                                      {`($${item.code}) ${item.name}`}
                                    </ContainerColumn>
                                  )}
                                  {provided.placeholder}
                                </React.Fragment>
                              )
                            }
                          </Draggable>
                        )
                      })
                    }
                    {provided.placeholder}
                  </ContainerColumnAttribute>
                )
              }
            </Droppable>
          </Grid>
        </Grid>
      </DragDropContext>

      {/* propup */}
      <DialogSalaryFormual openDialog={dialog} handleCloseDialog={handleCloseDialog} salaryFormulaRunTest={salaryFormulaRunTest} />
    </React.Fragment>
  )
}

export default DropDrapSalary;
import React, { memo, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid } from '@material-ui/core';
import { Paper, VerticalTabs, VerticalTab } from 'components/LifetekUi';
// import { generateRows, globalSalesValues } from 'containers/ConfigHrmPage/components/ConfigSalaryPage/demo/generator';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import {
  addSalaryFormula, getAllDataSalary, getAllSalaryFormula, getAttributeFormula, updateDataSalary, updateSalaryFormula,
  addAttributeFormula,
  updateAttributeFormula,
  deleteAttributeFormula,
  deleteSalaryFormula,
  getListAttributeFormula,
  getProjectBonus,
  addProjectBonus,
  updateProjectBonus,
  deleteProjectBonus,
  addSingleAttributeFormula,
  updateSingleAttributeFormula
} from './actions';
import makeSelectConfigSalary from './selectors';
import TableComponent from 'components/TableComponent';
import HrmConfigSalaryFormula from './components/HrmConfigSalaryFormula/Loadable';
import { changeSnackbar } from 'containers/Dashboard/actions';
import HrmConfigBenifitProject from './components/HrmConfigBenifitProject/Loadable';

function ConfigSalaryPage(props) {
  const { configSalaryPage, getAllSalary, getAllSalaryFormula, getProjectBonus, addProjectBonus, updateProjectBonus,
    deleteProjectBonus, updateSalaryData, updateSalaryFormula, addSalaryFormula, deleteSalaryFormula, getAttributeFormula, addAttributeFormula, getListAttributeFormula, onChangeSnackbar,
    addSingleAttributeFormula, updateSingleAttributeFormula } = props;
  const { salaryFormula, attributeFormula, listAttributeFormula, addSalaryFormulaSuccess, updateSalaryFormulaSuccess, deleteSalaryFormulaSuccess, addAttributeFormulaSuccess,
    projectBonus } = configSalaryPage;
  const [tab, setTab] = useState(0);
  const [attributeFormulaId, setAttributeFormulaId] = useState(null);

  const handleSave = data => {
    updateSalaryData(data);
  };
  useEffect(() => {
    getAllSalary();
    getAllSalaryFormula();
    getProjectBonus();
  }, []);
  useEffect(() => {
    if (attributeFormulaId) {
      getAttributeFormula(attributeFormulaId);
      getListAttributeFormula(attributeFormulaId);
    }
  }, [attributeFormulaId])

  // useEffect(() => {
  //   getListAttributeFormula();
  // }, [])

  useEffect(
    () => {
      setTab(tab);
    },
    [tab, configSalaryPage],
  );

  const handleSaveSalaryFormula = (data) => {
    if (data && data._id) {
      // console.log('data', data)
      updateSalaryFormula(data);
    } else {
      addSalaryFormula(data);
    }
  }

  const handleDeleteSalaryFormula = (data) => {
    if (data && data._id) {
      deleteSalaryFormula(data._id);
    } else {
      // Xóa lỗi
    }
  }

  const handleSelectSalaryFormula = useCallback((data) => {
    if (data && data._id) {
      setAttributeFormulaId(data._id);
    } else {
      setAttributeFormulaId(null);
    }
  }, [attributeFormulaId])

  const handleUpdateAttribute = (data) => {
    if (data && attributeFormulaId) {
      addAttributeFormula(data, attributeFormulaId);
    }
  }

  return (
    <React.Fragment>
      <Paper>
        <Grid container spacing={16}>
          <Grid item xs={2} xl={2} md={2}>
            <VerticalTabs value={tab} onChange={(e, tab) => setTab(tab)}>
              <VerticalTab value={0} label="Cấu hình hợp đồng" />
              {/* <VerticalTab value={1} label="Cấu hình thưởng dự án theo dự án" /> */}
              <VerticalTab value={2} label="Công thức lương" />
            </VerticalTabs>
          </Grid>
          <Grid item xs={10} xl={10} md={10}>
            {tab === 0 && (
              <TableComponent salary={configSalaryPage} onSave={handleSave} />
            )}
            {tab === 1 && (<HrmConfigBenifitProject
              projectBonus={projectBonus}
              addProjectBonus={addProjectBonus}
              updateProjectBonus={updateProjectBonus}
              deleteProjectBonus={deleteProjectBonus}
            />)}
            {tab === 2 && <HrmConfigSalaryFormula
              salaryFormula={salaryFormula}
              listAttributeFormula={listAttributeFormula}
              onSave={handleSaveSalaryFormula}
              onDelete={handleDeleteSalaryFormula}
              handleSelectSalaryFormula={handleSelectSalaryFormula}
              attributeFormula={attributeFormula}
              addSalaryFormulaSuccess={addSalaryFormulaSuccess}
              updateSalaryFormulaSuccess={updateSalaryFormulaSuccess}
              deleteSalaryFormulaSuccess={deleteSalaryFormulaSuccess}

              onUpdateAttribute={handleUpdateAttribute}
              addAttributeFormulaSuccess={addAttributeFormulaSuccess}

              onChangeSnackbar={onChangeSnackbar}
              attributeFormulaId={attributeFormulaId}
              addSingleAttributeFormula={addSingleAttributeFormula}
              updateSingleAttributeFormula={updateSingleAttributeFormula}
            />}
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
}

const mapStateToProps = createStructuredSelector({
  configSalaryPage: makeSelectConfigSalary(),
});

function mapDispatchToProps(dispatch) {
  return {
    getAllSalary: () => dispatch(getAllDataSalary()),
    updateSalaryData: data => dispatch(updateDataSalary(data)),
    // deleteSalaryCategory: data => dispatch(deleteSalaryCategory(data)),

    getAllSalaryFormula: () => dispatch(getAllSalaryFormula()),
    addSalaryFormula: (data) => dispatch(addSalaryFormula(data)),
    updateSalaryFormula: (data) => dispatch(updateSalaryFormula(data)),
    deleteSalaryFormula: (_id) => dispatch(deleteSalaryFormula(_id)),

    // lay 1 ban ghi
    getAttributeFormula: (_id) => dispatch(getAttributeFormula(_id)),
    addAttributeFormula: (data, _id) => dispatch(addAttributeFormula(data, _id)),
    updateAttributeFormula: (data) => dispatch(updateAttributeFormula(data)),
    deleteAttributeFormula: (_id) => dispatch(deleteAttributeFormula(_id)),

    // lay danh sach thuoc tinh 
    getListAttributeFormula: (_id) => dispatch(getListAttributeFormula(_id)),
    onChangeSnackbar: (obj) => dispatch(changeSnackbar(obj)),

    // thuong du an
    getProjectBonus: () => dispatch(getProjectBonus()),
    addProjectBonus: (data) => dispatch(addProjectBonus(data)),
    updateProjectBonus: (data) => dispatch(updateProjectBonus(data)),
    deleteProjectBonus: (_id) => dispatch(deleteProjectBonus(_id)),

    //
    addSingleAttributeFormula: (data) => dispatch(addSingleAttributeFormula(data)),
    updateSingleAttributeFormula: (data) => dispatch(updateSingleAttributeFormula(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'dataSalary', reducer });
const withSaga = injectSaga({ key: 'dataSalary', saga });

export default compose(
  memo,
  withReducer,
  withSaga,
  withConnect,
)(ConfigSalaryPage);

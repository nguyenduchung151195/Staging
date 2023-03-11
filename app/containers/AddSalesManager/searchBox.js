import { FormControl, Grid, MenuItem, Select, InputLabel, Button } from '@material-ui/core';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import CustomInputField from '../../components/Input/CustomInputField';
import DepartmentAndEmployee from 'components/Filter/DepartmentAndEmployee';
import './style.css';
import { Refresh, Search } from '@material-ui/icons';
function SearchBox(props) {
  const { onGetData, organizationUnitFilterKey, employeeFilterKey, code = 'task', profile } = props;
  const INITIAL_QUERY = {
    year: 0,
    month: 0,
    deparment: '',
  };
  const currentYear = moment().format('YYYY');
  const currentMonth = moment().format('MM');
  const FORMAT_DATE = 'YYYY/MM/DD`';
  const [years, setYears] = useState();
  const [months, setMonths] = useState();
  const [show, setShow] = useState(true);
  const [innerFilter, setInnerFilter] = useState({});
  const [localQueryFilter, setLocalQueryFilter] = useState(INITIAL_QUERY);

  const generateYear = () => {
    let result = [];

    let count = 0;
    while (count < 5) {
      result.push(Number(currentYear) - count);
      count += 1;
    }
    setYears(result);
  };

  const generateMonth = () => {
    let result = [];
    let count = 1;
    while (count <= Number(currentMonth)) {
      result.push(count);
      count += 1;
    }
    setMonths(result.reverse());
  };

  function checkShow(show) {
    setShow(show);
  }

  const getFirstDayOfYear = year => {
    return moment(year, 'YYYY')
      .startOf('year')
      .format(FORMAT_DATE);
  };
  const getLastDayOfYear = year => {
    return moment(year, 'YYYY')
      .endOf('year')
      .format(FORMAT_DATE);
  };
  const getFirstDayOfMonth = month => {
    return moment(month, 'MM')
      .startOf('month')
      .format(FORMAT_DATE);
  };
  const getLastDayOfMonth = month => {
    return moment(month, 'MM')
      .endOf('month')
      .format(FORMAT_DATE);
  };
  const getFirstDayInMonthOfYear = (year, month) => {
    let date = month + '/' + year;

    return moment(date, 'MM/YYYY')
      .startOf('month')
      .format(FORMAT_DATE);
  };
  const getLastDayInMonthOfYear = (year, month) => {
    let date = month + '/' + year;
    return moment(date, 'MM/YYYY')
      .endOf('month')
      .format(FORMAT_DATE);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setLocalQueryFilter({ ...localQueryFilter, [name]: value });
  };

  const handleSendingData = () => {
    const { year, month } = localQueryFilter;
    let obj = {};
    if (year === 0 && month === 0) {
      obj = {
        startDate: getFirstDayOfYear(currentYear),
        endDate: getLastDayOfYear(currentYear),
      };
    }
    if (year !== 0 && month === 0) {
      obj = {
        startDate: getFirstDayOfYear(year),
        endDate: getLastDayOfYear(year),
      };
    }
    if (year === 0 && month !== 0) {
      obj = {
        startDate: getFirstDayOfMonth(month),
        endDate: getLastDayOfMonth(month),
      };
    }
    if (year !== 0 && month !== 0) {
      obj = {
        startDate: getFirstDayInMonthOfYear(year, month),
        endDate: getLastDayInMonthOfYear(year, month),
      };
    }
    onGetData(obj);
  };
  const handleClear = () => {
    setLocalQueryFilter(INITIAL_QUERY);
    let obj = {
      startDate: getFirstDayOfYear(currentYear),
      endDate: getLastDayOfYear(currentYear),
    };
    onGetData(obj);
  };

  useEffect(() => {
    generateYear();
    generateMonth();
    return () => {
      generateYear();
      generateMonth();
    };
  }, []);

  return (
    <>
      <Grid container justify="flex-end" alignItems="center" style={{ gap: 10 }}>
        <Grid item md={2} xs={12}>
          <FormControl variant="outlined" className="form form__select">
            <InputLabel id="year">Năm</InputLabel>
            <Select fullWidth labelId="year" name="year" value={localQueryFilter.year} onChange={handleChange}>
              <MenuItem value={0}>
                <em>----CHỌN----</em>
              </MenuItem>
              {years && years.map(year => <MenuItem value={year}>{year}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={2} xs={12}>
          <FormControl variant="outlined" className="form form__select">
            <InputLabel id="month">Tháng</InputLabel>
            <Select fullWidth labelId="month" name="month" value={localQueryFilter.month} onChange={handleChange}>
              <MenuItem value={0}>
                <em>----CHỌN----</em>
              </MenuItem>
              {months && months.map(month => <MenuItem value={month}>{month}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        {show === true && (
          <Grid item md={2}>
            <DepartmentAndEmployee
              onChangeShow={s => checkShow(s)}
              onChange={result => {
                let employeeId = '';
                let organizationUnitId = '';
                const newFilter = {};
                if (result) {
                  if (result.department) {
                    newFilter[organizationUnitFilterKey || 'organizationUnitId'] = result.department;
                  }
                  if (result.employee) {
                    newFilter[employeeFilterKey || 'employeeId'] = result.employee._id;
                  }
                }
                setInnerFilter(newFilter);
              }}
              profile={profile}
              moduleCode={code}
            />
          </Grid>
        )}
        <Grid item container md={2} justify="center" alignItems="center">
          <Grid item md={5}>
            <Button className="mr2" variant="contained" color="primary" onClick={() => handleClear()}>
              <Refresh />
            </Button>
          </Grid>
          <Grid item md={5}>
            <Button variant="contained" color="primary" onClick={() => handleSendingData()}>
              <Search />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
export default SearchBox;

/* eslint-disable react/prop-types */
/* eslint-disable indent */
/**
 *
 * CreateProjectContentDialog
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
// import AsyncSelect from 'react-select/async';
import { TextField, Grid, Button } from '@material-ui/core';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
//  import AsyncSelect from '../AsyncComponent';
import { API_USERS } from 'config/urlConfig';
/* eslint-disable react/prefer-stateless-function */

class ScanFile extends React.Component {
  state = {
    project: {
      fullPath: '',
    },
  };

  handleChangeSelect = (selectedOption, key) => {
    const { project } = this.state;
    project[key] = selectedOption;
    this.setState({ project });
    this.props.onChangeNewProject(project);
  };

  render() {
    const { project } = this.state;

    return (
      <div>
        <ValidatorForm
          onSubmit={() => {
            this.props.onSubmit('ok');
          }}
        >
          <Grid container>
            <Grid item sm={12} className="my-2">
              <input
                type="file"
                id="fileUpload"
                name="fileUpload"
                onChange={event => {
                  project.fullPath = event.target.value;
                  this.setState({ project });
                  this.props.onChangeNewProject(project);
                }}
                value={project.fullPath}
                accept=".pdf,.jpeg,.png"
              />
            </Grid>
            <Grid item sm={12} className="text-right">
              <Button
                className="mx-3"
                type="button"
                onClick={() => {
                  this.props.onSubmit('cancel');
                }}
                variant="outlined"
                color="secondary"
              >
                Hủy
              </Button>
              <Button variant="outlined" color="primary" type="submit">
                Tải lên
              </Button>
            </Grid>
          </Grid>
        </ValidatorForm>
      </div>
    );
  }
}

ScanFile.propTypes = {};

export default ScanFile;

/* eslint-disable jsx-a11y/no-static-element-interactions */
/**
 *
 * AddTemplatePage
 *
 */

import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import CustomInputBase from 'components/Input/CustomInputBase';
import { viewConfigName2Title, viewConfigCheckRequired, viewConfigCheckForm, viewConfigCheckShowForm } from 'utils/common';
import moment from 'moment';
import './style.css';
import CustomAppBar from 'components/CustomAppBar';
import { mergeData as MergeData } from '../../../../../Dashboard/actions';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
import makeSelectDashboardPage from '../../../../../Dashboard/selectors';
import { MenuItem } from '@material-ui/core';
import { fetchData } from 'helper';
import { API_HRM_RECRUIT, API_RECRUITMENT, API_RECRUITMENT_AGENCY } from '../../../../../../config/urlConfig';
import { AsyncAutocomplete } from '../../../../../../components/LifetekUi';
import NumberFormat from 'react-number-format';
import { changeSnackbar } from '../../../../../Dashboard/actions';
const {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  OrderedList,
  UnorderedList,
  Undo,
  Redo,
  FontSize,
  FontName,
  FormatBlock,
  Link,
  Unlink,
  InsertImage,
  ViewHtml,
  InsertTable,
  AddRowBefore,
  AddRowAfter,
  AddColumnBefore,
  AddColumnAfter,
  DeleteRow,
  DeleteColumn,
  DeleteTable,
  MergeCells,
  SplitCell,
} = EditorTools;
export class AddRecruit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Alltemplate: null,
      name2Title: null,
      localCheckRequired: null,
      localCheckShowForm: null,
      localMessages: null,
      reload: 0,
    };
  }
  handleDialogTemplate = () => {
    const { allTemplates } = this.props.dashboardPage;
    if (this.props.code) {
      const templatesItem = allTemplates ? allTemplates.filter(elm => elm.moduleCode === this.props.code) : null;
      this.setState({ Alltemplate: templatesItem });
    }
  };
  componentDidMount() {
    let { recruitmentUnit, title, template, cost } = this.state;
    if (recruitmentUnit === undefined || recruitmentUnit === null) recruitmentUnit = '';
    const data = {
      ["recruitmentUnit.name"]: recruitmentUnit,
      title: title !== undefined ? title : "",
      template: template !== undefined ? template : "",
      cost: cost !== undefined ? cost : ""
    }
    const { code } = this.props
    const messages = viewConfigCheckForm(code, data)
    this.state.localMessages = messages
    this.handleDialogTemplate();
    const datas = fetchData(`${API_RECRUITMENT_AGENCY}`, 'GET', null).then(res => {
      if (res.data) this.setState({ listRecruitment: res.data });
    });
    const newName2Title = viewConfigName2Title(code);
    const checkRequired = viewConfigCheckRequired(code, 'required');
    const checkShowForm = viewConfigCheckRequired(code, 'showForm');
    this.setState({
      name2Title: newName2Title,
      localCheckRequired: checkRequired,
      localCheckShowForm: checkShowForm,
    });
    this.getRecruitment();
  }

  handleChangeTemplate = e => {
    const {
      target: { value, name },
    } = e;
    this.setState(prevState => ({ ...prevState, [name]: value }));
    if (value) {
      const { content } = value;
      const view = this.editor.view;
      EditorUtils.setHtml(view, content);
    } else {
      const view = this.editor.view;
      EditorUtils.setHtml(view, null);
    }
    const data = {
      [e.target.name]: e.target.value || ''
    }
    const { code } = this.props;
    const messages = viewConfigCheckForm(code, data)
    this.state.localMessages[e.target.name] = messages[e.target.name];
  };
  handleSave = () => {
    const { recruitmentUnit, title, template, cost } = this.state;
    let data = {
      recruitmentUnit,
      title,
      cost,
      content: EditorUtils.getHtml(this.editor.view.state),
    };
    if (this.props.dataPage.type === 'edit') data = { ...data, _id: this.props.dataPage.id };
    if (template) data = { ...data, template: template._id };
    if (recruitmentUnit) data = { ...data, recruitmentUnit: recruitmentUnit._id };
    const datas = {
      "recruitmentUnit.name": recruitmentUnit,
      title: title !== undefined ? title : "",
      template: template !== undefined ? template : "",
      cost: cost !== undefined ? cost : ""
    }
    const messagess = viewConfigCheckForm(this.props.code, datas)
    if (Object.values(messagess).length > 0) {
      return this.props.onChangeSnackbar({ variant: 'error', message: 'Vui lòng nhập đầy đủ các trường thông tin', status: true });
    }
    this.props.onSave(data);
  };
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    const data = {
      [e.target.name]: e.target.value || ''
    }
    const { code } = this.props;
    const messages = viewConfigCheckForm(code, data)
    if (e.target.name === 'recruitmentUnit') {
      delete data[e.target.name]
      data["recruitmentUnit.name"] = e.target.value || ''
      this.state.localMessages["recruitmentUnit.name"] = messages["recruitmentUnit.name"];
    }
    else
      this.state.localMessages[e.target.name] = messages[e.target.name];

  };
  handleInputPositionChange = e => {
    this.setState({
      position: e.vacanciesId,
    });
  };
  setHtml = content => {
    const view = this.editor.view;
    EditorUtils.setHtml(view, content);
  };
  getRecruitment = async () => {
    this.props.dataPage.type === 'edit' &&
      (await fetch(`${API_HRM_RECRUIT}?recruitmentWaveCode=${this.props.module}&id=${this.props.dataPage.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          data.data.forEach(element => {
            if (element._id === this.props.dataPage.id) {
              this.setHtml(element.content);
              let temp = element.template;
              let tempp = element.recruitmentUnit;
              this.state.Alltemplate.map(el => {
                if (el._id === element.template) temp = el;
              });
              this.state.listRecruitment &&
                this.state.listRecruitment.length &&
                this.state.listRecruitment.map(elv => {
                  if (tempp._id === elv._id) tempp = elv;
                });
              this.setState({
                ...element,
                recruitmentUnit: { ...tempp },
                template: temp,
              });
            }
          });
        }));
  };

  getLabelNames = name => {
    const { code } = this.props;
    return viewConfigCheckShowForm(code, name, '', 'title');
  };

  render() {
    const { startSalary } = this.props;
    const { localMessages } = this.state;

    return (
      <div>
        <CustomAppBar
          title={this.props.dataPage && this.props.dataPage.type === 'add' ? 'THÊM MỚI đăng tuyển' : 'CẬP NHẬT đăng tuyển'}
          onGoBack={e => this.props.onClose()}
          onSubmit={() => {
            this.handleSave();
          }}
          className
          isTask
        />
        <Grid container spacing={8} style={{ padding: 10, marginTop: 80 }}>
          <Grid item md={6}>
            {this.props.dataPage && this.props.dataPage.type === 'add' ? (
              <CustomInputBase
                className="CustomForm"
                label={this.getLabelNames('recruitmentUnit.name') || "ĐƠN VỊ TUYỂN DỤNG"}
                name="recruitmentUnit"
                value={this.state.recruitmentUnit}
                select
                // disabled={this.props.dataPage && this.props.dataPage.type === 'add'}
                onChange={e => this.handleInputChange(e)}
                error={localMessages && localMessages['recruitmentUnit.name']}
                helperText={localMessages && localMessages['recruitmentUnit.name']}
                checkedShowForm={this.state.localCheckShowForm && this.state.localCheckShowForm['recruitmentUnit.name']}
                required={this.state.localCheckRequired && this.state.localCheckRequired['recruitmentUnit.name']}
              >
                <MenuItem value={null}>-- CHỌN {this.getLabelNames('recruitmentUnit.name')} --</MenuItem>
                {this.state.listRecruitment &&
                  this.state.listRecruitment.length &&
                  this.state.listRecruitment.map(item => <MenuItem value={item}>{item.name}</MenuItem>)}
              </CustomInputBase>
            ) : (
              <CustomInputBase
                className="CustomForm"
                label={this.getLabelNames('recruitmentUnit') || 'ĐƠN VỊ TUYỂN DỤNG'}
                name="recruitmentUnit"
                disabled
                value={this.state.recruitmentUnit && this.state.recruitmentUnit.name}
              />
            )}
          </Grid>
          <Grid item xs={6} container>
            <CustomInputBase
              className="CustomForm"
              label={this.getLabelNames('title') || 'TIÊU ĐỀ'}
              name="title"
              value={this.state.title}
              onChange={e => this.handleInputChange(e)}
              checkedShowForm={this.state.localCheckShowForm && this.state.localCheckShowForm.title}
              required={this.state.localCheckRequired && this.state.localCheckRequired.title}
              error={localMessages && localMessages['title']}
              helperText={localMessages && localMessages['title']}
            />
          </Grid>
          <Grid item xs={6}>
            <CustomInputBase
              className="CustomForm"
              label={this.getLabelNames('template') || 'BIỂU MẪU'}
              select
              name="template"
              value={this.state.template}
              onChange={this.handleChangeTemplate}
              checkedShowForm={this.state.localCheckShowForm && this.state.localCheckShowForm.template}
              required={this.state.localCheckRequired && this.state.localCheckRequired.template}
              error={localMessages && localMessages['template']}
              helperText={localMessages && localMessages['template']}
            >
              <MenuItem value={null}>-- CHỌN {this.getLabelNames('template') || 'BIỂU MẪU'} --</MenuItem>
              {this.state.Alltemplate !== null && this.state.Alltemplate.map(field => <MenuItem value={field}>{field.title}</MenuItem>)}
            </CustomInputBase>
          </Grid>
          <Grid item xs={6}>
            <NumberFormat
              allowNegative={false}
              decimalSeparator={null}
              className="CustomForm"
              label={this.getLabelNames('cost') || 'CHI PHÍ'}
              name="cost"
              customInput={CustomInputBase}
              value={this.state.cost}
              onChange={e => this.handleInputChange(e)}
              checkedShowForm={this.state.localCheckShowForm && this.state.localCheckShowForm.cost}
              required={this.state.localCheckRequired && this.state.localCheckRequired.cost}
              error={localMessages && localMessages['cost']}
              helperText={localMessages && localMessages['cost']}
            />
          </Grid>
          <Grid item xs={12}>
            <Editor
              tools={[
                [Bold, Italic, Underline, Strikethrough],
                [Subscript, Superscript],
                [AlignLeft, AlignCenter, AlignRight, AlignJustify],
                [Indent, Outdent],
                [OrderedList, UnorderedList],
                FontSize,
                FontName,
                FormatBlock,
                [Undo, Redo],
                [Link, Unlink, InsertImage, ViewHtml],
                [InsertTable],
                [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
                [DeleteRow, DeleteColumn, DeleteTable],
                [MergeCells, SplitCell],
              ]}
              contentStyle={{ height: 300 }}
              contentElement={this.state.content}
              ref={editor => (this.editor = editor)}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

AddRecruit.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};
const mapStateToProps = createStructuredSelector({
  dashboardPage: makeSelectDashboardPage(),
});
function mapDispatchToProps(dispatch) {
  return {
    // onMergeData: data => dispatch(MergeData(data)),
    onChangeSnackbar: data => dispatch(changeSnackbar(data)),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default compose(
  memo,
  withConnect,
)(AddRecruit);

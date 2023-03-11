// import React, { Fragment } from 'react';
// import { Card, Input, TextField } from '@material-ui/core';
// import { withPropsAPI } from 'gg-editor';
// import upperFirst from 'lodash/upperFirst';

// const inlineFormItemLayout = {
//   labelCol: {
//     sm: { span: 8 },
//   },
//   wrapperCol: {
//     sm: { span: 16 },
//   },
// };

// class DetailForm extends React.Component {
//   get item() {
//     const { propsAPI } = this.props;

//     return propsAPI.getSelected()[0];
//   }

//   handleSubmit = e => {
//     if (e && e.preventDefault) {
//       e.preventDefault();
//     }

//     const { form, propsAPI } = this.props;
//     const { getSelected, executeCommand, update } = propsAPI;

//     setTimeout(() => {
//       form.validateFieldsAndScroll((err, values) => {
//         if (err) {
//           return;
//         }

//         const item = getSelected()[0];

//         if (!item) {
//           return;
//         }

//         executeCommand(() => {
//           update(item, {
//             ...values,
//           });
//         });
//       });
//     }, 0);
//   };

//   renderEdgeShapeSelect = () => (
//     <TextField onChange={this.handleSubmit}>
//       <option value="flow-smooth">Smooth</option>
//       <option value="flow-polyline">Polyline</option>
//       <option value="flow-polyline-round">Polyline Round</option>
//     </TextField>
//   );

//   renderNodeDetail = () => {
//     const { form } = this.props;
//     const { label } = this.item.getModel();

//     return (
//       <Item label="Label" {...inlineFormItemLayout}>
//         {form.getFieldDecorator('label', {
//           initialValue: label,
//         })(<Input onBlur={this.handleSubmit} />)}
//       </Item>
//     );
//   };

//   renderEdgeDetail = () => {
//     const { form } = this.props;
//     const { label = '', shape = 'flow-smooth' } = this.item.getModel();

//     return (
//       <Fragment>
//         <Item label="Label" {...inlineFormItemLayout}>
//           {form.getFieldDecorator('label', {
//             initialValue: label,
//           })(<Input onBlur={this.handleSubmit} />)}
//         </Item>
//         <Item label="Shape" {...inlineFormItemLayout}>
//           {form.getFieldDecorator('shape', {
//             initialValue: shape,
//           })(this.renderEdgeShapeSelect())}
//         </Item>
//       </Fragment>
//     );
//   };

//   renderGroupDetail = () => {
//     const { form } = this.props;
//     const { label = '新建分组' } = this.item.getModel();

//     return (
//       <Item label="Label" {...inlineFormItemLayout}>
//         {form.getFieldDecorator('label', {
//           initialValue: label,
//         })(<Input onBlur={this.handleSubmit} />)}
//       </Item>
//     );
//   };

//   render() {
//     const { type } = this.props;

//     if (!this.item) {
//       return null;
//     }

//     return (
//       <Card type="inner" size="small" title={upperFirst(type)} bordered={false}>
//         <form onSubmit={this.handleSubmit}>
//           {type === 'node' && this.renderNodeDetail()}
//           {type === 'edge' && this.renderEdgeDetail()}
//           {type === 'group' && this.renderGroupDetail()}
//         </form>
//       </Card>
//     );
//   }
// }

// export default withPropsAPI(DetailForm);

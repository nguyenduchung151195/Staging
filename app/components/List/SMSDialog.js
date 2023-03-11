import React, { useRef, useState, useEffect } from 'react';
import { Fab as Fa, TextField as TextFieldUI, MenuItem } from '@material-ui/core';
import { TextField, Dialog as DialogUI } from 'components/LifetekUi';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Grid from '@material-ui/core/Grid';
import NumberFormat from 'react-number-format';
import { convertTemplate } from '../../helper';

const SMSDialog = props => {
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

  const { setDialogSMS, sendSMS, dialogSMS, SMS, setSMS, state, setState } = props;
  const { templatess } = state;
  const editor = useRef();

  const [requiredNumber, setRequiredNumber] = useState(false);
  const onSetSMS = e => {
    // console.log(e.target.value, 'e.target.value');
    if (e.target.value) setSMS({ ...SMS, to: e && e.target && e.target.value });
    else {
      let data = SMS;
      delete data.to;
      setSMS({ ...data });
    }
  };
  useEffect(
    () => {
      if (SMS.to) {
        if (SMS.to.length > 11 || SMS.to.length < 10) {
          setRequiredNumber(true);
        } else {
          setRequiredNumber(false);
        }
      }
    },
    [SMS],
  );
  return (
    <>
      {dialogSMS && (
        <DialogUI
          title="SMS"
          //  onSave={sendSMS}
          onSave={() => {
            if (requiredNumber || !SMS.to) return alert('Vui lòng nhập số điện thoại');
            else if (!state.template) return alert('Vui lòng chọn biểu mẫu');
            if ((!requiredNumber || SMS.to) && state.template) {
              setSMS('');
              setState({ ...state, template: '' });
            }
            sendSMS({ content: EditorUtils.getHtml(editor.current.view.state) });
          }}
          saveText="Gửi SMS"
          onClose={() => {
            if ((!requiredNumber || SMS.to) && state.template) {
              setSMS('');
              setState({...state, template: '' });
            }
            setDialogSMS(false);
          }}
          open={dialogSMS}
        >
          {/* <DialogTitle style={{ textAlign: 'center' }}>SMS</DialogTitle> */}

          <Grid container alignItems="center" justify="space-between" style={{ display: 'flex', flexDirection: 'row' }}>
            <Grid xs={2} item alignItems="center" justify="space-between" style={{ display: 'flex', flexDirection: 'row' }}>
              <Grid item>Người nhận</Grid>
              <Grid item>
                <AccountCircle style={{ marginRight: 15 }} />
              </Grid>
            </Grid>
            <Grid xs={10}>
              {/* <TextField fullWidth id="input-with-icon-grid" /> */}
              {/* <TextField
            error={!SMS.to}
            helperText={SMS.to ? false : 'Không được bỏ trống'}
            onChange={e => setSMS({ ...SMS, to: e.target.value })}
            value={SMS.to}
            fullWidth
            label="Nhập số điện thoại"
          /> */}
              <TextField
                error={requiredNumber || !SMS.to}
                helperText={SMS.to === '' ? 'Không được bỏ trống' : requiredNumber == true ? 'Số điện thoại từ 10 đến 11 số' : ''}
                label="Nhập số điện thoại"
                value={SMS.to}
                onChange={onSetSMS}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                customInput={TextField}
                allowNegative={false}
                decimalSeparator={null}
              />
            </Grid>
          </Grid>

          <Grid container alignItems="center" justify="space-between" style={{ display: 'flex', flexDirection: 'row' }}>
            <Grid item>Mẫu SMS</Grid>

            <Grid xs={10}>
              <TextField
                error={!state.template}
                helperText={state.template ? false : 'Không được bỏ trống'}
                value={state.template}
                fullWidth
                select
                onChange={e => {
                  const { value } = e.target;
                  console.log(value, 'value');
                  const { content } = templatess.find(e => e._id === value);
                  convertTemplate({
                    content,
                    data: props.SMS && props.SMS.to && props.SMS.to.originItem ? props.SMS.to.originItem : [],
                    code: state.templatess[0].moduleCode,
                  }).then(template => {
                    // TextFieldUI.setHtml(editor.current.view, template);
                    EditorUtils.setHtml(editor.current.view, template);
                    setState({ ...state, template: value });
                    // const rawText = template.replace(/<p>/g, '').replace(/<\/p>/g, '');
                    // const rawText = template;
                    // setSMS({ ...SMS, text: rawText });
                  });
                }}
                label="Biểu mẫu"
              >
                {templatess.map(item => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

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
            ref={editor}
          />

          {/* <TextField
        error={!SMS.text}
        helperText={SMS.text ? false : 'Không được bỏ trống'}
        onChange={e => setSMS({ ...SMS, text: e.target.value })}
        value={SMS.text}
        fullWidth
        // label="Text"
        multiline
        rows={8}
        placeholder="Nhập nội dung"
        ref={editor}
      /> */}
        </DialogUI>
      )}
    </>
  );
};

export default SMSDialog;

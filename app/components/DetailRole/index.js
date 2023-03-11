/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/**
 *
 * DetailRole
 *
 */

import React, { useEffect } from 'react';
import { Tabs, Tab, TableHead, TableRow, TableCell, Table, TableBody, Checkbox, Button } from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import { API_ORIGANIZATION, API_ROLE_APP } from '../../config/urlConfig';
import { fetchData, flatChild } from '../../helper';
import Snackbar from '../Snackbar';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

function DetailRole({ employeeId, closeDialog, moduleCode, isGroup, groupId}) {
  // const history = useHistory();
  const [value, setValue] = React.useState(0);
  const moduleColor = React.useState('#4CAF50')[0];
  const [dataUp, setDataUp] = React.useState({});
  const [roles, setRoles] = React.useState({
    moduleCode,
    // userId: employeeId,
    roles: [
      {
        code: 'DERPARTMENT',
        name: 'Phòng ban',
        type: 0,
        column: [{ name: 'view', title: 'Xem' }, { name: 'edit', title: 'Sửa' }, { name: 'delete', title: 'Xóa' }],
        row: [],
        data: [],
      },
    ],
  });
  const setValueTab = (e, tab) => {
    setValue(tab);
  };
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', variant: 'success' });

  function mergeDerpartment(data, z) {
    return z.map(i => {
      const dt = data.find(it => it.name === i.id);
      if (dt) return { ...dt, slug: i.slug, expand: i.expand, open: i.open };
      return { open: i.open, name: i.id, id: i.id, expand: i.expand, slug: i.slug, data: { view: false, edit: false, delete: false } };
    });
  }

  async function getData() {
    try {
      if (!employeeId) return;
      const list = [fetchData(API_ORIGANIZATION), fetchData(`${API_ROLE_APP}/${moduleCode}/${employeeId}`)];
      const p = await Promise.all(list);
      setDataUp(p[1])
      const z = flatChild(p[0]);
      const newRows = { ...roles };
      // const rowDerpartment = roles.find(i=>code==="DERPARTMENT")
      const newRoles = p[1].roles.map(i => (i.code === 'DERPARTMENT' ? { ...i, row: z, data: mergeDerpartment(i.data, z) } : i));
      // newRows.push = z.map(i => (p[1].roles.derpartment.find(it => it.access && i.name === it.name) ? { ...i, access: true } : i));
      // setRows(newRows);
      newRows.roles = newRoles;
      setRoles(newRows);
    } catch (error) {
      // console.log(error);
    }
  }

  useEffect(
    () => {
      if (moduleCode && employeeId) {
        getData();
      }
    },
    [employeeId, employeeId],
  );

  function handleCheck(name, valueName) {
    const tabRow = roles.roles[value].data.map(i => (i.name === name ? { ...i, data: { ...i.data, [valueName]: !i.data[valueName] } } : i));
    const newRoles = { ...roles };
    newRoles.roles[value].data = tabRow;
    setRoles(newRoles);
  }

  function handleCheckDerpartment(name, valueName, checked) {
    // let tabRow;
    const slug = roles.roles[value].data.find(i => i.name === name).slug;
    const list = slug.split('/');
    const tabRow = roles.roles[value].data.map(
      i => (i.slug.includes(slug) || (list.includes(i.name) && checked) ? { ...i, data: { ...i.data, [valueName]: !checked } } : i),
    );

    // SPECIALL CHECK
    // if (checked) {
    //   const slug = roles.roles[value].data.find(i => i.name === name).slug;
    //   const list = slug.split('/');
    //   tabRow = roles.roles[value].data.map(i => (list.includes(i.name) ? { ...i, data: { ...i.data, [valueName]: !checked } } : i));
    // } else {
    //   const slug = roles.roles[value].data.find(i => i.name === name).slug;
    //   tabRow = roles.roles[value].data.map(i => (i.slug.includes(slug) ? { ...i, data: { ...i.data, [valueName]: !checked } } : i));
    // }
    // const tabRow = roles.roles[value].data.map(i => (i.name === name ? { ...i, data: { ...i.data, [valueName]: !i.data[valueName] } } : i));
    const newRoles = { ...roles };
    newRoles.roles[value].data = tabRow;
    setRoles(newRoles);
  }

  function expandRow(slug, name, expand) {
    let tabDerpartment;
    const rowDerpartment = roles.roles[value];
    if (expand) {
      tabDerpartment = rowDerpartment.row.map(i => {
        if (i.name === name) return { ...i, expand: false };
        if (i.slug.includes(slug)) return { ...i, open: false, hide: true };
        return i;
      });
    } else {
      tabDerpartment = rowDerpartment.row.map(i => {
        if (i.name === name) return { ...i, expand: true };
        if (i.parent === name) return { ...i, open: true, hide: false };
        return i;
      });
    }
    const newRoles = { ...roles };
    const derparment = { ...newRoles.roles[value], row: tabDerpartment };
    newRoles.roles[value] = derparment;
    setRoles(newRoles);
  }

  async function saveRole() {
    if (!employeeId) {
      alert('Không thể phần quyền tính năng người dùng mới! Bạn vui lòng tạo người dùng trước khi phân quyền chi tiết');
      return;
    }
    try {
      let data = roles
     if(isGroup){
      data ={
        ...data,
        isGroup,
        groupId: employeeId,
      }
     }else {
      data ={
        ...data,
        isGroup,
        userId: employeeId,
      }
     }
    //  console.log(data, "data");
    if(dataUp.isUpdate === false) {
      await fetchData(`${API_ROLE_APP}/${moduleCode}/${employeeId}`, 'POST', data);
    }
    else {
      await fetchData(`${API_ROLE_APP}/${moduleCode}/${employeeId}`, 'PUT', data);
    }
      setSnackbar({ variant: 'success', message: 'cập nhật thành công', open: true });
      setTimeout(() => {
        closeDialog()
      }, 500);
      
    } catch (error) {
      setSnackbar({ variant: 'error', message: error.toString() || 'cập nhật thất bại', open: true });
    }
  }

  return (
    <>
      <Tabs value={value} onChange={setValueTab}>
        {roles.roles.map(i => (
          <Tab label={i.type === 2 ? <span style={{ color: moduleColor }}>{i.name} *</span> : i.name} />
        ))}
      </Tabs>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{roles.roles[value].name}</TableCell>
            {roles.roles[value].column.map(i => (
              <TableCell>{i.title}</TableCell>
            ))}
          </TableRow>
        </TableHead>

        {roles.roles[value].type ? (
          <TableBody>
            {roles.roles[value].row.map((i, rowIndex) => (
              <TableRow>
                <TableCell>{i.title}</TableCell>
                {roles.roles[value].column.map(it => (
                  <TableCell>
                    <Checkbox onClick={() => handleCheck(i.name, it.name)} checked={roles.roles[value].data[rowIndex].data[it.name]} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            {roles.roles[value].row.map(
              (i, rowIndex) =>
                i.open ? (
                  <TableRow>
                    <TableCell>
                      {' '}
                      <p
                        style={{ paddingLeft: i.level ? i.level * 10 : 0, fontWeight: i.child ? 'bold' : false }}
                        onClick={() => expandRow(i.slug, i.name, i.expand)}
                      >
                        {i.title}
                        {i.child ? i.expand ? <ExpandLess /> : <ExpandMore /> : null}
                      </p>
                    </TableCell>
                    {roles.roles[value].column.map(it => (
                      <TableCell>
                        <CheckDerpartment
                          handleCheckDerpartment={handleCheckDerpartment}
                          checked={roles.roles[value].data[rowIndex].data[it.name]}
                          column={it.name}
                          row={i.name}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ) : null,
            )}
          </TableBody>
        )}
      </Table>
      <p style={{ color: moduleColor, paddingTop: 20 }}>Phân quyền module </p>
      <p>Phân quyền cá nhân </p>

      <Button onClick={saveRole} style={{ float: 'right', marginLeft: 5 }} color="primary" variant="outlined">
        Lưu
      </Button>
      <Button onClick={closeDialog} style={{ float: 'right' }} color="secondary" variant="outlined">
        HỦY
      </Button>
      <Snackbar message={snackbar.message} onClose={() => setSnackbar({ ...snackbar, open: false })} open={snackbar.open} />
    </>
  );
}

function CheckDerpartment({ handleCheckDerpartment, row, column, checked }) {
  function check() {
    handleCheckDerpartment(row, column, checked);
  }
  return <Checkbox onClick={check} checked={checked} />;
}

DetailRole.propTypes = {};

export default DetailRole;

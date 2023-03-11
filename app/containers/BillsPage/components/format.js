import React, { useState, useEffect, memo, useCallback } from 'react';
import { tableToExcel, tableToPDF } from 'helper';
import { API_BILLS_PRINT, API_E_BILL_PRINT_UNSIGNED_BILL } from 'config/urlConfig';

function ReportBusinessOpportunities(props) {
  const { id, onClose } = props;
  const [fileData, setFileData] = useState();
  // console.log('213', id);
  useEffect(() => {
    fetch(
      `${API_E_BILL_PRINT_UNSIGNED_BILL}?agencyCode=minvoice&idHoaDon=d378d97d-de09-47d0-92b8-f4511a7b189e&gidzl=yQkI5k5PfmtplPOMvqAa3_Eva1lzHw1IkRl16QWJy5Uyk9OVgqlo1B-mbqZvJg83whUIIZWWoW0jur2X2W`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    )
      .then(response => response.json())
      .then(data => {
        var byteCharacters = decodeURIComponent(escape(window.atob(data)));
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var file = new Blob([byteArray], { type: 'application/pdf;base64' });
        var fileURL = URL.createObjectURL(file);
        setFileData(fileURL);
      });
  }, []);
  // console.log('aa', fileData);
  useEffect(
    () => {
      if (id !== null) {
        const win = window.open();
        // console.log(win);
        win.document.write('fileData (chờ dữ liệu BE)');
        win.document.close();
        win.print();
      }
      onClose();
    },
    [id],
  );
  return <React.Fragment>{}</React.Fragment>;
}
// const mapStateToProps = createStructuredSelector({
//   stockPage: makeSelectStockPage(),
// });

// const withConnect = connect(
//   mapStateToProps,
// );

export default memo(ReportBusinessOpportunities);
const styles = {
  importBtn: {
    marginLeft: 10,
    width: 200,
  },
  menuItem: {
    width: 200,
    justifyContent: 'center',
  },
};

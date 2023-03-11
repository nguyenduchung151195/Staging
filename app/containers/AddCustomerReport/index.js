import React, { useState, useEffect, useCallback } from 'react';
import { Grid } from '@material-ui/core';
import request from '../../utils/request';
import { serialize } from '../../helper';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';

import { API_REPORT_FREQUENCY_SELL, API_REPORT_CUSTOMER_SELL, API_TASK_PROJECT, API_TEMPLATE, API_PRICE, GET_CONTRACT, API_RNE, API_MAIL } from '../../config/urlConfig';
import CustomChartWrapper from '../../components/Charts/CustomChartWrapper';
import { makeSelectProfile } from '../Dashboard/selectors';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ListPage from 'containers/ListPage';
import List from 'components/List';
import AddSalesQuotation from 'containers/AddSalesQuotation';

import AddProjects from 'containers/AddProjects';
import ListTask from 'components/List/ListTask';
import { taskPrioty } from '../../helper';
import { templateColumns, EmaiColumns, EmailReportCols, reportConverCustomer } from 'variable';
import HOCTable from '../HocTable';

import ReportCustomerContract from '../ReportReportCustomer/components/ReportCustomerContract/ReportCustomerContract';
import Buttons from 'components/CustomButtons/Button';
import { Paper, SwipeableDrawer } from '../../components/LifetekUi';

const CustomChart1 = props => {
  const { data = [], titleTex, isExport, id } = props;
  const [chartExport, setChartExport] = useState();
  let result = [];
  if (data) {
    data.map(i => {
      let obj = {};
      let { customer, products = [] } = i || {};
      obj.name = customer.name;
      if (Array.isArray(products)) {
        products.map(product => {
          obj[product.name] = product.amount;
        });
      }
      result.push(obj);
    });
  }
  let finalResult = [];
  let listName = [];

  if (result.length > 0) {
    result.map(i => {
      if (i.name && listName.indexOf(i.name) === -1) {
        listName.push(i.name);
      }
    });
  }

  if (listName && listName.length !== 0) {
    listName.map(i => {
      let obj = {};
      result.length !== 0 &&
        result.map(j => {
          if (i === j.name) {
            let { name, ...rest } = j;
            obj.name = i;
            Object.keys(rest).map(product => {
              if (Object.keys(obj).indexOf(product) !== -1) {
                obj[product] += rest[product];
              } else {
                obj[product] = rest[product];
              }
            });
          }
        });
      finalResult.push(obj);
    });
  }

  let series = [];
  if (finalResult.length > 0) {
    finalResult.map(i => {
      let arr = Object.keys(i).filter(f => f !== 'name');
      arr.map(product => {
        if (series.indexOf(product) === -1) {
          series.push(product);
        }
      });
    });
  }

  let columnChart;
  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.XYChart);
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      chart.data = finalResult;

      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = 'name';
      categoryAxis.renderer.minGridDistance = 70;
      categoryAxis.renderer.cellStartLocation = 0.2;
      categoryAxis.renderer.cellEndLocation = 0.8;
      categoryAxis.fontSize = 11;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.renderer.minGridDistance = 50;

      function createSeries(field, name) {
        const series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryX = 'name';
        series.columns.template.width = am4core.percent(50);
        series.dataFields.valueY = field;
        series.name = name;
        series.stacked = true;
        series.columns.template.tooltipText = name + ': {valueY.value}';
        series.columns.template.tooltipY = 0;
      }
      chart.legend = new am4charts.Legend();
      chart.legend.valign = 'bottom';
      columnChart = chart;
      if (Array.isArray(series) && series.length > 0) {
        series.map(i => {
          createSeries(i, i);
        });
      }

      setChartExport(data);
    },
    [data],
  );
  useEffect(
    () => {
      if (chartExport && isExport === true) {
        chartExport.exporting.export('pdf');
        onExportSuccess();
      }
    },
    [data, isExport, chartExport],
  );

  useEffect(
    () => () => {
      if (columnChart) {
        columnChart.dispose();
      }
    },
    [],
  );
  return <div {...props} id={id} />;
};
const CustomChart2 = props => {
  const { data = [], titleTex, isExport, id } = props;
  const [chartExport, setChartExport] = useState();
  let finalResult = [];
  if (data && Array.isArray(data)) {
    data.map(item => {
      let obj = {
        name: item.name,
        amoutProduct: item.data ? item.data.amoutProduct : 0,
      };
      finalResult.push(obj);
    });
  }
  console.log(finalResult);
  let columnChart;
  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.XYChart);
      const title = chart.titles.create();
      title.text = titleTex;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      chart.data = finalResult;

      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = 'name';
      categoryAxis.renderer.minGridDistance = 70;
      categoryAxis.renderer.cellStartLocation = 0.2;
      categoryAxis.renderer.cellEndLocation = 0.8;
      categoryAxis.fontSize = 11;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.strictMinMax = true;
      valueAxis.renderer.minGridDistance = 50;

      function createSeries(field, name) {
        const series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryX = 'name';
        series.columns.template.width = am4core.percent(50);
        series.dataFields.valueY = field;
        series.name = name;
        series.columns.template.tooltipText = '{valueY.value}';
        series.columns.template.tooltipY = 0;
      }
      columnChart = chart;
      createSeries('amoutProduct', 'Tần suất mua hàng');
      setChartExport(data);
    },
    [data],
  );
  useEffect(
    () => {
      if (chartExport && isExport === true) {
        chartExport.exporting.export('pdf');
        onExportSuccess();
      }
    },
    [data, isExport, chartExport],
  );

  useEffect(
    () => () => {
      if (columnChart) {
        columnChart.dispose();
      }
    },
    [],
  );
  return <div {...props} id={id} />;
};
function AddCustomerReport(props) {
  const { tab, profile, isDisplay, customerId, customer, miniActive } = props;
  const INIT_QUERY = {
    year: 2021,
    organizationUnitId: '',
    employeeId: '',
    skip: 0,
    limit: 10,
  };
  const [isExport, setIsExport] = useState(false);
  const [queryFilter, setQueryFilter] = useState(INIT_QUERY);
  const [zoom, setZoom] = useState(false);
  const [count, setCount] = useState(1);
  const [tab1, setTab1] = useState(1);
  const [id, setId] = useState();

  const [openAddTask, setOpenAddTask] = useState(false);
  const [openSale, setOpenSale] = useState(false);
  const [idSale, setIdSale] = useState();
  const [contractTypeSource, setContractTypeSource] = useState([]);





  const [data, setData] = useState([]);
  const handleExportSuccess = () => {
    setIsExport(false);
  };
  const getData = obj => {
    let url;
    switch (Number(tab)) {
      // case 0:
      //     url = API_REPORT_CUSTOMER_SELL
      //     break;
      case 0:
        url = API_REPORT_CUSTOMER_SELL;
        break;
      case 1:
        url = API_REPORT_FREQUENCY_SELL;
        break;
    }
    request(`${url}?${serialize(obj)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    }).then(res => {
      if (res && res.data) {
        setData(res.data);
        setCount(res.count);
      }
    });
  };
  const handleLoadData = useCallback(
    (page = 0, skip = 0, limit = 10) => {
      let { year, organizationUnitId, employeeId } = queryFilter || {};
      let obj = {
        year,
        organizationUnitId,
        employeeId,
        skip,
        limit,
      };
      setQueryFilter(obj);
      getData(obj);
    },
    [queryFilter],
  );

  const customDataChart1 = ({ data = [] }) => {
    let result = [];
    if (Array.isArray(data)) {
      data.map(i => {
        let { customer, products } = i || {};
        let obj = {
          customerName: customer ? customer.name : '',
          totalProduct: i.totalProduct,
        };
        let [item] = products || [];
        if (item) {
          obj.managerEmployee = item.managerEmployee;
        }
        result.push(obj);
      });
    }
    return result;
  };
  const customFieldChart1 = () => {
    let viewConfig = [];
    viewConfig[0] = { name: 'customerName', title: 'Khách hàng', checked: true, width: 120 };
    viewConfig[1] = { name: 'managerEmployee', title: 'Người phụ trách', checked: true, width: 120 };
    viewConfig[2] = { name: 'totalProduct', title: 'Tổng số lượng mua', checked: true, width: 120 };
    return viewConfig;
  };

  const customFieldChart2 = () => {
    let viewConfig = [];
    viewConfig[0] = { name: 'customerName', title: 'Khách hàng', checked: true, width: 120 };
    viewConfig[1] = { name: 'managerEmployee', title: 'Người phụ trách', checked: true, width: 120 };
    viewConfig[2] = { name: 'amoutProduct', title: 'Tổng trong năm', checked: true, width: 120 };
    // viewConfig[3] = { name: 'amoutProduct', title: 'Tổng trong năm', checked: true, width: 120 };
    return viewConfig;
  };
  function customDataChart2({ data = [] }) {
    let result = [];
    if (Array.isArray(data) && data.length > 0) {
      data.map(i => {
        let obj = {};
        obj.customerName = i.name ? i.name : '';
        obj.managerEmployee = i.managerEmployee && i.managerEmployee ? i.managerEmployee.name : '';
        obj.amoutProduct = i.data && i.data.amoutProduct ? i.data.amoutProduct : 0;
        result.push(obj);
      });
    }
    return result;
  }
  const handleSearch = obj => {
    getData(obj);
  };
  const handleClear = () => {
    getData(INIT_QUERY);
  };
  useEffect(() => {
    getData(INIT_QUERY);
    const listCrmSource = JSON.parse(localStorage.getItem('crmSource')) || [];
    let contractTypeSourcee = listCrmSource.find(i => i.code === 'S15');
    if (contractTypeSourcee && contractTypeSourcee.data) {
      contractTypeSourcee = contractTypeSourcee.data || []
    } else contractTypeSourcee = []
    setContractTypeSource(contractTypeSourcee)
  }, []);
  const Bt = props => (
    <Buttons onClick={() => handleTab(props.tab1)} {...props} color={props.tab1 === tab1 ? 'gradient' : 'simple'} right round size="sm">
      {props.children}
    </Buttons>
  );
  const handleTab = (tab1) => {
    // this.setState({ tab1 });
    setTab1(tab1)
  }
  const customFunctionSMS = item => {
    let newItem = [];
    newItem = item.filter(ele => ele.formType === 'sms').map((it, index) => ({
      ...it,
      index: index + 1,
    }));
    return newItem;
  };
  const Process = props => (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'no-wrap', height: 22, width: '100%', position: 'relative' }}>
      <div
        style={{
          width: `${props.value}%`,
          background: `${props.color2}`,
          height: '100%',
          animation: '2s alternate slidein',
        }}
      />
      <div
        style={{
          width: `${100 - props.value}%`,
          background: `${props.color}`,
          height: '100%',
          animation: '2s alternate slidein',
        }}
      >
        <b style={{ fontSize: 13, marginLeft: 3, color: '#e0e0e0' }}>
          {props.progress}
          %- {props.name} {props.time}
          ngày
        </b>
      </div>
    </div>
  );
  const mapFunctionCustomer = (item) => {
    // console.log(item, "njnsdv")
    const taskType = props.configs && props.configs.find(it => it.code === item.taskType)
    return {
      ...item,
      name: (
        // eslint-disable-next-line react/button-has-type
        <button style={{ color: '#0b99e0', cursor: 'pointer' }}

          // onClick={() => props.mergeData({ openAddTask: true, id: item._id })}
          onClick={() => {
            setOpenAddTask(true)
            setId(item._id)
          }}
        >
          {item.name}
        </button>
      ),
      priority: !isNaN(parseInt(item.priority)) && taskPrioty && taskPrioty[parseInt(item.priority) + 1] || "",
      taskType: !!taskType ? taskType.name : item.category,
      // createdBy: item['createdBy.name'],
      progress: (
        <Process
          value={item.progress}
          progress={item.progress}
          color={item.taskStatus === 1 ? '#0320ff' : item.taskStatus === 2 ? '#009900' : item.taskStatus === 3 ? '#ff5722' : '#f44336'}
          time={
            new Date(item.endDate) >= new Date()
              ? ((new Date(item.endDate) - new Date()) / 86400000).toFixed()
              : ((new Date() - new Date(item.endDate)) / 86400000).toFixed()
          }
          name={new Date(item.endDate) > new Date() ? 'Còn' : 'Trễ'}
          color2={item.taskStatus === 1 ? '#364896' : item.taskStatus === 2 ? '#70db70' : item.taskStatus === 3 ? '#e07c5c' : '#69201b'}
        />
      ),
    }
  }
  const mapFunctionContract = (item) => {
    let label = item.catalogContract;
    const value = contractTypeSource && Array.isArray(contractTypeSource) && contractTypeSource.length && contractTypeSource.find(t => t.value === `${item.catalogContract}`);
    if (value) {
      label = value.title;
    }
    return {
      ...item,
      createdBy: item.createdByName,
      customerId: item.customerIdName,
      catalogContract: label,
      typeContract: item.typeContract == '1' ? 'HĐ KHÁCH HÀNG' : 'HĐ NCC',
    }
  }
  const mapFunctionSale = item => ({
    ...item,
    name: (
      // eslint-disable-next-line react/button-has-type
      <button style={{ color: '#0b99e0', cursor: 'pointer' }} onClick={() =>

      // this.props.mergeData({ openSale: true, id: item._id })
      {
        setOpenSale(true)
        setIdSale(item._id)
      }
      }>
        {item.name}
      </button>
    ),
    typeOfSalesQuotation: item.typeOfSalesQuotation == 1 ? ' Bán hàng' : item.typeOfSalesQuotation == 2 ? 'Báo giá' : 'Đăt hàng',
  });
  const customFunctionEmail = item => {
    let newItem = [];
    newItem = item.map((it, index) => ({
      ...it,
      index: index + 1,
    }));
    return newItem;
  };
  return (
    <>
      <Grid container style={{ width: "calc(100vw - 260px)" }}>
        {tab === 0 ? (
          <div style={{marginTop: "50px"}}>
            <Grid item md={12}>
              <CustomChartWrapper
                onGetData={handleSearch}
                profile={profile}
                onZoom={z => setZoom(z)}
                onRefresh={handleClear}
                isReport={true}
                code="reportCustomerNumberSell"
                id="customerChart1"
                onExport={() => setIsExport(true)}
              >
                <CustomChart1
                  data={data}
                  titleTex="Báo cáo khách hàng theo số lượng mua hàng"
                  id="chart1"
                  onExportSuccess={handleExportSuccess}
                  isExport={isExport}
                  style={{ width: '100%', height: zoom ? '90vh' : '60vh', marginTop: 30 }}
                />
              </CustomChartWrapper>
            </Grid>
            <Grid item md={12}>
              <ListPage
                apiUrl={`${API_REPORT_CUSTOMER_SELL}?${serialize(queryFilter)}`}
                columns={data && customFieldChart1()}
                customRows={customDataChart1}
                perPage={queryFilter.limit}
                isReport={true}
                count={count}
                onLoad={handleLoadData}
                client
                disableEdit
                disableAdd
                disableConfig
                disableSearch
                disableSelect
              />
            </Grid>
          </div>
        ) : null}

        {tab === 1 ? (
          <div style={{marginTop: "50px"}}>
            <Grid item md={12}>
              <CustomChartWrapper
                onGetData={handleSearch}
                profile={profile}
                onZoom={z => setZoom(z)}
                onRefresh={handleClear}
                isReport={true}
                code="reportCustomerFrequencySell"
                id="customerChart2"
                onExport={() => setIsExport(true)}
              >
                <CustomChart2
                  data={data}
                  titleTex="Báo cáo tần suất khách hàng mua hàng"
                  id="chart2"
                  onExportSuccess={handleExportSuccess}
                  isExport={isExport}
                  style={{ width: '100%', height: zoom ? '80vh' : '60vh', marginTop: 30 }}
                />
              </CustomChartWrapper>
            </Grid>
            <Grid item md={12}>
              <ListPage
                apiUrl={`${API_REPORT_FREQUENCY_SELL}?${serialize(queryFilter)}`}
                columns={data && customFieldChart2()}
                customRows={customDataChart2}
                perPage={queryFilter.limit}
                isReport={true}
                count={count}
                onLoad={handleLoadData}
                client
                disableEdit
                disableAdd
                disableConfig
                disableSearch
                disableSelect
              />
            </Grid>
          </div>
        ) : null}
        {tab === 3 ? (
          <div>
            <Grid item md={12}>
              <ReportCustomerContract
                profile={profile}
              />
            </Grid>

          </div>
        ) : null}
        {tab === 2 ? (
          <div style={miniActive ? { width: 'calc(100vw - 80px)' } : { width: 'calc(100vw - 260px)' }}>
            <Grid container style={{ marginLeft: -50 }}>
              <Grid item sm={12}>
                <Bt tab1={7}>SMS</Bt>
                <Bt tab1={6}>Email</Bt>
                <Bt tab1={5}>Thu chi</Bt>
                <Bt tab1={4}>Hợp đồng</Bt>
                <Bt tab1={3}>Báo giá/Bán hàng</Bt>
                <Bt tab1={2}>Cơ hội kinh doanh</Bt>
                <Bt tab1={1}>Công việc dự án</Bt>
              </Grid>
            </Grid>

            {tab1 === 1 ? (
              <Paper>
                <ListTask
                  disableEdit
                  disableAdd
                  disableConfig
                  disableImport
                  tree
                  code="Task"
                  kanban="KANBAN"
                  status="taskStatus"
                  apiUrl={`${API_TASK_PROJECT}/projects`}
                  mapFunction={(item) => mapFunctionCustomer(item)}
                  filter={customerId ? {
                    customer: isDisplay ? isDisplay._id : customer ? customer._id : '',
                  } : ""}
                  columnExtensions={[{ columnName: 'name', width: 300 }]}
                />
                <SwipeableDrawer
                  onClose={() => {
                    setOpenAddTask(false)
                    setId('add')
                  }}
                  open={openAddTask}
                // width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}

                >
                  <AddProjects id={id}
                    onClose={() => {
                      setOpenAddTask(false)
                      setId('add')
                    }} />
                </SwipeableDrawer>
              </Paper>
            ) : null}

            {tab1 === 2 ? (
              <HOCTable
                customColumns={[
                  {
                    columnName: 'customer.customerId',
                    display: 'none',
                  },
                  {
                    columnName: 'kanbanStatus',
                    CustomComponent: props.CustomKanbanStatus,
                  },
                  {
                    columnName: 'name',
                    CustomComponent: props.CustomName,
                  },
                ]}
                extraColumnsFirst={[
                  {
                    columnName: 'forget',
                    columnTitle: 'Chưa thao tác',
                    CustomComponent: props.CustomForget,
                    alternativeSortColumnName: 'updatedAt',
                  },
                ]}
                dialogTitle="cơ hội kinh doanh"
                path="/crm/BusinessOpportunities"
                data={props.bos}
                tree
                kanbanStatuses={props.crmStatusSteps}
                collectionCode="BusinessOpportunities"
                pageDetail={props.pageDetail}
                onGetAPI={props.handleGetData}
                enableServerPaging
                history={props.history}
                enableAddFieldTable={false}
                enableApproved
                filter={customerId ? {
                  customer: isDisplay ? isDisplay._id : customer ? customer._id : '',
                  status: 1,
                } : { status: 1 }}
              />
            ) : null}
            {tab1 === 3 ? (
              <Paper>
                <List
                  disableEdit
                  disableAdd
                  disableConfig
                  code="SalesQuotation"
                  kanban="ST02"
                  kanbanKey="_id"
                  apiUrl={API_PRICE}
                  mapFunction={mapFunctionSale}

                  filter={customerId ? {
                    "customer.customerId": customerId,
                    status: 1,
                  } : {
                    status: 1,
                  }}
                />
                <SwipeableDrawer onClose={() => {
                  // this.props.mergeData({ openSale: false })
                  {
                    setOpenSale(false)
                    setIdSale('add')
                  }
                }} open={openSale} width={window.innerWidth - 260}>
                  <div fullWidth>
                    <AddSalesQuotation id={idSale}
                      onClose={() => {
                        {
                          setOpenSale(false)
                          setIdSale('add')
                        }
                      }}
                      miniActive={miniActive}
                    />
                  </div>
                </SwipeableDrawer>
              </Paper>
            ) : null}
            {tab1 === 4 ? (
              <Paper>
                <List
                  disableEdit
                  disableAdd
                  disableConfig
                  code="Contract"
                  kanban="ST253"
                  kanbanSecondary="ST05"
                  kanbanKey="_id"
                  // status="taskStatus"
                  status="crmStatus"
                  apiUrl={GET_CONTRACT}
                  mapFunction={(item) => mapFunctionContract(item)}
                  filter={customerId ? { customerId } : ""}
                />
              </Paper>
            ) : null}
            {tab1 === 5 ? (
              <Paper>
                <List
                  disableEdit
                  disableAdd
                  disableConfig
                  code="RevenueExpenditure"
                  kanban="KANBAN"
                  status="taskStatus"
                  apiUrl={API_RNE}
                  filter={customerId ? {
                    "customerId": customerId,
                  } :
                    ""
                  }
                />
              </Paper>
            ) : null}
            {tab1 === 6 ? (
              <Paper>
                <List
                  disableEdit
                  disableAdd
                  disableConfig
                  columns={EmailReportCols}
                  customFunction={customFunctionEmail}
                  mapFunction={item => {
                    const newItem = {
                      ...item,
                      templateTitle: item.campaignId && item.campaignId.template ? item.campaignId.template.title : '',
                      status: item.status === 1 ? 'Đang gửi' : item.status === 2 ? 'Thành công' : 'Thất bại',
                    };
                    return newItem;
                  }}
                  apiUrl={API_MAIL}
                  filter={customerId ? {
                    customer: customerId,
                    status: 1,
                  } : {
                    status: 1,
                  }}
                />
              </Paper>
            ) : null}
            {tab1 === 7 ? (
              <Paper>
                <List
                  disableEdit
                  disableAdd
                  disableConfig
                  client
                  columns={templateColumns}
                  customFunction={customFunctionSMS}
                  apiUrl={API_TEMPLATE}
                  filter={customerId ? {
                    customer: customerId,
                    status: 1,
                  } : {
                    status: 1,
                  }}
                />
              </Paper>
            ) : null}
          </div>
        ) : null}
      </Grid>
    </>
  );
}
const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(AddCustomerReport);

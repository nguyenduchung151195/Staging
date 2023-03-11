import React, { useEffect, memo, useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import { API_REPORT_HRM_CONTRACT_TYPE } from 'config/urlConfig';
am4core.useTheme(Am4themesAnimated);
const a = ['số lượng thời gian', 'đơn vị thời gian', 'số lượng'];
function createChart(id, data) {
  const chart = am4core.create(id, am4charts.XYChart);

  chart.data = data.result;

  const title = chart.titles.create();
  title.text = 'BIỂU ĐỒ THỐNG KÊ LOẠI HỢP ĐỒNG THEO PHÒNG BAN';
  title.fontSize = 19;
  title.marginBottom = 30;
  title.fontWeight = 'bold';
  chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

  //   chart.data = data;

  let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = 'year';
  categoryAxis.numberFormatter.numberFormat = '#';
  categoryAxis.renderer.inversed = true;
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.renderer.cellStartLocation = 0.1;
  categoryAxis.renderer.cellEndLocation = 0.9;

  let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
  valueAxis.renderer.opposite = true;

  // Create series
  function createSeries(field, name) {
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = field;
    series.dataFields.categoryY = 'year';
    series.name = name;
    series.columns.template.tooltipText = '{name}: [bold]{valueX}[/]';
    series.columns.template.height = am4core.percent(100);
    series.sequencedInterpolation = true;

    let valueLabel = series.bullets.push(new am4charts.LabelBullet());
    valueLabel.label.text = '{valueX}';
    valueLabel.label.horizontalCenter = 'left';
    valueLabel.label.dx = 10;
    valueLabel.label.hideOversized = false;
    valueLabel.label.truncate = false;

    let categoryLabel = series.bullets.push(new am4charts.LabelBullet());
    categoryLabel.label.text = '{name}';
    categoryLabel.label.horizontalCenter = 'right';
    categoryLabel.label.dx = -10;
    categoryLabel.label.fill = am4core.color('#fff');
    categoryLabel.label.hideOversized = false;
    categoryLabel.label.truncate = false;
  }

  data.contractTypes.forEach(ct => {
    createSeries(ct.value, ct.title);
  });
  //   createSeries('income', 'Hợp đồng có kì hạn');
  //   createSeries('expenses', 'Hợp đồng không kì hạn');
  //   createSeries('cumi', 'Hợp đồng theo mùa vụ');
  // disable logo
  if (chart.logo) {
    chart.logo.disabled = true;
  }
  // Add cursor
  chart.cursor = new am4charts.XYCursor();

  // Add legend
  chart.legend = new am4charts.Legend();
  chart.legend.position = 'top';

  // Add scrollbar
  // chart.scrollbarX = new am4charts.XYChartScrollbar();
  // chart.scrollbarX.series.push(series2);
  // chart.scrollbarX.parent = chart.bottomAxesContainer;

  return chart;
}

function ColumnXYChartSIgned(props) {
  const [chart, setChart] = useState(null);
  const { id, data, isExport, onExportSuccess } = props;
  useEffect(
    () => {
      if (isExport && chart) {
        chart.exporting.export('pdf');

        onExportSuccess();
      }
    },
    [isExport, onExportSuccess],
  );

  useEffect(() => {
    fetch(`${API_REPORT_HRM_CONTRACT_TYPE}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(res => {
        if (res && res.status && res.data) {
          const currentChart = createChart(id, res.data);
          setChart(currentChart);
        }
      })
      .catch(error => console.log('error', error));
  }, []);

  return <div {...props} style={{ height: '100vh' }} id={id} />;
}

export default memo(ColumnXYChartSIgned);

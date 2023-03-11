import React, { useEffect, memo, useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(Am4themesAnimated);
const a = ['số lượng thời gian', 'đơn vị thời gian', 'số lượng']
function createChart(id, data) {
  const chart = am4core.create(id, am4charts.XYChart);
  const title = chart.titles.create();
  title.text = 'BIỂU ĐỒ THỐNG KÊ NHÂN SỰ THEO THÂM NIÊN';
  title.fontSize = 19;
  title.marginBottom = 30;
  title.fontWeight = 'bold';
  chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

  chart.data = data;

  const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.dataFields.category = 'name';
  categoryAxis.renderer.minGridDistance = 30;
  categoryAxis.fontSize = 11;

  // const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  // dateAxis.renderer.grid.template.location = 0;
  // dateAxis.dataFields.data = 'index';
  // dateAxis.renderer.minGridDistance = 30;
  // dateAxis.fontSize = 11;

  const valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis1.title.text = 'Số lượng';
  // valueAxis1.renderer.opposite = true;
  // valueAxis1.renderer.grid.template.disabled = true;

  const series2 = chart.series.push(new am4charts.ColumnSeries());
  series2.dataFields.categoryX = 'name'
  series2.dataFields.valueY = 'value';
  series2.yAxis = valueAxis1;
  series2.name = 'Số lượng';
  series2.columns.template.stroke = am4core.color("#1078e4");
  series2.columns.template.fill = am4core.color("#1078e4");
  series2.columns.template.width = am4core.percent(70);
  series2.tooltipText = '{name}: [bold font-size: 20]{valueY} [/]';
  series2.fill = chart.colors.getIndex(0).lighten(0.5);
  series2.strokeWidth = 0;
  series2.clustered = false;
  series2.toBack();

  // disable logo
  if (chart.logo) {
    chart.logo.disabled = true
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
  useEffect(() => {
    if (isExport && chart) {
      chart.exporting.export("pdf");

      onExportSuccess();
    }
  }, [isExport, onExportSuccess]);

  useEffect(() => {
    const currentChart = createChart(id, data);
    setChart(currentChart);
    return () => {
      if (currentChart) {
        currentChart.dispose();
      }
    };
  }, [data]);

  return <div {...props} style={{ height: 550 }} id={id} />;
}

export default memo(ColumnXYChartSIgned);
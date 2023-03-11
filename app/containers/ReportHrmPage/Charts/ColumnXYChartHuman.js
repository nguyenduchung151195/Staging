import React, { useEffect, memo, useState  } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(Am4themesAnimated);
const a =['số lượng thời gian', 'đơn vị thời gian', 'số lượng']
function createChart(id, data) {
    const chart = am4core.create(id, am4charts.XYChart);
    const title = chart.titles.create();
    title.text = 'BIỂU ĐỒ BIẾN ĐỘNG NHÂN SỰ';
    title.fontSize = 19;
    title.marginBottom = 30;
    title.fontWeight = 'bold';
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = data;
    
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = 'month';
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.fontSize = 11;

    const valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis1.title.text = 'Nhân viên';

    const series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.categoryX = 'month';
    series2.dataFields.valueY = 'hrm';
    series2.name = 'Nhân viên';
    series2.columns.template.width = am4core.percent(70);
    series2.columns.template.stroke = am4core.color("#1078e4");
    series2.columns.template.fill = am4core.color("#1078e4");
    series2.tooltipText = '{name}: [bold font-size: 20]{valueY}[/]';
    series2.fill = chart.colors.getIndex(0).lighten(0.5);
    series2.strokeWidth = 0;
    series2.clustered = false;
    series2.toBack();

    // disable logo
    if(chart.logo){
      chart.logo.disabled = true
    }
    // Add cursor
    chart.cursor = new am4charts.XYCursor();

    // Add legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = 'top';

    return chart;
}

function ColumnXYChartHuman(props) {
  const [chart, setChart] = useState(null);
  const { id, data, } = props;
  // useEffect(() => {
  //   if (isExport && chart) {
  //     chart.exporting.export("pdf");

  //     onExportSuccess();
  //   }
  // }, [isExport, onExportSuccess]);

  useEffect(() => {
    const currentChart = createChart(id, data);
    setChart(currentChart);
    return () => {
      if (currentChart) {
        currentChart.dispose();
      }
    };
  }, [data]);

  return <div {...props} style={{height: 550}} id={id} />;
}

export default memo(ColumnXYChartHuman);
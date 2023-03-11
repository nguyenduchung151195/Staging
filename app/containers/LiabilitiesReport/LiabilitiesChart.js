import React from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(Am4themesAnimated);
export default class App extends React.Component {
  componentDidMount() {
    const chart = am4core.create(this.props.id, am4charts.PieChart);

    const title = chart.titles.create();
    title.text = this.props.titles;
    title.fontSize = 25;
    title.marginBottom = 30;
    title.fontWeight = 'bold';
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chart.radius = am4core.percent(70);
    chart.innerRadius = am4core.percent(40);
    chart.startAngle = 180;
    chart.endAngle = 360;

    chart.data = this.props.data;

    // Add and configure Series
    const series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = 'value';
    series.dataFields.category = 'country';

    series.slices.template.cornerRadius = 10;
    series.slices.template.innerCornerRadius = 7;
    series.slices.template.draggable = true;
    series.slices.template.inert = true;
    series.alignLabels = false;

    series.hiddenState.properties.startAngle = 90;
    series.hiddenState.properties.endAngle = 90;

    chart.legend = new am4charts.Legend();

    series.mainContainer.mask = undefined;

    const cursor = new am4charts.XYCursor();
    chart.cursor = cursor;
    cursor.lineX.disabled = true;
    cursor.lineY.disabled = true;
    cursor.behavior = 'none';

    this.chart = chart;
  }

  componentDidUpdate(oldProps) {
    if (oldProps.data !== this.props.data) {
      this.chart.data = this.props.data;
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
    if (this.pieChart) {
      this.pieChart.dispose();
    }
    if (this.columnChart) {
      this.columnChart.dispose();
    }
  }

  render() {
    const { id, data, ...rest } = this.props;
    return <div {...rest} id={id} />;
  }
}

import React from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(Am4themesAnimated);
export default class App extends React.Component {
  componentDidMount() {
    // PIE CHART

    const chart = am4core.create(this.props.id, am4charts.PieChart);

    const pieTitle = chart.titles.create();
    pieTitle.text = this.props.title;

    pieTitle.fontSize = 25;
    pieTitle.marginBottom = 30;
    pieTitle.fontWeight = 'bold';
    chart.data = this.props.data;

    const pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'litres';
    pieSeries.dataFields.category = 'country';
    pieSeries.innerRadius = am4core.percent(50);
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;

    const rgm = new am4core.RadialGradientModifier();
    rgm.brightnesses.push(-0.8, -0.8, -0.5, 0, -0.5);
    pieSeries.slices.template.fillModifier = rgm;
    pieSeries.slices.template.strokeModifier = rgm;
    pieSeries.slices.template.strokeOpacity = 0.4;
    pieSeries.slices.template.strokeWidth = 0;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'right';

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
  }

  render() {
    const { id, data, ...rest } = this.props;
    return <div {...rest} id={id} />;
  }
}

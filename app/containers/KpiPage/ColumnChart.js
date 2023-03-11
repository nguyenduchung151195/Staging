import React from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(Am4themesAnimated);
export default class App extends React.Component {
  componentDidMount() {
    const { id, data } = this.props;
    const chart = am4core.create(id, am4charts.XYChart);
    chart.data = data;
    // chart.logo.disabled = true;
    const title = chart.titles.create();
    // title.text = 'Tỷ trọng chi phí theo khoản mục';
    title.fontSize = 13;
    title.marginBottom = 5;
    title.fontWeight = 'bold';
    // Create axes
    const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'name';
    categoryAxis.fontSize = 13;
    categoryAxis.fontWeight = 'bold';
    categoryAxis.numberFormatter.numberFormat = '#';
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 1;

    const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.opposite = true;
    valueAxis.min = 0;
    valueAxis.max = 100;

    function createSeries(field, name) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = field;
      series.dataFields.categoryY = 'name';
      series.name = name;
      series.columns.template.tooltipText = '{name} [bold]{valueX}[/]';
      series.columns.template.height = am4core.percent(40);
      series.sequencedInterpolation = true;

      const valueLabel = series.bullets.push(new am4charts.LabelBullet());
      valueLabel.label.text = '{valueX}%';
      valueLabel.label.horizontalCenter = 'left';
      valueLabel.label.dx = 10;
      valueLabel.label.hideOversized = false;
      valueLabel.label.truncate = false;

      const categoryLabel = series.bullets.push(new am4charts.LabelBullet());
      categoryLabel.label.text = '{name}';
      categoryLabel.label.horizontalCenter = 'right';
      categoryLabel.label.dx = -10;
      categoryLabel.label.fill = am4core.color('#fff');
      categoryLabel.label.hideOversized = false;
      categoryLabel.label.truncate = false;
    }
    createSeries('point');

    this.chart = chart;
  }

  componentDidUpdate(oldProps) {
    if (oldProps.data !== this.props.data) {
      this.chart.data = this.props.data;
    }
  }

  render() {
    const { id, data, ...rest } = this.props;
    return <div {...rest} id={id} />;
  }
}

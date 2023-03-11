import React from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(Am4themesAnimated);
export default class App extends React.Component {
  componentDidMount() {
    const { id, data } = this.props;
    const chart = am4core.create(id, am4charts.GaugeChart);
    const title = chart.titles.create();
    title.text = 'CHỈ TIÊU KPI';
    title.fontSize = 25;
    title.marginBottom = 30;
    title.fontWeight = 'bold';
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chart.paddingBottom = 30;
    chart.angle = 35;
    chart.data = data;
    chart.innerRadius = am4core.percent(82);
    // chart.logo.disabled = true;


    const axis = chart.xAxes.push(new am4charts.ValueAxis());
    axis.min = 0;
    axis.max = 100;
    axis.strictMinMax = true;
    axis.renderer.radius = am4core.percent(80);
    axis.renderer.inside = true;
    axis.renderer.line.strokeOpacity = 1;
    axis.renderer.ticks.template.disabled = false;
    axis.renderer.ticks.template.strokeOpacity = 1;
    axis.renderer.ticks.template.length = 10;
    axis.renderer.grid.template.disabled = true;
    axis.renderer.labels.template.radius = 40;
    axis.renderer.labels.template.adapter.add('text', text => `${text}%`);
    // Create series
    const colorSet = new am4core.ColorSet();

    const axis2 = chart.xAxes.push(new am4charts.ValueAxis());
    axis2.min = 0;
    axis2.max = 100;
    axis2.renderer.innerRadius = 10;
    axis2.strictMinMax = true;
    axis2.renderer.labels.template.disabled = true;
    axis2.renderer.ticks.template.disabled = true;
    axis2.renderer.grid.template.disabled = true;

    const range0 = axis2.axisRanges.create();
    range0.value = 0;
    range0.endValue = 50;
    range0.axisFill.fillOpacity = 1;
    range0.axisFill.fill = colorSet.getIndex(0);

    const range1 = axis2.axisRanges.create();
    range1.value = 50;
    range1.endValue = 100;
    range1.axisFill.fillOpacity = 1;
    range1.axisFill.fill = colorSet.getIndex(2);

    const label = chart.radarContainer.createChild(am4core.Label);
    label.isMeasured = false;
    label.fontSize = 45;
    label.x = am4core.percent(50);
    label.y = am4core.percent(100);
    label.horizontalCenter = 'middle';
    label.verticalCenter = 'bottom';
    label.text = `${data}%`;

    const hand = chart.hands.push(new am4charts.ClockHand());
    hand.axis = axis2;
    hand.innerRadius = am4core.percent(20);
    hand.startWidth = 10;
    hand.pin.disabled = true;
    hand.value = data;

    hand.events.on('propertychanged', ev => {
      range0.endValue = ev.target.value;
      range1.value = ev.target.value;
      axis2.invalidate();
    });

    this.chart = chart;
    this.label = label;
    this.hand = hand;
  }

  componentDidUpdate(oldProps) {
    if (oldProps.data !== this.props.data) {
      this.updateGau();
    }
  }

  updateGau = () => {
    const value = this.props.data;
    this.label.text = `${value}%`;
    const animation = new am4core.Animation(
      this.hand,
      {
        property: 'value',
        to: value,
      },
      1000,
      am4core.ease.cubicOut,
    ).start();
  };

  render() {
    const { id, data, ...rest } = this.props;
    return <div {...rest} id={id} />;
  }
}

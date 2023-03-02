import '../scss/main.scss';
import * as d3 from 'd3';
import * as d3r from 'd3-regression';
import { eachDayOfInterval, subDays, addMonths, closestIndexTo, getDayOfYear, isSameDay } from 'date-fns';
import _ from 'lodash';
import plotly from 'plotly';

// Set up the chart dimensions
var margin = { top: 20, right: 20, bottom: 50, left: 50 },
  width = 960 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// Create a new SVG element for the chart
var svg = d3.select("#root")
  .append("svg")
  // .classed("svg-container", true) //container class to make it responsive
  // .attr("viewBox", "-50 20 " + width + " " + height)
  // .attr("preserveAspectRatio", "xMinYMin meet")
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

const x = d3.scaleTime()
  .range([0, width]);

const y = d3.scaleLinear()
  .range([height, 0]);

d3.csv('/assets/data/sample.csv', row => {
  // Convert date string to Date object
  const date = new Date(row.date);
  return {
    productId: row.asin,
    date,
    price: +row.priceNew
  };
}).then(async (data) => {
  // Filter data by product ID
  const productId = 'B08YFH3PZJ';

  const filteredData = data.filter(d => d.productId === productId);


  // Sort data by date
  filteredData.sort((a, b) => a.date.getTime() - b.date.getTime());

  const dates = filteredData.map(d => d.date);

  const interval = ({
    start: new Date('2022-01-01'),
    end: subDays(addMonths(new Date('2023-01-01'), 1), 1),
  });
  for (const date of eachDayOfInterval(interval)) {
    if (!_.find(filteredData, (d) => isSameDay(d.date, date))) {
      filteredData.push({
        productId,
        date,
        price: filteredData[closestIndexTo(date, dates)].price
      });
    }
  }

  // Sort data by date
  filteredData.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Set up the scales for the chart
  var xScale = d3.scaleTime()
    .range([0, width])
    .domain(d3.extent(filteredData, function (d) { return new Date(d.date); }));

  var yScale = d3.scaleLinear()
    .range([height, 0])
    .domain(d3.extent(filteredData, function (d) { return d.price; }));

  // Add the x-axis to the chart
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  // Add the y-axis to the chart
  svg.append("g")
    // .attr("transform", "translate(-"+margin.left + ",0)")

    .call(d3.axisLeft(yScale));

  // Add the price line to the chart
  // svg.append("path")
  //   .datum(filteredData)
  //   .attr("fill", "none")
  //   .attr("stroke", "steelblue")
  //   .attr("stroke-width", 2)
  //   .attr("d", <any>d3.line()
  //     .x(function (d:any) { return xScale(d.date); })
  //     .y(function (d:any) { return yScale(d.price); })
  //   );
  // Add data points
  svg.selectAll('.data-point')
    .data(data.filter(d => d.productId === productId))
    .enter()
    .append('circle')
    .attr('class', 'data-point')
    .attr('cx', d => xScale(d.date))
    .attr('cy', d => yScale(d.price))
    .attr('r', 2);

  // Calculate the linear regression coefficients
  var xMean = d3.mean(filteredData, function (d) { return d.date.getTime(); });
  var yMean = d3.mean(filteredData, function (d) { return d.price; });
  var numerator = 0;
  var denominator = 0;
  filteredData.forEach(function (d) {
    numerator += (d.date.getTime()- xMean) * (d.price - yMean);
    denominator += (d.date.getTime() - xMean) * (d.date.getTime() - xMean);
  });
  var slope = numerator / denominator;
  var intercept = yMean - slope * xMean;
  console.log("y = " + slope + "x + " + intercept);

  // Add the regression line to the chart
  var lineData = [
    { "date": filteredData[0].date, "price": slope * filteredData[0].date.getTime() + intercept },
    { "date": filteredData[filteredData.length - 1].date, "price": slope * filteredData[filteredData.length - 1].date.getTime() + intercept }
  ];
  svg.append("path")
    .datum(lineData)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr("d", <any>d3.line()
      .x(function (d: any) { return xScale(d.date); })
      .y(function (d: any) { return yScale(d.price); })
    );
});

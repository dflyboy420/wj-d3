import '../scss/main.scss';
import * as d3 from 'd3';
import * as d3c from 'd3-collection';
import { SLR as Regression } from 'ml-regression';

(async function () {
  const data = await d3.csv('/assets/data/products.csv', (d, i, columns) => {
    return {
      asin: d['asin'],
      category: d['category'],
      date: new Date(d['date']),
      price: parseFloat(d['price']),
    };
  })

  // const dateFormat = d3.timeFormat('%Y-%m-%d');

  // data.map(d => {
  //   return {
  //     date: dateFormat(d.date),
  //     price: d.price
  //   }
  // });

  // Fit a linear regression model to the data
  const regression = new Regression(data.map(d => d.date.getTime()), data.map(d => d.price));

  // Define the margin, width, and height of the plot
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Create an x-scale for the dates
  const x = d3.scaleTime()
    .range([0, width])
    .domain(d3.extent(data, d => d.date));

  // Create a y-scale for the prices
  const y = d3.scaleLinear()
    .range([height, 0])
    .domain(d3.extent(data, d => d.price));

  // Define the line function for the regression line
  const line = d3.line()
    .x(d => x(d[0]))
    .y(d => y(d[1]));

  // Create the SVG element
  const svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Add the x-axis
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // Add the y-axis
  svg.append('g')
    .call(d3.axisLeft(y));

  // Add the data points
  svg.selectAll('.point')
    .data(data)
    .enter().append('circle')
    .attr('class', 'point')
    .attr('cx', d => x(d.date))
    .attr('cy', d => y(d.price))
    .attr('r', 5);

  // Add the regression line
  svg.append('path')
    .datum([[x.domain()[0], regression.predict(x.domain()[0].getTime())], [x.domain()[1], regression.predict(x.domain()[1].getTime())]])
    .attr('class', 'line')
})();

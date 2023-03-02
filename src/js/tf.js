import '../scss/main.scss'
import '@tensorflow/tfjs-backend-webgl'
import tfvis from '@tensorflow/tfjs-vis'
import * as tf from '@tensorflow/tfjs'

import * as d3 from 'd3'
import * as d3r from 'd3-regression'
import {
  eachDayOfInterval,
  subDays,
  addMonths,
  closestIndexTo,
  getDayOfYear,
  isSameDay
} from 'date-fns'
import _ from 'lodash'

/**
 * Get the car data reduced to just the variables we are interested
 * and cleaned of missing data.
 */
async function getData () {
  const data = await d3.csv('/assets/data/products.csv', row => {
    // Convert date string to Date object
    const date = new Date(row.date)
    return {
      productId: row.asin,
      date,
      price: +row.priceNew,
      category: row.category
    }
  })

  return data
}

async function run () {
  // Load and plot the original input data that we are going to train on.
  const data = await getData()
  const values = data.map(d => ({
    x: d.horsepower,
    y: d.mpg
  }))

  tfvis.render.scatterplot(
    { name: 'Horsepower v MPG' },
    { values },
    {
      xLabel: 'Horsepower',
      yLabel: 'MPG',
      height: 300
    }
  )

  // More code will be added below
}

document.addEventListener('DOMContentLoaded', run)

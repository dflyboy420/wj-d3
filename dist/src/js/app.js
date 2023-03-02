"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../scss/main.scss");
const d3 = __importStar(require("d3"));
const d3c = __importStar(require("d3-collection"));
(async function () {
    // Selecting and appending elements
    let selection = d3.select('#root')
        .append('h5')
        .append('text')
        .text(`D3 version: ${d3.version}`);
    const data = await d3.csv('/assets/data/amazon.csv', (d, i, columns) => {
        return {
            asin: d['asin'],
            category: d['category'],
            date: d3.timeParse('%Y-%m-%d')(d['date']),
            price: parseFloat(d['price']),
        };
    });
    var entries = d3c.nest()
        .key(function (d) { return d['category']; })
        .key(function (d) { return d['asin']; })
        .key(function (d) { return d['date']; })
        .rollup(function (d) { return d[0]['price']; })
        // .map(data);
        .entries(data);
    console.log(entries);
    const frequency = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.date; }))
        .range([0, data.length - 1])
        .ticks(d3.timeMonth.every(1))
        .length;
    selection.text(`D3 version: ${d3.version} - frequency: ${frequency}`);
    const dataByProduct = d3c.nest()
        .key(function (d) { return d['asin']; })
        .entries(data);
    // Calculate the frequency of price change for each product
    dataByProduct.forEach(function (product) {
        const frequency = d3.scaleTime()
            .domain(d3.extent(product['values'], function (d) { return d['date']; }))
            .range([0, product.values.length - 1])
            .ticks(d3.timeWeek.every(2))
            .length;
        console.log("Product:", product.key);
        console.log("Price change frequency:", frequency, "per 6 months");
    });
})();
//# sourceMappingURL=app.js.map
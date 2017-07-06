const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json',
	months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	years = [],
	colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4","#e6f598", "#ffffbf", "#fee08b", "#fdae61","#f46d43", "#d53e4f", "#9e0142"],
	base = 8.66,
	margin = {top:50, right:25, bottom:50, left:75},
	height = 520 - margin.top - margin.bottom,
	width = 1300 - margin.left - margin.right;

let data;


const makeChart = () => {

	//make chart
	let svg = d3.select('#chart')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.style('background', 'white')
			.style('box-shadow', '0 5px 10px rgba(0,0,0,0.7)')
			.append('g')
				.attr('transform', `translate(${margin.left},${margin.top})`);

	const yearParser = d3.timeParse("%Y");
	const monthParser = d3.timeParse("%m");

	// set y scale
	let y = d3.scaleTime()
						.domain([monthParser(data[0].month), monthParser(data[11].month)])
						.range([0, height - margin.top]);

	// set x scale
	let x = d3.scaleTime()
						.domain(d3.extent(years, function(d) {
							let year = yearParser(d);
							return year;
						}))
						.range([0, width]);

	// create axis'
	let yAxis = d3.axisLeft(y).tickFormat(d3.timeFormat('%B')).tickSize(0).tickPadding(5);
	let xAxis = d3.axisTop(x).tickFormat(d3.timeFormat('%Y')).tickSize(9);

	// create and position data points
	svg.selectAll('rect')
	.data(data)
	.enter()
	.append('rect')
		.attr('x', function(d,i) {
			let year = yearParser(d.year);
			return x(year);
		})
		.attr('y', function(d,i) {
			let month = monthParser(d.month);
			return y(month);
		})
		.attr('width', function(d,i) {
			return ((width - margin.left - margin.right) / years.length);
		})
		.attr('height', function(d,i) {
			return (height - margin.top - margin.bottom) / 12;
		})
		.attr('fill', function(d) {
			if (d.varince + base >= 12.8) {
				return colors[11];
			} else if (d.variance + base >= 11.7) {
				return colors[10];
			} else if (d.variance + base >= 10.6) {
				return colors[9];
			} else if (d.variance + base >= 9.5) {
				return colors[8];
			} else if (d.variance + base >= 8.3) {
				return colors[7];
			} else if (d.variance + base >= 7.2) {
				return colors[6];
			} else if (d.variance + base >= 6.1) {
				return colors[5];
			} else if (d.variance + base >= 5) {
				return colors[4];
			} else if (d.variance + base >= 3.9) {
				return colors[3];
			} else if (d.variance + base >= 2.8) {
				return colors[2];
			} else if (d.variance + base >= 0) {
				return colors[1];
			} else {
				return colors[0];
			}
		})
		.on('mouseover', function(d) {
			let date = months[d.month - 1] + " " + d.year;
			tooltip.transition()
				.duration(200)
				.style('opacity', 0.9);
			tooltip.html(date + "<br/>" + (d.variance + base).toFixed(2) + '&degC<br/>Variance: ' + d.variance)
			.style("left", (d3.event.pageX - 70) + "px")
			.style("top", (d3.event.pageY + 25) + "px");

		})
		.on('mouseout', function() {
			tooltip.transition()
				.duration(200)
				.style('opacity', 0);
		});

		// display/append axis
		svg.append('g')
			.call(yAxis)
			.selectAll('text')
				.attr('dy', 15);

		svg.append('g')
			.call(xAxis);

		// append tooltip div
		var tooltip = d3.select('#chart')
				.append('div')
				.attr('class', 'tooltip')
				.style('opacity', 0)



}

// init: get all data and setup data for chart
const setupData = () => {
	for (var i = 0; i < data.length; i += 12) {
		years.push(data[i].year);
	}

	makeChart();
}

const getData = () => {
	d3.json(url, (d) => {
			data = d.monthlyVariance;

		setupData();
	})
};


getData();

<script>
	import * as d3 from 'd3';
	import { onMount } from 'svelte';

	var data = [
		{
			name: 'Direct Mapped',
			values: [
				{ cache: '0.5', rate: '.7854' },
				{ cache: '1', rate: '.8316' },
				{ cache: '2', rate: '.8896' },
				{ cache: '4', rate: '.948' },
				{ cache: '8', rate: '.9637' },
				{ cache: '16', rate: '.9893' }
			]
		},
		{
			name: '2-Way Set (LRU)',
			values: [
				{ cache: '0.5', rate: '.8286' },
				{ cache: '1', rate: '.8913' },
				{ cache: '2', rate: '.9219' },
				{ cache: '4', rate: '.9679' },
				{ cache: '8', rate: '.9839' },
				{ cache: '16', rate: '.9892' }
			]
		},
		{
			name: '2-Way Set (FIFO)',
			values: [
				{ cache: '0.5', rate: '.8197' },
				{ cache: '1', rate: '.8848' },
				{ cache: '2', rate: '.9149' },
				{ cache: '4', rate: '.9637' },
				{ cache: '8', rate: '.9823' },
				{ cache: '16', rate: '.9883' }
			]
		},
		{
			name: '4-Way Set (LRU)',
			values: [
				{ cache: '0.5', rate: '.8456' },
				{ cache: '1', rate: '.9207' },
				{ cache: '2', rate: '.9527' },
				{ cache: '4', rate: '.9733' },
				{ cache: '8', rate: '.9880' },
				{ cache: '16', rate: '.9909' }
			]
		},
		{
			name: '4-Way Set (FIFO)',
			values: [
				{ cache: '0.5', rate: '.8269' },
				{ cache: '1', rate: '.9098' },
				{ cache: '2', rate: '.9450' },
				{ cache: '4', rate: '.9667' },
				{ cache: '8', rate: '.9856' },
				{ cache: '16', rate: '.9895' }
			]
		},
		{
			name: '8-Way Set (LRU)',
			values: [
				{ cache: '0.5', rate: '.8506' },
				{ cache: '1', rate: '.9252' },
				{ cache: '2', rate: '.9627' },
				{ cache: '4', rate: '.9818' },
				{ cache: '8', rate: '.9889' },
				{ cache: '16', rate: '.9913' }
			]
		},
		{
			name: '8-Way Set (FIFO)',
			values: [
				{ cache: '0.5', rate: '.8203' },
				{ cache: '1', rate: '.9110' },
				{ cache: '2', rate: '.9549' },
				{ cache: '4', rate: '.9769' },
				{ cache: '8', rate: '.9862' },
				{ cache: '16', rate: '.9899' }
			]
		},
		{
			name: 'Fully Associative (LRU)',
			values: [
				{ cache: '0.5', rate: '.8506' },
				{ cache: '1', rate: '.9260' },
				{ cache: '2', rate: '.9627' },
				{ cache: '4', rate: '.9834' },
				{ cache: '8', rate: '.9897' },
				{ cache: '16', rate: '.9914' }
			]
		},
		{
			name: 'Fully Associative (FIFO)',
			values: [
				{ cache: '0.5', rate: '.8203' },
				{ cache: '1', rate: '.9142' },
				{ cache: '2', rate: '.9556' },
				{ cache: '4', rate: '.9783' },
				{ cache: '8', rate: '.9869' },
				{ cache: '16', rate: '.9901' }
			]
		}
	];

	onMount(() => {
		var width = 920 * 0.5614;
		var height = 475 * 0.5614;
		var margin = 50;
		var duration = 0;

		var lineOpacity = '0.25';
		var lineOpacityHover = '0.85';
		var otherLinesOpacityHover = '0.1';
		var lineStroke = '3px';
		var lineStrokeHover = '5px';

		var circleOpacity = '0.85';
		var circleOpacityOnLineHover = '1';
		var circleRadius = 6;
		var circleRadiusHover = 9;

		/* Format Data */
		var parseDate = d3.timeParse('%Y');
		data.forEach(function (d) {
			d.values.forEach(function (d) {
				d.cache = d.cache;
				d.rate = d.rate;
			});
		});

		/* Scale */
		// xScale doubles every time
		var xScale = d3
			.scaleLog()
			.domain([0.5, 16])
			.range([0, width - margin - 200])
			.base(2);

		// var xScale = d3
		// 	.scaleLinear()
		// 	.domain([0, 16])
		// 	.range([0, width - margin]);

		var yScale = d3
			.scaleLinear()
			.domain([0.7, 1])
			.range([height - margin, 0]);

		let xAxisGenerator = d3.axisBottom(xScale).tickFormat(d3.format('d'));

		var color = d3.scaleOrdinal(d3.schemeCategory10);

		/* Add SVG */
		var svg = d3
			.select('#chart')
			.append('svg')
			.attr('width', width + margin + 'px')
			.attr('height', height + margin + 'px')
			.append('g')
			.attr('transform', `translate(${margin}, ${margin})`);
		//.call(xAxisGenerator);

		/* Add line into SVG */
		var line = d3
			.line()
			.x((d) => xScale(d.cache))
			.y((d) => yScale(d.rate));

		// append xAxis
		// svg
		// 	.append('g')
		// 	.attr('class', 'x axis')
		// 	.attr('transform', `translate(0, ${height - margin})`)
		// 	.call(xAxisGenerator);

		let lines = svg.append('g').attr('class', 'lines');

		let colours = ['red', 'green', 'blue', 'orange', 'grey', 'black', 'pink', 'gold', 'magenta'];

		lines
			.selectAll('.line-group')
			.data(data)
			.enter()
			.append('g')
			.attr('class', 'line-group')
			.on('mouseover', function (d, i) {
				svg
					.append('text')
					.attr('class', 'title-text')
					.style('fill', color(i))
					.text(d.name)
					.attr('text-anchor', 'middle')
					.attr('x', width - margin / 2)
					.attr('y', 5);
			})
			.on('mouseout', function (d) {
				svg.select('.title-text').remove();
			})
			.append('path')
			.attr('class', 'line')
			.attr('d', (d) => {
				//console.log(d);
				return line(d.values);
			})
			.attr('fill', 'none')
			.attr('stroke-width', lineStroke)
			.style('stroke', (d, i) => colours[i])
			.style('opacity', lineOpacity)
			.on('mouseover', function (d) {
				d3.selectAll('.line').style('opacity', otherLinesOpacityHover);
				d3.selectAll('.circle').style('opacity', circleOpacityOnLineHover);
				d3.select(this)
					.style('opacity', lineOpacityHover)
					.style('stroke-width', lineStrokeHover)
					.style('cursor', 'pointer');
			})
			.on('mouseout', function (d) {
				d3.selectAll('.line').style('opacity', lineOpacity);
				d3.selectAll('.circle').style('opacity', circleOpacity);
				d3.select(this).style('stroke-width', lineStroke).style('cursor', 'none');
			});

		/* Add circles in the line */
		lines
			.selectAll('circle-group')
			.data(data)
			.enter()
			.append('g')
			.style('fill', (d, i) => colours[i])
			.selectAll('circle')
			.data((d) => {
				//console.log(d.values);
				return d.values;
			})
			.enter()
			.append('g')
			.attr('class', 'circle')
			.on('mouseover', function (d, i) {
				//console.log(i);
				d3.select(this)
					.style('cursor', 'pointer')
					.append('text')
					.attr('class', 'text')
					.attr('fill', 'black')
					// text is hit rate turned into perctenage rounded to 2 decimals
					.text(`${(i.rate * 100).toFixed(2)}%`)
					// .text(`Hit Rate: ${i.rate * 100}%`)
					.attr('x', (d) => xScale(i.cache) + 5)
					.attr('y', (d) => yScale(i.rate) - 10);
			})
			.on('mouseout', function (d) {
				d3.select(this)
					.style('cursor', 'none')
					.transition()
					.duration(duration)
					.selectAll('.text')
					.remove();
			})
			.append('circle')
			.attr('cx', (d) => xScale(d.cache))
			.attr('cy', (d) => yScale(d.rate))
			.attr('r', circleRadius)
			.style('opacity', circleOpacity)
			.on('mouseover', function (d) {
				d3.select(this).transition().duration(duration).attr('r', circleRadiusHover);
			})
			.on('mouseout', function (d) {
				d3.select(this).transition().duration(duration).attr('r', circleRadius);
			});

		let ticks = ['512 MB', '1 KB', '2 KB', '4 KB', '8 KB', '16 KB'];
		/* Add Axis into SVG */
		var xAxis = d3
			.axisBottom(xScale)
			.ticks(5)
			// large ticks
			.tickSize(10)
			// large tick font
			.tickValues([0.5, 1, 2, 4, 8, 16])
			// format in kilobytes
			.tickFormat((d, i) => {
				return ticks[i];
			});
		// var xAxis = d3.axisBottom(xScale).ticks(5);
		var yAxis = d3
			.axisLeft(yScale)
			.ticks(9)
			.tickValues([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1])
			.tickFormat((d) => `${d * 100}%`);

		svg
			.append('g')
			.attr('class', 'x axis')
			.attr('transform', `translate(0, ${height - margin})`)
			.style('font-size', '16px')
			.call(xAxis);

		svg
			.append('g')
			.attr('class', 'y axis')
			.style('font-size', '16px')
			.call(yAxis)
			.append('text')
			.attr('y', 20);

		// append legend markers
		for (let i = 0; i < data.length; i++) {
			svg
				.append('circle')
				.attr('cx', width - 220)
				.attr('cy', i * 21 + 20)
				.attr('r', 6)
				.style('fill', colours[i])
				.style('stroke', 'black');
			svg
				.append('text')
				.attr('x', width - 210)
				.attr('y', i * 21 + 21)
				.text(data[i].name)
				.style('font-size', '15px')
				.attr('alignment-baseline', 'middle');
		}

		// append graph title
		svg
			.append('text')
			.attr('x', width / 3.75)
			.attr('y', height - 75)
			.attr('text-anchor', 'middle')
			.style('font-size', '16px')
			.text('Hit Rate vs Cache Size');
		svg
			.append('text')
			.attr('x', width / 3.75)
			.attr('y', height - 60)
			.attr('text-anchor', 'middle')
			.style('font-size', '12px')
			.text('(gcc.trace)');

		// svg
		// 	.append('rect')
		// 	.attr('x', width - margin / 2 - 10 - 100)
		// 	.attr('y', 20)
		// 	.attr('width', 10)
		// 	.attr('height', 10)
		// 	.style('fill', colours[1]);
		// svg
		// 	.append('text')
		// 	.attr('x', width - margin / 2 + 3 - 100)
		// 	.attr('y', 27)
		// 	.text('L2')
		// 	.style('font-size', '12px')
		// 	.attr('alignment-baseline', 'middle');
	});
</script>

<main>
	<div id="chart" />
</main>

<style>
	#chart {
		width: 50%;
		height: 50%;
	}

	#chart > svg {
		width: 100%;
		height: 100%;
	}

	svg {
		font-family: Sans-Serif, Arial;
	}
	.line {
		stroke-width: 2;
		fill: none;
	}

	.axis path {
		stroke: black;
	}

	.text {
		font-size: 12px;
	}

	.title-text {
		font-size: 12px;
	}
</style>

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface ChartProps {
	data: any[]
	showOnChart: string
	aggregator: string
}

const Chart = ({ data, showOnChart, aggregator }: ChartProps) => {
	const d3Container = useRef<SVGSVGElement>(null)

	const width = 1500
	const height = 1000
	const marginTop = 20
	const marginRight = 20
	const marginBottom = 30
	const marginLeft = 30
	const animationDuration = 3000

	useEffect(() => {
		if (d3Container.current) {
			let resData = []

			const groupX = d3.group(data, d => d.year)
			const axesXData = groupX.keys()
			for (const axesXItem of axesXData) {
				const groupY = d3.group(groupX.get(axesXItem), d => d[showOnChart])
				const axesYData = groupY.keys()
				for (const axesYItem of axesYData) {
					const viewData = d3[aggregator](
						groupY.get(axesYItem),
						d => d.globalSales
					)
					resData.push({ axesXItem, axesYItem, viewData })
				}
			}

			const svg = d3.select(d3Container.current)

			const xScale = d3
				.scaleBand()
				.domain(d3.group(resData, d => d.axesXItem).keys())
				.range([marginLeft, width - marginRight])
				.padding(1)

			const yScale = d3
				.scaleLinear()
				.domain(d3.extent(resData, d => d.viewData))
				.range([height - marginBottom, marginTop])

			// отрисованная ось x
			svg
				.selectAll('g.x-axis')
				.data([null])
				.join(
					enter =>
						enter
							.append('g')
							.attr('class', 'x-axis')
							.attr('transform', `translate(0, ${height - marginBottom})`),
					update =>
						update
							.attr('transform', `translate(0, ${height - marginBottom})`)
							.transition()
							.duration(animationDuration)
				)
				.call(d3.axisBottom(xScale))

			// отрисованная ось y
			svg
				.selectAll('g.y-axis')
				.data([null])
				.join(
					enter =>
						enter
							.append('g')
							.attr('class', 'y-axis')
							.attr('transform', `translate(${marginLeft}, 0)`),
					update =>
						update
							.transition()
							.duration(animationDuration)
							.attr('transform', `translate(${marginLeft}, 0)`)
				)
				.call(d3.axisLeft(yScale))

			function makeXGridlines() {
				return d3
					.axisBottom(xScale)
					.tickSize(-height + marginTop + marginBottom)
					.tickFormat('')
			}

			function makeYGridlines() {
				return d3
					.axisLeft(yScale)
					.tickSize(-width + marginLeft + marginRight)
					.tickFormat('')
			}

			if (d3.select('.x-grid').empty()) {
				// Добавление сетки оси X
				svg
					.append('g')
					.attr('class', 'x-grid')
					.attr('transform', `translate(0,${height - marginBottom})`)
					.call(makeXGridlines())
					.selectAll('.tick line')
					.attr('stroke-opacity', 0.1)

				// Добавление сетки оси Y
				svg
					.append('g')
					.attr('class', 'y-grid')
					.attr('transform', `translate(${marginLeft},0)`)
					.call(makeYGridlines())
					.selectAll('.tick line')
					.attr('stroke-opacity', 0.1)
			} else {
				updateGrid()
			}

			function updateGrid() {
				svg
					.select('.x-grid')
					.transition()
					.duration(animationDuration)
					.call(makeXGridlines())
					.selectAll('.tick line')
					.attr('stroke-opacity', 0.1)

				svg
					.select('.y-grid')
					.transition()
					.duration(animationDuration)
					.call(makeYGridlines())
					.selectAll('.tick line')
					.attr('stroke-opacity', 0.1)
			}

			const points = resData.map(d => [
				xScale(d.axesXItem),
				yScale(d.viewData),
				d.axesYItem
			])
			const groups = d3.rollup(
				points,
				v => Object.assign(v, { z: v[0][2] }),
				d => d[2]
			)

			// отрисованные линии
			const line = d3.line()
			const linesGroup = svg
				.selectAll('g.lines')
				.data([null])
				.join('g')
				.attr('class', 'lines')

			const path = linesGroup
				.selectAll('path')
				.data(groups.values())
				.join(
					enter =>
						enter
							.append('path')
							.attr('class', 'line')
							.attr('fill', 'none')
							.attr('stroke', 'steelblue')
							.attr('stroke-width', 1.5)
							.attr('stroke-linejoin', 'round')
							.attr('stroke-linecap', 'round')
							.style('mix-blend-mode', 'multiply')
							.attr('d', line),
					update =>
						update.transition().duration(animationDuration).attr('d', line),
					exit => exit.transition().duration(animationDuration).remove()
				)

			const dot = svg.append('g').attr('display', 'none')
			dot.append('circle').attr('r', 2.5)
			dot.append('text').attr('text-anchor', 'middle').attr('y', -8)

			svg
				.on('pointerenter', pointerEntered)
				.on('pointermove', pointerMoved)
				.on('pointerleave', pointerLeft)
				.on('touchstart', event => event.preventDefault())

			function pointerMoved(event) {
				const [xm, ym] = d3.pointer(event)
				const i = d3.leastIndex(points, ([x, y]) => Math.hypot(x - xm, y - ym))
				const [x, y, k] = points[i]
				path
					.style('stroke', ({ z }) => (z === k ? null : '#ddd'))
					.filter(({ z }) => z === k)
					.raise()
				dot.attr('transform', `translate(${x},${y})`)
				dot.select('text').text(k)
				svg.property('value', resData[i]).dispatch('input', { bubbles: true })
			}

			function pointerEntered() {
				path.style('mix-blend-mode', null).style('stroke', '#ddd')
				dot.attr('display', null)
			}

			function pointerLeft() {
				path.style('mix-blend-mode', 'multiply').style('stroke', null)
				dot.attr('display', 'none')
				svg.node().value = null
				svg.dispatch('input', { bubbles: true })
			}
		}
	}, [data])

	return <svg width={width} height={height} ref={d3Container}></svg>
}

export default Chart

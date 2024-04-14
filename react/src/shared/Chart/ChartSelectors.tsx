import React from 'react'

interface ChartSelectorsProps {
	onClickShowOnChart: (e) => void
	onClickAggregation: (e) => void
}

const ChartSelectors = ({
	onClickShowOnChart,
	onClickAggregation
}: ChartSelectorsProps) => {
	return (
		<div>
			<h3>Показывать на графике:</h3>
			<select name='showOnChart' id='showOnChart' onChange={onClickShowOnChart}>
				<option value='genre'>Жанр</option>
				<option value='publisher'>Издатель</option>
				<option value='platform'>Платформа</option>
			</select>
			<h3>Аггрегатор:</h3>
			<select name='showOnChart' id='showOnChart' onChange={onClickAggregation}>
				<option value='sum'>Сумма</option>
				<option value='min'>Минимум</option>
				<option value='max'>Максимум</option>
				<option value='mean'>Среднее</option>
			</select>
		</div>
	)
}

export default ChartSelectors

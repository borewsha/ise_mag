import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'
import { DataCustomNameByField } from '@/types/DataCustomNameByField'
import PaginationTable from '@/shared/PaginationTable/PaginationTable'
import Filters from '@/shared/Filters/Filters'
import Sorters, { ISorters } from '@/shared/Sorters/Sorters'
import Chart from '@/shared/Chart/Chart'
import ChartSelectors from '@/shared/Chart/ChartSelectors'

export type FilterObject<Type> = {
	[key in keyof Type]?: string[]
}

const VideoGamesTable = () => {
	const [data, setData] = useState<Game[]>([])
	const [displayedData, setDisplayedData] = useState<Game[]>(data)
	const [selectedFilters, setSelectedFilters] = useState<FilterObject<Game>>({})
	const [sorters, setSorters] = useState<ISorters<Game, keyof Game>[]>([
		{
			key: 'year',
			name: 'Сортировка по Году',
			sorting: 'ns'
		},
		{
			key: 'genre',
			name: 'Сортировка по Жанру',
			sorting: 'ns'
		},
		{
			key: 'platform',
			name: 'Сортировка по Платформе',
			sorting: 'ns'
		}
	])
	const [showOnChart, setShowOnChart] = useState<string>('genre')
	const [aggregator, setAggregator] = useState<string>('sum')

	useEffect(() => {
		d3.csv('vgsales.csv', res => {
			if (res.Year !== 'N/A' && res.Publisher !== 'N/A') {
				return {
					id: +res.Rank,
					name: res.Name,
					platform: res.Platform,
					year: res.Year,
					genre: res.Genre,
					publisher: res.Publisher,
					globalSales: +res.Global_Sales
				} as Game
			}
		}).then(data => {
			setData(data)
			setDisplayedData(data)
		})
	}, [])

	const columns: DataCustomNameByField<Game, keyof Game>[] = [
		{
			key: 'id',
			name: 'ID'
		},
		{
			key: 'name',
			name: 'Название'
		},
		{
			key: 'year',
			name: 'Год издания'
		},
		{
			key: 'publisher',
			name: 'Издатель'
		},
		{
			key: 'platform',
			name: 'Платформа'
		},
		{
			key: 'genre',
			name: 'Жанр'
		},
		{
			key: 'globalSales',
			name: 'Продажи (млн. шт.)'
		}
	]

	const filters: DataCustomNameByField<Game, keyof Game>[] = [
		{
			key: 'publisher',
			name: 'Фильтр по Издателю'
		},
		{
			key: 'platform',
			name: 'Фильтр по Платформе'
		},
		{
			key: 'genre',
			name: 'Фильтр по Жанру'
		},
		{
			key: 'year',
			name: 'Фильтр по Году'
		}
	]

	const chainSortBy = sortByArray => {
		return (a, b) => {
			for (let i = 0; i < sortByArray.length; i++) {
				const res = sortByArray[i](a, b)
				if (res != 0) {
					return res
				}
			}
			return 0
		}
	}

	const sortBy = (field: keyof Game, reverse: number) => {
		const key = x => x[field]
		reverse = [-1, 1][+!!reverse]
		return (a, b) => {
			a = key(a)
			b = key(b)
			return a == b ? 0 : reverse * ((a > b) - (b > a))
		}
	}

	return (
		<>
			<div style={{ display: 'flex' }}>
				<Filters
					data={data}
					selectedFilters={selectedFilters}
					filters={filters}
					setSelectedFilters={setSelectedFilters}
				/>
				<Sorters sorters={sorters} setSorters={setSorters} />
				<ChartSelectors
					onClickShowOnChart={e => {
						setShowOnChart(e.target.value)
					}}
					onClickAggregation={e => {
						setAggregator(e.target.value)
					}}
				/>
				<button
					style={{ height: '50px', width: '100px' }}
					onClick={() => {
						let filtered = Array.from(data)
						for (const selectedFiltersKey in selectedFilters) {
							const values = selectedFilters[selectedFiltersKey]
							if (values.length > 0) {
								filtered = filtered.filter(item =>
									values.includes(item[selectedFiltersKey])
								)
							}
						}
						let sortData = []
						sorters.forEach(s => {
							if (s.sorting === 'asc') {
								sortData.push(sortBy(s.key, 1))
							}
							if (s.sorting === 'desc') {
								sortData.push(sortBy(s.key, 0))
							}
						})
						let sorted = filtered.sort(chainSortBy(sortData))
						setDisplayedData(sorted)
					}}
				>
					Показать
				</button>
			</div>
			<Chart
				data={displayedData}
				showOnChart={showOnChart}
				aggregator={aggregator}
			/>
			<PaginationTable
				data={displayedData}
				columns={columns}
				itemsOnPage={15}
			/>
		</>
	)
}

export default VideoGamesTable

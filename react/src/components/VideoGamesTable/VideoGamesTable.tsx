import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'
import { DataCustomNameByField } from '@/types/DataCustomNameByField'
import PaginationTable from '@/shared/PaginationTable/PaginationTable'
import Filters from '@/shared/Filters/Filters'
import Sorters, { ISorters } from '@/shared/Sorters/Sorters'

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
				<button
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
						let sorted = filtered
						console.log(sorters)
						setDisplayedData(filtered)
					}}
				>
					Показать
				</button>
			</div>
			<PaginationTable
				data={displayedData}
				columns={columns}
				itemsOnPage={15}
			/>
		</>
	)
}

export default VideoGamesTable

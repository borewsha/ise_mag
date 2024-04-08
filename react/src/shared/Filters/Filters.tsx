import React, { ReactNode } from 'react'
import Filter from '@/shared/Filter/Filter'
import { DataCustomNameByField } from '@/types/DataCustomNameByField'
import { FilterObject } from '@/components/VideoGamesTable/VideoGamesTable'

interface FiltersProps<Type, Key extends keyof Type> {
	data: Type[]
	selectedFilters: FilterObject<Type>
	filters: DataCustomNameByField<Type, Key>[]
	setSelectedFilters: (filter: FilterObject<Type>) => void
}

const Filters = <Type, Key extends keyof Type>({
	data,
	selectedFilters,
	filters,
	setSelectedFilters
}: FiltersProps<Type, Key>): ReactNode => {
	return (
		<>
			{filters.map(f => (
				<Filter
					key={f.key as string}
					title={f.name}
					data={Array.from(new Set(data.map(d => d[f.key]))).sort()}
					onChangeHandler={e => {
						const selectedValues: string[] = []
						for (const option of e.currentTarget.selectedOptions) {
							selectedValues.push(option.value)
						}
						const newState = {
							...selectedFilters,
							[f.key]: selectedValues
						}
						setSelectedFilters(newState)
					}}
				/>
			))}
		</>
	)
}

export default Filters

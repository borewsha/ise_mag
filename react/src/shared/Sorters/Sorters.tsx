import React from 'react'
import { DataCustomNameByField } from '@/types/DataCustomNameByField'
import Sorter from '@/shared/Sorter/Sorter'

export interface ISorters<Type, Key extends keyof Type>
	extends DataCustomNameByField<Type, Key> {
	sorting: 'asc' | 'desc' | 'ns'
}

export interface SortersProps<Type, Key extends keyof Type> {
	sorters: ISorters<Type, Key>[]
	setSorters: (sorters: ISorters<Type, Key>[]) => void
}

const Sorters = <Type, Key extends keyof Type>({
	sorters,
	setSorters
}: SortersProps<Type, Key>) => {
	const moveItem = (currentIndex: number, direction: 'up' | 'down') => {
		if (direction === 'up' && currentIndex > 0) {
			const newItems = [...sorters]
			;[newItems[currentIndex], newItems[currentIndex - 1]] = [
				newItems[currentIndex - 1],
				newItems[currentIndex]
			]
			setSorters(newItems)
		} else if (direction === 'down' && currentIndex < sorters.length - 1) {
			const newItems = [...sorters]
			;[newItems[currentIndex], newItems[currentIndex + 1]] = [
				newItems[currentIndex + 1],
				newItems[currentIndex]
			]
			setSorters(newItems)
		}
	}

	const editItem = (index: number, newSorting: 'asc' | 'desc' | 'ns') => {
		const newItems = [...sorters]
		newItems[index].sorting = newSorting
		setSorters(newItems)
	}

	return (
		<div>
			{sorters.map(({ key, name, sorting }, index) => (
				<Sorter
					onMoveDown={() => moveItem(index, 'down')}
					onMoveUp={() => moveItem(index, 'up')}
					key={key as string}
					keyName={key}
					name={name}
					sorting={sorting}
					onClick={editItem}
					index={index}
				/>
			))}
		</div>
	)
}

export default Sorters

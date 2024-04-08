import React from 'react'

interface SorterProps<Type, Key extends keyof Type> {
	keyName: Key
	name: string
	onMoveUp: () => void
	onMoveDown: () => void
	sorting: 'asc' | 'desc' | 'ns'
	onClick: (index: number, newSorting: 'asc' | 'desc' | 'ns') => void
	index: number
}

const Sorter = <Type, Key extends keyof Type>({
	keyName,
	name,
	onMoveUp,
	onMoveDown,
	sorting,
	onClick,
	index
}: SorterProps<Type, Key>) => {
	const setChecked = e => {
		onClick(index, e.target.value)
	}

	return (
		<div style={{ display: 'flex' }}>
			<button className='up-button' onClick={onMoveUp}>
				↑
			</button>
			<button className='down-button' onClick={onMoveDown}>
				↓
			</button>
			<span>{name}</span>
			<label htmlFor={(keyName as string) + 'Asc'}>По возрастанию</label>
			<input
				type='radio'
				value='asc'
				name={(keyName as string) + 'Asc'}
				checked={sorting === 'asc'}
				onClick={setChecked}
			/>
			<label htmlFor={(keyName as string) + 'Desc'}>По убыванию</label>
			<input
				type='radio'
				value='desc'
				name={(keyName as string) + 'Desc'}
				checked={sorting === 'desc'}
				onClick={setChecked}
			/>
			<label htmlFor={(keyName as string) + 'Ns'}>Не сортировать</label>
			<input
				type='radio'
				value='ns'
				name={(keyName as string) + 'Ns'}
				checked={sorting === 'ns'}
				onClick={setChecked}
			/>
		</div>
	)
}

export default Sorter

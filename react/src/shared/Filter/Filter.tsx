import React, { ChangeEvent, ReactNode } from 'react'

interface FilerProps<Type> {
	title: string
	data: Type[]
	onChangeHandler: (e: ChangeEvent<HTMLSelectElement>) => void
}

const Filter = <Type,>({ data, title, onChangeHandler }: FilerProps<Type>) => {
	return (
		<div>
			<h3>{title}</h3>
			<select multiple size={20} onChange={onChangeHandler}>
				{data.map(value => (
					<option key={value as string} value={value as string}>
						{value as ReactNode}
					</option>
				))}
			</select>
		</div>
	)
}

export default Filter

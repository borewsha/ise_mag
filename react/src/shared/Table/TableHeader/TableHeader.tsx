import React, { ReactNode } from 'react'
import { TableHeaderProps } from '@/shared/Table/TableTypes'
import s from './TableHeader.module.css'

const TableHeader = <Type, Key extends keyof Type>({
	columns
}: TableHeaderProps<Type, Key>): ReactNode => {
	return (
		<thead className={s.tableHead}>
			<tr>
				{(columns || []).map(({ name }, index) => (
					<th key={`headerCell${index}`}>{name}</th>
				))}
			</tr>
		</thead>
	)
}

export default TableHeader

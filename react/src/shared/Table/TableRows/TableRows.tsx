import React, { ReactNode } from 'react'
import { TableRowsProps } from '@/shared/Table/TableTypes'
import s from './TableRows.module.css'

const TableRows = <Type, Key extends keyof Type>({
	data,
	columns
}: TableRowsProps<Type, Key>): ReactNode => {
	return (
		<tbody className={s.tableBody}>
			{data.map((row, index) => (
				<tr key={`row${index}`}>
					{columns.map(({ key }) => (
						<td key={`${key.toString() + index}`}>{row[key] as ReactNode}</td>
					))}
				</tr>
			))}
		</tbody>
	)
}

export default TableRows

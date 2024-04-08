import React, { ReactNode } from 'react'
import { TableProps } from '@/shared/Table/TableTypes'
import TableHeader from '@/shared/Table/TableHeader/TableHeader'
import TableRows from '@/shared/Table/TableRows/TableRows'
import s from './Table.module.css'

const Table = <Type, Key extends keyof Type>({
	data,
	columns
}: TableProps<Type, Key>): ReactNode => {
	return (
		<table className={s.table}>
			<TableHeader columns={columns} />
			<TableRows data={data} columns={columns} />
		</table>
	)
}

export default Table

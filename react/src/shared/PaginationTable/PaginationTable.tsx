import { ReactNode, useEffect, useState } from 'react'
import Table from '@/shared/Table/Table'
import { TableProps } from '@/shared/Table/TableTypes'

interface PaginationTableProps<Type, Key extends keyof Type>
	extends TableProps<Type, Key> {
	itemsOnPage: number
}

const PaginationTable = <Type, Key extends keyof Type>({
	data,
	columns,
	itemsOnPage
}: PaginationTableProps<Type, Key>): ReactNode => {
	const allPages = Math.ceil(data.length / itemsOnPage)
	const [currentPage, setCurrentPage] = useState<number>(0)
	const [displayedData, setDisplayedData] = useState<typeof data>([])

	useEffect(() => {
		setDisplayedData(
			data.slice(
				itemsOnPage * currentPage,
				itemsOnPage * currentPage + itemsOnPage
			)
		)
	}, [currentPage])

	useEffect(() => {
		setDisplayedData(
			data.slice(
				itemsOnPage * currentPage,
				itemsOnPage * currentPage + itemsOnPage
			)
		)
		setCurrentPage(0)
	}, [data])

	return (
		<>
			<button
				disabled={currentPage === 0}
				onClick={() => setCurrentPage(prev => prev - 1)}
			>
				Предыдущая страница
			</button>
			<button
				disabled={currentPage === allPages - 1}
				onClick={() => setCurrentPage(prev => prev + 1)}
			>
				Следующая страница
			</button>
			<p>Всего страниц: {allPages}</p>
			<p>Текущая страница: {currentPage + 1}</p>
			<Table data={displayedData} columns={columns} />
		</>
	)
}

export default PaginationTable

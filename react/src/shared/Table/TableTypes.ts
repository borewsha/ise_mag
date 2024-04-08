import { DataCustomNameByField } from '@/types/DataCustomNameByField'

export interface TableProps<Type, Key extends keyof Type> {
	data: Type[]
	columns: DataCustomNameByField<Type, Key>[]
}

export interface TableHeaderProps<Type, Key extends keyof Type> {
	columns: DataCustomNameByField<Type, Key>[]
}

export interface TableRowsProps<Type, Key extends keyof Type> {
	data: Type[]
	columns: DataCustomNameByField<Type, Key>[]
}

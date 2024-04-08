export interface DataCustomNameByField<Type, Key extends keyof Type> {
	key: Key
	name: string
}

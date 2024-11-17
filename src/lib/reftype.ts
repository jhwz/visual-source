type Primitive = string | number | boolean | null | undefined;

type DeepKeyof<T> = T extends Primitive
	? never
	: T extends Array<infer U>
		? [number] | [number, ...DeepKeyof<U>]
		: T extends object
			? {
					[K in keyof T]: K extends string | number ? [K] | [K, ...DeepKeyof<T[K]>] : never;
				}[keyof T]
			: never;

type DeepPath<T> = DeepKeyof<T> extends (string | number)[] ? Join<DeepKeyof<T>> : never;

type Join<T extends (string | number)[]> = T extends []
	? never
	: T extends [infer F]
		? F
		: T extends [infer F, ...infer R]
			? F extends string | number
				? R extends (string | number)[]
					? `${F}${R extends [] ? '' : '/'}${Join<R>}`
					: never
				: never
			: string;

type RecursiveOmit<T, K extends string | number | symbol> = T extends Primitive
	? T
	: T extends Array<infer U>
		? Array<RecursiveOmit<U, K>>
		: T extends Map<infer KMap, infer VMap>
			? Map<RecursiveOmit<KMap, K>, RecursiveOmit<VMap, K>>
			: T extends Set<infer SType>
				? Set<RecursiveOmit<SType, K>>
				: {
						[P in Exclude<keyof T, K>]: RecursiveOmit<T[P], K>;
					};

export type $RefType<T extends Record<string, unknown>> = `#/${DeepPath<RecursiveOmit<T, '$ref'>>}`;

export function resolve_ref<T extends Record<string, unknown>>(spec: T, ref: $RefType<T>): unknown {
	const path = ref.slice(2).split('/');
	let obj: any = spec;
	for (const key of path) {
		obj = obj[key];
	}
	return obj;
}

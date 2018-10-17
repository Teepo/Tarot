/* @flow */

export async function asyncMap(array : Array<any>, callback : Function) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

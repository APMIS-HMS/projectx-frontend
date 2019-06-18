export class ArrayFunctionHelper {
    getIndexofObjectInArray(items, query): number {
		for (let i = 0; i < items.length; i++) {
				if (items[i]._id === query) { return i; } else {
			}
		}
	}
}

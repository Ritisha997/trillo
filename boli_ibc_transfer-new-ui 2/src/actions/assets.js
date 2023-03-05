export const setAssetList = (list) => {
	const assetHashMap = list.reduce((map, obj) => {
		map[obj?.denom] = obj;
		return map;
	}, {});

	return {
		type: 'SET_ASSET_LIST',
		list,
		map: assetHashMap,
	};
};

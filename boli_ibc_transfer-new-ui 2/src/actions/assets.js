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

export const fetchProofHeight = (rest, channel, callback) => {
	let url = `${rest}/ibc/core/channel/v1/channels/${channel}/ports/transfer`;
	const headers = {
		"Content-Type": "application/json",
	};

	axios
		.get(url, {
			headers,
		})
		.then((response) => {
			callback(null, response.data?.proof_height);
		})
		.catch((error) => {
			message.error(error?.message);
			callback(error?.message);
		});
};
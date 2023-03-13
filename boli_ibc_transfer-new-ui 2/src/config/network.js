import { envConfig } from "./envConfig";
import AssetList from "../config/ibc_assets.json";


const getIbcDenomsMap = () => {
	let myMap = {};

	for (let i = 0; i < AssetList?.tokens?.length; i++) {
		if (myMap[AssetList?.tokens[i].coinMinimalDenom] === undefined) {
			myMap[AssetList?.tokens[i].coinMinimalDenom] =
				AssetList?.tokens[i]?.ibcDenomHash;
		}
	}

	return myMap;
};

export const boli = {
    chainId: "",
    chainName: "",
    rpc: "",
    rest: "",
    explorerUrlToTx: "",
    walletUrlForStaking: "",
    coinGeckoId: "",
    coinDenom: "BOLI",
    coinMinimalDenom: "uboli",
    coinDecimals: 6,
    prefix: "boli",
    coinType: 118,
};

export const comdex = {
	chainId: envConfig?.chainId,
	chainName: envConfig?.chainName,
	rpc: envConfig?.rpc,
	rest: envConfig?.rest,
	explorerUrlToTx: envConfig?.explorerUrlToTx,
	walletUrlForStaking: envConfig?.comdexStakingUrl,
	coinGeckoId: envConfig?.coinGeckoId,
	coinDenom: envConfig?.coinDenom,
	coinMinimalDenom: envConfig?.coinMinimalDenom,
	coinDecimals: envConfig?.coinDecimals,
	prefix: envConfig?.prefix,
	coinType: envConfig?.coinType,
	symbol: envConfig?.symbol,
	networkTag: envConfig?.networkTag,
	webSocketApiUrl: envConfig?.webSocketApiUrl,
};

export const harbor = {
	coinDenom: "HARBOR",
	coinMinimalDenom: "uharbor",
	coinDecimals: 6,
	symbol: "HARBOR",
};

export const ibcDenoms = getIbcDenomsMap() || {};
export const envConfig = {
	chainId: "boli-1",
	chainName: "Boli Hub",
	rpc: "http://52.194.247.216:26657/",
	rest: "http://52.194.247.216:1317/",
	explorerUrlToTx: "https://www.mintscan.io/persistence/txs/{txHash}",
	coinDenom: "BOLI",
	coinMinimalDenom: "uboli",
	coinDecimals: 6,
	prefix: "boli",
	coinType: 118,
};

// export const envConfig = {
// 	chainId: process.env.REACT_APP_CHAIN_ID,
// 	chainName: process.env.REACT_APP_CHAIN_NAME,
// 	rpc: process.env.REACT_APP_RPC,
// 	rest: process.env.REACT_APP_REST,
// 	explorerUrlToTx: process.env.REACT_APP_EXPLORER_URL_TO_TX,
// 	walletUrlForStaking: process.env.REACT_APP_COMDEX_STAKING_URL,
// 	// coinGeckoId: "",
// 	coinDenom: "BOLI",
// 	coinMinimalDenom: "uboli",
// 	coinDecimals: 6,
// 	prefix: "boli",
// 	coinType: 118,
// };


export const tokenCoinGeckoIds = [
	"cosmos",
	"terra-luna",
	"ki",
	"comdex",
	"kava",
	"sentinel",
	"osmosis",
	"juno-network",
	"akash-network",
	"umee",
	"mantle",
	"persistence",
	"chihuahua-token",
	"secret",
	"injective-protocol",
];
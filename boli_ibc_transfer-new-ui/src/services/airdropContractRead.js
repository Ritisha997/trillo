import { CosmWasmClient } from "cosmwasm";
import { comdex } from "../config/network";
import { airdropContractAddress } from "./keplr";


const configin = {
	chainId: comdex?.chainId,
	rpcEndpoint: comdex?.rpc,
	prefix: comdex?.prefix,
};

export const checkEligibility = async (address, chainId) => {
	const client = await CosmWasmClient.connect(configin.rpcEndpoint);
	const config = await client.queryContractSmart(airdropContractAddress, {
		airdrop: { address: address, chain_id: chainId },
	});
	return await config;
};

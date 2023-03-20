import { SigningStargateClient } from "@cosmjs/stargate";
import { comdex } from "../config/network";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { QueryClient, createProtobufRpcClient } from "@cosmjs/stargate";
import { trimWhiteSpaces } from "../utils/string";
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";


export const MsgSendTokens = (
	userAddress,
	receiverAddress,
	currentChain,
	amount
) => {
	return {
		typeUrl: "/cosmos.bank.v1beta1.MsgSend",
		value: MsgSend.fromPartial({
			fromAddress: trimWhiteSpaces(userAddress),
			toAddress: trimWhiteSpaces(receiverAddress),
			amount: [
				{
					denom: currentChain?.coinMinimalDenom,
					amount: String(amount),
				},
			],
		}),
	};
};


function Fee(amount, gas = 250000, network) {
	return {
		amount: [{ amount: String(amount), denom: network?.coinMinimalDenom }],
		gas: String(gas),
	};
}


export {
	Fee,
}



export const createQueryClient = (callback) => {
	return newQueryClientRPC(comdex.rpc, callback);
};

export const newQueryClientRPC = (rpc, callback) => {
	Tendermint34Client.connect(rpc)
		.then((tendermintClient) => {
			const queryClient = new QueryClient(tendermintClient);
			const rpcClient = createProtobufRpcClient(queryClient);
			callback(null, rpcClient);
		})
		.catch((error) => {
			callback(error?.message);
		});
};

export const KeplrWallet = async (chainID = comdex.chainId) => {
	await window.keplr.enable(chainID);
	const offlineSigner = await window.getOfflineSignerAuto(chainID);
	const accounts = await offlineSigner.getAccounts();
	return [offlineSigner, accounts];
};

export const signAndBroadcastMagicTransaction = (
	transaction,
	address,
	currentChain,
	callback
) => {

	return magicTransactionWithKeplr(
		transaction,
		address,
		currentChain,
		callback
	);
};

export const magicTransactionWithKeplr = async (
	transaction,
	address,
	currentChain,
	callback
) => {
	const [offlineSigner, accounts] = await KeplrWallet(currentChain?.chainId);
	if (address !== accounts[0].address) {
		const error = "Connected account is not active in Keplr";
		callback(error);
		return;
	}

	SigningStargateClient.connectWithSigner(currentChain.rpc, offlineSigner, {
		registry: myRegistry,
		aminoTypes: aminoTypes,
	})
		.then((client) => {
			client
				.signAndBroadcast(
					address,
					[transaction.message],
					transaction.fee,
					transaction.memo
				)
				.then((result) => {
					callback(null, result);
				})
				.catch((error) => {
					callback(error?.message);
				});
		})
		.catch((error) => {
			callback(error && error.message);
		});
};


export const aminoSignIBCTx = (config, transaction, callback) => {
	(async () => {
		(await window.keplr) && window.keplr.enable(config.chainId);
		const offlineSigner =
			window.getOfflineSignerOnlyAmino &&
			window.getOfflineSignerOnlyAmino(config.chainId);
		const client = await SigningStargateClient.connectWithSigner(
			config.rpc,
			offlineSigner
		);

		client
			.sendIbcTokens(
				transaction.msg?.value?.sender,
				transaction.msg?.value?.receiver,
				transaction.msg?.value?.token,
				transaction.msg?.value?.source_port,
				transaction.msg?.value?.source_channel,
				transaction.msg?.value?.timeout_height,
				transaction.msg?.value?.timeout_timestamp,
				transaction.fee,
				transaction.memo
			)
			.then((result) => {
				if (result?.code !== undefined && result.code !== 0) {
					callback(result.log || result.rawLog);
				} else {
					callback(null, result);
				}
			})
			.catch((error) => {
				callback(error?.message);
			});
	})();
};



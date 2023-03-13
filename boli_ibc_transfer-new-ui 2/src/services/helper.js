import { SigningStargateClient } from "@cosmjs/stargate";
import { comdex } from "../config/network";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { LedgerSigner } from "@cosmjs/ledger-amino";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { QueryClient, createProtobufRpcClient } from "@cosmjs/stargate";
import { AminoTypes } from "@cosmjs/stargate";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";


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
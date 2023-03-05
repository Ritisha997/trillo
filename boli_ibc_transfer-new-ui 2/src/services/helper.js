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
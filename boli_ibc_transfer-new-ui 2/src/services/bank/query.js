import { QueryClientImpl } from "cosmjs-types/cosmos/bank/v1beta1/query";
import { newQueryClientRPC, createQueryClient } from "../helper";

export const queryAllBalances = (owner, callback) => {
	createQueryClient((error, client) => {
		if (error) {
			callback(error);
			return;
		}

		const stakingQueryService = new QueryClientImpl(client);

		stakingQueryService
			.AllBalances({
				address: owner,
			})
			.then((result) => {
				callback(null, result);
			})
			.catch((error) => {
				callback(error?.message);
			});
	});
};
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { buildQuery } from "@cosmjs/tendermint-rpc/build/tendermint34/requests";
import { comdex } from "../config/network";



export const fetchTxHash = (hash, callback) => {
	Tendermint34Client.connect(comdex?.rpc)
		.then((tendermintClient) => {
			tendermintClient
				.tx({ hash })
				.then((res) => {
					callback(null, res);
					console.log(res);
				})
				.catch((error) => {
					callback(error && error.message);
				});
		})
		.catch((error) => {
			callback(error && error.message);
		});
};


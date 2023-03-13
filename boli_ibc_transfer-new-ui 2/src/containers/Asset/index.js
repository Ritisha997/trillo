import React, { useState } from 'react'
import { Button, Modal, Table } from 'antd';
import './index.scss';
import IBCDeposit from './Deposit';
import IBCWithdraw from './Withdraw';
import { getChainConfig } from '../../services/keplr';
import { comdex, harbor } from '../../config/network';
import AssetList from '../../config/ibc_assets.json'
import { connect, useDispatch } from "react-redux";
import Lodash from "lodash";
import { fetchTxHash } from '../../services/transaction';
import {
	amountConversion,
	commaSeparatorWithRounding,
	denomConversion,
} from "../../utils/coin";
import { commaSeparator, marketPrice } from "../../utils/number";
import { iconNameFromDenom } from "../../utils/string";


const Asssets = ({
	assetBalance,
	balances,
	markets,
	refreshBalance,
	assetMap,
	harborPrice,
}) => {
	console.log(fetchTxHash());

     const handleBalanceRefresh = () => {
				setLoading(true);
				let assetReloadBth = document.getElementById("reload-btn");
				assetReloadBth.classList.toggle("reload");
				if (!assetReloadBth.classList.contains("reload")) {
					assetReloadBth.classList.add("reload-2");
				} else {
					assetReloadBth.classList.remove("reload-2");
				}

				dispatch({
					type: "BALANCE_REFRESH_SET",
					value: refreshBalance + 1,
				});
				setTimeout(() => {
					setLoading(false);
				}, 500);
			};

	const getPrice = (denom) => {
		if (denom === harbor?.coinMinimalDenom) {
			return harborPrice;
		}
		return marketPrice(markets, denom, assetMap[denom]?.id) || 0;
	};

	let ibcBalances = AssetList?.tokens.map((token) => {
		const ibcBalance = balances?.find(
			(item) => item.denom === token?.ibcDenomHash
		);
		console.log(ibcBalance);
		return {
			chainInfo: getChainConfig(token),
			coinMinimalDenom: token?.coinMinimalDenom,
			balance: {
				amount: ibcBalance?.amount
					? amountConversion(
							ibcBalance.amount,
							comdex?.coinDecimals,
							assetMap[ibcBalance?.denom]?.decimals
					  )
					: 0,
				price: getPrice(ibcBalance?.denom) || 0,
			},
			sourceChannelId: token.comdexChannel,
			destChannelId: token.channel,
			ibcDenomHash: token?.ibcDenomHash,
			explorerUrlToTx: token?.explorerUrlToTx,
			depositUrlOverride: token?.depositUrlOverride,
			withdrawUrlOverride: token?.withdrawUrlOverride,
		};
	});
	console.log(ibcBalances);
	console.log(balances);
	// let ibcBalances = AssetList?.tokens.map((token) => {
	// 	const ibcBalance = balances.find(
	// 		(item) => item.denom === token?.ibcDenomHash
	// 	);
	// 	return {
	// 		chainInfo: getChainConfig(token),
	// 		coinMinimalDenom: token?.coinMinimalDenom,
	// 		balance: {
	// 			amount: ibcBalance?.amount
	// 				? amountConversion(
	// 						ibcBalance.amount,
	// 						comdex?.coinDecimals,
	// 						assetMap[ibcBalance?.denom]?.decimals
	// 				  )
	// 				: 0,
	// 			price: getPrice(ibcBalance?.denom) || 0,
	// 		},
	// 		sourceChannelId: token.comdexChannel,
	// 		destChannelId: token.channel,
	// 		ibcDenomHash: token?.ibcDenomHash,
	// 		explorerUrlToTx: token?.explorerUrlToTx,
	// 		depositUrlOverride: token?.depositUrlOverride,
	// 		withdrawUrlOverride: token?.withdrawUrlOverride,
	// 	};
	// });

	const columns = [
		{
			title: "Asset",
			dataIndex: "asset",
			key: "asset",
			align: "left",
			width: 100,
		},
		{
			title: "No. Of Tokens",
			dataIndex: "noOfTokens",
			key: "noOfTokens",
			align: "center",
			width: 150,
			render: (tokens) => (
				<>
					<p>{commaSeparator(Number(tokens || 0))}</p>
				</>
			),
		},
		{
			title: "IBC Deposit",
			dataIndex: "ibcDeposit",
			key: "ibcDeposit",
			align: "center",
			width: 150,
			render: (value) => {
				if (value) {
					return value?.depositUrlOverride ? (
						<Button
							type="primary btn-filled"
							size="small"
							className="external-btn"
						>
							<a
								href={value?.depositUrlOverride}
								target="_blank"
								rel="noreferrer"
							>
								Deposite{" "}
								{/* <span className="hyperlink-icon">
									{" "}
									<SvgIcon name="hyperlink" />
								</span> */}
							</a>
						</Button>
					) : (
						<IBCDeposit
							chain={value}
							balances={balances}
							handleRefresh={handleBalanceRefresh}
						/>
					);
				}
			},
		},
		{
			title: "IBC Withdraw",
			key: "ibcWithdraw",
			dataIndex: "ibcWithdraw",
			align: "right",
			width: 150,
		},
	];
     const nativeCoin = balances.filter(
				(item) => item.denom === comdex?.coinMinimalDenom
			)[0];
			// const cmstCoin = balances.filter(
			//   (item) => item.denom === cmst?.coinMinimalDenom
			// )[0];
			// const harborCoin = balances.filter(
			//   (item) => item.denom === harbor?.coinMinimalDenom
			// )[0];

			const nativeCoinValue =
				getPrice(nativeCoin?.denom) *
				(nativeCoin?.amount ? Number(amountConversion(nativeCoin?.amount)) : 0);
console.log(nativeCoin)

	console.log(comdex);
	const currentChainData = [
		{
			key: comdex.chainId,
			symbol: comdex?.symbol,
			asset: (
				<>
					<div className="assets-withicon">
						<div className="assets-icon">
							{/* <SvgIcon name={iconNameFromDenom(comdex?.coinMinimalDenom)} /> */}
						</div>{" "}
						{/* {denomConversion(comdex?.coinMinimalDenom)} */}
						<div className="name">
							{denomConversion(comdex?.coinMinimalDenom)}
						</div>
					</div>
				</>
			),
			  noOfTokens: nativeCoin?.amount ? amountConversion(nativeCoin.amount) : 0,
			// noOfTokens: 50,
		},
	];

	const tableIBCData =
		ibcBalances &&
		ibcBalances.map((item) => {
            console.log(item)
			return {
				key: item?.coinMinimalDenom,
				asset: (
					<>
						<div className="assets-withicon">
							<div className="assets-icon">
								{/* <SvgIcon
														name={iconNameFromDenom(item?.coinMinimalDenom)}
													/> */}
							</div>
							{denomConversion(item?.coinMinimalDenom)}{" "}
						</div>
					</>
				),
				noOfTokens: item?.balance?.amount,
				ibcDeposit: (
					<>
						<IBCDeposit/>
					</>
				),
				ibcWithdraw: (
					<>
						<IBCWithdraw />
					</>
				),

				// ibcdeposit: item,
				// ibcwithdraw: item,
			};
		});

	const data = [
		{
			key: "1",
			asset: (
				<>
					<div className="asset_with_icon">
						<div className="icon"></div>
						<div className="name">BOLI</div>
					</div>
				</>
			),
			noOfTokens: 20,
			ibcDeposit: (
				<>
					<IBCDeposit />
				</>
			),
			ibcWithdraw: (
				<>
					<IBCWithdraw />
				</>
			),
		},
		{
			key: "2",
			asset: (
				<>
					<div className="asset_with_icon">
						<div className="icon"></div>
						<div className="name">HDC</div>
					</div>
				</>
			),
			noOfTokens: 20,
			ibcDeposit: (
				<>
					<IBCDeposit />
				</>
			),
			ibcWithdraw: (
				<>
					<IBCWithdraw />
				</>
			),
		},
		{
			key: "3",
			asset: (
				<>
					<div className="asset_with_icon">
						<div className="icon"></div>
						<div className="name">Parallel</div>
					</div>
				</>
			),
			noOfTokens: 20,
			ibcDeposit: (
				<>
					<IBCDeposit />
				</>
			),
			ibcWithdraw: (
				<>
					<IBCWithdraw />
				</>
			),
		},
	];

	const tableData = Lodash.concat(currentChainData, tableIBCData);

	return (
		<>
			<div className="asset_main_container">
				<div className="asset_container">
					<div className="asset_table">
						<Table
							columns={columns}
							dataSource={tableData}
							pagination={false}
							className="custom_table"
							scroll={{ x: 600 }}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

const stateToProps = (state) => {
	return {
		balances: state.account.balances.list,
		assetBalance: state.account.balances.asset,
		assetMap: state.assets.map,
		refreshBalance: state.account.refreshBalance,
		harborPrice: state.liquidity.harborPrice,
	};
};

export default connect(stateToProps)(Asssets);
// export default Asssets;
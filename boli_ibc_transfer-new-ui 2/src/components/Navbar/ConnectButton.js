import React from 'react';
import './index.scss'
import { Button, Dropdown, message } from "antd";
import { connect, useDispatch } from "react-redux";
import { useCallback } from 'react';
import {
	setAccountAddress,
	setAccountBalances,
	setAccountName,
	setAssetBalance,
	setPoolBalance,
	showAccountConnectModal,
} from "../../actions/account";
import { cmst, comdex, harbor, ibcDenoms } from "../../config/network";
import { queryAllBalances } from "../../services/bank/query";
import { fetchKeplrAccountName, initializeChain } from "../../services/keplr";
import ConnectModal from '../Modal';
import { useState, useEffect } from 'react';
import { chain } from 'lodash';

const ConnectButton = ({
	setAccountAddress,
	address,
	setAccountBalances,
	lang,
	setAssetBalance,
	setPoolBalance,
	 refreshBalance,
	setAccountName,
	balances,
}) => {
    const dispatch = useDispatch();
     const [addressFromLocal, setAddressFromLocal] = useState();

	 useEffect(() => {
			const savedAddress = localStorage.getItem("ac");
			const userAddress = savedAddress ? decode(savedAddress) : address;

			if (userAddress) {
				setAccountAddress(userAddress);

				fetchKeplrAccountName().then((name) => {
					setAccountName(name);
				});
			}
		}, [address, refreshBalance]);



		const fetchBalances = useCallback(
			(address) => {
				queryAllBalances(address, (error, result) => {
					if (error) {
						return;
					}

					setAccountBalances(result.balances, result.pagination);
					// calculateAssetBalance(result.balances);
					// calculatePoolBalance(result.balances);
				});
			},
			[ setAccountBalances]
		);

		useEffect(() => {
			if (address) {
				fetchBalances(address);
			}
		}, [address, refreshBalance]);

		useEffect(() => {
			let addressAlreadyExist = localStorage.getItem("ac");
			addressAlreadyExist = addressAlreadyExist
				? decode(addressAlreadyExist)
				: "";
			setAddressFromLocal(addressAlreadyExist);
		}, []);


		useEffect(() => {
			if (addressFromLocal) {
				initializeChain((error, account) => {
					if (error) {
						message.error(error);
						return;
					}
					setAccountAddress(account.address);
					fetchKeplrAccountName().then((name) => {
						setAccountName(name);
					});
					localStorage.setItem("ac", encode(account.address));
					localStorage.setItem("loginType", "keplr");
				});
			}
		}, [addressFromLocal]);

console.log(comdex)
		const items = [{ label: <ConnectModal />, key: "item-1" }];

	return (
		<>
			{address ? (
				<div className="connected_div">
					<DisConnectModal />
				</div>
			) : (
				<div>
					{/* <Dropdown
						menu={{ items }}
						placement="bottomRight"
						trigger={["click"]}
						overlayClassName="dropconnect-overlay"
					> */}
						<Button shape="round" type="primary" className='btn'>
							Connect
						</Button>
					{/* </Dropdown> */}
				</div>
			)}
		</>
	);
};

const stateToProps = (state) => {
	return {
		address: state.account.address,
		show: state.account.showModal,
		refreshBalance: state.account.refreshBalance,
		balances: state.account.balances.list,
	};
};

const actionsToProps = {
	showAccountConnectModal,
	setAccountAddress,
	setAccountBalances,
	setAccountName,
};

export default connect(stateToProps, actionsToProps)(ConnectButton);


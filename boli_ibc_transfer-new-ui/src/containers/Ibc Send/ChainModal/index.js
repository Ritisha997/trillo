import React from 'react'
import { useState, useEffect } from 'react';
import { Button, Modal, Input, message, Row, Col } from "antd";
import { chainNetworks } from "../../../config/magixTx_chain_config";
import { setAccountAddress, setAccountName } from "../../../actions/account";
import { connect, useDispatch } from "react-redux";
import Snack from '../../../components/Common/Snack';
import { MsgSendTokens, signAndBroadcastMagicTransaction, Fee } from '../../../services/helper';
import { checkEligibility } from '../../../services/airdropContractRead';
import { setuserEligibilityData } from '../../../actions/airdrop';
import { magicInitializeChain } from '../../../services/keplr';
import './index.scss'

const ChainModal = ({
	currentChain,
	userEligibilityData,
	setuserEligibilityData,
	address,
}) => {
	// console.log(currentChain);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [userComdexAddress, setuserComdexAddress] = useState("");
	const [userAddress, setUserAddress] = useState("");
	const [userCurrentChainAddress, setUserCurrentChainAddress] = useState("");
	const [amount, setAmount] = useState();
	const [txLogin, setTxLogin] = useState(false);

	const showModal = () => {
		setuserEligibilityData(0);
		if (address) {
			magicInitializeChain(
				chainNetworks[currentChain?.networkname],
				(error, account) => {
					if (error) {
						console.log(error, "error");
						message.error(error);
						return;
					}
					setUserCurrentChainAddress(account?.address);
				}
			);

			checkEligibility(address, currentChain?.chainId)
				.then((res) => {
					if (res) {
						message.success("Magic Transaction already completed! 👍");
						navigate(`./complete-mission/${currentChain?.chainId}`);
					}
				})
				.catch((error) => {
					console.log(error);
				});

			setIsModalVisible(true);
		} else {
			message.error("Please connect  wallet!");
		}
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setuserEligibilityData(0);
		setIsModalVisible(false);
	};

	const handleClickMagicTx = () => {
		setTxLogin(true);
		let msg = MsgSendTokens(
			userCurrentChainAddress,
			userComdexAddress,
			chainNetworks[currentChain?.networkname],
			Number(amount) *
				10 ** chainNetworks[currentChain?.networkname]?.coinDecimals
		);
		signAndBroadcastMagicTransaction(
			{
				message: msg,
				fee: Fee(0, 250000, chainNetworks[currentChain?.networkname]),
				memo: "",
			},
			userCurrentChainAddress,
			chainNetworks[currentChain?.networkname],
			(error, result) => {
				if (error) {
					message.error(error);
					setTxLogin(false);
					return;
				}
				if (result && !result?.code) {
					message.success(
						<Snack
							message={variables[lang].tx_success}
							explorerUrlToTx={
								chainNetworks[currentChain?.networkname].explorerUrlToTx
							}
							hash={result?.transactionHash}
						/>
					);
				} else {
					message.error(result?.rawLog || "Transaction failed");
					console.log(result?.rawLog);
				}
				setTxLogin(false);
			}
		);
	};

	useEffect(() => {
		setUserAddress(userCurrentChainAddress);
	}, [address, userCurrentChainAddress]);

	return (
		<>
			<Button className="icons" onClick={showModal}>
				<div className="icon-inner">
					<img className="airdrop-img" src={currentChain?.icon} alt="" />
				</div>
			</Button>
			<Modal
				className="claimrewards-modal"
				centered={true}
				closable={false}
				footer={null}
				open={isModalVisible}
				width={685}
				onCancel={handleCancel}
				onOk={handleOk}
				// closeIcon={<SvgIcon name="close" viewbox="0 0 19 19" />}
				title={
					<div className="claim-box-modal-main-head">
						<div className="title-head">
							<div className="icons" onClick={showModal}>
								<div className="icon-inner">
									<img src={currentChain?.icon} alt="" />
								</div>
							</div>
							<span>{currentChain?.chainName}</span>
						</div>
					</div>
				}
			>
				{currentChain?.chainId != 4 &&
					currentChain?.chainId != 5 &&
					currentChain?.chainId != 8 && (
						<Row>
							<Col>
								<label>Send Tokens</label>
								<div>
									<Input
										placeholder={`Enter Wallet Address`}
										value={userComdexAddress}
										onChange={(e) => setuserComdexAddress(e.target.value)}
									/>
									<Input
										placeholder={`Enter Amount`}
										value={amount}
										onChange={(e) => setAmount(e.target.value)}
										type="number"
										className="mt-2 input-value"
									/>
									<Button
										type="primary"
										className="btn-filled mt-2 w-100"
										loading={txLogin}
										disabled={
											// disableTxBtn ||
											!amount || txLogin
										}
										onClick={() => handleClickMagicTx()}
									>
										Send
									</Button>
								</div>
							</Col>
						</Row>
					)}
			</Modal>
		</>
	);
};

const stateToProps = (state) => {
	return {
		address: state.account.address,
		refreshBalance: state.account.refreshBalance,
		// userEligibilityData: state.airdrop.userEligibilityData,
	};
};

const actionsToProps = {
	setuserEligibilityData,
	setAccountAddress,
	setAccountName,
};

export default connect(stateToProps, actionsToProps)(ChainModal);
// export default ChainModal

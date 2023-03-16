import { Button, Col, Form, Modal, Row, message } from 'antd';
import React, { useState } from 'react';
import { fetchProofHeight } from '../../../actions/assets';
import Snack from '../../../components/Common/Snack';
import { comdex } from '../../../config/network';
import { ValidateInputNumber } from '../../../config/_validations';
import { queryBalance } from '../../../services/bank/query';
import { aminoSignIBCTx } from '../../../services/helper';
import { initializeIBCChain, getChainConfig } from '../../../services/keplr';
import { fetchTxHash } from '../../../services/transaction';
import CustomInput from '../../../components/CustomInput';
import { truncateString } from "../../../utils/string";
import {
	denomConversion,
	getAmount,
} from "../../../utils/coin";
import { connect } from 'react-redux';

const IBCWithdraw = ({chain, address}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState(0)
   const [destinationAddress, setDestinationAddress] = useState("");
	const [inProgress, setInProgress] = useState(false);
	const [proofHeight, setProofHeight] = useState(0);
	const [validationError, setValidationError] = useState();

    const onChange = (value) => {
			value = toDecimals(value).toString().trim();

			setAmount(value);
			setValidationError(ValidateInputNumber(value, chain?.balance?.amount));
		};

    const showModal = () => {
       initializeIBCChain(chain.chainInfo, (error, account) => {
					if (error) {
						message.error(error);
						return;
					}
                    console.log(account);
					setDestinationAddress(account?.address);
					fetchProofHeight(
						chain.chainInfo?.rest,
						chain.sourceChannelId,
						(error, data) => {
                            console.log(data)
							if (error) return;
							setProofHeight(data);
						}
					);
				});
        setIsModalOpen(true);
    };

 const signIBCTx = () => {
		setInProgress(true);

		if (!proofHeight?.revision_height) {
			message.error("Unable to get the latest block height");
			setInProgress(false);
			return;
		}

		const data = {
			msg: {
				typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
				value: {
					source_port: "transfer",
					source_channel: chain?.sourceChannelId,
					token: {
						denom: chain?.ibcDenomHash,
						amount: getAmount(amount),
					},
					sender: address,
					receiver: destinationAddress,
					timeout_height: {
						revisionNumber: Number(proofHeight?.revision_number),
						revisionHeight: Number(proofHeight?.revision_height) + 100,
					},
					timeout_timestamp: undefined,
				},
			},
			fee: defaultFee(),
			memo: "",
		};

		aminoSignIBCTx(getChainConfig(), data, (error, result) => {
			if (error) {
				if (result?.transactionHash) {
					message.error(
						<Snack
							message={variables[lang].tx_failed}
							explorerUrlToTx={comdex?.explorerUrlToTx}
							hash={result?.transactionHash}
						/>
					);
				} else {
					message.error(error);
				}

				resetValues();
				return;
			}

			if (result?.transactionHash) {
				message.loading(
					"Transaction Broadcasting, Waiting for transaction to be included in the block"
				);

				handleHash(result?.transactionHash);
			}
		});
 };


 const resetValues = () => {
		setInProgress(false);
		setIsModalOpen(false);
		setAmount();
 };
console.log(validationError)
 const handleHash = (txhash) => {
		let counter = 0;

		const time = setInterval(() => {
			fetchTxHash(txhash, (hashResult) => {
				if (hashResult) {
					if (hashResult?.code !== undefined && hashResult?.code !== 0) {
						message.error("the error", hashResult?.raw_log);
						message.error(
							<Snack
								message={hashResult?.raw_log}
								explorerUrlToTx={comdex?.explorerUrlToTx}
								hash={hashResult?.hash}
							/>
						);

						resetValues();

						clearInterval(time);

						return;
					}
				}

				counter++;
				if (counter === 3) {
					if (
						hashResult &&
						hashResult.code !== undefined &&
						hashResult.code !== 0
					) {
						message.error(
							<Snack
								message={hashResult?.raw_log}
								explorerUrlToTx={comdex?.explorerUrlToTx}
								hash={hashResult?.hash}
							/>
						);

						resetValues();
						clearInterval(time);

						return;
					}

					message.success(
						<Snack
							message={"Transaction Successful. Token Transfer in progress."}
							explorerUrlToTx={comdex?.explorerUrlToTx}
							hash={txhash}
						/>
					);

					resetValues();
					clearInterval(time);

					const fetchTime = setInterval(() => {
						queryBalance(
							comdex?.rpc,
							address,
							chain?.ibcDenomHash,
							(error, result) => {
								if (error) return;

								let resultBalance =
									balances?.length &&
									chain?.ibcDenomHash &&
									balances.find((val) => val.denom === chain?.ibcDenomHash);

								if (result?.balance?.amount !== resultBalance?.amount) {
									handleRefresh();
									resetValues();

									message.success("IBC Transfer Complete");
									clearInterval(fetchTime);
								}
							}
						);
					}, 5000);
				}
			});
		}, 5000);
 }; 

    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };


    return (
			<>
				<div className="modal_container">
					<Button type="primary" className="btn-filled" onClick={showModal}>
						IBC Withdraw
					</Button>
					<Modal
						title="IBC Withdraw"
						open={isModalOpen}
						onOk={handleOk}
						onCancel={handleCancel}
						className="asstedeposit-modal"
						centered={true}
						closable={true}
						footer={null}
						width={480}
					>
						<Form layout="vertical">
							<Row>
								<Col>
									<Form.Item label="From">
										<CustomInput
											type="text"
											value={truncateString(address, 9, 9)}
											disabled
										/>
									</Form.Item>
								</Col>
								{/* <SvgIcon name="arrow-right" viewbox="0 0 17.04 15.13" /> */}
								<Col>
									<Form.Item label="To" className="ml-1">
										<CustomInput
											type="text"
											value={truncateString(destinationAddress, 9, 9)}
											disabled
										/>
									</Form.Item>
								</Col>
							</Row>
							<Row>
								<Col className="position-relative">
									<div className="availabe-balance">
										Available
										<span className="ml-1">
											{" "}
											{chain?.balance?.amount || 0}{" "}
											{denomConversion(chain?.coinMinimalDenom) || ""}
										</span>
										<span className="assets-maxhalf">
											<Button
												className=" active"
												onClick={() => {
													setAmount(chain?.balance?.amount || 0);
												}}
											>
												Max
											</Button>
										</span>
									</div>
									<Form.Item
										label="Amount to Withdraw"
										className="assets-input-box"
									>
										<CustomInput
											value={amount}
											onChange={(event) => onChange(event.target.value)}
											validationError={validationError}
										/>
									</Form.Item>
								</Col>
							</Row>
							<Row>
								<Col className="text-center mt-2">
									<Button
										type="primary"
										// disabled={
										// 	inProgress || !Number(amount) || validationError?.message
										// }
										className="btn-filled modal-btn"
										onClick={signIBCTx}
									>
										Withdraw
									</Button>
								</Col>
							</Row>
						</Form>
					</Modal>
				</div>
			</>
		);
}

const stateToProps = (state) => {
	return {
		address: state.account.address,
	};
};
export default connect(stateToProps)(IBCWithdraw)
// export default IBCWithdraw;
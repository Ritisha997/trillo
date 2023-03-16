import { Button, Col, Form, Modal, Row, message, Spin } from "antd";
import React, { useState } from 'react'
import CustomInput from '../../../components/CustomInput';
import { truncateString } from "../../../utils/string";
import { fetchProofHeight } from '../../../actions/assets';
import { comdex } from '../../../config/network';
import {queryBalance} from '../../../services/bank/query'
import { aminoSignIBCTx } from '../../../services/helper';
import { initializeIBCChain } from '../../../services/keplr';
import {fetchTxHash} from '../../../services/transaction';
import Snack from '../../../components/Common/Snack';
import { DEFAULT_FEE } from "../../../constants/common";
import { connect, useDispatch } from "react-redux";
import {
	amountConversion,
	commaSeparatorWithRounding,
	denomConversion,
	getAmount
} from "../../../utils/coin";
import '../index.scss';
import {ValidateInputNumber} from '../../../config/_validations';


const IBCDeposit = ({chain, address}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sourceAddress, setSourceAddress] = useState("");
    const [amount, setAmount] = useState(0);
    const [inProgress, setInProgress] = useState(false);
	const [availableBalance, setAvailableBalance] = useState(0);
	const [proofHeight, setProofHeight] = useState(0);
	const [validationError, setValidationError] = useState();
	const [balanceInProgress, setBalanceInProgress] = useState(false);


 const onChange = (value) => {
		value = toDecimals(value).toString().trim();

		setAmount(value);
		setValidationError(
			ValidateInputNumber(getAmount(value), availableBalance?.amount)
		);
 };


    const showModal = () => {
         initializeIBCChain(chain.chainInfo, (error, account) => {
						if (error) {
							message.error(error);
							setInProgress(false);
							return;
						}
                     
						setSourceAddress(account?.address);
						setBalanceInProgress(true);

						queryBalance(
							chain?.chainInfo?.rpc,
							account?.address,
							chain?.coinMinimalDenom,
							(error, result) => {
								setBalanceInProgress(false);

								if (error) return;
                                
								setAvailableBalance(result);
							}
						);
                        console.log(availableBalance);

						fetchProofHeight(
							comdex?.rest,
							chain.sourceChannelId,
							(error, data) => {
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
						source_channel: chain.destChannelId,
						token: {
							denom: chain.coinMinimalDenom,
							amount: getAmount(amount),
						},
						sender: sourceAddress,
						receiver: address,
						timeout_height: {
							revisionNumber: Number(proofHeight.revision_number),
							revisionHeight: Number(proofHeight.revision_height) + 100,
							// Need to add some blocks in order to get the timeout
						},
						timeout_timestamp: undefined,
					},
				},
				fee: {
					amount: [{ denom: chain.denom, amount: "25000" }],
					gas: "200000",
				},
				memo: "",
			};

			aminoSignIBCTx(chain.chainInfo, data, (error, result) => {
				setInProgress(false);
				if (error) {
					if (result?.transactionHash) {
						message.error(
							<Snack
								message={variables[lang].tx_failed}
								explorerUrlToTx={chain?.explorerUrlToTx}
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
									explorerUrlToTx={chain?.explorerUrlToTx}
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
									explorerUrlToTx={chain?.explorerUrlToTx}
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
								explorerUrlToTx={chain?.explorerUrlToTx}
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


    console.log(proofHeight)
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
						IBC Deposit
					</Button>
					<Modal
						title="IBC Deposit"
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
											value={truncateString(sourceAddress, 9, 9)}
											disabled
										/>
									</Form.Item>
								</Col>
								{/* <SvgIcon name="arrow-right" viewbox="0 0 17.04 15.13" /> */}
								<Col>
									<Form.Item label="To" className="ml-1">
										<CustomInput
											type="text"
											value={truncateString(address, 9, 9)}
											disabled
										/>
									</Form.Item>
								</Col>
							</Row>
							<Row>
								<Col className="position-relative">
									<div className="availabe-balance">
										{balanceInProgress ? (
											<Spin />
										) : (
											<>
												available
												<span className="ml-1">
													{(availableBalance &&
														availableBalance.amount &&
														amountConversion(availableBalance.amount)) ||
														0}{" "}
													{denomConversion(chain?.coinMinimalDenom || "")}
												</span>
												<span className="assets-maxhalf">
													<Button
														className=" active"
														onClick={() => {
															setAmount(
																availableBalance?.amount > DEFAULT_FEE
																	? amountConversion(
																			availableBalance?.amount - DEFAULT_FEE
																	  )
																	: amountConversion(availableBalance?.amount)
															);
														}}
													>
														max
													</Button>
												</span>
											</>
										)}
										{/* Available
										<span className="ml-1">123 BOLI</span>
										<span className="assets-maxhalf">
											<Button className=" active">Max</Button>
										</span> */}
									</div>
									<Form.Item
										label="Amount to Deposit"
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
										className="btn-filled modal-btn"
										loading={inProgress}
										disabled={
											inProgress ||
											balanceInProgress ||
											!Number(amount) ||
											validationError?.message
										}
										onClick={signIBCTx}
									>
										Deposit
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

export default connect(stateToProps)(IBCDeposit);
// export default IBCDeposit;
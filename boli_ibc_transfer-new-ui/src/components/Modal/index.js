import "./index.scss";
import "antd/dist/antd.css";
import * as PropTypes from "prop-types";
import { Spin, message } from "antd";
import { connect, useDispatch, useSelector } from "react-redux";
import { encode } from "js-base64";
import { fetchKeplrAccountName, initializeChain } from "../../services/keplr";
import { setAccountAddress } from "../../actions/account";
import {
	setAccountName,
	showAccountConnectModal,
} from "../../actions/account";
import React, { useState } from "react";
// import variables from "../../utils/variables";


export const ConnectModal = ({
	setAccountAddress,
	setAccountName,
	showAccountConnectModal,
}) => {
	console.log(showAccountConnectModal)
	const [inProgress, setInProgress] = useState(false);
	
	const handleConnectToKeplr = () => {
		setInProgress(true);
console.log('hi')
		initializeChain((error, account) => {
			console.log("hi1");
			setInProgress(false);
			if (error) {
				message.error(error);
				return;
			}
			console.log("hi2");
			console.log(setAccountAddress)
			// localStorage.setItem("ac", encode(account.address));
			setAccountAddress(account.address);
			console.log("hi3");
			fetchKeplrAccountName().then((name) => {
				setAccountName(name);
			});

			localStorage.setItem("ac", encode(account.address));
			localStorage.setItem("loginType", "keplr");
			showAccountConnectModal(false);
		});
	};

	return (
		<Spin spinning={inProgress}>
			<div className="wallet-connect-dropdown">
				<div className="wallet-connect-upper">
					<h3 className="text-center">Connect Wallet</h3>
				</div>
				<div className="mb-2 mt-3">
					<div className="wallet-links" onClick={handleConnectToKeplr}>
						<div className="wallet-links">
							<span>Keplr Wallet</span>{" "}
						</div>
					</div>
				</div>
			</div>
		</Spin>
	);
};

// ConnectModal.propTypes = {
// setAccountAddress: PropTypes.func.isRequired,
// setAccountName: PropTypes.func.isRequired,
// showAccountConnectModal: PropTypes.func.isRequired,
// lang: PropTypes.string,
// show: PropTypes.bool,
// };

const stateToProps = (state) => {
	return {
		show: state.account.showModal,
	};
};

const actionsToProps = {
	showAccountConnectModal,
	setAccountAddress,
	setAccountName,
};

export default connect(stateToProps, actionsToProps)(ConnectModal);

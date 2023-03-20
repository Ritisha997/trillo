import React, { useState } from 'react'
import { NavLink } from "react-router-dom";
import './index.scss';
import { Button, Dropdown } from 'antd';
import { ConnectModal } from '../Modal';
import ConnectButton from './ConnectButton';


const Navbar = () => {

const [open, setOpen] = useState(false);

    let activeStyle = {
        color: "#e94100"
    };

    // const WalletConnectedDropdown = <ConnectModal />;

    return (
			<>
				<div className="navbar_main_container">
					<div className="max_width">
						<div className="navbar_container">
							<div className="logo_container">
								<h3>Logo</h3>
							</div>
							<div className="toggle" onClick={() => setOpen(!open)}>
								<p>Logo</p>
							</div>
							<div className={open ? "links_container new" : "links_container"}>
								{open && <div className='close-btn' onClick={() => setOpen(!open)}>&#9747;</div>}
								<div className="links">
									<ul>
										<li>
											<NavLink
												to="/asset"
												style={({ isActive }) =>
													isActive ? activeStyle : undefined
												}
											>
												Asset
											</NavLink>
										</li>
										<li>
											<NavLink
												to="/ibc_transfer"
												style={({ isActive }) =>
													isActive ? activeStyle : undefined
												}
											>
												IBC Transfer
											</NavLink>
										</li>
										<div className="button_container">
											<div>
												{/* <Dropdown
													overlay={WalletConnectedDropdown}
													placement="bottomRight"
													trigger={["click"]}
												> */}
													<div
														shape="round"
														type="primary"
														className="btn-filled"
													>
														<ConnectButton />
													</div>
												{/* </Dropdown> */}
											</div>
										</div>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
}

export default Navbar;
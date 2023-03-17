import React from 'react';
import { maginTxChain } from './magicTxChain';
import { NavLink } from "react-router-dom";
import "./index.scss";
import ChainModal from './ChainModal';

const IbcTransfer = () => {
//   console.log(maginTxChain)
  return (
		<div>
			{/* <Col xl="8" lg="6"> */}
				<div className="airdrop-upper-card airdrop-upper-card2">
					<h3>IBC Token Transfer</h3>
					<ul>
						{maginTxChain?.map((item) => {
							return (
								<li className="airdrop-content" key={item?.chainId}>
									<ChainModal currentChain={item}/>
									<p>{item?.chainName} </p>
								</li>
							);
						})}
					</ul>
				</div>
				{/* <div className="text-center mt-auto">
                  <Button type="primary" className="different-chain-eligibility">Click on different chains to check eligibility and complete missions</Button>
                </div> */}
			{/* </Col> */}
		</div>
	);
}

export default IbcTransfer
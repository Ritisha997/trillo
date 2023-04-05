import React from "react";
import "./index.scss";
import logo from "../assets/img/logo.png";
import user from "../assets/img/user.jpg";
import user1 from '../assets/img/user-1.jpg';
import user2 from '../assets/img/user-2.jpg';
import user3 from '../assets/img/user-3.jpg';
import user4 from '../assets/img/user-4.jpg';
import user5 from '../assets/img/user-5.jpg';
import user6 from '../assets/img/user-6.jpg';
import { FaBookmark } from "react-icons/fa";
import { FaComments } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaMap } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaPlaneDeparture } from "react-icons/fa";
import hotel1 from '../assets/img/hotel-1.jpg'
import hotel2 from '../assets/img/hotel-2.jpg'
import hotel3 from '../assets/img/hotel-3.jpg'

const Container = () => {
	return (
		<>
			<div className="container">
				<div className="container-section">
					<div className="container-section_header">
						<div className="logo">
							<img src={logo} alt="logo" className="logo-main" />
						</div>
						<form className="container-section_form">
							<input
								type="text"
								name="search"
								placeholder="search hotels"
								className="input"
							/>
							<button className="btn">
								<FaSearch />
							</button>
						</form>
						<div className="container-section_icons">
							<div className="container-section_icon">
								<FaBookmark className="bookmark" />
								<span className="count">7</span>
							</div>
							<div className="container-section_icon">
								<FaComments className="comment" />
								<span className="count">13</span>
							</div>
							<div className="user">
								<img src={user} alt="user" className="user-img" />
								<h4 className="user-name">Jonas</h4>
							</div>
						</div>
					</div>
					<div className="container-section_main">
						<div className="container-section_aside">
							<ul className="container-section_items">
								<li className="container-section_item">
									{" "}
									<a href="/" class="container-section_link">
										<FaHome className="icon" />
										<span className="span">HOME</span>
									</a>
								</li>
								<li className="container-section_item">
									{" "}
									<a href="/" class="container-section_link">
										<FaPlaneDeparture className="icon" />
										<span>FLIGHT</span>
									</a>
								</li>
								<li className="container-section_item">
									{" "}
									<a href="/" class="container-section_link">
										<FaKey className="icon" />
										<span>CAR RENTAL</span>
									</a>
								</li>
								<li className="container-section_item">
									{" "}
									<a href="/" class="container-section_link">
										<FaMap className="icon" />
										<span>TOURS</span>
									</a>
								</li>
							</ul>
							<div className="copy">
								<p>
									&copy; {new Date().getFullYear()} by trillo. All Rights
									Reserved.
								</p>
							</div>
						</div>

						<div className="container-section_content">
							<div className="container-section_img">
								<figure>
									<img src={hotel1} alt="hotel" className="hotel-img" />
								</figure>
								<figure>
									<img src={hotel2} alt="hotel" className="hotel-img" />
								</figure>
								<figure>
									<img src={hotel3} alt="hotel" className="hotel-img" />
								</figure>
							</div>
							<div className="hotel-review">
								<h3>hotel las palmas</h3>
								<div className="hotel-star">
									<FaStar className="star" />
									<FaStar className="star" />
									<FaStar className="star" />
									<FaStar className="star" />
									<FaStar className="star" />
								</div>
								<div className="hotel-location">
									<FaMapMarkerAlt />
									<h5>Albufeira, Portugal</h5>
								</div>
								<div className="hotel-votes">
									<h2>8.6</h2>
									<span className="votes">400 votes</span>
								</div>
							</div>
							<div className="facilities">
								<div className="facilities-main">
									<div className="border">
										<p>
											Lorem ipsum dolor sit amet, consectetur adipisicing elit.
											Animi nisi dignissimos debitis ratione sapiente saepe.
											Accusantium cumque, quas, ut corporis incidunt deserunt
											quae architecto voluptate.
										</p>
										<p>
											Accusantium cumque, quas, ut corporis incidunt deserunt
											quae architecto voluptate delectus, inventore iure aliquid
											aliquam.
										</p>
									</div>
									<div className="lists">
										<ul className="list">
											<li class="list_item">
												<FaAngleRight className="list_icon" /> Close to the
												beach
											</li>
											<li class="list_item">
												<FaAngleRight className="list_icon" /> Free airport
												shuttle
											</li>
											<li class="list_item">
												<FaAngleRight className="list_icon" /> Breakfast
												included
											</li>
											<li class="list_item">
												<FaAngleRight className="list_icon" /> Free wifi in all
												rooms
											</li>
											<li class="list_item">
												<FaAngleRight className="list_icon" /> Air conditioning
												and heating
											</li>
											<li class="list_item">
												<FaAngleRight className="list_icon" /> Pets allowed
											</li>
											<li class="list_item">
												<FaAngleRight className="list_icon" /> We speak all
												languages
											</li>
											<li class="list_item">
												<FaAngleRight className="list_icon" /> Perfect for
												families
											</li>
										</ul>
									</div>
									<div className="friend">
										<p> Lucy and 3 other friends recommend this hotel.</p>
										<div className="friends">
											<img src={user3} alt="user" className="friends_item" />
											<img src={user4} alt="user" className="friends_item" />
											<img src={user5} alt="user" className="friends_item" />
											<img src={user6} alt="user" className="friends_item" />
										</div>
									</div>
								</div>
								<div className="facilities-sub">
									<div className="facilities-review">
										<p>
											Lorem ipsum dolor sit amet, consectetur adipisicing elit.
											Fuga doloremque architecto dicta animi, totam, itaque
											officia ex.
										</p>
										<div className="single-card">
											<img
												src={user1}
												alt="user"
												className="single-card_photo"
											/>
											<div className="single-card_detail">
												<p className="single-card_name">Nick Smith</p>
												<p className="single-card_date">Feb 23rd, 2017</p>
											</div>
											<h2>7.8</h2>
										</div>
									</div>
									<div className="facilities-review">
										<p>
											Lorem ipsum dolor sit amet, consectetur adipisicing elit.
											Fuga doloremque architecto dicta animi, totam, itaque
											officia ex.
										</p>
										<div className="single-card">
											<img
												src={user2}
												alt="user"
												className="single-card_photo"
											/>
											<div className="single-card_detail">
												<p className="single-card_name">Mary Thomas</p>
												<p className="single-card_date">Feb 23rd, 2017</p>
											</div>
											<h2>7.8</h2>
										</div>
									</div>
									
									<button className="last-btn">
										Show All <span>&rarr;</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Container;

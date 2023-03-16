import { combineReducers } from "redux";

const harborPrice = (state = 0, action) => {
	if (action.type === "SET_HARBOR_PRICE") {
		return action.value;
	}
	return state;
};


export default combineReducers({
	harborPrice,
});
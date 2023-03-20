import { combineReducers } from "redux";

const userEligibilityData = (state = {}, action) => {
	if (action.type === "SET_USER_ELIGIBILITY_DATA") {
		return action.value;
	}

	return state;
};


export default combineReducers({
	userEligibilityData,
});
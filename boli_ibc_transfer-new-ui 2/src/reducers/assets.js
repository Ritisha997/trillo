import { combineReducers } from "redux";

const map = (state = {}, action) => {
	if (action.type === 'SET_ASSET_LIST') {
		return action.map;
	}

	return state;
};


export default combineReducers({
	map,
});
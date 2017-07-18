export function filtered (state, action){
  var initialState = {displayType: ""};
  if(state === undefined){
    return initialState;
  }
  switch (action.type){
    case 'UPDATE_FILTERED':
      var new_state = {};
      new_state = Object.assign(
        {},
        state,
        {displayType: action.displayType}
      )
      return new_state;
    default:
      return state;
  }
}

export default filtered;

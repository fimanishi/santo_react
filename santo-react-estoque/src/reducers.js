export function filtered (state, action){
  var initialState = {data: [], displayType: ""};
  if(state === undefined){
    return initialState;
  }
  switch (action.type){
    case 'UPDATE_FILTERED':
      var new_state = {};
      new_state = Object.assign(
        {},
        state,
        {data: action.data, displayType: action.displayType}
      )
      return new_state;
    default:
      return state;
  }
}

export default filtered;

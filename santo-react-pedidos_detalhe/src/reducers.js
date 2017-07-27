export function filtered (state, action){
  var initialState = {data: [], info: {}, displayType: ""};
  if(state === undefined){
    return initialState;
  }
  switch (action.type){
    case 'UPDATE_FILTERED':
      var new_state = {};
      if (action.displayType === "add"){
        new_state = Object.assign(
          {},
          state,
          {data: state.data, info: state.info, displayType: action.displayType}
        )
      }
      else{
        new_state = Object.assign(
          {},
          state,
          {data: action.data, info: action.info, displayType: action.displayType}
        )
      }
      return new_state;
    default:
      return state;
  }
}

export default filtered;

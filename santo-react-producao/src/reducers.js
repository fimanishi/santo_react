export function filtered (state, action){
  var initialState = [];
  if(state === undefined){
    return initialState;
  }
  switch (action.type){
    case 'UPDATE_FILTERED':
      return action.data;
    default:
      return state;
  }
}

export default filtered;

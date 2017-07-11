export function filtered (state, action){
  var initialState = {data: [], displayType: ""};
  if(state === undefined){
    return initialState;
  }
  switch (action.type){
    case 'UPDATE_FILTERED':
      return {data: action.data, displayType: action.displayType};
    default:
      return state;
  }
}

export default filtered;

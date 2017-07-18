export function updateFiltered (displayType){
  return {
    type: 'UPDATE_FILTERED',
    displayType : displayType
  }
}

window.updateFiltered = updateFiltered;

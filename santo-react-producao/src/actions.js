export function updateFiltered (data, displayType){
  return {
    type: 'UPDATE_FILTERED',
    data: data,
    displayType : displayType
  }
}

window.updateFiltered = updateFiltered;

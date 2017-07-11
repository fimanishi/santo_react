export function updateFiltered (data, displayType){
  return {
    type: 'UPDATE_FILTERED',
    data: data,
  }
}

window.updateFiltered = updateFiltered;

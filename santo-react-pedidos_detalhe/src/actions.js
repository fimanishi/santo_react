export function updateFiltered (data, info, displayType){
  return {
    type: 'UPDATE_FILTERED',
    data: data,
    info: info,
    displayType : displayType
  }
}

window.updateFiltered = updateFiltered;

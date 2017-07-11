export function updateFiltered (data){
  return {
    type: 'UPDATE_FILTERED',
    data: data,
  }
}

window.updateFiltered = updateFiltered;

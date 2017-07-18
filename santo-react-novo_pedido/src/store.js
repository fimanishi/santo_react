import { createStore } from 'redux';
import filtered from './reducers';

var store = createStore(filtered);

window.store = store;

export default store;

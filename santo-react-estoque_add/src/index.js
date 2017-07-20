import React from 'react';
import ReactDOM from 'react-dom';
import List from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import store from './store.js';

ReactDOM.render(<Provider store={store}>
                  <List />
                </Provider>, document.getElementById('result_list'));
//registerServiceWorker();

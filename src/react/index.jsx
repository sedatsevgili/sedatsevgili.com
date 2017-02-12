import React from 'react';
import {render} from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import App from './components/App.js';

render(
    <Router history={browserHistory} onUpdate={() => window.scrollTo(0, 0)}>
        <Route path="/(skip/:skip)" component={App} />
    </Router>
    , document.getElementById('app'));
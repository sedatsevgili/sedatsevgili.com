import React from 'react';
import {render} from 'react-dom';
import App from './components/App.js';
import Footer from './components/Footer.js';
import Header from './components/Header.js';
import Posts from './components/Posts.js';

render(
    <App>
        <Header />
        <Posts />
        <Footer />
    </App>
    , document.getElementById('app'));
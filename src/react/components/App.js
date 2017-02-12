import React from 'react';
import Footer from './Footer.js';
import Header from './Header.js';
import Posts from './Posts.js';

export default class App extends React.Component {
    render() {
        var skip = 0;
        if (this.props.params && this.props.params.skip) {
            skip = this.props.params.skip;
        }
        return (
            <div className="app-container">
                <Header />
                <Posts skip={skip}/>
                <Footer />
            </div>
        );
    }
}
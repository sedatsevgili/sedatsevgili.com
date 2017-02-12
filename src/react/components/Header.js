import React from 'react';

export default class Header extends React.Component {
    render() {
        var styleOfHeader = {
            backgroundImage: 'url(/img/thought.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 70%'
        };
        return (
        <header className="intro-header" style={styleOfHeader}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                        <div className="site-heading">
                            <h3>Blog</h3>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        );
    }
}
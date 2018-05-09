import React from 'react';
import FooterLink from './FooterLink';

export default class Footer extends React.Component {
    render() {
        return (
            <footer>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                            <ul className="list-inline text-center">
                                <FooterLink link="https://twitter.com/sedatsevgili" icon="fa-twitter" />
                                <FooterLink link="https://github.com/sedatsevgili" icon="fa-github" />
                            </ul>
                            <p className="copyright text-muted">Copyleft &copy; sedatsevgili.com</p>
                        </div>
                    </div>
                </div>
            </footer>
            
        );
    }
}
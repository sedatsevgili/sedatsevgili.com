import React from 'react';

export default class FooterLink extends React.Component {
    render() {
        const icon = "fa " + this.props.icon + " fa-stack-1x fa-inverse";
        return (
            <li>
                <a target="_blank" href={this.props.link}>
                    <span className="fa-stack fa-lg">
                        <i className="fa fa-circle fa-stack-2x"></i>
                        <i className={icon}></i>
                    </span>
                </a>
            </li>
        );
    }
}
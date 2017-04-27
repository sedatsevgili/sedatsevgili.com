import React from 'react';

export default class Post extends React.Component 
{
    render() {
        return (
            <div className="post-preview">
                <a>
                    <h2 className="post-subtitle">
                        {this.props.post.content}
                    </h2>
                </a>
                <p className="post-meta">{this.props.post.createdAt}</p>
            </div>
        );
    }
}
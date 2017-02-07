import React from 'react';
import axios from 'axios';

export default class Posts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            skip: 0
        };
        this.handleOlderPostsClick = this.handleOlderPostsClick.bind(this);
        this.handleNewerPostsClick = this.handleNewerPostsClick.bind(this);
    }

    componentDidMount() {
        axios.get('/posts').then(res => {
            this.setState({posts: res.data.posts, skip:0});
        });
    }

    handleOlderPostsClick() {
        axios.get('/posts?skip=' + (this.state.skip + 10)).then(res => {
            this.setState({posts: res.data.posts, skip: (this.state.skip + 10)});
        });
    }

    handleNewerPostsClick() {
        axios.get('/posts?skip=' + (this.state.skip - 10)).then(res => {
            this.setState({posts: res.data.posts, skip: (this.state.skip - 10)});
        });
    }

    render() {
        const currentSkip = this.state.skip;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                        {this.state.posts.map(post => 
                            <div className="post-preview">
                                <a>
                                    <h2 className="post-subtitle">
                                        {post.content}
                                    </h2>
                                </a>
                                <p className="post-meta">{post.createdAt}</p>
                            </div>
                        )}
                        <hr />
                        <ul className="pager">
                            {currentSkip > 0 &&
                            <li className="previous">
                                <a href="javascript:void(0);" onClick={this.handleNewerPostsClick}>Newer Posts &larr;</a>
                            </li>        
                            }
                            <li className="next">
                                <a href="javascript:void(0);" onClick={this.handleOlderPostsClick}>Older Posts &rarr;</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}
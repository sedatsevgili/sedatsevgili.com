import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import Post from './Post.js';

export default class Posts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            skip: 0
        };
        this.handleOlderPostsClick = this.handleOlderPostsClick.bind(this);
        this.handleNewerPostsClick = this.handleNewerPostsClick.bind(this);
        this.init();
    }

    init() {
        axios.get('/posts?skip=' + this.props.skip).then(res => {
            this.setState({posts: res.data.posts, skip:this.props.skip});
        });
    }

    handleOlderPostsClick() {
        var newSkip = parseInt(this.state.skip) + 10;
        axios.get('/posts?skip=' + newSkip).then(res => {
            this.setState({posts: res.data.posts, skip: newSkip});
        });
    }

    handleNewerPostsClick() {
        var newSkip = parseInt(this.state.skip) - 10;
        if (newSkip < 0) {
            newSkip = 0;
        }
        axios.get('/posts?skip=' + newSkip).then(res => {
            this.setState({posts: res.data.posts, skip: newSkip});
        });
    }

    render() {
        const currentSkip = parseInt(this.state.skip);
        var newerSkipPath = '/';
        var olderSkipPath = '/skip/' + (currentSkip + 10);
        if (currentSkip > 10) {
            newerSkipPath = '/skip/' + (currentSkip - 10);
        }

        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                        {this.state.posts.map(post => 
                            <Post key={post.id} post={post} />
                        )}
                        <hr />
                        <ul className="pager">
                            {currentSkip > 0 &&
                            <li className="previous">
                                <Link to={`${newerSkipPath}`} onClick={this.handleNewerPostsClick}>Newer Posts &larr;</Link>
                            </li>        
                            }
                            {this.state.posts.length > 0 &&
                            <li className="next">
                                <Link to={`${olderSkipPath}`} onClick={this.handleOlderPostsClick}>Older Posts &rarr;</Link>
                            </li>        
                            }
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}
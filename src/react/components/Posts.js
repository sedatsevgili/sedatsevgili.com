import React from 'react';
import axios from 'axios';

export default class Posts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        };
    }

    componentDidMount() {
        axios.get('/posts').then(res => {
            this.setState({posts: res.data.posts});
        });
    }

    render() {

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
                        {/*<% }); %>
                        <!-- Pager -->
                        <%#
                        <ul class="pager">
                            <li class="next">
                                <a href="#">Older Posts &rarr;</a>
                            </li>
                        </ul>
                        %>
                        */}
                    </div>
                </div>
            </div>
        );
    }
}
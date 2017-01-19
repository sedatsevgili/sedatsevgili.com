import React from 'react';

export default class Posts extends React.Component {
    render() {

        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                        {/* <% posts.forEach(function(post) { %> */}
                        <div className="post-preview">
                            <a>
                                <h2 className="post-subtitle">
                                    Hello World!
                                    {/* <%= post.content %> */}
                                </h2>
                            </a>
                            <p className="post-meta">Posted at NOW! {/* <%= post.createdAt %> */}</p>
                        </div>    
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
import React, { Component } from 'react'
import Stats from './../Stats';
import GithubCorner from 'react-github-corner';

class Home extends Component {

  render() {
      return (
          <div>
            <div className="Home container">
                <Stats/>
            </div>
            <div>
                <GithubCorner href="https://github.com/cryptoDev222/block-explorer" octoColor="#303030" bannerColor="#00bc8c" direction="left" />
            </div>
        </div>
      );
  }
}

export default Home;
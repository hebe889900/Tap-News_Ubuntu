import './NewsPanel.css';
import React from 'react';
import NewsCard from '../NewsCard/NewsCard';
import Auth from '../Auth/Auth';
import _ from 'lodash';

class NewsPanel extends React.Component {
    constructor() {
        super();
        this.state = { news: null, pageNum: 1, loadedAll: false };
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        this.loadMoreNews();
        this.loadMoreNews = _.debounce(this.loadMoreNews, 1000);
        window.addEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        let scrollY = window.scrollY || 
                      window.pageYOffset || 
                      document.documentElement.scrollTop;
        
        if ((window.innerHeight + scrollY) >= (document.body.offsetHeight - 50)) {
            console.log('Loading more news');
            this.loadMoreNews();
        }                      
    }

    loadMoreNews() {
        if (this.state.loadedAll) {
            return;
        } 

        let url = '/news/userId/' + Auth.getEmail() + '/pageNum/' + this.state.pageNum;

        // in case user email has special character, which may affect the url interpolation, so need to use encodeURIComponent
        // to escape special character
        let request = new Request(encodeURI(url), {
            method: 'GET',
            cache: false,
            headers: {
                'Authorization': 'bearer ' + Auth.getToken()
            }
        });

        fetch(request)
            .then(res => res.json())
            .then(news => {
                if (!news || news.length === 0) {
                    this.setState({ loadedAll: true });
                }
                this.setState({
                    news: this.state.news ? this.state.news.concat(news) : news,
                    pageNum: this.state.pageNum + 1
                });                
            }); 
    }

    renderNews() {
        const news_list = this.state.news.map(function (news) {
            return(
                <a className='list-group-item' href="#">
                    <NewsCard news={news} />
                </a>
            );
        });

        return(
            <div className='container-fluid'>
                <div className='list-group'>
                    {news_list}
                </div>
            </div>
        )
    }

    render() {
        if (this.state.news) {
            return(
                <div>
                    {this.renderNews()}
                </div>
            );
        } else {
            return(
                <div>
                    <div id='msg-app-loading'>
                        Loading...
                    </div>
                </div>
            );
        }
    }
}

export default NewsPanel;

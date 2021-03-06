import styles from './index.less';
import { Component } from 'react';
import { getRecommendPixivAuthors } from '@/utils/api';
import { Link } from 'umi';

export default class PixivNovel extends Component<any,any>{

  componentDidMount(){
    getRecommendPixivAuthors().then((res:any)=>{
      this.setState({
        users: res,
        finish: true,
      })
    })
  }

  render() {
    if(!this.state?.finish) return null;
    const userEle = Object.entries(this.state.users).map(([name, id])=>{
      return (<div>
        <Link to={`/pixiv/user/${id}`}>{name}</Link>
      </div>);
    });
    return (
      <div>
        <h1>推荐作者</h1>
        {userEle}
      </div>
    );
  }
}

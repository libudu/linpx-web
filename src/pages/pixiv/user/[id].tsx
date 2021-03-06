import styles from './index.less';
import { Link } from 'umi';
import { Component } from 'react';
import { getPixivUser, getPixivNovelProfiles } from '@/utils/api';

// 小说简介
interface INovelProfile{
  id: string;
  title: string;
  coverUrl: string;
  tags: string[];
  userId: string;
  userName: string;
  desc: string;
}

// 用户信息
interface IUserInfo{
  id: string;
  novels: string[];
  name: string;
  imageUrl: string;
  comment: string;
  backgroundUrl?: string;
}

interface PixivNovelState{
  userInfo: IUserInfo;
  finish: boolean;
  novels: INovelProfile[];
}

export default class PixivNovel extends Component<any,PixivNovelState>{
  componentDidMount(){
    const id = this.props.match.params.id;
    getPixivUser(id).then((res:any)=>{
      if(res?.error) return this.props.history.push('/404');
      this.setState({
        userInfo: res
      });
      res.novels = res.novels.reverse();
      const novels = res.novels.slice(0, 30);
      getPixivNovelProfiles(novels).then((res:any)=>{
        this.setState({
          novels: res,
          finish: true
        });
      });
    })
  }

  render() {
    if(!this.state?.finish) return null;
    const { userInfo:{ name }, novels } = this.state;
    const novelEle = novels.reverse().map((ele:any)=>{
      return (<div key={ele.id}>
        <Link to={`/pixiv/novel/${ele.id}`}>{ele.title}</Link>
      </div>);
    });
    return (
      <div>
        <div>{name}</div>
        {novelEle}
      </div>
    );
  }
}

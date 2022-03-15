import { postApi } from '@/api';
import PageLayout from '@/components/PageLayout';
import React from 'react';
import { IRouteProps } from 'umi';

const Post: React.FC<{ match: IRouteProps }> = ({ match }) => {
  const id = match.params.id;
  const res = postApi.useOne(id);
  let children = null;
  if (res) {
    const { title, content } = res;
    children = (
      <div>
        <div>{title}</div>
        <div>{content}</div>
      </div>
    );
  }
  console.log(res);
  return <PageLayout title="帖子详情">{children}</PageLayout>;
};

export default Post;

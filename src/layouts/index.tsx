import { IRouteComponentProps, history } from 'umi';

const pageStack: any[] = [];

export default function Layout({ children }: IRouteComponentProps) {
  console.log(history, window.history.length);
  // pageStack.push(children)
  // 最外层框架，灰色
  // 内层居中的手机，白色
  // 页面，绝对定位
  return (
    <div className="h-screen bg-gray-100 text-xl flex">
      <div className="h-screen w-full max-w-md mx-auto bg-white overflow-y-scroll">
        {
          children
          // pageStack.map((ele,index)=>{
          //   return (<div className="h-screen w-full max-w-md absolute" key={index}>
          //     {ele}
          //   </div>);
          // })
        }
      </div>
    </div>
  );
}

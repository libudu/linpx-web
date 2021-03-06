import { IRouteComponentProps } from 'umi';

export default function Layout({ children }:IRouteComponentProps) {
  return (
    <div className="h-screen bg-gray-100 text-xl"> 
      <div className="h-screen max-w-md mx-auto bg-white overflow-y-scroll">
        {children}
      </div>
    </div>
  );
}
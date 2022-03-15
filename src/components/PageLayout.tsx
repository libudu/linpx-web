import { ContentNavbar } from './Navbar';
import { currDrawerPath } from '@/layouts/DrawerLayout';

interface IPageLayout {
  children: any;
  backToPath?: string;
  rightEle?: JSX.Element;
  title: string;
}

export default function PageLayout({
  children,
  title,
  rightEle,
  backToPath = currDrawerPath,
}: IPageLayout) {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-shrink-0 w-full absolute top-0 z-20">
        <ContentNavbar rightEle={rightEle} backTo={backToPath}>
          {title}
        </ContentNavbar>
      </div>
      <div className="flex-grow w-full overflow-x-hidden mt-12 pt-3">
        {children}
      </div>
    </div>
  );
}

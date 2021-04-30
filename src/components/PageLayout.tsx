import { ContentNavbar } from './Navbar';
import { currDrawerPath } from '@/layouts/DrawerLayout';

interface IPageLayout {
  children: any;
  backToPath?: string;
  title: string;
}

export default function PageLayout({
  children,
  title,
  backToPath = currDrawerPath,
}: IPageLayout) {
  return (
    <div className="h-screen flex flex-col w-full">
      <div className="flex-shrink-0">
        <ContentNavbar backTo={backToPath}>{title}</ContentNavbar>
      </div>
      <div className="overflow-y-scroll w-full overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}

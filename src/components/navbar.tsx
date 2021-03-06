interface IHeaderProps {
  title: string;
}

export default function({title}:IHeaderProps) {
  return (<div className="text-5xl text-center">
    {title}
  </div>);
}
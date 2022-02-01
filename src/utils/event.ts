import ReactGA from 'react-ga';

export const event = ({
  category,
  action,
}: {
  category: string;
  action: string;
}) => {
  ReactGA.event({
    category,
    action,
  });
};

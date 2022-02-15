import ReactGA from 'react-ga4';

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

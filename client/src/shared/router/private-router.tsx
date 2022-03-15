import { useLocation, Navigate } from 'react-router-dom';
import { ROUTES } from './routes';

type Props = Readonly<{
  isAuth: boolean;
  children: JSX.Element;
}>;

export const PrivateRoute = ({ isAuth, children }: Props) => {
  const location = useLocation();

  return !isAuth ? (
    <Navigate
      replace
      state={{
        from: location,
      }}
      to={ROUTES.home}
    />
  ) : (
    children
  );
};

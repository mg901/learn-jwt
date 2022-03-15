import { useContext, useEffect } from 'react';
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES, PrivateRoute } from '@/shared/router';
import { observer } from 'mobx-react-lite';
import { Context } from '@/context';

const HomePage = lazy(() => import('@/pages/home'));
const RegistrationPage = lazy(() => import('@/pages/registration'));
const LoginPage = lazy(() => import('@/pages/login'));
const NoMatch = lazy(() => import('@/pages/no-match'));

export const App = observer(() => {
  const { store } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, [store]);

  return (
    <Suspense fallback={<div>loading...</div>}>
      <Routes>
        <Route element={<RegistrationPage />} path={ROUTES.registration} />
        <Route element={<LoginPage />} path={ROUTES.login} />
        <Route
          element={
            <PrivateRoute isAuth>
              <HomePage />
            </PrivateRoute>
          }
          path={ROUTES.home}
        />
        <Route element={<NoMatch />} path="*" />
      </Routes>
    </Suspense>
  );
});

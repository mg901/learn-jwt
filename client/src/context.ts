import { createContext } from 'react';
import * as session from '@/features/session';

type State = {
  store: typeof session.store;
};

export const Context = createContext<State>({
  store: session.store,
});

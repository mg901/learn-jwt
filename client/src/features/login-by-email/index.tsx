import { useContext } from 'react';
import { Context } from '@/context';

export const LoginForm = () => {
  const { store } = useContext(Context);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    store.login(form.email.value, form.password.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input name="email" placeholder="Email" type="email" />
      </div>
      <div>
        <input name="password" placeholder="Password" type="password" />
      </div>
      <button type="submit">sign in</button>
    </form>
  );
};

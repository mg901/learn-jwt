import { useContext } from 'react';
import { Context } from '@/context';

export const RegistrationForm = () => {
  const { store } = useContext(Context);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    store.registration(form.email.value, form.password.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input name="email" placeholder="Email" type="email" />
      </div>
      <div>
        <input name="password" placeholder="Password" type="password" />
      </div>
      <button type="submit">sign up</button>
    </form>
  );
};

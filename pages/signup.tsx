import {
  useCallback,
  useEffect,
} from 'react';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import BareLayout from '../components/layouts/bareLayout';
import { isEmailUnique, isHandleUnique } from './api/handlers/userApiHandler';
import crypto, { Sign } from 'crypto';
import { hashPassword } from '../util/baseUtils';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

type SignupForm = {
  email: string,
  handle: string,
  password: string,
  passwordConfirmation: string,
}

export default function Index({ user }: { user: any }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>({
    reValidateMode: 'onSubmit',
  });

  useEffect(() => {
    // Prefetch the dashboard page
    router.prefetch('/studio');
  }, []);

  const submitSignupForm: SubmitHandler<SignupForm> = useCallback((data) => {
    const { salt, hash } = hashPassword(data.password);
    fetch('/api/user/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        handle: data.handle,
        hash,
        salt,
      }),
    }).then((res) => {
      // Do a fast client-side transition to the already prefetched dashboard page
      if (res.ok) router.push('/studio');
    }).catch(() => {
    });
  }, []);

  const renderFieldRequired = (message = 'This field is required') => {
    return (
      <p className={'form__error'}>{message}</p>
    );
  };

  return (
    <BareLayout>
      <div className={'flex-container'}>
        <div className={'signup-container'}>
          <h1>Create An Account</h1>

          <form onSubmit={handleSubmit(submitSignupForm)}>
            <div className={'input-container'}>
              <label>Email</label>
              <input type={'text'}
                     id={'email'}
                     {...register('email', {
                       required: true,
                       pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                       // validate: (value, formValues) => {
                       //   return !isEmailUnique(value);
                       // }
                     })}
              />
              {errors?.email?.type === 'required' && renderFieldRequired()}
              {errors?.email?.type === 'pattern' && renderFieldRequired('Email is invalid')}
              {errors?.email?.type === 'validate' && renderFieldRequired('Email is already taken')}
            </div>
            <div className={'input-container'}>
              <label>Username</label>
              <input type={'text'}
                     id={'handle'}
                     {...register('handle', {
                       required: true,
                       maxLength: 20,
                       // validate: (value, formValues) => {
                       //   return !isHandleUnique(value);
                       // }
                     })}
              />
              {errors?.handle?.type === 'required' && renderFieldRequired()}
              {errors?.handle?.type === 'maxLength' && renderFieldRequired()}
              {errors?.handle?.type === 'validate' && renderFieldRequired('Username is already taken')}
            </div>
            <div className={'input-container'}>
              <label>Password</label>
              <input type={'password'}
                     id={'password'}
                     {...register('password', {
                       required: true,
                       minLength: 6,
                     })}
              />
              {errors?.password?.type === 'required' && renderFieldRequired()}
              {errors?.password?.type === 'minLength' && renderFieldRequired('Password must be at least 8 characters')}
            </div>
            <div className={'input-container'}>
              <label>Confirm Password</label>
              <input type={'password'}
                     id={'passwordConfirmation'}
                     {...register('passwordConfirmation', {
                       required: true,
                     })}
              />
              {errors?.passwordConfirmation?.type === 'required' && renderFieldRequired()}
            </div>
            <div className={'form-row'}>
              <button type={'submit'}>Create Account</button>
            </div>
          </form>
        </div>
      </div>
    </BareLayout>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      props: {
      }
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/studio',
      }
    };
  }
};
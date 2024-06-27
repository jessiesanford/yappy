import { FormEvent, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { BareLayout } from '../components/layouts';
import { signIn, SignInResponse } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

type LoginForm = {
  email: string,
  password: string,
}

export default function Index({ user }: { user: any }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginForm>({
    reValidateMode: 'onSubmit',
  });

  const submitLoginForm: SubmitHandler<LoginForm> = useCallback((data) => {
    signIn('credentials', { email: data.email, password: data.password, redirect: false }).then((res: SignInResponse | undefined) => {
      if (res) {
        if (res.ok) {
          router.push('/studio');
        }

        if (res.error) {
          console.log(res.error);
        }
      }
    }).catch((e) => {
      console.log(e);
    });
  }, [router]);

  useEffect(() => {
    router.prefetch('/studio');
  }, [router]);

  const renderFieldRequired = (msg = 'This field is required') => {
    return (
      <div className={'form__error'}>
        {msg}
      </div>
    );
  };

  return (
    <BareLayout>
      <div className={'flex-container'}>
        <div className={'signup-container'}>
          <h1>Login</h1>
          <form onSubmit={handleSubmit(submitLoginForm)}>
            <div className={'input-container'}>
              <label htmlFor={'password'}>Email</label>
              <input type={'text'}
                     {...register('email', {
                       required: true,
                     })}
              />
              {errors?.email?.type === 'required' && renderFieldRequired()}
            </div>
            <div className={'input-container'}>
              <label htmlFor={'password'}>Password</label>
              <input type={'password'}
                     {...register('password', {
                       required: true,
                     })}
              />
              {errors?.password?.type === 'required' && renderFieldRequired()}
            </div>
            <div className={'form-row'}>
              <button type={'submit'}>Login</button>
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
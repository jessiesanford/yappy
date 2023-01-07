import BaseLayout from "../components/layouts/baseLayout";
import {FormEvent, useCallback, useEffect} from "react";
import { useRouter } from "next/router";

export default function Index({ user }: { user: any }) {
  const router = useRouter()
  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault()

    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        /* Form data */
      }),
    }).then((res) => {
      // Do a fast client-side transition to the already prefetched dashboard page
      if (res.ok) router.push('/dashboard')
    })
  }, [])

  useEffect(() => {
    // Prefetch the dashboard page
    router.prefetch('/dashboard')
  }, [])

  return (
    <BaseLayout>
      <div>
        <div>Login</div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div>
            <input type={'text'} name={'email'}/>
          </div>
          <div>
            <input type={'password'} name={'password'}/>
          </div>
          <button type={'submit'}>Login</button>
        </form>
      </div>
    </BaseLayout>
  )
}
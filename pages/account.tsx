import BaseLayout from "../components/layouts/baseLayout";

export default function Account({ user }: any) {
  return (
    <BaseLayout title={'Account'}>

    </BaseLayout>
  )
}

export async function getStaticProps() {
  // const res = await fetch('someEndPoint');
  // const user = await res.json();

  return {
    props: {
      // user,
    },
  }
}
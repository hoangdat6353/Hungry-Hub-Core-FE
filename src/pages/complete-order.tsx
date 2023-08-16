import React, { useEffect } from 'react';
import Container from '@components/ui/container';
import Layout from '@components/layout/layout';
import OrderInformation from '@components/order/order-information';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import Divider from '@components/ui/divider';
import { useCart } from '@contexts/cart/cart.context';
import Seo from '@components/seo/seo';
import { useRouter } from 'next/router';

export default function Order() {
  const { resetCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      // Reset the cart when the user navigates away from the page
      resetCart();
    };

    router.events.on('routeChangeStart', handleRouteChange);

    // Clean up by removing the event listener when the component unmounts
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [resetCart, router]);

  return (
    <>
      <Seo
        title="Order"
        description="Fastest E-commerce template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        path="complete-order"
      />
      <Divider />
      <Container>
        <OrderInformation />
      </Container>
      <Divider />
    </>
  );
}

Order.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        'common',
        'forms',
        'menu',
        'footer',
      ])),
    },
  };
};

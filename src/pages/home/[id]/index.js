import React from 'react';
import Head from 'next/head';
import Navigation from '../../../components/Navigation';
import styles from '../../../styles/Home.module.css';
import RecipeGrid from '../../../components/RecipeGrid';
import { Router, useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home(props) {
    
    const router = useRouter()
    const { id } = router.query
    const locale = router.locale
    const { t } = useTranslation('preference');
    const recommendations = t('Recommendations');
    const help = t('Help');
    const account = t('Account');
    //console.log(help)

    if (Object.keys(props.data).length === 0){
      console.log("No Cookie");
      Router.push('/');
    }

    return (
        <>
      <div className={styles.homepagebackground}>
        <Head>
          <title>Recipify</title>
          <meta name="description" content="Recipify" />
          <link rel="icon" href="/logo.ico" />
        </Head>
  
        <Navigation locale={locale} account={account} recommendations = {recommendations} help={help}></Navigation>
        <RecipeGrid user_id = {id}>
        </RecipeGrid>
        </div>
        </>
    )
}

export async function getServerSideProps  ({ locale, req, res })  {
  const data = req.cookies;
  if (Object.keys(data).length === 0){
    return { 
    redirect: {
      destination: "/"
    }
  }
}
  return { props: {
    ...(await serverSideTranslations(locale, ['preference'])),
    data
  },
};
}
import React from 'react';
import Head from 'next/head';
import Navigation from '../../../components/Navigation';
import styles from '../../../styles/Home.module.css';
import { useRouter } from 'next/router';
import PreferenceForm from '../../../components/PreferenceForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function Account(props) {
    const router = useRouter()
    const { id } = router.query
    const locale = router.locale
    const { t } = useTranslation('preference');
    const recommendations = t('Recommendations');
    const help = t('Help');
    const account = t('Account');
    
    return (
        <>
      <div className={styles.homepagebackground}>
        <Head>
          <title>Recipify</title>
          <meta name="description" content="Recipify" />
          <link rel="icon" href="/logo.ico" />
        </Head>
  
        <Navigation locale={locale} account={account} recommendations = {recommendations} help={help}></Navigation>
        <br></br>
        <PreferenceForm id = {id} localisation = { t }></PreferenceForm>
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
  },
};
}
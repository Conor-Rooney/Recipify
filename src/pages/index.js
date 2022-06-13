import React from 'react';
import Head from 'next/head';
import LoginModal from '../components/LoginModal';
import SignUpModal from '../components/SignUpModal';
import styles from '../styles/Home.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router'

export default function Home(props) {
  const router = useRouter();
  const { t } = useTranslation('common');

  const user_prompt = t('user_prompt');
  const password_prompt = t('password_prompt');
  const username_label = t('username_label');
  const password_label = t('password_label');
  const login_button = t('login_button');
  const signup_button = t('signup_button')
  const details = t('details')
  const submit = t('submit')

  return (
    <div>
    <div className={styles.righthalf}></div>
    <div className={styles.lefthalf}>
        <Head>
          <title>Recipify</title>
          <meta name="description" content="Recipify" />
          <link rel="icon" href="/logo.ico" />
        </Head>

      <main className={styles.main}>
        <img src="../logo.png" alt="Recipify Logo" className={styles.img}></img>

          <p className={styles.description}>
          {t('welcome')} <br></br> {t('introduction')}
          </p>

          <div className={styles.grid}>
            <LoginModal className='loginbutton' 
            user_prompt = {user_prompt}
            password_prompt = {password_prompt}
            username_label = {username_label}
            password_label = {password_label}
            login_button = {login_button}
            details = {details}
            submit = {submit}>
            </LoginModal>

            <h6 className={styles.or}>{t('or')}</h6>

            <SignUpModal className='SignUpbutton'
            user_prompt = {user_prompt}
            password_prompt = {password_prompt}
            username_label = {username_label}
            password_label = {password_label}
            signup_button = {signup_button}
            details = {details}
            submit = {submit}
            >

            </SignUpModal>
        </div>
      </main>
    </div>
    </div>
  )
}


export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}



import React from 'react';
import Head from 'next/head';
import Navigation from '../../../components/Navigation';
import styles from '../../../styles/Home.module.css';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function Help(props) {
    const router = useRouter()
    const { id } = router.query
    const locale = router.locale
    const { t } = useTranslation('help');
    const recommendations = t('Recommendations');
    const help = t('Help');
    const account = t('Account');
    const allergies = t('Allergies');
    const allergy_desc = t('Allergy_desc');
    const diets = t('Diets');
    const diet_desc = t('Diet_desc');
    const liked_recipes = t('Liked_recipes');
    const liked_recipes_desc = t('Liked_recipes_desc');
    const tried_recipes = t('Tried_recipes');
    const tried_recipes_desc = t('Tried_recipes_desc');
    const disliked_recipes = t('Disliked_recipes');
    const disliked_recipes_desc = t('Disliked_recipes_desc');
    const location = t('Location');
    const location_desc = t('Location_desc');
    const delete_account = t('Delete');
    const delete_desc = t('Delete_desc');
    const save_preferences = t('Save_preferences');
    const save_preferences_desc = t('Save_preferences_desc');
    const recommended_recipes = t('Recommended_recipes');
    const recommended_recipes_desc = t('Recommended_recipes_desc');
    const recipe = t('Recipe');
    const recipe_desc = t('Recipe_Desc');
    const like = t('Like');
    const like_desc = t('Like_desc');
    const tried = t('Tried');
    const tried_desc = t('Tried_desc');
    const dislike = t('Dislike');
    const dislike_desc = t('Dislike_desc');
    const exit = t('Exit');
    const exit_desc = t('Exit_desc');
    
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
        <h1 className={styles.helptitle1}>{account}:</h1>
        <div className={styles.helpbox}>
            <h3>{allergies}: </h3>
              <h6>{allergy_desc}</h6>
              <br></br>
            <h3>{diets}: </h3>
              <h6>{diet_desc}</h6>
              <br></br>
            <h3>{liked_recipes}: </h3>
              <h6>{liked_recipes_desc}</h6>
              <br></br>
            <h3>{tried_recipes}: </h3>
              <h6>{tried_recipes_desc}</h6>
              <br></br>
            <h3>{disliked_recipes}: </h3>
              <h6>{disliked_recipes_desc}</h6>
              <br></br>
            <h3>{location}: </h3>
              <h6>{location_desc}</h6>
              <br></br>
            <h3>{delete_account}: </h3>
              <h6>{delete_desc}</h6>
              <br></br>
            <h3>{save_preferences}: </h3>
              <h6>{save_preferences_desc}</h6>
        </div>

        <br></br>
        <h1 className={styles.helptitle2}>{recommendations}:</h1>
        <div className={styles.helpbox}>
            <h3>{recommended_recipes}: </h3>
              <h6>{recommended_recipes_desc}</h6>
              <br></br>
            <h3>{recipe}: </h3>
              <h6>{recipe_desc}</h6>
              <br></br>
            <h3>{like}: </h3>
              <h6>{like_desc}</h6>
              <br></br>
            <h3>{tried}: </h3>
              <h6>{tried_desc}</h6>
              <br></br>
            <h3>{dislike}: </h3>
              <h6>{dislike_desc}</h6>
              <br></br>
            <h3>{exit}: </h3>
              <h6>{exit_desc}</h6>
        </div>
        <br></br>

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
    ...(await serverSideTranslations(locale, ['help'])),
  },
};
}
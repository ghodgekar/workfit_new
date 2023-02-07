import { IonButton, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonListHeader, IonPage, IonRadio, IonRadioGroup, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { searchOutline } from 'ionicons/icons'
import React, { useEffect, useState } from 'react';
import { Browser } from '@capacitor/browser';
import { useHistory } from 'react-router-dom';
import '../css/search.css';
import { App } from '@capacitor/app';
let searchJSON = {
  googleScholar: {
    title: "",
    author: "",
    article: "",
    abstract: ""
  },
  pubMed: {
    title: "",
    author: "",
    article: "",
    abstract: ""
  },
  cochranelibrary: {
    title: "",
    author: "",
    article: "",
    abstract: ""
  },
  scienceDirect: {
    title: "",
    author: "",
    article: "",
    abstract: ""
  }
}
let googleScholarUrl = "https://scholar.google.com/scholar?&q="
let pubMedUrl = "https://pubmed.ncbi.nlm.nih.gov/?term="
// let cochranelibraryUrl = "https://www.cochranelibrary.com/search?p_p_id=scolarissearchresultsportlet_WAR_scolarissearchresults&p_p_lifecycle=0&_scolarissearchresultsportlet_WAR_scolarissearchresults_searchType=basic&_scolarissearchresultsportlet_WAR_scolarissearchresults_searchBy=8&_scolarissearchresultsportlet_WAR_scolarissearchresults_searchText="
let cochranelibraryUrl="https://www.cochranelibrary.com/advanced-search?t=1&q="
let scienceDirectUrl="https://www.sciencedirect.com/search?"

const Search: React.FC = () => {
  const [inputVal, setinputVal] = useState("")
  const [IsError, setIsError] = useState(false)
  const [searchType, setsearchType] = useState("title")
  // const [type, settype] = useState("")
  const history = useHistory();
  async function changeInput(searchText) {
    searchJSON = {
      googleScholar: {
        title: "allintitle:" + searchText,
        article: searchText + " OR",
        author : "author:" + searchText,
        abstract: "source:" + searchText
      },
      pubMed: {
        title: searchText + "[ti]",
        author: searchText + "[au]",
        article: searchText ,
        abstract: searchText + "[tiab]"
      },
      cochranelibrary: {
        title: "ti:"+searchText ,
        author: "au:"+searchText ,
        article: searchText,
        abstract: "ab:"+searchText 
      },
      scienceDirect:{
        title: "title="+searchText ,
        author: "authors="+searchText ,
        article: "qs="+searchText,
        abstract: "tak="+searchText 
      }
    }
    setinputVal(searchText)
  }

  async function openSearch(type) {
    if ((!inputVal || (inputVal && !inputVal.trim())) || !searchType || !type) {
      setIsError(true)
      return false
    }
    let searchCriteria = searchJSON[type][searchType]
    console.log("inputVal", inputVal)
    if(type != "scienceDirect"){
     searchCriteria = encodeURIComponent(searchJSON[type][searchType])

    }
    let URL = ""
    if (type == "googleScholar") {
      URL = googleScholarUrl + searchCriteria
    }
    if (type == "pubMed") {
      URL = pubMedUrl + searchCriteria
    }
    if (type == "cochranelibrary") {
      URL = cochranelibraryUrl + searchCriteria
    }
    if (type == "scienceDirect") {
      URL = scienceDirectUrl + searchCriteria
    }
    console.log({ URL });
    setinputVal("")
    setsearchType("title")

    await Browser.open({ url: URL ,windowName:'_self'});

  }

  // useEffect(() => {
  //   // App.addListener('backButton', () => { history.push("/") })
  //   App.addListener('backButton', () => { window.history.pushState({urlPath:'/'},"",'/')})
    
  // }, [])
  return (
    <IonPage>
      <IonHeader>
        {/* <IonToolbar>
          <IonTitle>Search</IonTitle>
        </IonToolbar> */}
        <div className="logoImgContainer">
          {/* <h4>Search</h4> */}
          <img className="landingLogo" src="/assets/images/home.png" />
          {/* <IonIcon icon={menu} className="menuLogo" onClick={() => { setshowMenu(!showMenu) }} /> */}
        </div>
      </IonHeader>
      <IonContent fullscreen>
        <div className="searchContainer">
          <input type="text" placeholder="Enter Search Text Here...." className='inputSearch' value={inputVal} onChange={(e) => { changeInput(e.target.value) }} />
          {/* <IonIcon icon={searchOutline} className='search' /> */}
        </div>


          <IonRadioGroup
            // allowEmptySelection
            value={searchType}
            onIonChange={(e) => {
              setsearchType(e.detail.value)
            }} >

            <IonItem lines='none'>
              <IonLabel>Title</IonLabel>
              <IonRadio value="title" slot="start" />
            </IonItem>

            <IonItem lines='none'>
              <IonLabel>Abstract</IonLabel>
              <IonRadio value="abstract" slot="start" />
            </IonItem>

            <IonItem lines='none'>
              <IonLabel>Article</IonLabel>
              <IonRadio value="article" slot="start" />
            </IonItem>

            <IonItem lines='none'>
              <IonLabel>Author</IonLabel>
              <IonRadio value="author" slot="start" />
            </IonItem>

          </IonRadioGroup>
        


        <IonGrid>
          <IonRow><IonButton className="webBtn" onClick={() => { openSearch("googleScholar") }} >Google Scholar</IonButton></IonRow>
          <IonRow><IonButton className="webBtn" onClick={() => { openSearch("pubMed") }}>PubMed</IonButton></IonRow>
          {/* <IonRow><IonButton className="webBtn" onClick={() => { openSearch("cochranelibrary") }}>Cochrane Library</IonButton></IonRow> */}
          <IonRow><IonButton className="webBtn" onClick={() => { openSearch("scienceDirect") }}>Science Direct</IonButton></IonRow>
          </IonGrid>


      </IonContent>
    </IonPage>
  );
};

export default Search;
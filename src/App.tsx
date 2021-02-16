import React, { useState, useRef } from "react";
import { ALL_COUNTS } from "./constants/constants";
import {
  IonApp,
  IonHeader,
  IonContent,
  IonToolbar,
  IonButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonToggle,
  IonText,
  IonImg,
  IonAlert,
} from "@ionic/react";

import firebase from "./firebaseConfig";

import {
  heartOutline,
  flameOutline,
  peopleCircleOutline,
} from "ionicons/icons";

import { AdOptions, AdSize, AdPosition, AdMobPlugin } from "capacitor-admob";

import { Plugins } from "@capacitor/core";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

/* Custom styling */
import "./styles/styles.css";
import logo from "./images/logo.svg";

const App: React.FC = () => {
  const [quote, setQuote] = useState("...");
  const [author, setAuthor] = useState();
  const [authorized, setAuthorized] = useState(false);
  const [currentTypeCount, setCurrentTypeCount] = useState(0);
  const [authorHidden, setAuthorHidden] = useState(true);
  const [captionType, setCaptionType] = useState(null);
  const [showAlert1, setShowAlert1] = useState(false);
  const [admobInitHasRan, setadmobInitHasRan] = useState(false);

  const { Clipboard } = Plugins;
  const AdMob = Plugins.AdMob as AdMobPlugin;

  const captionTypes: string[] = ["romantic", "motivational", "funny"];

  const showTabBanner = () => {
    const options: AdOptions = {
      adId: "ca-app-pub-9214368890231884/4469593432",
      position: AdPosition.BOTTOM_CENTER,
      adSize: AdSize.SMART_BANNER,
    };

    AdMob.showBanner(options).then(
      (value) => {
        console.log(value); // true
      },
      (error) => {
        console.error(error); // show error
      }
    );
  };

  const loadQuote = () => {
    // Ask for quote from backend
    const dbref = firebase
      .database()
      .ref("captions/" + captionType + "/" + getRandomInt(currentTypeCount));

    dbref.on("value", function (snapshot) {
      setQuote(snapshot.val().text);
      setAuthor(snapshot.val().from);
    });
    console.log("QUOTE ASKED");
  };

  const loadData = () => {
    if (firebase.auth().currentUser) {
      loadQuote();
    } else {
      // Authorize user anonymously
      firebase
        .auth()
        .signInAnonymously()
        .then(() => {})
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
        });

      setAuthorized(true);
    }
  };

  const copyToClipboard = (quote: string, quoteAuthor: string) => {
    let textToCopy: string;

    if (authorHidden) {
      textToCopy = quote;
    } else {
      textToCopy = '"' + quote + '"' + " - " + quoteAuthor;
    }

    Clipboard.write({
      string: textToCopy,
    });

    setShowAlert1(true);
  };

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  if (!admobInitHasRan) {
    AdMob.initialize({ appId: "ca-app-pub-9214368890231884~7095756774" });
    setadmobInitHasRan(true);
  }

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar color="primary">
          <IonImg className="logo-img" src={logo} />
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow>
            <div className="center wide">
              <div className="choices">
                <div className="center wide">
                  <p>Choose caption type :</p>
                </div>

                <IonSegment
                  color="tertiary"
                  onIonChange={(e) => {
                    setCaptionType(e.detail.value);
                    if (e.detail.value === captionTypes[0]) {
                      setCurrentTypeCount(ALL_COUNTS[0]);
                    } else if (e.detail.value === captionTypes[1]) {
                      setCurrentTypeCount(ALL_COUNTS[1]);
                    } else {
                      setCurrentTypeCount(ALL_COUNTS[2]);
                    }
                  }}
                >
                  <IonSegmentButton
                    value={captionTypes[0]}
                    style={{ fontSize: "13px" }}
                  >
                    <IonLabel>Romantic</IonLabel>
                    <IonIcon icon={heartOutline}></IonIcon>
                  </IonSegmentButton>
                  <IonSegmentButton
                    value={captionTypes[1]}
                    style={{ fontSize: "13px" }}
                  >
                    <IonLabel>Motivational</IonLabel>
                    <IonIcon icon={flameOutline}></IonIcon>
                  </IonSegmentButton>
                  <IonSegmentButton
                    value={captionTypes[2]}
                    style={{ fontSize: "13px" }}
                  >
                    <IonLabel>Funny</IonLabel>
                    <IonIcon icon={peopleCircleOutline}></IonIcon>
                  </IonSegmentButton>
                </IonSegment>
              </div>
            </div>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonButton
                className="wide"
                onClick={loadData}
                disabled={captionType === null}
              >
                {authorized ? "Generate" : "Start session"}
              </IonButton>
            </IonCol>
          </IonRow>

          <IonRow className="ion-justify-content-center">
            <IonCard color="light">
              <IonCardContent className="ion-text-capitalize">
                <IonText color="dark">
                  <h2>{quote}</h2>
                </IonText>
                <IonText color="medium" hidden={authorHidden}>
                  - {author}
                </IonText>
              </IonCardContent>
            </IonCard>
          </IonRow>

          <IonRow className="ion-justify-content-end">
            <div className="author-box">
              <IonLabel>Author</IonLabel>
              <IonToggle
                name="author"
                color="primary"
                checked={!authorHidden}
                onIonChange={(e) => setAuthorHidden(!authorHidden)}
              ></IonToggle>
            </div>
          </IonRow>

          <IonRow>
            <IonButton onClick={() => showTabBanner()}>show ad</IonButton>
            <div className="button-container">
              <IonButton onClick={() => copyToClipboard(quote, author)}>
                Copy Caption
              </IonButton>
            </div>
          </IonRow>
        </IonGrid>

        <IonAlert
          isOpen={showAlert1}
          onDidDismiss={() => setShowAlert1(false)}
          header={"Success"}
          message={"Caption copied to clipboard"}
          buttons={["OK"]}
          cssClass={"alert-bg"}
        />
      </IonContent>
    </IonApp>
  );
};

export default App;

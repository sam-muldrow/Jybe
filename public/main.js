
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyD5urxo4Ol6p7uA-wZbV6Cr4tBqmz9ye9Q",
    authDomain: "jybe-c4974.firebaseapp.com",
    projectId: "jybe-c4974",
    storageBucket: "jybe-c4974.appspot.com",
    messagingSenderId: "1020855075768",
    appId: "1:1020855075768:web:d8c7542cf1e05d7773854d",
    measurementId: "G-2DBER4XYW9"
    };
    // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();



  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        document.getElementById('signIn').style.display = 'none';
        document.getElementById('mainJybe').style.display = 'block';
        return false;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,

    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
  };

  ui.start('#firebaseui-auth-container', uiConfig);

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      document.getElementById('signIn').style.display = 'none';
      document.getElementById('mainJybe').style.display = 'block';
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      var user = firebase.auth().currentUser;
      var uid = user.uid
      var db = firebase.firestore();
      
  
      var docRef = db.collection("users").doc(uid);
  
      docRef.get().then(function(doc) {
          if (doc.exists) {
              console.log("Document data:", doc.data());
              firebase.firestore().collection("users").doc(uid)
              .onSnapshot((doc) => {
                  console.log("Current data: ", doc.data());
                  showJybes(doc.data());
              });
  
          } else {
              db.collection("users").doc(uid).set({
                "jybes": [],
              })
              .then(function() {
                  console.log("Document successfully written!");
              })
              .catch(function(error) {
                  console.error("Error writing document: ", error);
              })
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });

      
      // ...
    } else {
      // User is signed out
      // ...
    }
  });
  document.getElementById("createJybeText").addEventListener("click", getInputDataText);
  document.getElementById("createJybeLink").addEventListener("click", getInputDataLink);
  document.getElementById("createJybeFile").addEventListener("click", getInputDataFile);

  function getInputDataFile() {
    jybeFiles = document.getElementById("files").files;
    writeUserDataFile(jybeFiles);
  }

  function getInputDataText() {
    var jybeText = document.getElementById("jybeInputText").value;
    writeUserData(jybeText);
    document.getElementById("jybeInputText").value = "";
  }

  function getInputDataLink() {
    var jybeText = document.getElementById("jybeInputLink").value;
    writeUserDataLink(jybeText);
    document.getElementById("jybeInputLink").value = "";
  }
  function forceDownload(blob, filename) {
    var a = document.createElement('a');
    a.download = filename;
    a.href = blob;
    // For Firefox https://stackoverflow.com/a/32226068
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  
  // Current blob size limit is around 500MB for browsers
  function downloadResource(url, filename) {
    if (!filename) filename = url.split('\\').pop().split('/').pop();
    fetch(url, {
        headers: new Headers({
          'Origin': location.origin
        }),
        mode: 'cors'
      })
      .then(response => response.blob())
      .then(blob => {
        let blobUrl = window.URL.createObjectURL(blob);
        forceDownload(blobUrl, filename);
      })
      .catch(e => console.error(e));
  }
  


function writeUserDataFile(jybeFiles) {
  var user = firebase.auth().currentUser;
  var userId = user.uid;
  var db = firebase.firestore();
  var storage = firebase.storage().ref();
  var jybeRef = db.collection("users").doc(userId);
  if (user) {
      date = Date.now();
      betterDate = new Date().toLocaleString();
      var storageRef = storage.child('/users/' + userId + '/' + date + '/');
      var jybeObject = {
          "jybeText": "",
          "jybeType": "fileObject",
          "Time": betterDate,
          "exactTime": date,
      }
      jybeRef.update({
          jybes: firebase.firestore.FieldValue.arrayUnion(jybeObject)
      }, { merge: true });
      console.log(files, files.type, files.length);
      console.log(jybeFiles[0].name);
      for (let i = 0; i < jybeFiles.length; i++) {
        file = jybeFiles[i];
        var storageRef = storage.child('/users/' + userId + '/' + date + '/' + file.name);
        storageRef.put(file).then((snapshot) => {
          console.log('Uploaded a blob or file!');
        });
      }
  } else {
  // No user is signed in.
  }
}
// Write a Jybe to the databse
function writeUserData(jybeText) {
    var user = firebase.auth().currentUser;
    var userId = user.uid;
    var db = firebase.firestore()
    var jybeRef = db.collection("users").doc(userId);
    if (user) {
        date = Date.now();
        betterDate = new Date().toLocaleString();
        var jybeObject = {
            "jybeText": jybeText,
            "jybeType": "textObject",
            "Time": betterDate,
        }
        jybeRef.update({
            jybes: firebase.firestore.FieldValue.arrayUnion(jybeObject)
        }, { merge: true });
    } else {
    // No user is signed in.
    }
  }


// Write Link Jybe to database
function writeUserDataLink(jybeLink) {
  var user = firebase.auth().currentUser;
  var userId = user.uid;
  var db = firebase.firestore()
  var jybeRef = db.collection("users").doc(userId);
  if (user) {
      date = Date.now();
      betterDate = new Date().toLocaleString();
      var jybeObject = {
          "jybeText": jybeLink,
          "jybeType": "linkObject",
          "Time": betterDate,
      }
      jybeRef.update({
          jybes: firebase.firestore.FieldValue.arrayUnion(jybeObject)
      }, { merge: true });
  } else {
  // No user is signed in.
  }
}


  // Show Our Jybes
  async function showJybes(jybeObject) {
    var user = firebase.auth().currentUser;
    var userId = user.uid;
    var storage = firebase.storage().ref();
    document.getElementById("jybes").innerHTML = "";
    jybeArray = jybeObject.jybes;
    for (let i = jybeArray.length - 1; i >= 0; i--) {
      var jybe = jybeArray[i];
      if(jybe.jybeType == "textObject"){
        document.getElementById("jybes").innerHTML += jybe.Time + " || " + jybe.jybeText + "<br></br>";
      } else if (jybe.jybeType == "linkObject") {
        document.getElementById("jybes").innerHTML += jybe.Time + " || <a href='"+ jybe.jybeText +"'>" + jybe.jybeText + "</a> <br></br>";
      } else if (jybe.jybeType == "fileObject") {
        var storageRef = storage.child('/users/' + userId + '/' + jybe.exactTime + '/');
        var displayString = jybe.Time + " || Jybe Files: ";
        await storageRef.listAll()
        .then(async (res) => {
          res.items.forEach(async (itemRef) => {
            var downloadURL = await itemRef.getDownloadURL();
            console.log(downloadURL);
            displayString += "<a href='" + downloadURL + "' download='" + itemRef.name + "'>" + itemRef.name + "</a> ";
            document.getElementById("jybes").innerHTML += displayString + "<br></br>";
          });
        }).catch((error) => {
          // Uh-oh, an error occurred!
        });
        
      }

      
    }
  }


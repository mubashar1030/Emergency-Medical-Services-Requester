import { auth, db, firebase, admin } from './ApiInfo';

let CurrentEmail = '';
let CurrentUser = null;
let imageURL = '';

// Checks with the databse if the user trying to login/sign up is valid.
// Validity is based on whether the user exists in the database and if the 
//  entered email on sign up is a valid one.
async function is_valid_user(Email, Password) {
    console.log("valid user")
    let isValid = true;
    await auth.signInWithEmailAndPassword(Email, Password).catch((err) => {
        isValid = false;
    });
    console.log("Is-valid")
    console.log(isValid)
    return isValid;
}

// Retrives the user's details after he/she has been authenticated.
async function get_user(userID) {
    console.log("get user")
    let snapshot = null
    await db.collection('users').where("email", '==', userID).get()
        .then(snap => {
            if (snap.empty) {
                console.log('query failed')
                return null;
            }
            else {
                const data = snap.docs.map(doc => {
                    let obj = doc.data()
                    obj['key'] = doc.id
                    console.log("getuser", obj)
                    return obj
                });
                snapshot = data[0];
            }
        })
    if (snapshot === null) {
        return null;
    } else {
        return snapshot;
    }
}

// This function uses the sign up details enetered by the user and
//  saves them in the database.
async function signup(userProfile, Password, uri) {
    if (userProfile === undefined || Password === undefined)
        return 0;

    CurrentUser = userProfile;
    CurrentEmail = userProfile['email'];

    let unique_id = userProfile['email'];
    let snapshot = await get_user(unique_id);

    if (snapshot != null) {
        console.log("Error: User Already Exists");
        return 0;
    }

    let response = await auth.createUserWithEmailAndPassword(userProfile['email'], Password)
        .then(() => { return true; })
        .catch(() => { return false; });
    if (!response) {
        return response;
    }
    await db.collection('users').add(userProfile)

    uploadImage(uri, userProfile["email"])
        .then(() => {
            console.log("Success: Image Uploaded");
        })
        .catch((error) => {
            console.log("Error: Image Upload Unsuccessful");
            console.log(error);
        })
    imageURL = await downloadPhoto();
    console.log("Success: New User Created")
    return 1;
};

// This function uses the the details input by an administrator to create a new 
//  EMS Member account.
async function addNewEmsMember(userProfile, Password) {
    if (userProfile === undefined || Password === undefined)
        return 0;

    let unique_id = userProfile['email'];
    let snapshot = await get_user(unique_id);

    if (snapshot != null) {
        console.log("Error: User Already Exists");
        return 0;
    }

    await auth.createUserWithEmailAndPassword(userProfile['email'], Password);
    await db.collection('users').add(userProfile)

    console.log("Success: New EMS Member Created")
    return 1;
};

// This is the initial function that is called by the 'LoginScreen' page
const signin = async (Email, Password) => {
    console.log("Sign In Requested")
    let verify = await is_valid_user(Email, Password);
    if (!verify) {
        return null;
    }
    CurrentEmail = Email;
    CurrentUser = await get_user(Email);
    console.log('returning', CurrentUser);
    imageURL = await downloadPhoto();
    return CurrentUser;
};

"This function is used to upload the user's photo to the firebase storage"
const uploadImage = async (uri, imageName) => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        var user = auth.currentUser;
        var ref = firebase.storage().ref().child("profile photo/" + user.email);
        await ref.put(blob);

        console.log("Success: Image Upload Complete")
    }
    catch (error) {
        console.log("Error: Image Could Not Be Uploaded");
    }

    return
}

// This function retrives the user's photo from the firebase storage.
const downloadPhoto = async () => {
    var URL;
    try {
        var ref = await firebase.storage().ref("profile photo").child(CurrentEmail).getDownloadURL().then(url => {
            URL = url;
        });
        console.log("Success: Image Retrived From Database")
    }
    catch (error) {
        console.log("Warning: Image Not Found In Database");
        return "https://therminic2018.eu/wp-content/uploads/2018/07/dummy-avatar-300x300.jpg";
    }

    return URL;
}

// This function is used by other pages to retrive the URL of the already downloaded url of the
//  user's photo for quick access. 
const photoUrlRetriver = () => {
    return imageURL;
}

// This function is used by other pages to retrive the name of the current user
const getName = () => {
    return CurrentUser['name'];
}

// This is the inital function that is called when the user wants to update his photo in the 'SettingsScreen'
const updatePhoto = async (uri) => {
    try {
        var ref = await firebase.storage().ref("profile photo").child(CurrentEmail).delete();
        console.log("Success: Old Photo Deleted");
    }
    catch (error) {
        console.log("Warning: No Old Photo found in Database");
    }

    uploadImage(uri, CurrentEmail);
}

// This function is used to quickly retrive the already downloaded phone number of the 
//  currently logged in user.
const getPhone = () => {
    return CurrentUser['phone'];
}

// This function is called when the user wants to update his phone number in the 'SettingsScreen'
const updatePhoneDB = async (newPhone) => {
    var query = await db.collection('users').where('email', '==', CurrentUser['email']);
    await query.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            doc.ref.delete();
        });
    });

    CurrentUser['phone'] = newPhone;
    await db.collection('users').add(CurrentUser);
    console.log("Success: Phone Updated");


}

// Used to get a formated string that shows date and time. It is attached to new requests.
const getTime = () => {
    let date_ob = new Date();

    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();

    let hours = ("0" + date_ob.getHours()).slice(-2);
    let minutes = ("0" + date_ob.getMinutes()).slice(-2);


    let currenttime = hours + ":" + minutes + " " + date + "-" + month + "-" + year;
    return currenttime;
}

// This function logs a new request in the database. 
const updateRequestDB = (region, emergencyDetails) => {
    let requestInfo = {
        name: CurrentUser['name'],
        email: CurrentUser['email'],
        phone: CurrentUser['phone'],
        emergencyDetails: emergencyDetails,
        photo: { uri: photoUrlRetriver() },
        latitude: region['latitude'],
        latitudeDelta: region['latitudeDelta'],
        longitude: region['longitude'],
        longitudeDelta: region['longitudeDelta'],
        dateTime: getTime(),
    };
    db.collection('pending requests').add(requestInfo);
}

// Used to retrive user information used on different pages.
const getCurrentUser = () => {
    return CurrentUser;
}

// When a request has been completed and either the Requester or EMS Member that responded to the request
//  ends it, this function removes that request from the database table 'Servicing Requests'. This table is 
//  for storing requests that are currently being attended to be an EMS Member.
const removeRequestFromServicing = (userType) => {
    var ref = db.collection('servicing requests').where(userType, '==', auth.currentUser.email);
    ref.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            doc.ref.delete();
        });
    });
}

// This function is called when an Administrator removes an EMS Member.
const removeMember = async (memberToRemove) => {
    memberToRemove['user_type'] = 'requester';
    delete memberToRemove.photo;
    var ref = await db.collection('users').where("email", '==', memberToRemove['email']);
    ref.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            doc.ref.set(memberToRemove);
        });
    });
}

// This function is called when an Administrator makes an EMS Member an Admin as well.
const makeAdmin = async (memberToPromote) => {
    memberToPromote['user_type'] = 'Admin';
    delete memberToPromote.photo;
    var ref = await db.collection('users').where("email", '==', memberToPromote['email']);
    ref.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            doc.ref.set(memberToPromote);
        });
    });
}

// Returns the currently logged in user.
const getSavedUser = async (userId) => {
    CurrentEmail = userId;
    CurrentUser = await get_user(userId);
    console.log('returning', CurrentUser);
    imageURL = await downloadPhoto();
    return CurrentUser;
};

// Stores the user's token in the database (used for push notifications)
const storeToken = async (token) => {
    try {
        var ref = await db.collection('users').where("email", '==', CurrentEmail);
        CurrentUser['push_token'] = token
        ref.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                doc.ref.set(CurrentUser);
            });
        });
        console.log("Success: new token saved in database")
    } catch (error) {
        console.log(error);
    }
}

// Used to send a push notificaitons to EMS Members when a new request is made.
const sendPushNotification = async () => {
    try {
        let textBody = CurrentUser['name'] + " needs your help!";
        var ref = await db.collection('users').where("user_type", '==', "EMS_Member");
        ref.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                let token = doc.data()['push_token']
                let response = fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        to: token,
                        sound: 'default',
                        title: 'New Request!',
                        body: textBody
                    })
                })
            });
        });
        console.log("Success: new token saved in database")
    } catch (error) {
        console.log(error);
    }
}

// Used to send a push notificaiton to the requester that made the request that his request
//  has been accepted.
const pushNotificaionRequester = async (id) => {
    try {
        let textBody = CurrentUser['name'] + " is on his way!";
        var ref = await db.collection('users').where("email", '==', id);
        ref.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                let token = doc.data()['push_token'];
                let response = fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        to: token,
                        sound: 'default',
                        title: 'Hold On!',
                        body: textBody
                    })
                })
            });
        });

    } catch(error) {
        console.log("Error: push notificaion to Requester not sent")
    }
}

export {
    signup,
    signin,
    uploadImage,
    photoUrlRetriver,
    downloadPhoto,
    updatePhoto,
    getName,
    getPhone,
    updatePhoneDB,
    updateRequestDB,
    getCurrentUser,
    getTime,
    removeRequestFromServicing,
    addNewEmsMember,
    removeMember,
    makeAdmin,
    getSavedUser,
    storeToken,
    sendPushNotification,
    pushNotificaionRequester,
}
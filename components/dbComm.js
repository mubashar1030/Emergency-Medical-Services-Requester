import { auth, db, firebase, admin } from './ApiInfo';

let CurrentEmail = '';
let CurrentUser = null;
let imageURL = '';

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

    await auth.createUserWithEmailAndPassword(userProfile['email'], Password);
    await db.collection('users').add(userProfile)

    uploadImage(uri, userProfile["email"])
        .then(() => {
            console.log("Success: Image Uploaded");
        })
        .catch((error) => {
            console.log("Error: Image Upload Unsuccessful");
            console.log(error);
        })

    console.log("Success: New User Created")
    return 1;
};

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

const uploadImage = async (uri, imageName) => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        var user = auth.currentUser;
        var ref = firebase.storage().ref().child("profile photo/" + user.email);
        ref.put(blob);

        console.log("Success: Image Upload Complete")
    }
    catch (error) {
        console.log("Error: Image Could Not Be Uploaded");
    }

    return
}

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

const photoUrlRetriver = () => {
    return imageURL;
}

const getName = () => {
    return CurrentUser['name'];
}

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

const getPhone = () => {
    return CurrentUser['phone'];
}

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

const getTime = () => {
    let date_ob = new Date();

    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();

    let hours = date_ob.getHours() % 12;
    let minutes = date_ob.getMinutes();


    let currenttime = hours + ":" + minutes + " " + date + "-" + month + "-" + year;
    return currenttime;
}

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

const getCurrentUser = () => {
    return CurrentUser;
}

const removeRequestFromServicing = (userType) => {
    var ref = db.collection('servicing requests').where(userType, '==', auth.currentUser.email);
    ref.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            doc.ref.delete();
        });
    });
}

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
}
import {auth, db, firebase} from './ApiInfo';

let CurrentEmail = '';
let CurrentUser = null;

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
    var start = new Date();
    await db.collection('users').where("email",'==',userID).get()
    .then(snap => {
            if (snap.empty) {
                console.log('query failed')
                return null;
            }
            else
            {
                console.log("query completed in:" , new Date() - start)
                const data = snap.docs.map(doc => {
                    let obj = doc.data()
                    obj['key'] = doc.id
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

async function signup(userProfile, Password) {
    if (userProfile === undefined || Password === undefined)
        return 0;

    
    

    let unique_id = userProfile['email'];
    let snapshot = await get_user(unique_id);

    console.log("check getuser:", snapshot)
    if (snapshot != null) { // User already exists
        console.log("User Already Exists");
        return 0;
    }

    await db.collection('users').add(userProfile)
    await auth.createUserWithEmailAndPassword(userProfile['email'], Password);
    console.log("user created")
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
    console.log('returning',CurrentUser);
    return CurrentUser;
};

export {
    signup,
    signin,
}
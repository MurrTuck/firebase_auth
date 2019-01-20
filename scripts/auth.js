
//Listen for auth changes
auth.onAuthStateChanged(user => {
    console.log(user)
    if (user) {
        db.collection('guides').onSnapshot(snapshot => {
            setupGuides(snapshot.docs)
            setupUI(user);
        }, err => {
            console.log(err.message)
        });
        // console.log('user logged in:', user)
    } else {
        setupUI()
        setupGuides([])
        console.log('user logged out')
    }
})

//create new guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
    e.preventDefault();

    db.collection('guides').add({
        title: createForm['title'].value,
        content: createForm['content'].value
    }).then(() => {
        //close the modal and reset form
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        createForm.reset();
    }).catch(err => {
        console.log(err.message)
    })
})

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        return db.collection('users').doc(cred.user.uid).set({
            fullName: signupForm['full-name'].value,
            bio: signupForm['signup-bio'].value
        })
    }).then(() => {
        // close the signup modal & reset form
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
    });
});

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut()
});

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    //log user in
    auth.signInWithEmailAndPassword(email, password).then((cred) => {
        // console.log(cred.user)
        //close the signup modal & reset form
        const modal = document.querySelector("#modal-login");
        M.Modal.getInstance(modal).close();
        loginForm.reset()
    })
});


import React, { useState, useEffect, useContext, createContext } from 'react';
import cookie from 'js-cookie';
import firebase from './firebase';
import { createUser } from './db';

const authContext = createContext();
const firestore = firebase.firestore();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const handleUser = async (rawUser) => {
    if (rawUser) {
      var user;
      const ref = firestore.collection('users').doc(rawUser.uid);
      ref.get().then(async (doc) => {
        if (doc.exists) {
          user = doc.data();
        } else {
          user = await formatUser(rawUser);
          createUser(user.uid, user);
        }
        if (user.admin) {
          setUser(user);
          cookie.set('auth', user.uid, {
            expires: 1
          });
          return user;
        } else {
          setUser(false);
          cookie.remove('auth');
          return false;
        }
      });
    } else {
      setUser(false);
      cookie.remove('auth');
      return false;
    }
  };

  const signinWithGoogle = () => {
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((response) => {
        handleUser(response.user);
      });
  };

  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => handleUser(false));
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onIdTokenChanged(handleUser);
    return () => unsubscribe();
  }, []);
  return {
    user,
    signinWithGoogle,
    signout
  };
}

const formatUser = async (user) => {
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    admin: false
  };
};

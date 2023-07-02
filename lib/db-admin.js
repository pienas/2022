import firebase from './firebase-admin';

export async function getStats() {
  try {
    const snapshot = await firebase.collection('stats').get();
    const results = [];
    snapshot.forEach((doc) => {
      results.push({ name: doc.id, ...doc.data() });
    });
    return { results };
  } catch (error) {
    return { error };
  }
}

export async function getGames() {
  try {
    const snapshot = await firebase.collection('games').get();
    const results = [];
    snapshot.forEach((doc) => {
      results.push({ name: doc.id, ...doc.data() });
    });
    return { results };
  } catch (error) {
    return { error };
  }
}

export async function getLastTransactions() {
  try {
    const snapshot = await firebase
      .collection('transactions')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();
    const results = [];
    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return { results };
  } catch (error) {
    return { error };
  }
}

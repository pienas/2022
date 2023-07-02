import firebase from './firebase';

const firestore = firebase.firestore();

export function createUser(uid, data) {
  return firestore
    .collection('users')
    .doc(uid)
    .set(
      {
        uid,
        ...data
      },
      { merge: true }
    );
}

export function updateStats(data) {
  return firestore.collection('stats').doc(data.name).update({
    total: data.total,
    updatedAt: new Date().toISOString()
  });
}

export function createTransaction(data) {
  return firestore
    .collection('transactions')
    .doc(new Date().toISOString())
    .set({
      from: data.from || '',
      to: data.to || '',
      by: data.by,
      game: data.game,
      gameType: data.gameType,
      place: data.place || 0,
      amount: data.amount,
      amountAfterHouseEdge: data.amountAfterHouseEdge,
      createdAt: new Date().toISOString()
    });
}

import { doc, runTransaction } from "firebase/firestore";
 
import { db } from "../../../firebase/config";

/**
 * Get the next counter value for a given collection and counter ID.
 * @param {string} collectionName - The collection where counter docs are stored.
 * @param {string} docId - The document ID for the specific counter (e.g., "student", "teacher").
 * @param {string} field - The counter field name (default is "count").
 * @returns {Promise<number>} - The incremented value (new count).
 */
export const getNextCounterValue = async (
  collectionName,
  docId,
  field = "count"
) => {

    try{
  const counterRef = doc(db, collectionName, docId);

  const newValue = await runTransaction(db, async (transaction) => {
    const docSnap = await transaction.get(counterRef);

    if (!docSnap.exists()) {
      transaction.set(counterRef, { [field]: 1 });
      return 1;
    } else {
      const current = docSnap.data()[field] || 0;
      const next = current + 1;
      transaction.update(counterRef, { [field]: next });
      return next;
    }
  });

  return newValue;
}
catch(e){
    alert(e)
    console.log(e)
    return '0';
}
};

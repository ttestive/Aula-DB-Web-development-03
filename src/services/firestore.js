import {
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    where,
} from "firebase/firestore";
import {database} from '../config/firebase';



export default FirestoreService = {
    async create(collectionName, data){
        try{
            const docRef = await addDoc(collection(databse, collectionName), data);
        return docRef;
        } catch (error) {
            console.error('Error creating document:', error);
            throw error;
        }
    },

    async getAll(collectionName){
        try{
            const querySnapshot = await getDocs(collection(databse, collectionName));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        }catch (error){
            console.error("Error trying to get all documents:", error);
        }

},

async update(collectionName, docId, data){
    try{
        const docRef = doc(databse, collectionName, docId);
        await updateDoc(docRef, data);
    }catch (error){
        console.error("Error trying to update document:", error);
    }
},

async delete(collectionName, docId){
    try{
        const    docRef = doc(databse, collectionName, docId);
        await deleteDoc(docRef);
    }catch (error){
        console.error("Error trying to delete document:", error);
    }
}
};

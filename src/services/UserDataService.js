import firebase from "../firebase";

const db = firebase.collection("/userdata");

class UserDataService {
  getAll() {
    return db;
  }
  create(user) {
    return db.add(user);
  }
  update(id, user) {
    return db.doc(id).update(user);
  }
  delete(id) {
    return db.doc(id).delete();
  }
}

export default new UserDataService();

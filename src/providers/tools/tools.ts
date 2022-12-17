import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

@Injectable()
export class ToolsProvider {
  constructor(private af: AngularFirestore) {
    console.log("Hello ToolsProvider Provider");
  }

  /*****  Inicia Checklist metodos  *****/

  newchecklist(checklist: any) {
    return new Promise((resolve, reject) => {
      this.af
        .collection("checklist")
        .add(checklist)
        .then((docRef) => {
          const add = {
            add: "success",
            docID: docRef.id,
          };
          resolve(add);
        })
        .catch((error) => {
          const add = {
            add: "error",
            error: error,
          };
          reject(add);
        });
    });
  }

  deleteChecklist(checkID: string) {
    return new Promise((resolve, reject) => {
      this.af
        .collection("checklist")
        .doc(checkID).delete().then(() => {
          const get = {
            delete: "success"
          };
         resolve(get); 
        });
    });
  }

  getAllChecklist() {
    return new Promise((resolve, reject) => {
      this.af
        .collection("checklist")
        .get()
        .subscribe((querySnapshot) => {
          let arrCheck = [];
          querySnapshot.forEach((doc) => {
            const checklist = doc.data();
            checklist.id = doc.id;
            arrCheck.push(checklist);
          });
          const get = {
            get: "success",
            data: arrCheck,
          };
          resolve(get);
        });
    });
  }

  getChecklist(checkID: string) {
    return new Promise((resolve, reject) => {
      this.af
        .collection("checklist")
        .doc(checkID)
        .get()
        .subscribe((checklist) => {
          const get = {
            get: "success",
            data: checklist.data(),
          };
          resolve(get);
        });
    });
  }

  /*****  Inicia Cupones metodos  *****/

  getAllCupones() {
    return new Promise((resolve, reject) => {
      this.af
        .collection("cupones")
        .get()
        .subscribe((querySnapshot) => {
          let arrCheck = [];
          querySnapshot.forEach((doc) => {
            const checklist = doc.data();
            checklist.id = doc.id;
            arrCheck.push(checklist);
          });
          const get = {
            get: "success",
            data: arrCheck,
          };
          resolve(get);
        });
    });
  }

  deleteCupones(cuponesID: string, index: number) {
    return new Promise((resolve, reject) => {
      this.af
        .collection("cupones")
        .doc(cuponesID).delete().then(() => {
          const get = {
            delete: "success",
            index: index
          };
         resolve(get); 
        });
    });
  }

}

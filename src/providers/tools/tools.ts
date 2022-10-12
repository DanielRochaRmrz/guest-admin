import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

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
}

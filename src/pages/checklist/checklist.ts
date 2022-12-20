import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

import {
  IonicPage,
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from "ionic-angular";

import { File } from "@ionic-native/file";
import { FileOpener } from "@ionic-native/file-opener";

import { ToolsPage } from "../tools/tools";
import { ChecklistNewPage } from "../checklist-new/checklist-new";

import { ToolsProvider } from "../../providers/tools/tools";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as firebase from "firebase/app";
@IonicPage()
@Component({
  selector: "page-checklist",
  templateUrl: "checklist.html",
})
export class ChecklistPage {
  fileName: string = "checklist";

  num: number;
  opened: boolean = false;

  hide: boolean = true;

  activityForm: FormGroup = this.fb.group({
    checklistTitle: ["", [Validators.required, Validators.minLength(3)]],
    replies: this.fb.array([]),
  });

  checkData: any[] = [];

  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public fb: FormBuilder,
    private toolsProvider: ToolsProvider,
    private file: File,
    private fileOpener: FileOpener
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ChecklistPage");
    this.getChecklist();
  }

  async downloadAsPDF(checkID: string) {
    let loading = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Cargando...",
    });
    loading.present();

    const checklist: any = await this.toolsProvider.getChecklist(checkID);

    if (checklist.get === "success") {
      loading.dismiss();
      const checkData = checklist.data;
      const listA = checkData.actividades;
      const actividades = [];
      listA.map((c) => {
        const data = [c.activity, c.completed, c.accountable, c.note];
        actividades.push(data);
      });

      const head = [
        ["Actividades", "Completada", "Responsable", "Observaciones"],
      ];
      const data = actividades;

      const doc = new jsPDF();
      doc.setTextColor("#2c3e50");
      doc.text(checkData.titulo, 100, 20, { align: "center" });
      autoTable(doc, {
        head: head,
        body: data,
        startY: 40,
        headStyles: {
          halign: "center",
          lineColor: [44, 62, 80],
          fillColor: [44, 62, 80],
        },
        styles: {
          overflow: "linebreak",
          cellWidth: "wrap",
          halign: "justify",
          fontSize: 10,
          lineColor: 100,
          lineWidth: 0.25,
        },
        columnStyles: {
          0: { halign: "left", cellWidth: "auto" },
          1: { halign: "center", cellWidth: "auto" },
          2: { halign: "center", cellWidth: "auto" },
          3: { halign: "left", cellWidth: "auto" },
        },
        theme: "striped",
        pageBreak: "auto",
        tableWidth: "auto",
        showHead: "everyPage",
        showFoot: "everyPage",
        tableLineWidth: 0,
        tableLineColor: 200,
        margin: { top: 30 },
      });

      const pdfOutput = doc.output();

      let buffer = new ArrayBuffer(pdfOutput.length);
      let array = new Uint8Array(buffer);
      for (var i = 0; i < pdfOutput.length; i++) {
        array[i] = pdfOutput.charCodeAt(i);
      }

      // doc.save("check.pdf");
      //This is where the PDF file will stored , you can change it as you like
      // for more information please visit https://ionicframework.com/docs/native/file/
      const directory = this.file.documentsDirectory;

      //Date Time
      const dateTime = Date.now();
      //Name of pdf
      const fileName = `${this.fileName}_${dateTime}.pdf`;

      //Writing File to Device
      this.file
        .writeFile(directory, fileName, buffer)
        .then((success) => {
          console.log("File created Succesfully" + JSON.stringify(success));
          //open File
          this.fileOpener
            .open(success.nativeURL, "application/pdf")
            .then((success) => {
              console.log("File Opened Succesfully" + JSON.stringify(success));
            })
            .catch((error) =>
              console.log("Cannot Open File " + JSON.stringify(error))
            );
        })
        .catch((error) =>
          console.log("Cannot Create File " + JSON.stringify(error))
        );
    }
  }

  toggleFunc(i: number) {
    this.num = i;
    this.opened = !this.opened;
  }

  async newChecklist(checklist: any) {
    let loading = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Creando...",
    });
    loading.present();

    const addChecklist: any = await this.toolsProvider.newchecklist(checklist);
    const success = addChecklist.add;
    if (success === "success") {
      loading.dismiss();
      // this.showErrorSuccessToast("Checklist generado con exito.");
    } else {
      // this.showErrorSuccessToast(
      // "Error al generar checklist, intenta de nuevo."
      // );
    }
  }

  async checklistAdd() {
    if (this.hide === true) {
      const msg = "El formulario se encuentra oculto";
      this.showInfoToast(msg);
      return;
    } else if (!this.activityForm.get("checklistTitle").value) {
      const msg = "El campo titulo checklist es requerido";
      this.showErrorToast(msg);
      return;
    } else if (this.repliesControl.length === 0) {
      const msg = "El checklist debe contener actividades";
      this.showWarningToast(msg);
      return;
    } else if (this.repliesControl.status === "INVALID") {
      const msg = "El campo actividad es requerido";
      this.showErrorToast(msg);
      return;
    }

    let loading = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Creando...",
    });
    loading.present();

    const checklist = {
      titulo: this.activityForm.get("checklistTitle").value,
      actividades: this.activityForm.get("replies").value,
      FechaAdd: firebase.firestore.FieldValue.serverTimestamp(),
    };

    const addChecklist: any = await this.toolsProvider.newchecklist(checklist);
    const success = addChecklist.add;
    if (success === "success") {
      this.activityForm.reset();
      const a = this.activityForm.get("replies").value;
      a.forEach((a: any, index: number) => this.deleteActivity(index));
      this.hide = true;
      this.getChecklist();
      loading.dismiss();
      this.showSuccessToast("Checklist generado con exito.");
    } else {
      this.showErrorToast("Error al generar checklist, intenta de nuevo.");
    }
  }

 async deleteChecklist(checkID: string) {
    let loading = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Cargando...",
    });
    loading.present();

    const checklist: any = await this.toolsProvider.deleteChecklist(checkID);

    if (checklist.delete === "success") {
      this.getChecklist();
      loading.dismiss();
      this.showSuccessToast('Checkliste eliminado con exito')
    }
  }

  async getChecklist() {
    let loading = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Cargando...",
    });
    loading.present();

    const checklist: any = await this.toolsProvider.getAllChecklist();

    if (checklist.get === "success") {
      loading.dismiss();
      this.checkData = checklist.data;
    }
  }

  get repliesControl() {
    return this.activityForm.get("replies") as FormArray;
  }

  campoNoValido(campo: string) {
    return (
      this.activityForm.get(campo).invalid &&
      this.activityForm.get(campo).touched
    );
  }

  addActivity() {
    this.repliesControl.push(
      this.fb.group({
        activity: ["", [Validators.required]],
        accountable: [""],
        completed: [""],
        note: [""],
      })
    );
  }

  deleteActivity(i: number) {
    this.repliesControl.removeAt(i);
  }

  clearForm() {
    const value = this.activityForm.get("checklistTitle").value;
    if (value) {
      console.log("limpiondo");
      this.activityForm.reset();
      this.repliesControl.reset();
      const msg = "Formulario vaciado con exito";
      this.showSuccessToast(msg);
    } else {
      const msg = "El formulario se encuentra vacío o oculto";
      this.showInfoToast(msg);
    }
  }

  goToChecklistNew() {
    this.navCtrl.setRoot(ChecklistNewPage);
  }

  showErrorToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000,
      position: "bottom",
      cssClass: "toastDanger",
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }

  showWarningToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000,
      position: "bottom",
      cssClass: "toastWarning",
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }

  showInfoToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000,
      position: "bottom",
      cssClass: "toastInfo",
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }

  showSuccessToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000,
      position: "bottom",
      cssClass: "toastSuccess",
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }

  toBack() {
    this.navCtrl.setRoot(ToolsPage);
  }
}

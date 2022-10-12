import { Component } from "@angular/core";
import {
  IonicPage,
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from "ionic-angular";

import { ToolsPage } from "../tools/tools";
import { ChecklistNewPage } from "../checklist-new/checklist-new";

import { ToolsProvider } from "../../providers/tools/tools";

@IonicPage()
@Component({
  selector: "page-checklist",
  templateUrl: "checklist.html",
})
export class ChecklistPage {
  opened: boolean = false;
  buttonAdd: boolean = true;
  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    private toolsProvider: ToolsProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ChecklistPage");
  }

  toggleFunc() {
    this.opened = !this.opened;
  }

  checklistNew() {
    const prompt = this.alertCtrl.create({
      title: "Nuevo Checklist",
      inputs: [
        {
          name: "checklistTitle",
          placeholder: "Titulo",
        },
      ],
      buttons: [
        {
          text: "Cancelar",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
        {
          text: "Guardar",
          handler: (data) => {
            if (data.checklistTitle !== "") {
              const checklist = {
                titulo: data.checklistTitle,
                FechaAdd: new Date(),
              };
              this.newChecklist(checklist);
            } else {
              this.showErrorSuccessToast("Titulo es un campo requerido");
              return false;
            }
          },
        },
      ],
    });
    prompt.present();
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
      this.showErrorSuccessToast("Checklist generado con exito.");
    } else {
      this.showErrorSuccessToast(
        "Error al generar checklist, intenta de nuevo."
      );
    }
  }

  actividadAdd(event: any) {
    const actividad = event.target.value;
    if (actividad.length > 3) {
      this.buttonAdd = false;
    } else {
      this.buttonAdd = true;
    }
    console.log('event -->', event.target.value);
  }

  goToChecklistNew() {
    this.navCtrl.setRoot(ChecklistNewPage);
  }

  showErrorSuccessToast(data: any) {
    let toast = this.toastCtrl.create({
      message: data,
      duration: 5000,
      position: "top",
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

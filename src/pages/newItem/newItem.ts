import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { dataService } from '../../providers/data-service';
import { Http, Response } from '@angular/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-newItem',
  templateUrl: 'newItem.html'
})
export class NewItemPage {
  imageNewPath: any;
  imageURI: any;
  imageChosen: any = 0;
  todo = {
    "title": "",
    "description": "",
    "category": "",
    "priority": 1,
    "image": ""
  }
  config: any;
  color: any;

  constructor(public navCtrl: NavController,
    public dataservice: dataService,
    public alertCtrl: AlertController,
    private http: Http,
    private transfer: FileTransfer,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {

    this.color = localStorage.getItem('back_color');
    this.initialList()
      .subscribe(res => {
        this.config = res;
      });
  }

  initialList() {
    let apiUrl = 'assets/data/config.json';
    return this.http.get(apiUrl)
      .map((response: Response) => {
        const data = response.json();
        return data;
      });
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Success',
      subTitle: 'New Item Added',
      buttons: ['OK']
    });
    alert.present();
  }

  logForm() {
    //delete this section when build
    this.dataservice.uploadImage().then((result) => {
      //the data service call to add the item should move inside uploadfile method
      this.todo.image = result["url"];
      this.dataservice.createItem(this.todo).then((res) => {
        this.todo.title = null;
        this.todo.description = null;
        this.todo.category = null;
        this.todo.priority = 1;
        this.todo.image = null;
        this.showAlert();
        //end of move section
      })
    });
    //uncomment this section when build
    //this.uploadFile();
  }

  getImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    this.camera.getPicture(options).then((imageData) => {

      // var sourceDirectory = imageData.substring(0, imageData.lastIndexOf('/') + 1);
      // var sourceFileName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.length);
      // sourceFileName = sourceFileName.split('?').shift();
      // File.copyFile(sourceDirectory, sourceFileName, cordova.file.externalApplicationStorageDirectory, sourceFileName).then((result: any) => {
      //   this.imageURI = imageData;
      //   this.imageChosen = 1;
      //   this.imageNewPath = result.nativeURL;
      // }, (err) => {
      //   alert(JSON.stringify(err));
      // })

        this.imageURI = imageData;
        this.imageChosen = 1;
        
    }, (err) => {
      console.log(err);
      this.presentToast(err);
    });
  }

  uploadFile() {
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'ionicfile',
      fileName: 'ionicfile',
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {}
    }

    fileTransfer.upload(this.imageURI, 'http://10.0.2.2:8080/api/uploadImage', options)
      .then((data) => {

        //the data service call to add the item should uncomment when this is build
        // this.todo.image = data["url"];
        // this.dataservice.createItem(this.todo).then((res) => {
        //   this.todo.title = null;
        //   this.todo.description = null;
        //   this.todo.category = null;
        //   this.todo.priority = 1;
        //   this.todo.image = null;
        // })

        console.log(data);
        loader.dismiss();
        this.presentToast("New Item Added successfully");
      }, (err) => {
        console.log(err);
        loader.dismiss();
        this.presentToast(err);
      });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  download() {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const url = 'http://www.example.com/file.pdf';
    fileTransfer.download(url, 'this.file.dataDirectory ' + 'file.pdf').then((entry) => {
      console.log('download complete: ' + entry.toURL());
    }, (error) => {
      // handle error
    });
  }

}

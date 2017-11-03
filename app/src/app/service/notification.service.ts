import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { SystemService } from './system.service';
import { Observable } from 'rxjs/Observable';
declare var PushNotification: any;
import { BLocalStorageService } from 'app/service/bLocalStorage.service';
import * as firebase from 'firebase';
import { PubSubService } from './pubSub.service';
import { Http } from '@angular/http';
import { BSessionStorage } from './bSessionStorage.service';
import { Router } from '@angular/router';
import { BHTTPLoader } from './bHTTPLoader';

@Injectable()
export class NotificationService implements OnInit, OnDestroy {
  private static instance: NotificationService;
  private systemService: SystemService = SystemService.getInstance();
  private firebaseSenderId: string;
  private isNotificationEnabled: boolean;
  private deviceType; string;
  private resDetails;
  private deviceUUID: string;
  loginSubscribe;
  sessionStorage;
  constructor(private localStorageService: BLocalStorageService, private pubSubService: PubSubService, private http: Http, private router: Router, private bHttpLoader: BHTTPLoader) {
    this.firebaseSenderId = this.systemService.getVal('firebaseSenderId');
    this.isNotificationEnabled = this.systemService.getVal('isNotificationEnabled');
    this.deviceType = this.systemService.deviceType;
    this.sessionStorage = new BSessionStorage();
    this.loginSubscribe = this.pubSubService.$sub('loginComplete', () => {
      this.enableNotification();
    })
  }

  ngOnInit() {
  }


  enableNotification() {
    if (this.isNotificationEnabled) {
      if (this.deviceType && this.deviceType != 'browser') {
        document.addEventListener('deviceready', () => {
          this.deviceType = this.systemService.deviceType;
          // this.deviceUUID = this.systemService.deviceUUID;
          this.checkPermission().then(res => {
            if (res) {
              this.initializeNotifications();
            }
          });
        }, false);
      } else {
        this.initialiseWebPush();
      }

    }

  }

  initialiseWebPush() {
    const __this = this;
    const messaging = firebase.messaging();

    messaging.requestPermission()
      .then(function () {
        return messaging.getToken();
      })
      .then(function (token) {
        if (token) {
          __this.sendRegDetails(token);
        }
      })
      .catch(function (err) {
        __this.bHttpLoader.alertError(err);
        // console.log('Error Occured.', err);
      });

    messaging.onMessage(function (payload) {
      if (payload['notification']) {
        let notificationObj = payload['notification'];
        let options = {
          body: notificationObj.body,
          icon: notificationObj.icon
        }
        // creating a native browser message
        let notificationUI = new Notification(notificationObj.title, options);
        notificationUI.onclick = function () {
          window.focus(); // window is focused when the user clicks the notification using this
        }
      }

    });
  }

  checkPermission() {
    // Android & iOS only
    // Checks whether the push notification permission has been granted.
    return new Promise((resolve) => {
      if (this.deviceType === 'Android' || this.deviceType === 'iOS') {
        PushNotification.hasPermission(function (data) {
          return resolve(data.isEnabled);
        });
      } else {
        return resolve(true);
      }
    });
  }

  initializeNotifications() {

    if (window['FCMPlugin']) {
      console.log("initializing notifications for platform :: " + window['device'].platform);

      window['FCMPlugin'].getToken(function (token) {
        this.sendRegDetails(token);
      }, function (error) {
        console.log('getToken err', error);

      });

      window['FCMPlugin'].onNotification(function (data) {
        // data.body,
        // data.title,
        // data.count,
        // data.sound,
        // data.image,
        // data.additionalData
        if (data.wasTapped) {
          //Notification was received on device tray and tapped by the user.
        } else {
          //Notification was received in foreground. Maybe the user needs to be notified.
          window['cordova'].plugins.notification.local.schedule({
            title: data.title,
            text: data.body,
            sound: data.sound,
            at: new Date().getTime()
          });
        }
        console.log("notification received...");
      }, function (error) {
        console.log('notification err', error);
      });
    }
  }

  sendRegDetails(registrationId) {
    this.localStorageService.setValue('registrationId', registrationId);
    // var url = "http://10.100.26.16:3000/bhive-art/multichoice/notification/uopor/register";
    var url = this.systemService.getTenantUrl() + 'notification/uopor/register';
    this.http.post(url, { 'key': JSON.parse(this.sessionStorage.getValue('userObj'))['userKey'], 'uuid': this.localStorageService.getValue('uuid'), 'fbregid': registrationId }).subscribe(result => {

      // this.pubSubService.$pub('FBRegComp');
    }, error => {
      console.log(error);
    })
  }

  ngOnDestroy() {
    this.loginSubscribe.unSubscribe();
  }

}

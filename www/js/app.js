// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core', 'ngCordova', 'ngRoute', 'ion-autocomplete', 'starter.controllers','starter.services','google.places','ionic.service.push','ionic.service.core','pascalprecht.translate']).constant('ApiEndpoint', {
    //url: 'http://localhost:8100/api'
    url:'http://portal.wikwio.org/api'
    //url:'http://pamba.strandls.com/api'
    //url:'http://indiabiodiversity.org/api'
})


.run(function($ionicPlatform, $cordovaSQLite, $ionicSideMenuDelegate,NotificationService,$ionicPush,$ionicPopup,$state,$http,ApiEndpoint,$filter,$rootScope,$ionicModal,$rootScope,$cordovaPush,$cordovaToast) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if (window.cordova) {

    db = $cordovaSQLite.openDB("observationQueue.db");
     $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS observation (id integer primary key, status text, obslist text)");
     

    /*var push = PushNotification.init({
    
    ios: {
        alert: "true",
        badge: true,
        sound: 'false'
    }
    });

    var user = Ionic.User.current();
    
    if (!user.id) {
      user.id = Ionic.User.anonymousId();
    }
    
    // Just add some dummy data..
    user.set('name', 'Simon');
    user.set('bio', 'This is my little bio');
    user.save();
   
    
    push.on('registration', function(data) {
      alert(data);
    console.log(JSON.stringify(data));
    });

    push.on('notification', function(data1) {
      alert(JSON.stringify(data1));
    });



    push.on('error', function(e) {
    console.log(e.message);
    });*/

    var appVersion;


  /*if(navigator.connection.type != Connection.NONE) {

    NotificationService.GetAppVersion().then(function(localVersion){
      appVersion = localVersion.data.instance.ios;
      cordova.getAppVersion(function(version) {
        if(appVersion != version){
           var confirmPopup = $ionicPopup.confirm({
          title: 'New Version',
          template: 'WikwioCS has a new version,Please update the app to get new features.',
          okText: 'Update now',
          cancelText: 'Later'
        });
         confirmPopup.then(function(result) {

            if(result) {
              window.open('https://itunes.apple.com/us/app/wikwio-citizen-science/id1028388728?mt=8', '_system');
              if(localStorage.getItem('USER_KEY')!== null){
                //alert(Icheck());
                $state.go("app.home");
              }
            }else{
              if(localStorage.getItem('USER_KEY')!== null){
                //alert(Icheck());
                $state.go("app.home");
              }
            }
          });

        }else {
          if(localStorage.getItem('USER_KEY')!== null){
            //alert(Icheck());
            $state.go("app.home");
          }
        }
      });

    });
  }else {*/
    
     if(localStorage.getItem('USER_KEY')!= null){
          //alert(Icheck());
          if(localStorage.getItem('Home') != null){
            var exec = localStorage.getItem('Home');
            var exec1 = JSON.parse(exec);;
            var newVal = exec1.ExecuteVal
            //alert(newVal);
            if(newVal == 1){
            var homeValue = {"ExecuteVal":0};
                   localStorage.setItem('Home',JSON.stringify(homeValue));
                 }
                  var query = "SELECT * FROM OBSERVATION  WHERE STATUS='PROCESSING' ";
             $cordovaSQLite.execute(db, query).then(function(res) {
            if(res.rows.length > 0){
              var query1 = "UPDATE OBSERVATION SET STATUS='PENDING' WHERE ID ="+res.rows.item(0)['id'];
               $cordovaSQLite.execute(db, query1).then(function(res) {

                $cordovaToast.show("You have PENDING observations ", "long", "bottom").then(function(success) {
                    console.log("The toast was shown");
                }, function (error) {
                    console.log("The toast was not shown due to " + error);
                });
               }, function (err) {
                //alert(err);
                  console.error("newwww"+err);
              });
            }
          }, function (err) {
            //alert(err);
              console.error("newwww"+err);
          });
             }
         $state.go("app.home");
      }
  //}
   var countVal = {"successVal":0,"failedVal":0};
      localStorage.setItem('countvariables',JSON.stringify(countVal));
      
    }
      });
  
})




.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider,$ionicAppProvider,$translateProvider) {

  $stateProvider


  .state('login', {
    url: "/login",
    //views: {
      //'menuContent':{
        cache:false,
        templateUrl: "templates/login.html",
        controller: 'AppCtrl'
    // }
    //}
  })

  .state('newUser', {
    cache:false,
    url: "/newUser",
    //views: {
      //'menuContent':{
        templateUrl: "templates/newUser.html",
        controller: 'NewUserCtrl'
    // }
    //}
  })
  .state('registerLocation', {
      url: "/registerLocation",

          templateUrl: "templates/registerLocation.html",
          controller: 'GPSController'
    })

  .state('app', {
    cache:false,
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    //controller: 'LogoutController'
    
  })

  .state('app.home', {
    cache:false,
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller: 'HomeController'
      }
    }
  })

  .state('app.settings', {
    cache:false,
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "templates/settings.html",
        controller: 'SettingsController'
      }
    }
  })

  .state('app.viewMap', {
    cache:false,
    url: "/viewMap",
    views: {
      'menuContent':{
        templateUrl: "templates/viewMap.html",
        controller:  'ViewOnMapController'
     }
    }
  })

  /*.state('app.forgotpassword', {
      url: '/forgot-password',
      views: {
      templateUrl: 'templates/forgot-password.html'
    }
    })*/



  .state('app.newObservation', {
    //cache:true,
    url: "/newObservation",
    views: {
      'menuContent': {
        templateUrl: "templates/newObservation.html",
        controller: 'NewObservationCtrl'
      }
    }
  })

  .state('app.gps', {
    cache:false,
    url: "/gps",
    views: {
      'menuContent': {
        templateUrl: "templates/gps.html",
        controller: 'GPSController'
      }
    }
  })

  .state('app.location', {
    cache:false,
    url: "/location",
    views: {
      'menuContent': {
        templateUrl: "templates/location.html",
        controller: 'GPSController'
      }
    }
  })



  .state('app.joinedGroups', {
    cache:false,
      url: "/joinedGroups",
      views: {
        'menuContent': {
          templateUrl: "templates/joinedGroups.html",
          controller: 'JoinGroupCtrl'
        }
      }
    })

    .state('app.browsedetails', {
      cache:false,
      url: "/browsedetails/:browseId",
      views: {
        'menuContent': {
          templateUrl: "templates/browsedetails.html",
          controller: 'BrowseDetailsCtrl'
        }
      }
    })

    .state('app.browse', {
      //cache:false,
      url: "/browse",
      views: {
        'menuContent': {
          templateUrl: "templates/observation_list.html",
          controller: 'ListController'
        }
      }
    })

    .state('app.observationnearby', {
      //cache:false,
      url: "/observationnearby",
      views: {
        'menuContent': {
          templateUrl: "templates/observation_list.html",
          controller: 'ObsNearByCtrl'
        }
      }
    })

    .state('app.mycollection', {
      //cache:false,
      url: "/mycollection",
      views: {
        'menuContent': {
          templateUrl: "templates/myCollection.html",
          controller: 'MyCollectionCtrl'
        }
      }
    })

    .state('app.statusDetails', {
      cache:false,
      url: "/statusDetails/:browseId",
      views: {
        'menuContent': {
          templateUrl: "templates/statusDetails.html",
          controller: 'statusDetailsController'
        }
      }
    })
    .state('app.notification', {
    cache:false,
    url: "/notification",
    views: {
      'menuContent':{
        templateUrl: "templates/notificationList.html",
        controller:  'NotificationController'
     }
    }
  })

    .state('app.editDetails', {
      cache:false,
      url: "/editDetails/:browseId",
      views: {
        'menuContent': {
          
          templateUrl: "templates/editObservation.html",
          controller: 'EditObservationCtrl'
        }
      }
    })
    .state('app.aboutUs', {
    cache:false,
    url: "/aboutUs/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/aboutUs.html",
        controller: 'aboutController'
      }
    }
  })

.state('app.getLocation', {
      cache:false,
      url: "/getLocation/:statusId",
      views: {
        'menuContent': {
          templateUrl: "templates/getLocation.html",
          controller: 'GPSController'
        }
      }
    })

  .state('app.observationStatus', {
    cache:false,
    url: "/observationStatus",
    views: {
      'menuContent': {
        templateUrl: "templates/observationStatus.html",

        controller: 'HomeController'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $ionicAppProvider.identify({
      app_id: '7b0018b7',
      api_key: '6e186b8bbb38e3fde8218a9d5e342d81173ca3e9e2582ab0',
      dev_push: false 
    });
  $urlRouterProvider.otherwise('/login');
  $ionicConfigProvider.navBar.alignTitle("center");
  $ionicConfigProvider.backButton.text('Back').icon('ion-chevron-left');
  $translateProvider.preferredLanguage("en");
  $translateProvider.fallbackLanguage("en");
  $translateProvider.translations("en", languageEnglish);
  $translateProvider.translations("fr", languageFrench);
  
});



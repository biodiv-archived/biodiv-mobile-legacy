// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core', 'ngCordova', 'ngRoute', 'ion-autocomplete', 'starter.controllers','starter.services','google.places','pascalprecht.translate']).constant('ApiEndpoint', {
    //url: 'http://localhost:8100/api'
    url:'http://portal.wikwio.org/api'
    //url:'http://192.9.200.253:8080/biodiv/api'
    //url:'http://indiabiodiversity.org/api'
})


.run(function($ionicPlatform, $cordovaSQLite, $ionicSideMenuDelegate,$ionicPopup,$state,$http,ApiEndpoint,NotificationService,$filter,$rootScope,$ionicModal,$cordovaSQLite,$cordovaToast, $translate) {
  $ionicPlatform.ready(function() {
    //var appVersion = "2.0.10";
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
     /*var io = Ionic.io();
     var scope;
    var push = new Ionic.Push({
      "onNotification": function(notification) {
        scope = $rootScope.$new();
        scope.items = [{"title":notification.title,"desc":notification.text, "time":$filter('date')(Date.now(),"MMM/dd/yyyy")}];
        scope.itemVal = 0;
        scope.checkValue = true;
        $ionicModal.fromTemplateUrl("templates/showNotification.html", {
          cache:false,
       scope: scope,
       animation: 'slide-in-up'
       }).then(function(modal) {
       scope.modal = modal;
       scope.modal.show();
       });
      },
      "pluginConfig": {
        "android": {
          //"iconColor": "#0000FF"
          "icon": "icon"
        }
      }
    });
    var user = Ionic.User.current();
    
    if (!user.id) {
      user.id = Ionic.User.anonymousId();
    }

    $rootScope.closeModal = function() {
      if(localStorage.getItem('USER_KEY')!== null){
      //alert(Icheck());
        $state.go("app.notification");
      }else{

      }
       scope.modal.hide();
       scope.modal.remove();

      };
    
    // Just add some dummy data..
    user.set('name', 'biodiv');
    user.set('bio', 'This is my little bio');
    user.save();
   
    var callback = function(data) {
      console.log(data.token);
      if(window.Connection) {
        if(navigator.connection.type != Connection.NONE) {
     if(localStorage.getItem('NOTIFICATION')== null){
      
        NotificationService.SaveTokens(data.token).then(function(resp){
          var setVar = {"tokenVar":data.token};
          localStorage.setItem('NOTIFICATION',JSON.stringify(setVar));
        });

         }
       }
     }
      
      push.addTokenToUser(user);
      user.save();
    };
    push.register(callback);
    var appVersion;*/
    /*if(navigator.connection.type != Connection.NONE) {

    NotificationService.GetAppVersion().then(function(localVersion){
      appVersion = localVersion.data.instance.andriod;
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
              window.open('https://play.google.com/store/apps/details?id=com.ifp.wikwio', '_system');
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
     
    /*if(typeof navigator.globalization !== "undefined") {
      navigator.globalization.getPreferredLanguage(function(language) {
          $translate.use((language.value).split("-")[0]).then(function(data) {
            //alert(data);
              console.log("SUCCESS -> " + data);
          }, function(error) {
              console.log("ERROR -> " + error);
          });
      }, null);
    }*/
     if(localStorage.getItem('USER_KEY')!== null){
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
               for(var i=0; i<res.rows.length; i++){
              var query1 = "UPDATE OBSERVATION SET STATUS='PENDING' WHERE ID ="+res.rows.item(i)['id'];
               $cordovaSQLite.execute(db, query1).then(function(res) {
                if(i = res.rows.length-1){
                $cordovaToast.show("You have PENDING observations ", "long", "bottom").then(function(success) {
                    console.log("The toast was shown");
                }, function (error) {
                    console.log("The toast was not shown due to " + error);
                });
              }
               }, function (err) {
                //alert(err);
                  console.error("newwww"+err);
              });
             }
            }
          }, function (err) {
            //alert(err);
              console.error("newwww"+err);
          });
             }
         $state.go("app.home");
      }
      var countVal = {"successVal":0,"failedVal":0};
      localStorage.setItem('countvariables',JSON.stringify(countVal));
  //}
      
    }
     
  });
  $ionicPlatform.registerBackButtonAction(function () {
       //alert("Hello");
       $ionicSideMenuDelegate.toggleLeft();
       //return ;
     }, 100);
})



.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $translateProvider) {
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
    //cache:false,
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller: 'HomeController'
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
      //cache:false,
      url: "/editDetails/:browseId",
      views: {
        'menuContent': {
          
          templateUrl: "templates/editObservation.html",
          controller: 'EditObservationCtrl'
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
  $urlRouterProvider.otherwise('/login');
  $ionicConfigProvider.navBar.alignTitle("center");
 
  $translateProvider.preferredLanguage("en");
  $translateProvider.fallbackLanguage("en");
  $translateProvider.translations("en", languageEnglish);
  $translateProvider.translations("fr", languageFrench);

});



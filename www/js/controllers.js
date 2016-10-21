var appne = angular.module('starter.controllers', [])

appne.controller('AppCtrl', function($scope, $location,$ionicUser,$rootScope,$ionicPush,$cordovaPush,$rootScope,$state,$ionicModal, $ionicSideMenuDelegate, $timeout,LoginService,$ionicPopup,$cordovaToast, $cordovaOauth, ApiEndpoint, $http, $cordovaProgress) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  //localStorage.removeItem('USER_KEY');
  //alert($location.absUrl());
  $ionicSideMenuDelegate.canDragContent(false);
  

  if(localStorage.getItem('SETTINGS') == null){
    //alert(Icheck());
    var setVar = {"wifiSetting":false,"manualUpload":false};
       localStorage.setItem('SETTINGS',JSON.stringify(setVar));
  }


  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  /*$scope.closeLogin = function() {
    $scope.modal.hide();
  };*/

  // Open the login modal
  
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {

    
    
    var check =internetCheck($ionicPopup);
    if(check == false){
      return;
    } else {
      $cordovaProgress.showSimple(true) ;
    /*var check = {"check1":"hi"}
    localStorage.setItem("checking",JSON.stringify(check));*/
    //console.log('Doing login', $scope.loginData);
    //localStorage.removeItem('USER_KEY');
    LoginService.GetUserDetails($scope.loginData).then(function(vals){

      console.log('Doing login', vals);

      var uservar = {"userKey":vals["data"]['model']['token'],"userID":vals["data"]['model']['id'],"nId":0};
       localStorage.setItem('USER_KEY',JSON.stringify(uservar));
       if(localStorage.getItem('Home') == null){
     //alert(Icheck());
          var homeValue = {"ExecuteVal":0};
          localStorage.setItem('Home',JSON.stringify(homeValue));
        }
        $cordovaProgress.hide();
        $state.go("app.home");
      /*var laboo = localStorage.getItem('checking');
      var taboo = JSON.parse(laboo);
      alert(taboo.check1);*/
      //$scope.userDetails = vals;
      //console.log('Doing login', vals["data"]['model']['token']);

      });
  }

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
   
    $timeout(function() {
      //$scope.closeLogin();
    }, 1000);
  };

  $scope.facebookLogin = function() {
    $cordovaOauth.facebook("836915199738203", ["email"]).then(function(result) {
            //alert(JSON.stringify(result));
            //var res = JSON.stringify(result);
            var access_token = result.access_token;
            //alert(access_token);
        facebook(access_token);
    });
  }

  $scope.googleLogin = function() {
    //$(".modal").show();
    //667301081944-v71rladv4mlt3ockv2rjomtfs4rckebp.apps.googleusercontent.com
    //29806730219-b6l9ofjup5f1luupdjngtv7ir8r8vlrv.apps.googleusercontent.com
        $cordovaOauth.google("317806372709-lj7r2mfrkgihhqnodmelugtqga3m4vb4.apps.googleusercontent.com", ["email"]).then(function(result) {
            console.log(JSON.stringify(result));
            //var res = JSON.stringify(result);
            var access_token = result.access_token;
            //alert(access_token);
        google(access_token);
    },function(error) {
      alert(JSON.stringify(error));
    });
  }

  function facebook(accessKey){
    //alert("accessKey" + accessKey);
    //$(".modal").hide();
    $cordovaProgress.showSimple(true) ;
    LoginService.FacebookUserlogin(accessKey).then(function(res){
     // alert("in to success");
          console.log(res);
          //alert(JSON.stringify(res));
          var gToken = res.data.model.token ;
          //alert(gToken);
          var uservar = {"userKey":res["data"]['model']['token'],"userID":res["data"]['model']['id'],"nId":0};
          localStorage.setItem('USER_KEY',JSON.stringify(uservar));
          $cordovaProgress.hide();
          $state.go("app.home");
       });
  }

  function google(accesVal){
    //alert("came");
    //$(".modal").hide();
    $cordovaProgress.showSimple(true) ;
    LoginService.GoogleUserlogin(accesVal).then(function(res){
      //alert("in to success");
          console.log(res);
          //alert(JSON.stringify(res));
          var gToken = res.data.model.token ;
          //alert(gToken);
          var uservar = {"userKey":res["data"]['model']['token'],"userID":res["data"]['model']['id'],"nId":0};
          localStorage.setItem('USER_KEY',JSON.stringify(uservar));
          if(localStorage.getItem('Home') == null){
     //alert(Icheck());
          var homeValue = {"ExecuteVal":0};
          localStorage.setItem('Home',JSON.stringify(homeValue));
        }
          $cordovaProgress.hide();
          $state.go("app.home",{},{cache:false});
       });
  }

  $scope.forgotPassword = function() {
    $ionicPopup.prompt({
    title: 'Forgot Password ?:',
    subTitle: 'Password will be sent to this email id',
    inputType: 'text',
    inputPlaceholder: 'Email'
  }).then(function(email) {
   //console.log('Your password is', res);
   if(!validateEmail(email)){
        //alert("Invalid email");
       showToast($cordovaToast,"Please enter a valid Email")
        return ;
      }
 LoginService.ForgotPassword(email).then(function(res){

          console.log(res);
          //$(".modal").hide();
          showToast($cordovaToast,res.data.msg);
       });

 });
    
  }

  function showDailog(message){

      $ionicPopup.alert({
          title: 'ERROR',
          content: message//'You must submit atleast one image'
        });
    }
})


function showToast($cordovaToast,message) {
  $cordovaToast.show(message, "long", "bottom").then(function(success) {
            console.log("The toast was shown");
        }, function (error) {
            console.log("The toast was not shown due to " + error);
        });
        //else $ionicLoading.show({ template: message, noBackdrop: true, duration: 2000 });
    }

appne.controller('NewUserCtrl', function($scope,LoginService,$timeout,$cordovaToast,$state,LocationService,$ionicPopup,$cordovaGeolocation){

  $scope.register = {
    name:"",
    email:"",
    password:"",
    password2:"",
    location:"",
    longitude:"",
    latitude:"",
  };

  
    $scope.editGPS = function(){
     //$scope.gpsPopup.close();
      var inter = Icheck();
        if(inter == false){
          showToast($cordovaToast,"No Internet")
          return;
        }else {
          $('ion-nav-bar').addClass('hide');
          $state.go("registerLocation");
        }
    }

   $scope.doRegister = function() {

      var name = $scope.register.name;
      var email = $scope.register.email;
      var password = $scope.register.password;
      $scope.register.location = $('#Locationvalue1').text();
      console.log($('#Locationvalue1').text())
      var data = LocationService.GetUserSelectedLocation()
      $scope.register.latitude = data.latitude
      $scope.register.longitude = data.longitude
      $scope.register.password2 = password;
      console.log(email);
          if(name.length == 0){
            showToast($cordovaToast,"name cannot be empty");
            return ;
          }
          //console.log(validateEmail(email));
          if(!validateEmail(email)){
            showToast($cordovaToast,"Invalid email");
            return ;
          }
          if(password.length <5){
            showToast($cordovaToast,"password length has to be 5 characters");
            return ;
          }
          if($('#Locationval').text() == "Location"){
            showToast($cordovaToast,"Please enter a Location");
            return ;
          }

          //console.log(LoginService);

       LoginService.RegisterUser($scope.register).then(function(vals){

          console.log(vals);
          $(".modal1").hide();
          showToast($cordovaToast,vals.data.msg);
          $state.go('login');
       });

          //$(".modal").show();
   }

   
});
function validateEmail(email) { 
  // http://stackoverflow.com/a/46181/11236
  
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


appne.controller('LogoutController', function($scope, $state, $window, $ionicPopup, $cordovaSQLite,$ionicHistory,BrowseService) {

//alert("hello");
$scope.speciesGroups = [{"id":1,"name":"All"},{"id":8,"name":"Mammals"},{"id":6,"name":"Birds"},{"id":11,"name":"Fish"},{"id":5,"name":"Amphibians"},{"id":9,"name":"Reptiles"},{"id":10,"name":"Molluscs"},{"id":7,"name":"Arthropods"},{"id":4,"name":"Plants"},{"id":3,"name":"Fungi"},{"id":2,"name":"Others"}];
   $scope.logout = function(){
        console.log("logout");
        //internetCheck($ionicPopup);
        localStorage.removeItem('USER_KEY');
        localStorage.removeItem('Home');

        localStorage.removeItem('UserGroupArray');
         $state.go("login");
         //$window.location.reload(true)
         /*var query = "DELETE FROM OBSERVATION WHERE STATUS='FAILED'";
         //alert(query);
          $cordovaSQLite.execute(db, query).then(function(res) {
              console.log("INSERT ID -> " + res);
              //alert("transactedlogout");
          }, function (err) {
            //alert(err);
              console.error("erorrrrrr   "+err);
          });*/
      } 


      $scope.goToNewObs = function(){
        $ionicHistory.clearCache().then(function(){ 
         $state.go('app.newObservation',{},{ reload: true });
        })
      }
       $scope.goToObsNearby = function(){
          cordova.plugins.diagnostic.isLocationEnabled(function(enabled){
              //alert(enabled);
                if(enabled ){
                    $scope.listPopup = $ionicPopup.show({
                             template: '<ion-list class="item-icon-right">                                '+
                                       '  <ion-item class="item " id="uGroup{{usrgrps.id}}" ng-repeat="usrgrps in speciesGroups " ng-click="goToNearBy({{usrgrps.id}});" > '+
                                       '    {{usrgrps.name}}                             '+
                                       '  </ion-item>                             '+
                                       '</ion-list>                               ',
                             title: 'Observation Near me',
                             scope: $scope,
                             buttons: [
                               { text: 'Cancel' },
                             ]
                           });     
                  } else {

                 var confirmPopup = $ionicPopup.alert({
                    title: 'GPS',
                    template: "Location not found.Please enable the Location Services for the app"
                  });
                   /*confirmPopup.then(function(result) {

                               cordova.plugins.settings.openSetting(settingName, success,failure);
                    });*/

              }

                

            }, function(error){
                alert("The following error occurred: "+error);
            });

            

      }
      $scope.goToNearBy = function(browseId){
        $scope.listPopup.close();
              BrowseService.setSpeciesGroupID(browseId);

        $ionicHistory.clearCache().then(function(){ 
            $state.go('app.observationnearby',{},{ reload: true });
          })
        
      }
        
         /*var tokenVal = localStorage.getItem('USER_KEY');
      var tokenVar = JSON.parse(tokenVal);
      var countVal = tokenVar.nId;
        if(countVal==0){
          tokenVar.nId = 1;
          localStorage.setItem('USER_KEY',JSON.stringify(tokenVar));
          $state.go("app.newObservation");
        }else{
      
          $state.go("app.newObservation",null,{reload:true});
        }*/
        //return false;
      
      $scope.goToMyCollection = function(){
        $ionicHistory.clearCache().then(function(){ 
          $state.go('app.mycollection');
        })
      }

      $scope.goToBrowseObs = function(){
           $scope.listPopup = $ionicPopup.show({
         template: '<ion-list class="item-icon-right">                                '+
                   '  <ion-item class="item " id="uGroup{{usrgrps.id}}" ng-repeat="usrgrps in speciesGroups " ng-click="browseObs({{usrgrps.id}});" > '+
                   '    {{usrgrps.name}}                             '+
                   '  </ion-item>                             '+
                   '</ion-list>                               ',
         title: 'Select Groups',
         scope: $scope,
         buttons: [
           { text: 'Cancel' },
         ]
       });  

      }

      $scope.browseObs = function(IdValue){
       $scope.listPopup.close();
      BrowseService.setSpeciesGroupID(IdValue);
        $ionicHistory.clearCache().then(function(){ 
          $state.go('app.browse',{},{ reload: true });
        })
      }

     
});
//appne.controller('observationStatusController', function($scope, NewObservationService, $cordovaSQLite){
  function observationStatusController($scope, NewObservationService, $cordovaSQLite){
  var setStorage = localStorage.getItem('SETTINGS');
     var setValues = JSON.parse(setStorage);
     $scope.pendingObservation = setValues.manualUpload;
     $scope.details = [];
     $scope.obsStatusList = false;
     $scope.obsStatusFailedList = false;
     var query = "SELECT * from observation ";
    $cordovaSQLite.execute(db, query).then(function(res) {
      if(res.rows.length == 0){
       // $("div #obsStatusMsg").show();
       $scope.obsStatusList = false;
      }else{
        for(var i=0;i<res.rows.length;i++){
          var dat = JSON.parse(res.rows.item(i)['obslist']);
          var iCheck = Icheck();
                  if(iCheck==true && dat.hasOwnProperty('file_name')){
                    $scope.deleteMultiple(res.rows.item(i)['id'],dat['file_name'] );
                  }

          console.log(dat);
           if(res.rows.item(i)['status'] == "No Location"){
            $scope.obsStatusList = true;
            $scope.details.push({"id":res.rows.item(i)['id'], "sciName":dat['recoName'],"status":res.rows.item(i)['status'], "imgArr":dat['imagePath'], "date":dat['fromDate'], "location":dat['placeName'], "notes":dat['notes'], "showGPS":true });

          }else {
            if(res.rows.item(i)['status'] == "PENDING" || res.rows.item(i)['status'] == "PROCESSING"){
               $scope.obsStatusList = true;
               $scope.details.push({"id":res.rows.item(i)['id'], "sciName":dat['recoName'],"status":res.rows.item(i)['status'], "imgArr":dat['imagePath'], "date":dat['fromDate'], "location":dat['placeName'], "notes":dat['notes'], "showGPS":false });

            }
            if(res.rows.item(i)['status'] == "FAILED"){
              $scope.obsStatusFailedList = true;
              $scope.details.push({"id":res.rows.item(i)['id'], "sciName":dat['recoName'],"status":res.rows.item(i)['status'], "imgArr":dat['imagePath'], "date":dat['fromDate'], "location":dat['placeName'], "notes":dat['notes'], "showGPS":false });

            }
        }
      }
        //$("div #obsStatusList").show();
        //$scope.obsStatusList = true;
        NewObservationService.SetDetails($scope.details);
      }
      console.log($scope.details);
        
    }, function (err) {
      //alert(err);
        console.error(err);
    });
  }
  /*if(localStorage.getItem('StatusArray')== null){

        

  }else {
    //$route.reload();
    //alert("statuscntrl");
      var status = localStorage.getItem('StatusArray');
      var statusArray1 = JSON.parse(status);

      console.log(statusArray1);
      $scope.details = statusArray1;
      
      $("div #obsStatusList").show();

  }*/
//});
appne.controller('statusDetailsController', function($state,$scope,$location,NewObservationService,$cordovaSQLite,$ionicPopup) {
  
  console.log("statusDetailsController");

    $scope.singleObsDetails = [];
    $scope.singleImgDetails = [];
      var obsId = $location.path().split("/")[3];
      //alert(obsId);
    var statusArray1 = NewObservationService.GetDetails();
    console.log(statusArray1);
      //var status = localStorage.getItem('StatusArray');
      //var statusArray1 = JSON.parse(status);

      for(var i=0; i<Object.keys(statusArray1).length;i++){
        if(statusArray1[i]['id'] == obsId){
          $scope.singleObsDetails.push({"id":statusArray1[i]['id'],"scientificName":statusArray1[i]['sciName'],"CommonName":statusArray1[i]['commonName'],"observed":statusArray1[i]['date'],"updated":statusArray1[i]['date'],"submitted":statusArray1[i]['date'],"author":'',"place":statusArray1[i]['location'], "imgDetails":statusArray1[i]['imgArr'], "notes":statusArray1[i]['notes']});
          //$scope.singleImgDetails.push({"image":{"icon":statusArray1[i]['imgArr']}})
          $scope.singleImgDetails.push({"image":statusArray1[i]['imgArr']});
          if(statusArray1[i]['status'] == 'FAILED'){
            $scope.ShowSubmitButton = true;
          }else {
            $scope.ShowSubmitButton = false;
          }
        } 
      }

      $scope.goStatus = function(){
       $state.go('app.observationStatus');

      }

      $scope.submitFailedObs = function(){
        var query = "UPDATE OBSERVATION SET STATUS='PENDING' WHERE ID ="+obsId;
      $cordovaSQLite.execute(db, query).then(function(res) {
                    console.log("INSERT ID -> " + res.insertId);
                            $state.go('app.observationStatus');

       }, function (err) {
      //alert(err);
        console.error(err);
      });
      }

      $scope.deleteObs = function(){
         var confirmPopup = $ionicPopup.confirm({
           title: 'Delete Observation',
           template: 'This Observation will be deleted permanently. Are you sure ? '
         });
         confirmPopup.then(function(result) {
           if(result) {
              var query = "DELETE FROM OBSERVATION  WHERE ID ="+obsId;
              $cordovaSQLite.execute(db, query).then(function(res) {
                            console.log("INSERT ID -> " + res.insertId);
                                    $state.go('app.observationStatus');

               }, function (err) {
              //alert(err);
                console.error(err);
              });
           }else{}
         });


      }
//alert($scope.singleImgDetails[0]["image"]);
//console.log($scope.singleImgDetails[0]["image"]["icon"]);
//console.log(obsId);


  
    //console.log(imgDetails);
});

appne.controller('BrowseDetailsCtrl', function($scope,$state,ApiEndpoint, $http, $window,$ionicModal,$filter,$cordovaInAppBrowser,$location,BrowseService,NewObservationService,LocationService,$ionicPopup,UserGroupService,$cordovaToast,$ionicSideMenuDelegate,$ionicHistory) {
  $scope.vedio = false;
  $scope.showButton = true;
    //$scope.agreeButton = false;
    //$scope.acceptedName = true;
    $scope.showMore = false;
    $ionicSideMenuDelegate.canDragContent(false);
  var tokenvar = localStorage.getItem('USER_KEY');
  var tokenvar1 = JSON.parse(tokenvar);
  var userId = tokenvar1.userID;
  $scope.userValue = tokenvar1.userID;
  //alert($scope.userValue);
  console.log("BrowseDetailsCtrl");
  $scope.comment = {
    text:''
  };
  $scope.suggest = {
    sciName:'',
    commonName:'',
    comment:'',
    recoId:'',
    lang:'English'
  };
  $scope.languages = [];
  $scope.languages.push("Abor","Bangla","Afghan","Arab","Assam","Assamese","Awadhi","Baduga and Kurumba","Baluchi","Bauris of Deccan","Beng","Bengali","Benhali","Bhagalpore hill tribes","Bhagulpore hill tiibes","Bhojpuri","Bihari","Bihari languages","Blue English","Braj","Brngali","Bundelkand","Burm","Burmese","cabbage white","Cach","Cach.","Cachar","Chin","Cingalese","Coorg","Coorgi","Daff","Deccan","Dogri","Dravidian languages","Duff","Dur","Dutch","English","EnglishHindi","English/hindi","EnglisHindih","Garh","Garo","Gond","Gondi","Gonds","Guinea-Bissau","Gujarat","Gujarati","Hi","Hill-tribes near Simla","Hima","Himachali languages; Western Pahari languages","Hin","Hind","Hindi","Hindi,Bengali","Hindi/ English","Hindihi","Ho","Hyderabad","Igilwat","Indian Languages","Indic Languages","Iran","Irula","Kach","Kachchi","Kannada","Kash","Kashmiri","Kashi","kiraalbogi","Konkani","Kuki","Kutchi","Ladak","Ladh","Ladk","Lakh","Lepcha","Lush","Ma");
$scope.editButton = function(){
  LocationService.SetUserSelectedLocAdd('');
}
//window.open('http://indiabiodiversity.org/biodiv/user/{{item.userId}}', '_system');
var obsId = $location.path().split("/")[3];

$scope.openUser = function(userId){
  //$window.open('http://indiabiodiversity.org/user/show/'+userId, '_system');

$cordovaInAppBrowser.open('http://indiabiodiversity.org/user/show/'+userId, '_blank')
      .then(function(event) {
        // success
      })
      .catch(function(event) {
        // error
      });
}
//console.log(typeof(newUrl.split("/")[3]));
//console.log(obsId);

$scope.obsDetails=BrowseService.getObsList()

console.log($scope.obsDetails);
browsingArray($scope,$scope.obsDetails,obsId, NewObservationService)
$scope.commentList = [];


  BrowseService.GetComments(obsId).then(function(commentsList){

    console.log(commentsList);
    for(var i=0;i<commentsList['data']['model']['instanceList'].length;i++){
      $scope.commentList.push({"userIcon":commentsList['data']['model']['instanceList'][i]['author']['icon'],"userId":commentsList['data']['model']['instanceList'][i]['author']['id'],"userName":commentsList['data']['model']['instanceList'][i]['author']['name'],"activityAction":'',"activityName":$("<p>").html(commentsList['data']['model']['instanceList'][i]['text']).text(),"date":$filter('date')( commentsList['data']['model']['instanceList'][i]['lastUpdated'] ), "fullDate":commentsList['data']['model']['instanceList'][i]['lastUpdated'], "commentId":commentsList['data']['model']['instanceList'][i]['id'], "commentFlag":false });
    
    }
    

  } );


   BrowseService.GetServerTime().then(function(time){

      console.log(time);
      $scope.serverTime = time;
      var z='';
       BrowseService.GetActivityFeed(obsId,z).then(function(feedList){
        $scope.showMore = true;
          console.log(feedList);
          $scope.timeVal = feedList['data']['newerTimeRef'] ;
          parsingFeedDetails($scope,feedList['data']['model']['feeds'],$filter,UserGroupService);

          //$scope.commentList.push({"userName":"karthik","activityAction":"Posted observation to group","activityName":"Western Ghats"}, {"userName":"karthik","activityAction":"Posted observation to group","activityName":"Western Ghats"});

        } );

    } );

   $scope.showMoreButton = function(){
    console.log($scope.timeVal);
    BrowseService.GetActivityFeed(obsId,$scope.timeVal).then(function(newFeedList){
      $scope.listFeed=[];
          console.log(newFeedList);
          $scope.timeVal = newFeedList['data']['newerTimeRef'] ;
          //for(var i=0;i<1;i++){
            
            $scope.listFeed.push(newFeedList['data']['model']['feeds'][0]);
            
          //}
          console.log($scope.listFeed);
          parsingFeedDetails($scope,$scope.listFeed,$filter,UserGroupService);

          //$scope.commentList.push({"userName":"karthik","activityAction":"Posted observation to group","activityName":"Western Ghats"}, {"userName":"karthik","activityAction":"Posted observation to group","activityName":"Western Ghats"});

        } );
   }
  


  BrowseService.GetRecommendationVotes(obsId).then(function(recommendationVotes){
    //$scope.acceptedName = true;
    console.log(recommendationVotes);
    //alert(recommendationVotes.data.model.recoVotes.length);
    parsingRecoDetails($scope,recommendationVotes['data']['model']['recoVotes'], userId);


  }, function (err){
    //alert("err");
    //$scope.acceptedName = false;
  });
$scope.paramsList ={};
  $scope.postComments = function(){
    if($scope.comment.text == ''){
      showIonicAlert($ionicPopup,'Please enter a comment');
    } else{
      $scope.paramsList['rootHolderId'] = obsId ;
      $scope.paramsList['rootHolderType'] = "species.participation.Observation" ;
      $scope.paramsList['commentBody'] = $scope.comment.text ;
      $scope.paramsList['commentHolderId'] = obsId ;
      $scope.paramsList['commentHolderType'] = "species.participation.Observation" ;
      $scope.paramsList['newerTimeRef'] = $scope.serverTime ;
      BrowseService.AddComments( $scope.paramsList).then(function(res){
        console.log(res);
        if(res.data.success == true){
          $scope.commentList.push({"userIcon":"","userId":"","userName":"you","activityAction":"","activityName":$scope.comment.text,"date":"now","fullDate":""});
          $scope.comment.text ='';
          showToast($cordovaToast,"successfully added, please visit the page again to see updated details");

        }
      });
        //$scope.commentList.push({"userName":"karthik","activityAction":"Posted observation to group","activityName":$scope.comment.text});

    }
    
  }

  $scope.agreButton = function(recoId){
    BrowseService.AgreeRecommendationVotes(obsId, recoId).then(function(res){
      console.log(res);
      console.log(recoId);
      console.log($scope.agreeDetails);
      if(res.data.success==true){
      /*for(var i=0;i < $scope.agreeDetails.length;i++){
                    alert($scope.agreeDetails[i]['recoId']);

          if($scope.agreeDetails[i]['recoId'] == recoId){
            alert('here');
            $scope.agreeDetails[i]['noOfVotes'] = ++$scope.agreeDetails[i]['noOfVotes'];
            $scope.agreeDetails[i]['buttonVal'] = true;
            break;
          }
        }*/
         //showToast($cordovaToast,"successfully added, please visit the page again to see updated details");
         BrowseService.GetRecommendationVotes(obsId).then(function(recommendationVotes){
          //$scope.acceptedName = true;
          console.log(recommendationVotes);
          //alert(recommendationVotes.data.model.recoVotes.length);
          parsingRecoDetails($scope,recommendationVotes['data']['model']['recoVotes'], userId);


        }, function (err){
          //alert("err");
          //$scope.acceptedName = false;
        });
      }
    });
    //$scope.agreeButton = true;
    //$("#removeButton"+recoId).show();
    //$("#agreeButton"+recoId).hide();
    
  }
  $scope.removeButton = function(recoId){
    //alert(recoId);
    BrowseService.RemoveRecommendationVotes(obsId, recoId).then(function(res){
      //console.log(res);
      if(res.data.success==true){
        /*for(var i=0;i < $scope.agreeDetails.length;i++){
          if($scope.agreeDetails[i]['recoId'] == recoId){
            //console.log("here11");
            $scope.agreeDetails[i]['noOfVotes'] = --$scope.agreeDetails[i]['noOfVotes'];
             //console.log("here");
            for(var j = 0;j < $scope.agreeDetails[i]['userDetails'].length ; j++){
              if($scope.agreeDetails[i]['userDetails'][j]['userId'] == userId){
                //console.log("here");
                $scope.agreeDetails[i]['userDetails'].splice(j,1);
                $scope.agreeDetails[i]['buttonVal'] = false;
                //console.log($scope.agreeDetails);
                break;
              }
            }
            break;
          }
        }
        showToast($cordovaToast,"successfully removed, please visit the page again to see updated details");
*/
        BrowseService.GetRecommendationVotes(obsId).then(function(recommendationVotes){
            //$scope.acceptedName = true;
            console.log(recommendationVotes);
            //alert(recommendationVotes.data.model.recoVotes.length);
            parsingRecoDetails($scope,recommendationVotes['data']['model']['recoVotes'], userId);


          }, function (err){
            //alert("err");
            //$scope.acceptedName = false;
          });
      }

    });
    //$scope.agreeButton = false;
     //$("#agreeButton"+recoId).show();
    //$("#removeButton"+recoId).hide();
  }
  $scope.editDiv = false;
  $scope.edit = {
    editText : ''
  }
  $scope.editComment = function(id, comment){
    
    $scope.replyDiv = false;
    $scope.editDiv = true;
    $scope.edit.editText = comment;
          for(var i=0;i< $scope.commentList.length ;i++){
            //$scope.commentList[i]['commentFlag'] = false;
            if($scope.commentList[i]['activityAction']=='' && $scope.commentList[i]['commentId'] ==id){
              $scope.commentList[i]['commentFlag'] = true;
              //alert($scope.commentList[i]['commentFlag']);
              console.log($scope.commentList);
              //break;
            }else {
              //alert("came");
              $scope.commentList[i]['commentFlag'] = false;
            }
          }
   }
   $scope.updateComment = function(id,comment){
    //alert(id);
    $scope.editDiv = false;
    if($scope.edit.editText == '' ){
      showIonicAlert($ionicPopup,'Please enter a comment');
    } else if($scope.edit.editText == comment){
      showIonicAlert($ionicPopup,'comment not changed');
    } else {
        $scope.paramsList['commentBody'] = $scope.edit.editText ;
        $scope.paramsList['commentId'] = id ;
        BrowseService.AddComments( $scope.paramsList).then(function(res){
        console.log(res);
        if(res.data.success == true){
          //$scope.commentList.push({"userIcon":"","userId":"","userName":"you","activityAction":"","activityName":$scope.reply.replyText,"date":"now","fullDate":""});
          $scope.edit.editText ='';
          showToast($cordovaToast,"successfully Updated, please visit the page again to see updated details");

        }
      });
    }
   }
   $scope.deleteComment = function(id){
    //alert(id);

    var confirmPopup = $ionicPopup.confirm({
           title: 'Delete Comment',
           template: 'This comment will be deleted. Are you sure ? '
         });
         confirmPopup.then(function(result) {
           if(result) {

            $scope.editDiv = false;
            BrowseService.DeleteComment(id).then(function(res){
            console.log(res);
            if(res.data.success == true){
              for(var i=0;i< $scope.commentList.length ;i++){
                if($scope.commentList[i]['commentId'] ==id){
                  $scope.commentList.splice(i,1);
                  break;
                }
              }
              //$scope.commentList.push({"userIcon":"","userId":"","userName":"you","activityAction":"","activityName":$scope.reply.replyText,"date":"now","fullDate":""});
              
              //showToast($cordovaToast,"successfully deleted, please visit the page again to see updated details");

            } else {
              showToast($cordovaToast,"Comment deleted");
            }
          });

           } else {
              return;
           }
         });
    
   }
  $scope.replyDiv = false;
   $scope.replyToComment = function(id){
    //alert(id);
    $scope.editDiv = false;
    $scope.replyDiv = true;
          for(var i=0;i< $scope.commentList.length ;i++){
            if($scope.commentList[i]['activityAction']=='' && $scope.commentList[i]['commentId'] ==id){
              $scope.commentList[i]['commentFlag'] = true;
              //alert($scope.commentList[i]['commentFlag']);
              //break;
            }else {
              $scope.commentList[i]['commentFlag'] = false;
            }
          }
   }
   $scope.hideDiv = function(){
    $scope.replyDiv = false;
   }
   $scope.reply={
    replyText:''
   };
   $scope.postReply = function(id){
    
    //alert($scope.reply.replyText)
    //alert(id);
    if($scope.reply.replyText == ''){
      showIonicAlert($ionicPopup,'Please enter a comment');
    } else{
      $scope.paramsList['rootHolderId'] = obsId ;
      $scope.paramsList['rootHolderType'] = "species.participation.Observation" ;
      $scope.paramsList['commentBody'] = $scope.reply.replyText ;
      $scope.paramsList['commentHolderId'] = obsId ;
      $scope.paramsList['commentHolderType'] = "species.participation.Observation" ;
      $scope.paramsList['parentId'] = id ;
      $scope.paramsList['newerTimeRef'] = $scope.serverTime ;
      BrowseService.AddComments( $scope.paramsList).then(function(res){
        console.log(res);
        if(res.data.success == true){
          $scope.commentList.push({"userIcon":"","userId":"","userName":"me","activityAction":"","activityName":$scope.reply.replyText,"date":"now","fullDate":""});
          $scope.reply.replyText ='';
          $scope.replyDiv = false;
          showToast($cordovaToast,"successfully added, please visit the page again to see updated details");

        }
      });
        //$scope.commentList.push({"userName":"karthik","activityAction":"Posted observation to group","activityName":$scope.comment.text});

    }
   }
  $scope.suggestNames = function(){
    //console.log($scope.suggest);
    $scope.addReco = {
      obvId:obsId,
      recoName:'',
      commonName:'',
      languageName:'',
      recoId:'',
      recoComment:''
    };
    
    if($scope.suggest.commonName == '' && $scope.suggest.sciName ==''){
      showIonicAlert($ionicPopup,'Please enter a name');
      return;
    }

    if($scope.suggest.sciName.length >0){
      $scope.addReco.recoName = $scope.suggest.sciName
    }
    if($scope.suggest.commonName.length >0){
      $scope.addReco.commonName = $scope.suggest.commonName;
      $scope.addReco.languageName = $scope.suggest.lang;
    }
    if($scope.suggest.comment.length >0){
      $scope.addReco.recoComment = $scope.suggest.comment;
    }

    if($scope.suggest.recoId != 0 || $scope.suggest.recoId !='' ){
      $scope.addReco.recoId = $scope.suggest.recoId;
    }

    //console.log($scope.addReco);
    BrowseService.AddRecommendationVotes(obsId, $scope.addReco).then(function(result){

    console.log(result);
    for(var i=0;i < $scope.agreeDetails.length;i++){
      $scope.agreeDetails[i]['buttonVal'] = false;
    }
    //$scope.agreeDetails.push({"noOfVotes":"you" ,"canonicalForm": $scope.addReco.recoName,"commonNames": "("+$scope.addReco.commonName+")","userDetails":"", "recoId":"", "buttonVal":"tfal" })

    $scope.suggest.sciName='',
    $scope.suggest.commonName ='',
    $scope.suggest.recoComment='',
    BrowseService.GetRecommendationVotes(obsId).then(function(recommendationVotes){
    //$scope.acceptedName = true;
    console.log(recommendationVotes);
    //alert(recommendationVotes.data.model.recoVotes.length);
    parsingRecoDetails($scope,recommendationVotes['data']['model']['recoVotes'], userId);


  }, function (err){
    //alert("err");
    //$scope.acceptedName = false;
  });

    //showToast($cordovaToast,"successfully added, please visit the page again to see updated details");
    //if($scope.agreeButton){

    //}

   
  });

  }

      var idList = BrowseService.GetIDArrayBrowse();

      var indexElement ;
      for(var x=0; x<idList.length;x++){
        if(idList[x] == obsId){
          indexElement = x;
        }
      }
  //var element = angular.element(document.querySelector('#eventPlaceholder'));
      /*$ionicGesture.on('swiperight', function (event) {
        alert('right');
        $scope.$apply(function () {
          alert(indexElement);

          if(indexElement != 0){}
          $state.go('app.browsedetails',{browseId:idList[(indexElement)-1]});
        });
      }, element);

     $ionicGesture.on('swipeleft', function (event) {
              alert('left');

        $scope.$apply(function () {

          alert(indexElement);
          if(indexElement != idList.length){
            alert(idList[(indexElement)+1]);
            $state.go('app.browsedetails',{browseId:idList[(indexElement)+1]});
          }
        });
      }, element);  */
    $scope.goBacking = function(){
      /*console.log($ionicHistory.viewHistory());
      var logHistory = $ionicHistory.viewHistory().histories;
      var hisArray = []; 
              angular.forEach(logHistory, function(value, key){ 
                
                hisArray.push(value); 
              });
     //         console.log(hisArray[1].stack[0].stateId);
     // var history = $ionicHistory.viewHistory().histories.ion1.stack[0].stateId;
      var history = hisArray[1].stack[0].stateId;
      console.log(history);
      if(history=='app.observationnearby' || history=='app.mycollection'){
        $state.go(history);
      } else {
        $state.go('app.browse')
      }*/
       var orderValue =  BrowseService.GetTrackOrder();
       //alert(orderValue);
       if(orderValue ==1){
         $state.go('app.browse')
       }
        else if(orderValue==2){
          $state.go('app.observationnearby')

        }else{
          $state.go('app.mycollection')

        }


    }

    $scope.onSwipeRight = function(){
            //alert(indexElement);

          if(indexElement != 0){
              $state.go('app.browsedetails',{browseId:idList[(indexElement)-1]});
          }
          };
    $scope.onSwipeLeft = function(){
      //alert(indexElement)
          if(indexElement != idList.length-1){
            $state.go('app.browsedetails',{browseId:idList[(indexElement)+1]});
          }
    };



      $scope.getTestItems = function (query) {
                      //alert(query);
                       var itemArray = [];
                      itemArray.push({view: query,"acceptedName":'',recoId:0,'showField':query})
                     
                        if (query) {
                          $http.get(ApiEndpoint.url+'/recommendation/suggest?term='+query+'&nameFilter=commonNames').success(function(suggestData){
                            console.log(suggestData);
                            
                             for(var i=0; i<suggestData['model']['instanceList'].length;i++){
                              if(suggestData['model']['instanceList'][i]['acceptedName'] != null){
                                itemArray.push({view: htmlToPlaintext(suggestData['model']['instanceList'][i]['label']),acceptedName:suggestData['model']['instanceList'][i]['acceptedName'],"recoId":suggestData['model']['instanceList'][i]['recoId'],"showField":htmlToPlaintext(suggestData['model']['instanceList'][i]['label'])+"<br>["+suggestData['model']['instanceList'][i]['acceptedName']+"]"});
                               }else{
                                itemArray.push({view: htmlToPlaintext(suggestData['model']['instanceList'][i]['label']),acceptedName:suggestData['model']['instanceList'][i]['acceptedName'],"recoId":suggestData['model']['instanceList'][i]['recoId'],"showField":htmlToPlaintext(suggestData['model']['instanceList'][i]['label'])});
                              }
                             }
                             
                          })
                           return {
                                items:  itemArray
                            };
                            
                        }
                      
                     return {items :[]};
                      
                    };
                $scope.getScientificItems = function (query) {
                  //alert(query);
                   var itemArray = [];
                  itemArray.push({view: query,"acceptedName":'',recoId:0,'showField':query})
                 
                    if (query) {
                      $http.get(ApiEndpoint.url+'/recommendation/suggest?term='+query+'&nameFilter=scientificNames').success(function(suggestData){
                        console.log(suggestData);
                        
                         for(var i=0; i<suggestData['model']['instanceList'].length;i++){

                            if(suggestData['model']['instanceList'][i]['acceptedName'] != null){
                                itemArray.push({view: htmlToPlaintext(suggestData['model']['instanceList'][i]['label']),acceptedName:suggestData['model']['instanceList'][i]['acceptedName'],"recoId":suggestData['model']['instanceList'][i]['recoId'],"showField":htmlToPlaintext(suggestData['model']['instanceList'][i]['label'])+"<br>["+suggestData['model']['instanceList'][i]['acceptedName']+"]"});
                               }else{
                                itemArray.push({view: htmlToPlaintext(suggestData['model']['instanceList'][i]['label']),acceptedName:suggestData['model']['instanceList'][i]['acceptedName'],"recoId":suggestData['model']['instanceList'][i]['recoId'],"showField":htmlToPlaintext(suggestData['model']['instanceList'][i]['label'])});
                              }             
                            }
                         
                      })
                       return {
                            items:  itemArray
                        };
                        
                    }
                  
                 return {items :[]};
                  
                };

           $scope.itemsClicked = function (callback) {
           
            //alert(JSON.stringify(callback.selectedItems[0].view));
              $scope.suggest.sciName = callback.selectedItems[0].view;
              
              if(callback.selectedItems[0].recoId != 0){
                $scope.suggest.recoId = callback.selectedItems[0].recoId;
              }else{
                $scope.suggest.recoId = '';
              }

            
          };
          $scope.itemsRemoved = function (callback) {
            //alert(JSON.stringify(callback))
              $scope.suggest.sciName = "";
              $scope.suggest.recoId = '';
          };
          $scope.nameClicked = function (callback) {
            console.log(callback);
              $scope.suggest.commonName = callback.selectedItems[0].view;
              if(callback.selectedItems[0].acceptedName!=''){
                $scope.suggest.sciName = callback.selectedItems[0].acceptedName;
                $("#sugestName").text(callback.selectedItems[0].acceptedName);
              }
              if(callback.selectedItems[0].recoId != 0){
                $scope.suggest.recoId = callback.selectedItems[0].recoId;
              }
              

            
          };
          $scope.nameRemoved = function (callback) {
                        console.log(callback);

            //alert(JSON.stringify(callback))
              $scope.suggest.commonName = "";
          };

          $scope.showImages = function(index) {
           $scope.activeSlide = index;
           $scope.showModal('templates/image-popover.html');
          }

          $scope.showModal = function(templateUrl) {
           $ionicModal.fromTemplateUrl(templateUrl, {
           scope: $scope,
           animation: 'slide-in-up'
           }).then(function(modal) {
           $scope.modal = modal;
           $scope.modal.show();
           });
         }
         $scope.closeModal = function() {
           $scope.modal.hide();
           $scope.modal.remove()
         };

         
  $scope.userGroups =[];
         $scope.showMyGroups = false;
          var groups = UserGroupService.GetUserJoinGroups();
          var instanceList = groups['data']['model']['observations'];
          console.log( groups)
          var enabled;
          if(instanceList.length>0){
            console.log($scope.singleObsDetails);
                     $scope.showMyGroups = true;

            for(var i=0; i<instanceList.length; i++){
              for(var j=0;j<$scope.singleObsDetails[0]["UGroupID"].length;j++){
                if($scope.singleObsDetails[0].UGroupID[j]==instanceList[i].id){
                  enabled = true;
                  break;
                }else {
                  enabled = false;
                }
              }
              $scope.userGroups.push({"id":instanceList[i].id,"name":instanceList[i].title,"enabled":enabled})
            }
          }else{
                     $scope.showMyGroups = false;

          }
          $scope.postRemoveGroup ={};
          $scope.postGroup = function(type){
            //alert(type);
            $scope.userGroupIDVal = [];


            for(var i = 0; i < $scope.userGroups.length; i++){
              if($scope.userGroups[i]['enabled']==true){
                $scope.userGroupIDVal.push($scope.userGroups[i]['id'])
              }
            }
            console.log($scope.userGroupIDVal);
            if($scope.userGroupIDVal.length != 0){
                          $scope.isHidden = false;

              $scope.postRemoveGroup['userGroups'] = $scope.userGroupIDVal.join(',');
              $scope.postRemoveGroup['objectIds'] = obsId;
              $scope.postRemoveGroup['objectType'] = "species.participation.Observation";
              $scope.postRemoveGroup['submitType'] = type;
              $scope.postRemoveGroup['pullType'] = "single";
              $scope.postRemoveGroup['author'] = userId;
            //$scope.postRemoveGroup['selectionType'] = "selectAll";


            UserGroupService.PostToGroup($scope.postRemoveGroup).then(function(response){
              //$scope.acceptedName = true;
              console.log(response);
              //alert("posted");
              if(response.data.success == true){
                BrowseService.GetServerTime().then(function(time){

                  console.log(time);
                  $scope.serverTime = time;
                   BrowseService.GetActivityFeed(obsId,'').then(function(feedList){
                    $scope.showMore = true;
                      console.log(feedList);
                      $scope.timeVal = feedList['data']['newerTimeRef'] ;
                      parsingFeedDetails($scope,feedList['data']['model']['feeds'],$filter,UserGroupService);

                      //$scope.commentList.push({"userName":"karthik","activityAction":"Posted observation to group","activityName":"Western Ghats"}, {"userName":"karthik","activityAction":"Posted observation to group","activityName":"Western Ghats"});

                    } );

                });
                if(type=='remove'){
                  for(var i = 0; i < $scope.userGroupIDVal.length; i++){
                    for(var j = 0; j < $scope.userGroups.length; j++){
                      if($scope.userGroups[j]['id'] == $scope.userGroupIDVal[i]){
                        $scope.userGroups[j]['enabled'] = false;
                        //break;
                      }

                    }
                  }

                }
                showToast($cordovaToast, type+" successfull, you can check the updated details in Activity Feed")
              }

            }, function (err){
              //alert("err");
              //$scope.acceptedName = false;
            });
          }else{
            showIonicAlert($ionicPopup,'Please select a group');
            console.log($scope.userGroupIDVal);
          }
          }




})

function showIonicAlert($ionicPopup,message){

      $ionicPopup.alert({
          title: 'ERROR',
          content: message//'You must submit atleast one image'
        });
    }

function parsingRecoDetails($scope, recommendationDetails, userId){

  $scope.agreeDetails =[];
  if(recommendationDetails.length>0){
    $scope.checkReco = true;
    var buttonVal = false;
  for(var i=0; i< recommendationDetails.length; i++){
    var agreedUser =[];
    for(var j=0; j< recommendationDetails[i]['authors'].length; j++){

       agreedUser.push({"userIcon": recommendationDetails[i]['authors'][j][0]['icon'], "userId": recommendationDetails[i]['authors'][j][0]['id']});
       if(recommendationDetails[i]['authors'][j][0]['id'] == userId){
        //alert('came'+ userId);
          //$scope.agreeButton = true;
          //$(".listss #removeButton"+recommendationDetails[i]['recoId']).show();
          //$(".listss #agreeButton"+recommendationDetails[i]['recoId']).hide();
          //console.log($("#agreeButton"+recommendationDetails[i]['recoId']).html());
          //alert($(".listss").html());
          buttonVal = true;
          $scope.recoValue = recommendationDetails[i]['recoId'];
       } else {
          //$scope.agreeButton = false;
          //buttonVal = false;
          //$("#agreeButton"+recommendationDetails[i]['recoId']).show();
          //$("#removeButton"+recommendationDetails[i]['recoId']).hide();
       }
    }
      $scope.agreeDetails.push({"noOfVotes":recommendationDetails[i]['noOfVotes'] ,"canonicalForm": recommendationDetails[i]['name'],"commonNames": recommendationDetails[i]['commonNames'],"userDetails":agreedUser, "recoId":recommendationDetails[i]['recoId'], "buttonVal":buttonVal })
      //alert(typeof($scope.agreeDetails[0]['noOfVotes']));
    }
  }else {
    $scope.checkReco = false;
  }


}
function parsingFeedDetails($scope,feedDetails,$filter,UserGroupService){
  //alert(JSON.stringify(feedDetails[3]));
  if(feedDetails.length==5 ){
    $scope.showMore = true;
  //} else if(feedDetails.length < 5){
   // $scope.showMore = false;
  } else if(feedDetails.length==1&&feedDetails[0]['activityType']=="Observation created"){
    $scope.showMore = false;
  }else if(feedDetails.length==1){
      $scope.showMore = true;
  }else{
    $scope.showMore = false;
  }

  var userGrp = UserGroupService.GetUserGroupsList();
  console.log(userGrp);
  var groupName;

  for(var i=0;i<feedDetails.length;i++){
    if(feedDetails[i]['activityHolderType'] == 'species.participation.RecommendationVote'){
      $scope.commentList.push({"userIcon":feedDetails[i]['author']['icon'],"userId":feedDetails[i]['author']['id'],"userName":feedDetails[i]['author']['name'],"activityAction":feedDetails[i]['activityType'],"activityName":$("<p>").html(feedDetails[i]['activityDescription']).text(),"date":$filter('date')( feedDetails[i]['lastUpdated'] ), "fullDate":feedDetails[i]['lastUpdated']});
    }
    if(feedDetails[i]['activityHolderType'] == 'species.groups.UserGroup'){
      var groupId = feedDetails[i]['activityHolderId'];

      for(var j=0;j<userGrp.length;j++){
        if(groupId == userGrp[j]['id']){
          groupName = userGrp[j]['name'];
           $scope.commentList.push({"userIcon":feedDetails[i]['author']['icon'],"userId":feedDetails[i]['author']['id'],"userName":feedDetails[i]['author']['name'],"activityAction":feedDetails[i]['activityDescription'],"activityName":groupName,"date":$filter('date')( feedDetails[i]['lastUpdated'] ), "fullDate":feedDetails[i]['lastUpdated']});
           break;
        }
      }
    }
    if(feedDetails[i]['activityHolderType'] == 'species.participation.Observation'){
      $scope.commentList.push({"userIcon":feedDetails[i]['author']['icon'],"userId":feedDetails[i]['author']['id'],"userName":feedDetails[i]['author']['name'],"activityAction":feedDetails[i]['activityType'],"activityName":$("<p>").html(feedDetails[i]['activityDescription']).text(),"date":$filter('date')( feedDetails[i]['lastUpdated'] ), "fullDate":feedDetails[i]['lastUpdated']});
    }
    if(i== (feedDetails.length - 1)){
      $scope.commentList = $scope.commentList.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        //return new Date(a.date) - new Date(b.date) && new Date(a['fullDate']).getTime() - new Date(b['fullDate']).getTime();
        return new Date(a['fullDate']).getTime() - new Date(b['fullDate']).getTime();
      });
      console.log($scope.commentList);
    }
  }
}
function browsingArray($scope,obsDetails,obsId,NewObservationService){

    var tokenvar = localStorage.getItem('USER_KEY');
    var tokenvar1 = JSON.parse(tokenvar);
    var currentUserId = tokenvar1.userID;
  var updated ,submited, observed, commonname, sciName, id, notes, author ;


  $scope.insertDetails = [];
  var imgDetails=[];
  var userid;
  //console.log(obsDetails);
  for(var i=0;i<obsDetails.length;i++){
      $scope.postedGroupID = [];
  if(Object.keys(obsDetails[i].maxVotedReco).length >0){
    if(obsDetails[i].maxVotedReco.hasOwnProperty('commonNamesRecoList')){
            commonname = obsDetails[i].maxVotedReco.commonNamesRecoList[0].name;
        }else {
          commonname="";
        }

        if(obsDetails[i].maxVotedReco.hasOwnProperty('sciNameReco')){
            if(obsDetails[i].maxVotedReco.sciNameReco.hasOwnProperty('taxonomyDefinition')){
              sciName = obsDetails[i].maxVotedReco.sciNameReco.taxonomyDefinition.name;
            }else{
              sciName = obsDetails[i].maxVotedReco.sciNameReco.name;
            }
          }else{
            sciName = commonname;
          }
      
    }else{
      sciName="Unknown";
      commonname="";
      }
      id = obsDetails[i].id;
      userid =  obsDetails[i]['author']['id'];
      //console.log(userid);
      imgDetails[id] ={};
      for(var j=0;j<obsDetails[i].resource.length;j++){
        //console.log(obsDetails[i].resource[j]);
        
        imgDetails[id][j]=obsDetails[i].resource[j];

      }
      
      //console.log(imgDetails);
      var updated1 = new Date(obsDetails[i].lastRevised.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
      var updated2 = updated1.toString();
       updated = updated2.slice(4,15);
       //console.log(updated);
      var submited1 = new Date(obsDetails[i].createdOn.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
      var submited2 = submited1.toString();
       submited = submited2.slice(4,15);
      var observed1 = new Date(obsDetails[i].fromDate.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
      var observed2 = observed1.toString();
       observed = observed2.slice(4,15);
      notes =  $("<p>").html(obsDetails[i].notes).text();

      author = obsDetails[i].author.name;
      place = obsDetails[i].reverseGeocodedName;
      if(obsDetails[i].hasOwnProperty('userGroups')){
              for(var j=0;j<obsDetails[i].userGroups.length;j++){
                $scope.postedGroupID.push(obsDetails[i].userGroups[j].id)
              }

      }
          $scope.insertDetails.push({"id":id,"scientificName":sciName,"CommonName":commonname,"observed":observed,"updated":updated,"submitted":submited,"author":author,"place":place, "imgDetails":imgDetails, "notes":notes, "userIdVal":userid, "UGroupID":$scope.postedGroupID});

    }



    for(var y=0;y<$scope.insertDetails.length;y++){

      

      if($scope.insertDetails[y].id==obsId){

        if($scope.insertDetails[y].userIdVal==currentUserId){
          NewObservationService.SetEditObsDetails(obsDetails[y]);
          $scope.vedio = true;
        } else {
          $scope.vedio = false;
        }
        $scope.singleObsDetails = [];
        $scope.singleImgDetails = [];
        $scope.singleObsDetails.push({"id":$scope.insertDetails[y].id,"scientificName":$scope.insertDetails[y].scientificName,"CommonName":$scope.insertDetails[y].CommonName,"observed":$scope.insertDetails[y].observed,"updated":$scope.insertDetails[y].updated,"submitted":$scope.insertDetails[y].submitted,"author":$scope.insertDetails[y].author,"place":$scope.insertDetails[y].place, "imgDetails":$scope.insertDetails[y].imgDetails[$scope.insertDetails[y].id], "notes":$scope.insertDetails[y].notes, "UGroupID":$scope.insertDetails[y].UGroupID});
        console.log($scope.singleObsDetails);
        if($scope.singleObsDetails[0]["notes"].length>0){
          $scope.visible=false;
        }else{
          $scope.visible=true;
        }
        $scope.singleImgDetails.push({"image":$scope.insertDetails[y].imgDetails[$scope.insertDetails[y].id]});
        break;
      }
    }
   

}

appne.controller('EditObservationCtrl', function($scope,$state,$http,$cordovaCamera,LocationService,$ionicPopup,$cordovaDevice, $cordovaFile, $ionicPlatform,  $ionicActionSheet, $filter, $cordovaFileTransfer, ApiEndpoint, UserGroupService, NewObservationService, $cordovaSQLite, $cordovaToast, $cordovaGeolocation, $timeout) {
  $scope.submitObsVal = false;
  //alert("came")
    $scope.submitObsParams = {};
    $scope.submitDbParams = {};
    $scope.imgURI =[];
    $scope.userGroupId = [];
  var obsDetails = NewObservationService.GetEditObsDetails();
  console.log(obsDetails);
  var z=0;
  var date = new Date(obsDetails.fromDate);
  console.log(date);
    $scope.submitDbParams['group_id']   =  obsDetails.group['id'] ;
       $("#categoryName").text(obsDetails.group['name']);
 $scope.newobs ={
      sciName    :'',
      commonName :'',
      notes : '',
      recoId:'',
      boxVal : false
    };
    
      $scope.newobs.date = date;

    var address = LocationService.GetUserSelectedLocAdd();
    //alert(address);
    if(address != ''){
      $scope.newobs['location'] = address;
    }else{
    $scope.newobs['location'] = obsDetails.reverseGeocodedName;
  }
  var oComonName, oSciNm;
      $scope.imageLicense = [{"id":"CC PUBLIC-DOMAIN","imageName":"publicDomain.png"},{"id":"CC BY","imageName":"cc-by.png"},{"id":"CC BY-SA","imageName":"by_sa.png"},{"id":"CC BY-NC","imageName":"by_nc.png"},{"id":"CC BY-NC-SA","imageName":"by_nc_sa.png"},{"id":"CC BY-NC-ND","imageName":"by_nc_nd.png"},{"id":"CC BY-ND","imageName":"by_nd.png"}];

var imgNameString;
    // $("#Locationval").text(obsDetails.reverseGeocodedName);
      for(var i=0; i<obsDetails['resource'].length; i++){
        $("#imgContent").show();
        z++;
        //alert($("#imgContent").html());
        for(var lic=0;lic<$scope.imageLicense.length;lic++){

          if(obsDetails['resource'][i]['license']['name'] == $scope.imageLicense[lic]['id']){
            imgNameString = $scope.imageLicense[lic]['imageName'];
            break;
          }
        }
        $scope.imgURI.push({"id":z,"path":obsDetails['resource'][i].url,"license":obsDetails['resource'][i]['license']['name'],"licImgg":imgNameString});
        
       

      }

     if(Object.keys(obsDetails.maxVotedReco).length >0){

        if(obsDetails.maxVotedReco.hasOwnProperty('commonNamesRecoList')){
              $scope.newobs.commonName = obsDetails.maxVotedReco.commonNamesRecoList[0]["name"];
              oComonName = obsDetails.maxVotedReco.commonNamesRecoList[0]["name"];
          }

        if(obsDetails.maxVotedReco.hasOwnProperty('sciNameReco')){
                $scope.newobs.sciName = obsDetails.maxVotedReco.sciNameReco.name;
                oSciNm = obsDetails.maxVotedReco.sciNameReco.name;

          } 
      
    }

    if(obsDetails.hasOwnProperty('notes')){
      $scope.newobs.notes = obsDetails.notes;
    }
    $(function () {
      $('#check').change(function () {
          $(".check1").toggle(this.checked);
      });
  });
    $('#uGroupText').text(obsDetails['userGroups'].length);
    if(obsDetails['userGroups'].length > 0){
      for (var z = 0; z < obsDetails['userGroups'].length; z++) {
          $scope.userGroupId.push(obsDetails['userGroups'][z].id);
      }
    }
$scope.speciesGroups = [{"id":8,"name":"Mammals"},{"id":6,"name":"Birds"},{"id":11,"name":"Fish"},{"id":5,"name":"Amphibians"},{"id":9,"name":"Reptiles"},{"id":10,"name":"Molluscs"},{"id":7,"name":"Arthropods"},{"id":4,"name":"Plants"},{"id":3,"name":"Fungi"},{"id":2,"name":"Others"}];
    $scope.categorySelect = function(){
        $scope.listPopup = $ionicPopup.show({
             template: '<ion-list class="item-icon-right">                                '+
                       '  <ion-item class="item " id="uGroup{{usrgrps.id}}" ng-repeat="usrgrps in speciesGroups " ng-click="selectCategory({{usrgrps.id}},usrgrps.name);" > '+
                       '    {{usrgrps.name}}                             '+
                       '  </ion-item>                             '+
                       '</ion-list>                               ',
             title: 'Select Groups',
             scope: $scope,
             buttons: [
               { text: 'Cancel' },
             ]
           });  
       
       }

       $scope.selectCategory = function(id, name){
       // alert(id+" "+name);
        $scope.listPopup.close();
       $scope.submitDbParams['group_id']   =  id ;
       //$("#categoryName").text(name);
       $scope.nameCategory = name;
       }

     $(function () {
      $('#dateSight').change(function () {
          //alert($scope.newobs.date);
        $scope.date = $filter('date')( $scope.newobs.date );
        console.log($scope.date);
        var currentDate = getDatetime();
        //console.log(currentDate);
        if(Date.parse($scope.date) > Date.parse(currentDate)){
           showDailog("Please slect a valid date");
           $scope.newobs.date = date;
           return;
        }else {
          $scope.newobs.date = $filter('date')( $scope.newobs.date,"dd/MM/yyyy" );
        }
        console.log($scope.newobs.date)
      });
  });

     


  function getDatetime() {
    var currentDate = $filter('date')(new Date);
    //console.log($filter('date')(new Date));
    return currentDate;
  };

  $scope.modelToItemMethod = function (modelValue) {

      return {view:modelValue};
  }
    
    $scope.modelToItem = function(modelValue){
     return {view:modelValue};
    }
     $scope.getTestItems = function (query) {
                      //alert(query);
                       var itemArray = [];
                      itemArray.push({view: query,"acceptedName":'',recoId:0,showField:query})
                        if (query) {
                      $http.get(ApiEndpoint.url+'/recommendation/suggest?term='+query+'&nameFilter=scientificNames').success(function(suggestData){
                            console.log(suggestData);
                            
                             for(var i=0; i<suggestData['model']['instanceList'].length;i++){

                              if(suggestData['model']['instanceList'][i]['acceptedName'] != null){
                                itemArray.push({view: htmlToPlaintext(suggestData['model']['instanceList'][i]['label']),acceptedName:suggestData['model']['instanceList'][i]['acceptedName'],"recoId":suggestData['model']['instanceList'][i]['recoId'],"showField":htmlToPlaintext(suggestData['model']['instanceList'][i]['label'])+"<br>["+suggestData['model']['instanceList'][i]['acceptedName']+"]"});
                               }else{
                                itemArray.push({view: htmlToPlaintext(suggestData['model']['instanceList'][i]['label']),acceptedName:suggestData['model']['instanceList'][i]['acceptedName'],"recoId":suggestData['model']['instanceList'][i]['recoId'],"showField":htmlToPlaintext(suggestData['model']['instanceList'][i]['label'])});
                              }                                }
                             
                          })
                           return {
                                items:  itemArray
                            };
                            
                        }
                      
                     return {items :[]};
                      
                    };
                     $scope.itemsClicked = function (callback) {
                     
                      //alert(JSON.stringify(callback.selectedItems[0].view));
                        $scope.newobs.sciName = callback.selectedItems[0].view;
                        if(callback.selectedItems[0].recoId != 0){
                            $scope.newobs.recoId = callback.selectedItems[0].recoId;
                          }else{
                            $scope.newobs.recoId = '';
                          }

                      
                    };
                    $scope.itemsRemoved = function (callback) {
                      //alert(JSON.stringify(callback))
                        $scope.newobs.sciName = '';
                        $scope.newobs.recoId = '';
                    };

                $scope.getSuggestName = function (query) {
                //alert(query);
                 var itemArray = [];
                      itemArray.push({view: query,"acceptedName":'',showField:query})
                  if (query) {
                          $http.get(ApiEndpoint.url+'/recommendation/suggest?term='+query+'&nameFilter=commonNames').success(function(suggestData){
                      console.log(suggestData);
                      
                       for(var i=0; i<suggestData['model']['instanceList'].length;i++){

                            if(suggestData['model']['instanceList'][i]['acceptedName'] != null){
                                itemArray.push({view: htmlToPlaintext(suggestData['model']['instanceList'][i]['label']),acceptedName:suggestData['model']['instanceList'][i]['acceptedName'],"recoId":suggestData['model']['instanceList'][i]['recoId'],"showField":htmlToPlaintext(suggestData['model']['instanceList'][i]['label'])+"<br>["+suggestData['model']['instanceList'][i]['acceptedName']+"]"});
                               }else{
                                itemArray.push({view: htmlToPlaintext(suggestData['model']['instanceList'][i]['label']),acceptedName:suggestData['model']['instanceList'][i]['acceptedName'],"recoId":suggestData['model']['instanceList'][i]['recoId'],"showField":htmlToPlaintext(suggestData['model']['instanceList'][i]['label'])});
                              }                     
                        }
                       
                    })
                     return {
                          items:  itemArray
                      };
                      
                  }
                
               return {items :[]};
                
              };

               $scope.nameClicked = function (callback) {
               
                //alert(JSON.stringify(callback));
                  $scope.newobs.commonName = callback.selectedItems[0].view;
                  if(callback.selectedItems[0].acceptedName!=''){
                    $scope.newobs.sciName = callback.selectedItems[0].acceptedName;
                    $("#sugestName").text(callback.selectedItems[0].acceptedName);
                  }
                  if(callback.selectedItems[0].recoId != 0){
                    $scope.newobs.recoId = callback.selectedItems[0].recoId;
                  }
                 //console.log($scope.newobs.sciName);
              };
              $scope.nameRemoved = function (callback) {
               // alert(JSON.stringify(callback))
                  $scope.newobs.commonName = '';
              };

  

 

  $scope.addMedia = function() {

    if($scope.imgURI.length >= 10){
      showDailog("Maximum Images reached");
      return;
    }
    $scope.hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Take photo' },
        { text: 'Photo from library' }
      ],
      titleText: 'Add images',
      cancelText: 'Cancel',
      buttonClicked: function(index) {
        $scope.addImage(index);
      }
    });
  }
 
  $scope.addImage = function(type) {
    
    $scope.hideSheet();
    //ImageService.handleMediaDialog(type).then(function() {
     // $scope.$apply();
    //});
    

  switch (type) {
      case 0:
        openCamera();

        break;
      case 1:
        openAlbum();
        break;
    }
}

  function openCamera(){



var options = {
    destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true
  };

  console.log(options);
  $cordovaCamera.getPicture(options).then(function(imageUrl) {
      
                     $("#imgContent").show();

      onImageSuccess(imageUrl);
      }, function(err) {
                // An error occured. Show a message to the user
          });
}

function openAlbum(){
      $scope.imagesSelected = 0;

      window.imagePicker.getPictures(
          function(results) {
                $("#imgContent").show();
                $scope.imagesSelected = results.length;
              $cordovaToast.show("Processing,Please wait", "short", "bottom").then(function(success) {
                    console.log("The toast was shown");
                });
              for (var i = 0; i < results.length; i++) {
                                
                 onImageSuccess(results[i]);
              }
          }, function (error) {
              console.log('Error: ' + error);
          },{
                maximumImagesCount: 5
            }

      );

     }

     
 
       function onImageSuccess(fileURI) {
          createFileEntry(fileURI);
       }
       
       function createFileEntry(fileURI) {
          window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
       }
       
       // 5
       function copyFile(fileEntry) {
         var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
         var newName = makeid() + name;
         
         window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
         fileEntry.copyTo(fileSystem2,newName,onCopySuccess,fail);
         },
         fail);
       }
       
       // 6
       function onCopySuccess(entry) {
               z++;

              if($scope.imgURI.length >= 10){
                  showToast($cordovaToast,"Maximum Images reached");
                  return;
                }else{

         $scope.$apply(function () {
          //alert(urlForImage(entry.nativeURL));
         $scope.imgURI.push({"id":z,"path":urlForImage(entry.nativeURL),"license":"CC BY","licImgg":"cc-by.png"});
         });
        }
       }
       
       function fail(error) {
          console.log("fail: " + error.code);
       }
       
       function makeid() {
         var text = "";
         var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
         
         for (var i=0; i < 5; i++) {
           text += possible.charAt(Math.floor(Math.random() * possible.length));
         }
         return text;
       }

      

    

      function urlForImage(imageName) {
        //alert($scope.imgURI.length);
        console.log(imageName);
        //alert("y r u cmg here");
        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
        var trueOrigin = cordova.file.dataDirectory + name;
        console.log(cordova.file.dataDirectory);
        return trueOrigin;
      }

   
         


    $scope.removeImage = function(id){
    //alert($scope.imgURI.length);
      for(var i=0; i<$scope.imgURI.length;i++){
        if($scope.imgURI[i]['id']==id){
          $scope.imgURI.splice(i,1);
          break;
        }
      }
      console.log($scope.imgURI);
      $('#imgContent #'+id).hide();

    //alert(id);
    }

    $scope.showLicense = function(imageNumber){
      $scope.imageVal = imageNumber;
      $scope.licensePopup = $ionicPopup.show({
             template: '  <img ng-repeat="img in imageLicense" style=" padding: 5px 5px 5px 5px;" ng-src="img/{{img.imageName}}" ng-click="selectedLicense(img.id, img.imageName);" > '+
                       '  </img>   ',
             title: 'Choose License',
             scope: $scope,
             buttons: [
               { text: 'cancel' },
             ]
           }); 
    }
    $scope.selectedLicense = function(licenseId, imgName){
      $scope.licensePopup.close();
      //$(".img-wrap #license"+$scope.imageVal).css("background", "url(img/"+imgName+") no-repeat");
      //$scope.submitDbParams["license_"+$scope.imageVal] = licenseId;
      for(var i=0; i<$scope.imgURI.length;i++){
        if($scope.imgURI[i]['id']==$scope.imageVal){
          $scope.imgURI[i]['license'] = licenseId;
          $scope.imgURI[i]['licImgg'] = imgName;
          break;
        }
      }

    }

    $scope.gps = function(){
 

      $scope.gpsPopup = $ionicPopup.show({
            template: '<ion-list class="item-icon-right">                                '+
                      '  <ion-item class="item "  ng-click="currentGPS();" > '+
                      '    Get Current Location                             '+
                      '  </ion-item>                             '+
                      '  <ion-item class="item "  ng-click="editGPS();" > '+
                      '   Edit Location                             '+
                      '  </ion-item>                             '+
                      '</ion-list>                               ',
            title: 'Choose Option',
            scope: $scope,
            buttons: [
              { text: 'cancel' },
            ]
          }); 
     /**/
    }
    $scope.currentGPS = function(){
     $scope.gpsPopup.close();
     onGPS($cordovaGeolocation,LocationService,$ionicPopup);
     //$("#Locationval").text("Please Wait ...");
     $scope.newobs.location = "Please Wait ...";
     $timeout(function() {
       var data = LocationService.getCurrentLocation();
       var check =Icheck();
       if(check ==true){
       //.then(function(data){
       //alert(JSON.stringify(data));
         var code="https://maps.googleapis.com/maps/api/geocode/json?latlng="+data.latitude+","+data.longitude;
         var loc = {'H':data.latitude , 'L':data.longitude};
               LocationService.SetUserSelectedLocation(loc);
         $http.get(code).success(function(dataval){
               //console.log(dataval);
               //$("#Locationval").text(dataval.results[0]["formatted_address"]);
               $scope.newobs.location = dataval.results[0]["formatted_address"];

             });
       }else {
         //$("#Locationval").text("Lattitude:"+data.latitude+"longitude"+data.longitude);
         $scope.newobs.location = "Lattitude:"+data.latitude+" longitude"+data.longitude;
         var loc = {'H':data.latitude , 'L':data.longitude};
          LocationService.SetUserSelectedLocation(loc);
       }
     }, 5000);
     
    }
    $scope.editGPS = function(){
    $scope.gpsPopup.close();
     //var inter = internetCheck($ionicPopup);
     var inter = Icheck();
       if(inter == false){
        showToast($cordovaToast,"No Internet");
         return;
       }else {
         $('ion-nav-bar').addClass('hide');
         $state.go("app.location");
       }
    }

    function showDailog(message){

      $ionicPopup.alert({
          title: 'ERROR',
          content: message//'You must submit atleast one image'
        });
    }



$scope.select = [];
    $scope.userGroup = function(){
      //alert("hhh");
      $scope.usrGrp =[]

      var groups = UserGroupService.GetUserJoinGroups()
      console.log(groups);
      var instanceList = groups['data']['model']['observations'];
      if(instanceList.length>0){
        for(var i=0; i<instanceList.length; i++){
          $scope.usrGrp.push({"id":instanceList[i].id,"name":instanceList[i].title})
        }
        console.log($scope.usrGrp);
         $scope.listPopup = $ionicPopup.show({
         template: '<ion-list class="item-icon-right">                                '+
                   '  <ion-item class="item " id="uGroup{{usrgrps.id}}" ng-repeat="usrgrps in usrGrp " ng-click="uploadTo({{usrgrps.id}});" > '+
                   '    {{usrgrps.name}}                             '+
                   '<i ng-if="userGroupId.indexOf(usrgrps.id) > -1" class="icon ion-checkmark-round" style="font-size: 18px;right: -7px;"></i>'+
                   '  </ion-item>                             '+
                   '</ion-list>                               ',
         
         title: 'Choose Option',
         scope: $scope,
         buttons: [
           { text: 'Ok' },
         ]
       });   

      } else {
       var lispop = $ionicPopup.alert({
                title: 'Success',
                content: 'Join atleast one user groups'
              });
            
      }
      
    }

    
    
    $scope.uploadTo = function(id){
      var addToArray = true;
      $scope.listPopup.close();

      //$('#uGroup'+id).addClass("addActive");

      for(var i=0;i<$scope.userGroupId.length;i++){
        if($scope.userGroupId[i] == id){
          var index = $scope.userGroupId.indexOf(id);
          if (index > -1) {
              $scope.userGroupId.splice(index, 1);
          }
          addToArray = false;
          
        }
      }
      if(addToArray){
        $scope.userGroupId.push(id);
       $scope.vedio = true;
      }

       $('#uGroupText').text($scope.userGroupId.length);
      console.log($scope.userGroupId);
    }




   $scope.submitNewObs = function(){
    //console.log(document.getElementById("check").checked);
    console.log("newobs");
    console.log($scope.newobs);
    console.log($scope.newobs.boxVal);
    //var date = $filter('date')( $scope.newobs.date );
    console.log($('#Locationval').text());
    console.log(typeof($('#Locationval').text()));
    validation();
  }

    function validation(){
      var check =Icheck();
      //if($scope.newobs)

      if($scope.imgURI.length == 0){
        showDailog("You must submit atleast one image");
        return;
      }
      if($scope.newobs.date == null){
        showDailog("You must enter date");
        return;
      }
      if($scope.newobs.boxVal == false){
        //console.log($scope.newobs['sciName'].length());
        if($scope.newobs['sciName'].length==0 && $scope.newobs['commonName'].length==0){
          showDailog("Please enter all fields");
          return;
        }
      } else {
        $scope.newobs['sciName'] = "";
        $scope.newobs['commonName'] = "";
        delete $scope.newobs['recoId'];
      }
      //console.log($('#Locationval').text());
      $scope.locationAddress = $scope.newobs['location'];
      if($scope.locationAddress == 'Location' || $scope.locationAddress == 'Searching' || $scope.locationAddress == 'Please Wait ...'){
        showDailog("Please Select location by clicking on GPS button");
        return;
      /*if($scope.locationAddress == 'Location'){
        //alert($scope.locationAddress);
        var confirmPopup = $ionicPopup.confirm({
           title: 'Location',
           template: 'you didnt entered Location. Default location will be taken'
         });
         confirmPopup.then(function(res) {
           if(res) {
            $scope.locationAddress = "Lally Tollendal Street, White Town, Puducherry, Puducherry 605002, India"; 
            //$('#Locationval').text($scope.locationAddress);
            $scope.newobs['location'] = $scope.locationAddress;
            var loc = {'H':11.93707847595214 , 'L':79.83552551269528}
            LocationService.SetUserSelectedLocation(loc);
            if(check == false) {
              //alert("store"+check);
              storeinDb();
            }else {
               //alert("exec"+check);
              executeRequest();
             }
           } else {
             console.log('You are not sure');
             return;
           }
         });*/
      }else {
        storeinDb();
        /*if(check == false) {
          storeinDb();
        }else {
          executeRequest();
         }*/
      }
      
      
    }
    function storeinDb(){
           //console.log($state);
                 var check1 =Icheck();


          $scope.imgName = [];
          //alert("storedb");
          if(check1==false){
            showToast($cordovaToast,"Your observation will be submitted when you are next online.");
          }else {
            showToast($cordovaToast,"Your observation will be submitted shortly");

          }
          console.log("storedb");
          console.log(db);
            //console.log("SUBMIT USER"+uLatLong.latitude+" SUBMI "+uLatLong.longitude)
            $scope.submitDbParams['observationId'] = obsDetails.id;
            $scope.submitDbParams['habitat_id'] = 1;//267838;//;
            $scope.submitDbParams['fromDate']   = $scope.newobs.date;
            $scope.submitDbParams['placeName']  = $scope.locationAddress;
            //$scope.submitDbParams['areas']      =  "POINT("+uLatLong.longitude+" "+uLatLong.latitude+")"
             if(address != ''){
                      var uLatLong = LocationService.GetUserSelectedLocation();

                $scope.submitDbParams['areas']  = "POINT("+uLatLong.longitude+" "+uLatLong.latitude+")"
             }else{
                $scope.submitDbParams['areas'] = obsDetails.topology;
            }
            $scope.submitDbParams['notes']      = $scope.newobs.notes;
           
            $scope.submitDbParams['imagePath']  = $scope.imgURI;
            //console.log(JSON.stringify($scope.submitDbParams));;
            if($scope.newobs['sciName'].length>0){
              $scope.submitDbParams['recoName'] = $scope.newobs['sciName'];
            } else {
              $scope.submitDbParams['recoName'] = "Unknown";
            }
            if($scope.newobs['commonName'].length>0){
              $scope.submitDbParams['commonName'] = $scope.newobs['commonName'];
            } else {
              $scope.submitDbParams['commonName'] = "";
            }
            if($scope.newobs['recoId'] == ''){
              delete $scope.newobs['recoId'];
            }else{
              $scope.submitDbParams['recoId'] = $scope.newobs['recoId']
            }
            $scope.submitDbParams['resourceListType'] = "ofObv" ;
            $scope.submitDbParams['agreeTerms'] = "on";
            if($scope.userGroupId !=null && $scope.userGroupId.length>0) {
              $scope.submitDbParams['userGroupsList'] = $scope.userGroupId
            }
            //alert("came");
            console.log(JSON.stringify($scope.submitDbParams));
            var query = "INSERT INTO observation (status,obslist) VALUES (?,?)";
            $cordovaSQLite.execute(db, query, ["PENDING",JSON.stringify($scope.submitDbParams)]).then(function(res) {
                console.log("INSERT ID -> " + res.insertId);
                      $state.go("app.home");


                //alert("transacted");
            }, function (err) {
              //alert(err);
                console.error(err);
            });
        }

    $scope.deleteObs = function(){

      var confirmPopup = $ionicPopup.confirm({
           title: 'Delete Observation',
           template: 'This Observation will be deleted. Are you sure ? '
         });
         confirmPopup.then(function(result) {
           if(result) {
      NewObservationService.DeleteObservation(obsDetails.id).then(function(obsResponse){
              
              //alert("success" + obsResponse.data.success);
              if(obsResponse.data.success == false){

               showToast($cordovaToast,"Unknown error, Observation couldnot be deleted");
              }else{
                showToast($cordovaToast,"Observation deleted");
                $state.go("app.home");
                
              }
              console.log(obsResponse);
            },
            function(err){
             showDailog("Unknown Error occurred");
            });
      } else {
        return;
      }
    });
    } 




  });

function htmlToPlaintext(text) {
  return text ? String(text).replace(/<[^>]+>/gm, '') : '';
}

appne.controller('NewObservationCtrl', function($scope,$window,$route,$state,$location,$http,$cordovaCamera,LocationService,$ionicPopup,$cordovaDevice, $cordovaFile, $ionicPlatform,  $ionicActionSheet, $filter, $cordovaFileTransfer, ApiEndpoint, UserGroupService, NewObservationService, $cordovaSQLite, $cordovaToast, $cordovaGeolocation, $timeout, $interval) {
   //alert('new');
   UserGroupService.GetJoinedGroups().then(function(groups){

    console.log(groups['data']['model']);
    UserGroupService.SetUserJoinGroups(groups);
  });
    var tokenVal = localStorage.getItem('USER_KEY');
      var tokenVar = JSON.parse(tokenVal);
      var countVal = tokenVar.nId;
      //alert(countVal);
      var countVal1 =0;
      var noLocation = false;
      
    setTimeout(function(){
      if($('ion-nav-bar').hasClass('hide')){
        //alert('came');
        $('ion-nav-bar').removeClass('hide');
        //$('ion-view').css('padding-top','44px');
        //$('ion-content').css('margin-top','43px');
      }
    },100);
    
    $scope.submitObsVal = true;
    $scope.newobs ={
      sciName    :'',
      commonName :'',
      notes : '',
      recoId :'',
      boxVal : false
    };
    $scope.submitObsParams = {};
    $scope.submitDbParams = {};
    $scope.imgURI =[];
    $scope.newobs.date = new Date();
    /*$(function () {
      $(document).on('change', '#check', function() {
        //alert($scope.newobs.boxVal);
        $(".check1").toggle(this.checked);
      
      });
  });*/
    $scope.imageLicense = [{"id":"CC PUBLIC-DOMAIN","imageName":"publicDomain.png"},{"id":"CC BY","imageName":"cc-by.png"},{"id":"CC BY-SA","imageName":"by_sa.png"},{"id":"CC BY-NC","imageName":"by_nc.png"},{"id":"CC BY-NC-SA","imageName":"by_nc_sa.png"},{"id":"CC BY-NC-ND","imageName":"by_nc_nd.png"},{"id":"CC BY-ND","imageName":"by_nd.png"}];


     $(function () {
      $(document).on('change', '#dateSight', function() {
      //$('#dateSight').change(function () {
          //alert($scope.newobs.date);
        $scope.date = $filter('date')( $scope.newobs.date );
        console.log($scope.date);
        var currentDate = getDatetime();
        //console.log(currentDate);
        if(Date.parse($scope.date) > Date.parse(currentDate)){
          $scope.newobs.date = "";
           showDailog("Please slect a valid date");
           return;
        }else {
          $scope.newobs.date = $filter('date')( $scope.newobs.date,"dd/MM/yyyy" );
        }
        console.log($scope.newobs.date)
      });
  });

     


  function getDatetime() {
    var currentDate = $filter('date')(new Date);
    //console.log($filter('date')(new Date));
    return currentDate;
  };

$scope.speciesGroups = [{"id":8,"name":"Mammals"},{"id":6,"name":"Birds"},{"id":11,"name":"Fish"},{"id":5,"name":"Amphibians"},{"id":9,"name":"Reptiles"},{"id":10,"name":"Molluscs"},{"id":7,"name":"Arthropods"},{"id":4,"name":"Plants"},{"id":3,"name":"Fungi"},{"id":2,"name":"Others"}];
    $scope.categorySelect = function(){
        $scope.listPopup = $ionicPopup.show({
             template: '<ion-list class="item-icon-right">                                '+
                       '  <ion-item class="item " id="uGroup{{usrgrps.id}}" ng-repeat="usrgrps in speciesGroups " ng-click="selectCategory({{usrgrps.id}},usrgrps.name);" > '+
                       '    {{usrgrps.name}}                             '+
                       '  </ion-item>                             '+
                       '</ion-list>                               ',
             title: 'Select Groups',
             scope: $scope,
             buttons: [
               { text: 'Cancel' },
             ]
           });  
       
       }

        $scope.selectCategory = function(id, name){
          $scope.listPopup.close();
        //alert(id+" "+name);
         $scope.submitDbParams['group_id']   =  id ;
         $("#categoryName").text(name);
       }

   $scope.getTestItems = function (query) {
                      //alert(query);
                       var itemArray = [];
                      itemArray.push({view: query,"acceptedName":'',recoId:0,showField:query})
                        if (query) {
                      $http.get(ApiEndpoint.url+'/recommendation/suggest?term='+query+'&nameFilter=scientificNames').success(function(suggestData){
                            console.log(suggestData);
                            
                             for(var i=0; i<suggestData['model']['instanceList'].length;i++){

                              if(suggestData['model']['instanceList'][i]['acceptedName'] != null){
                                itemArray.push({view: htmlToPlaintext(suggestData['model']['instanceList'][i]['label']),acceptedName:suggestData['model']['instanceList'][i]['acceptedName'],"recoId":suggestData['model']['instanceList'][i]['recoId'],"showField":htmlToPlaintext(suggestData['model']['instanceList'][i]['label'])+"<br>["+suggestData['model']['instanceList'][i]['acceptedName']+"]"});
                               }else{
                                itemArray.push({view: htmlToPlaintext(suggestData['model']['instanceList'][i]['label']),acceptedName:suggestData['model']['instanceList'][i]['acceptedName'],"recoId":suggestData['model']['instanceList'][i]['recoId'],"showField":htmlToPlaintext(suggestData['model']['instanceList'][i]['label'])});
                              }                                }
                             
                          })
                           return {
                                items:  itemArray
                            };
                            
                        }
                      
                     return {items :[]};
                      
                    };
                     $scope.itemsClicked = function (callback) {
                     
                      //alert(JSON.stringify(callback.selectedItems[0].view));
                        $scope.newobs.sciName = callback.selectedItems[0].view;
                        if(callback.selectedItems[0].recoId != 0){
                            $scope.newobs.recoId = callback.selectedItems[0].recoId;
                          }else{
                            $scope.newobs.recoId = '';
                          }

                      
                    };
                    $scope.itemsRemoved = function (callback) {
                      //alert(JSON.stringify(callback))
                        $scope.newobs.sciName = '';
                        $scope.newobs.recoId = '';
                    };

              
               $scope.getSuggestName = function (query) {
                //alert(query);
                 var itemArray = [];
                      itemArray.push({view: query,"acceptedName":'',recoId:0,showField:query})
                  if (query) {
                          $http.get(ApiEndpoint.url+'/recommendation/suggest?term='+query+'&nameFilter=commonNames').success(function(suggestData){
                      console.log(suggestData);
                      
                       for(var i=0; i<suggestData['model']['instanceList'].length;i++){

                              if(suggestData['model']['instanceList'][i]['acceptedName'] != null){
                                itemArray.push({view: htmlToPlaintext(suggestData['model']['instanceList'][i]['label']),acceptedName:suggestData['model']['instanceList'][i]['acceptedName'],"recoId":suggestData['model']['instanceList'][i]['recoId'],"showField":htmlToPlaintext(suggestData['model']['instanceList'][i]['label'])+"<br>["+suggestData['model']['instanceList'][i]['acceptedName']+"]"});
                               }else{
                                itemArray.push({view: htmlToPlaintext(suggestData['model']['instanceList'][i]['label']),acceptedName:suggestData['model']['instanceList'][i]['acceptedName'],"recoId":suggestData['model']['instanceList'][i]['recoId'],"showField":htmlToPlaintext(suggestData['model']['instanceList'][i]['label'])});
                              }   
                        }
                       
                    })
                     return {
                          items:  itemArray
                      };
                      
                  }
                
               return {items :[]};
                
              };
               $scope.nameClicked = function (callback) {
               
                //alert(JSON.stringify(callback));
                  $scope.newobs.commonName = callback.selectedItems[0].view;
                  if(callback.selectedItems[0].acceptedName!=''){
                    $scope.newobs.sciName = callback.selectedItems[0].acceptedName;
                    $("#sugestName").text(callback.selectedItems[0].acceptedName);
                  }
                  if(callback.selectedItems[0].recoId != 0){
                    $scope.newobs.recoId = callback.selectedItems[0].recoId;
                  }
                 //console.log($scope.newobs.sciName);
              };
              $scope.nameRemoved = function (callback) {
               // alert(JSON.stringify(callback))
                  $scope.newobs.commonName = '';
              };

  $scope.submitNewObs = function(){
    //console.log(document.getElementById("check").checked);
    console.log("newobs");
    console.log($scope.newobs);
    console.log($scope.newobs.boxVal);
    $scope.newobs.date = $filter('date')( $scope.newobs.date,"dd/MM/yyyy" );
    //var date = $filter('date')( $scope.newobs.date );
    console.log($('#Locationval').text());
    console.log(typeof($('#Locationval').text()));
    validation();
  }

    function validation(){
      var check =Icheck();
      //if($scope.newobs)

      if(!$scope.submitDbParams['group_id']){
        showDailog("Please select category");
        return;
      }
      if($scope.imgURI.length == 0){
        showDailog("You must submit atleast one image");
        return;
      }
      if($scope.newobs.date == null){
        showDailog("You must enter date");
        return;
      }
      if($scope.newobs.boxVal == false){
        //console.log($scope.newobs['sciName'].length());
        if($scope.newobs['sciName'].length==0 && $scope.newobs['commonName'].length==0){
          showDailog("Please enter all fields");
          return;
        }
      } else {
        $scope.newobs['sciName'] = "";
        $scope.newobs['commonName'] = "";
        delete $scope.newobs['recoId']
      }
      console.log($('#Locationval').text());
      $scope.locationAddress = $('#Locationval').text();
      var uLatLong = LocationService.getCurrentLocation();
      if(uLatLong.longitude == "" || uLatLong.latitude == ""){
                //showDailog("Unable to get Location, Please edit your location");
         if($scope.locationAddress == 'Searching'){
         var confirmPopup = $ionicPopup.confirm({
           title: 'Location',
           template: 'Unable to get Location, this will be in queue until you enter location.Do u wish to proceed?'
         });
         confirmPopup.then(function(res) {
           if(res) {
             noLocation = true;
             storeinDb();
           }else{
             noLocation = false;
           }
         });
       }else {
          storeinDb();
        }
               
                //return;
      }else if($scope.locationAddress == 'Location' || $scope.locationAddress == 'Searching'){
        showDailog("Please Select location by clicking on GPS button");
        return;
        /*var confirmPopup = $ionicPopup.confirm({
           title: 'Location',
           template: 'you didnt entered Location. Default location will be taken'
         });
         confirmPopup.then(function(res) {
           if(res) {
            $scope.locationAddress = "Lally Tollendal Street, White Town, Puducherry, Puducherry 605002, India"; 
            $('#Locationval').text($scope.locationAddress);
            var loc = {'H':11.93707847595214 , 'L':79.83552551269528}
            LocationService.SetUserSelectedLocation(loc);
            if(check == false) {
              //alert("store"+check);
              storeinDb();
            }else {
               //alert("exec"+check);
              executeRequest();
             }
           } else {
             console.log('You are not sure');
             return;
           }
         });*/
      }else {
        storeinDb();
        /*if(check == false) {
          storeinDb();
        }else {
          executeRequest();
         }*/
      }
      
      
    }

  function storeinDb(){
       //console.log($state);
     
       var check1 =Icheck();
      $scope.imgName = [];
      //alert("storedb");
      if(check1 == false){
        showToast($cordovaToast,"Your observation will be submitted when you are next online");
      } else{
        showToast($cordovaToast,"Your observation will be submitted shortly");
      }
      console.log("storedb");
      console.log(db);
        var uLatLong = LocationService.GetUserSelectedLocation();
        console.log("SUBMIT USER"+uLatLong.latitude+" SUBMI "+uLatLong.longitude)
        $scope.submitDbParams['habitat_id'] = 1;//267838;
        $scope.submitDbParams['fromDate']   = $scope.newobs.date;
        $scope.submitDbParams['placeName']  = $scope.locationAddress;
        $scope.submitDbParams['areas']      =  "POINT("+uLatLong.longitude+" "+uLatLong.latitude+")"
        $scope.submitDbParams['notes']      = $scope.newobs.notes;
       $scope.submitDbParams['protocol']   = "MOBILE";
        $scope.submitDbParams['imagePath']  = $scope.imgURI;
        //console.log(JSON.stringify($scope.submitDbParams));;
        if($scope.newobs['sciName'].length>0){
          $scope.submitDbParams['recoName'] = $scope.newobs['sciName'];
        } else {
          $scope.submitDbParams['recoName'] = "Unknown";
        }
        if($scope.newobs['commonName'].length>0){
          $scope.submitDbParams['commonName'] = $scope.newobs['commonName'];
        } else {
          $scope.submitDbParams['commonName'] = "";
        }
        if($scope.newobs['recoId'] == ''){
          delete $scope.newobs['recoId'];
        }else{
          $scope.submitDbParams['recoId'] = $scope.newobs['recoId']
        }
        $scope.userGroupId = $scope.userGroupId.toString();
        $scope.submitDbParams['resourceListType'] = "ofObv" ;
        $scope.submitDbParams['agreeTerms'] = "on";
        if($scope.userGroupId !=null && $scope.userGroupId.length>0) {
          $scope.submitDbParams['userGroupsList'] = $scope.userGroupId
        }
        //alert("came");
        console.log(JSON.stringify($scope.submitDbParams));
        var query = "INSERT INTO observation (status,obslist) VALUES (?,?)";
        if(noLocation == false){
          $cordovaSQLite.execute(db, query, ["PENDING",JSON.stringify($scope.submitDbParams)]).then(function(res) {
              console.log("INSERT ID -> " + res.insertId);
               $state.go("app.observationStatus");
              //alert("transacted");
          }, function (err) {
            //alert(err);
              console.error(err);
          });
        }else {
          $cordovaSQLite.execute(db, query, ["No Location",JSON.stringify($scope.submitDbParams)]).then(function(res) {

              console.log("INSERT ID -> " + res.insertId);
               $state.go("app.observationStatus");
              //alert("transacted");
          }, function (err) {
            //alert(err);
              console.error(err);
          });
        }
    }
    
    function showDailog(message){

      $ionicPopup.alert({
          title: 'ERROR',
          content: message//'You must submit atleast one image'
        });
    }


    $scope.userGroup = function(){
      var check =Icheck();
      //alert("hhh");
      var groups;
      var instanceList;
      $scope.usrGrp =[]
      if(check == true){
         groups = UserGroupService.GetUserJoinGroups()
        console.log(groups);
         instanceList = groups['data']['model']['observations'];
      } else {
        var getGroup =  localStorage.getItem('UserGroupArray');
        var groups = JSON.parse(getGroup);
        //alert(groups +" "+ getGroup);
         //groups = UserGroupService.GetUserJoinGroups()
        console.log(groups);
         instanceList = groups['data']['model']['observations'];
      }
      if(instanceList.length>0){
        for(var i=0; i<instanceList.length; i++){
          $scope.usrGrp.push({"id":instanceList[i].id,"name":instanceList[i].title})
        }
        console.log($scope.usrGrp);
         $scope.listPopup = $ionicPopup.show({
         template: '<ion-list class="item-icon-right">                                '+
                   '  <ion-item class="item " id="uGroup{{usrgrps.id}}" ng-repeat="usrgrps in usrGrp " ng-click="uploadTo({{usrgrps.id}});" > '+
                   '    {{usrgrps.name}}                             '+
                   '<i ng-if="userGroupId.indexOf(usrgrps.id) > -1" class="icon ion-checkmark-round" style="font-size: 18px;right: -7px;"></i>'+
                   '  </ion-item>                             '+
                   '</ion-list>                               ',
         title: 'Choose Option',
         scope: $scope,
         buttons: [
           { text: 'Ok' },
         ]
       });   

      } else {
       var lispop = $ionicPopup.alert({
                title: 'Success',
                content: 'Join atleast one user groups'
              });
            
      }
      
    }

    $scope.userGroupId =[];
    
    $scope.uploadTo = function(id){
      var addToArray = true;
      $scope.listPopup.close();

      //$('#uGroup'+id).addClass("addActive");

      for(var i=0;i<$scope.userGroupId.length;i++){
        if($scope.userGroupId[i] == id){
          var index = $scope.userGroupId.indexOf(id);
          if (index > -1) {
              $scope.userGroupId.splice(index, 1);
          }
          addToArray = false;
          
        }
      }
      if(addToArray){
        $scope.userGroupId.push(id);
      }
       $('#uGroupText').text($scope.userGroupId.length)
      console.log($scope.userGroupId);
    }

  $scope.addMedia = function() {

    if($scope.imgURI.length >= 10){
      showDailog("Maximum Images reached");
      return;
    }
    $scope.hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Take photo' },
        { text: 'Photo from library' }
      ],
      titleText: 'Add images',
      cancelText: 'Cancel',
      buttonClicked: function(index) {
        $scope.addImage(index);
      }
    });
  }
 var z=0;
  $scope.addImage = function(type) {
    
    $scope.hideSheet();
    //ImageService.handleMediaDialog(type).then(function() {
     // $scope.$apply();
    //});
    

  switch (type) {
      case 0:
        openCamera();

        break;
      case 1:
        openAlbum();
        break;
    }
}

  function openCamera(){



var options = {
    destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true
  };

  console.log(options);
  $cordovaCamera.getPicture(options).then(function(imageUrl) {
      
                     $("#imgContent").show();

      onImageSuccess(imageUrl);
      }, function(err) {
                // An error occured. Show a message to the user
          });
}

function openAlbum(){
      $scope.imagesSelected = 0;

      window.imagePicker.getPictures(
          function(results) {
                $("#imgContent").show();
                $scope.imagesSelected = results.length;
              $cordovaToast.show("Processing,Please wait", "short", "bottom").then(function(success) {
                    console.log("The toast was shown");
                });
              for (var i = 0; i < results.length; i++) {
                 onImageSuccess(results[i]);
              }
          }, function (error) {
              console.log('Error: ' + error);
          },{
                maximumImagesCount: 5
            }

      );

     }

     
 
       function onImageSuccess(fileURI) {
          createFileEntry(fileURI);
       }
       
       function createFileEntry(fileURI) {
          window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
       }
       
       // 5
       function copyFile(fileEntry) {
         var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
         var newName = makeid() + name;
         
         window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
         fileEntry.copyTo(fileSystem2,newName,onCopySuccess,fail);
         },
         fail);
       }
       
       // 6
       function onCopySuccess(entry) {
              z++;
              if($scope.imgURI.length >= 10){
                  showToast($cordovaToast,"Maximum Images reached");
                  return;
                }else{

         $scope.$apply(function () {
          //alert(urlForImage(entry.nativeURL));
                     //   alert($scope.imgURI.length);

         $scope.imgURI.push({"id":z,"path":urlForImage(entry.nativeURL),"license":"CC BY","licImgg":"cc-by.png"});
         });
        }
       }
       
       function fail(error) {
          console.log("fail: " + error.code);
       }
       
       function makeid() {
         var text = "";
         var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
         
         for (var i=0; i < 5; i++) {
           text += possible.charAt(Math.floor(Math.random() * possible.length));
         }
         return text;
       }

  function urlForImage(imageName) {
    //alert($scope.imgURI.length);
    console.log(imageName);
    //alert("y r u cmg here");
    var name = imageName.substr(imageName.lastIndexOf('/') + 1);
    var trueOrigin = cordova.file.dataDirectory + name;
    console.log(cordova.file.dataDirectory);
    return trueOrigin;
  }

/*var data = LocationService.getCurrentLocation()//.then(function(data){
    console.log(data);
      var code="https://maps.googleapis.com/maps/api/geocode/json?latlng="+data.latitude+","+data.longitude;
      var loc = {'G':data.latitude , 'K':data.longitude};
            LocationService.SetUserSelectedLocation(loc);
      $http.get(code).success(function(dataval){
            //console.log(dataval.results[0]);
            $("#Locationval").text(dataval.results[0]["formatted_address"]);

          });*/

$scope.removeImage = function(id){
//alert($scope.imgURI.length);
  for(var i=0; i<$scope.imgURI.length;i++){
    if($scope.imgURI[i]['id']==id){
      $scope.imgURI.splice(i,1);
      break;
    }
  }
  console.log($scope.imgURI);
  $('#imgContent #'+id).hide();

//alert(id);
}

$scope.showLicense = function(imageNumber){
  $scope.imageVal = imageNumber;
  $scope.licensePopup = $ionicPopup.show({
         template: '  <img ng-repeat="img in imageLicense" style=" padding: 5px 5px 5px 5px;" ng-src="img/{{img.imageName}}" ng-click="selectedLicense(img.id, img.imageName);" > '+
                   '  </img>   ',
         title: 'Choose License',
         scope: $scope,
         buttons: [
           { text: 'cancel' },
         ]
       }); 
}
$scope.selectedLicense = function(licenseId, imgName){
  $scope.licensePopup.close();
 // $(".img-wrap #license"+$scope.imageVal).css("background", "url(img/"+imgName+") no-repeat");
  //$scope.submitDbParams["license_"+$scope.imageVal] = licenseId;
  for(var i=0; i<$scope.imgURI.length;i++){
    if($scope.imgURI[i]['id']==$scope.imageVal){
      $scope.imgURI[i]['license'] = licenseId;
      $scope.imgURI[i]['licImgg'] = imgName;
      break;
    }
  }

}
$scope.gps = function(){
 

  $scope.gpsPopup = $ionicPopup.show({
        template: '<ion-list class="item-icon-right">                                '+
                  '  <ion-item class="item "  ng-click="currentGPS(2);" > '+
                  '    Get Current Location                             '+
                  '  </ion-item>                             '+
                  '  <ion-item class="item "  ng-click="editGPS();" > '+
                  '   Edit Location                             '+
                  '  </ion-item>                             '+
                  '</ion-list>                               ',
        title: 'Choose Option',
        scope: $scope,
        buttons: [
          { text: 'cancel' },
        ]
      }); 
 /**/
}
$scope.currentGPS = function(valuee){
 if(valuee == 2){
   $scope.gpsPopup.close();
 }
  // alert("cald");
cordova.plugins.diagnostic.isLocationEnabled(function(enabled){
  //alert(enabled);
    if(enabled == 1){
      $ionicPlatform.ready(function(){
      onGPS($cordovaGeolocation,LocationService,$ionicPopup);
      });
    } else {

      //var settingName = "location_source";
    
  var confirmPopup = $ionicPopup.alert({
          title: 'GPS',
          template: "Location not found.Please enable the Location Services for the app"
        });
         /*confirmPopup.then(function(result) {

                     cordova.plugins.settings.openSetting(settingName, success,failure);
          });*/

    }

}, function(error){
    alert("The following error occurred: "+error);
});
     $("#Locationval").text("Searching");


 $timeout(function() {
   var data1 = LocationService.getCurrentLocation();
   var check =Icheck();
   if(check ==true && data1.latitude != ''){
   //.then(function(data){
   //alert(JSON.stringify(data1));
     var code="https://maps.googleapis.com/maps/api/geocode/json?latlng="+data1.latitude+","+data1.longitude;
     var loc = {'H':data1.latitude , 'L':data1.longitude};
           LocationService.SetUserSelectedLocation(loc);
     $http.get(code).success(function(dataval){
           //console.log(dataval.results[0]);
           $("#Locationval").text(dataval.results[0]["formatted_address"]);
          LocationService.SetCurrentAdd(dataval.results[0]["formatted_address"])
           //$scope.newobs.location = dataval.results[0]["formatted_address"];

         });
   }else if(check ==false && data1.latitude != '') {
     $("#Locationval").text("Lattitude:"+data1.latitude+"longitude"+data1.longitude);
     var loc1 = {'H':data1.latitude , 'L':data1.longitude};
     LocationService.SetUserSelectedLocation(loc1);
   }
 }, 5000);
 
}
$scope.currentGPS(1);
$scope.editGPS = function(){
  $scope.gpsPopup.close();
   var inter = Icheck();
     if(inter == false){
      showToast($cordovaToast,"No Internet");
       return;
     }else {
       $('ion-nav-bar').addClass('hide');
       $state.go("app.gps");
     }
}

  $interval(function(){
        var check =Icheck();
        //alert($scope.newobs.location);
        //console.log($('#Locationval').text().substr(0,9));
            var data1 = LocationService.getCurrentLocation();
        if(data1.latitude == "" && data1.longitude == ""){
           var dataUser = LocationService.GetUserSelectedLocation();
        if(dataUser.latitude == "" && dataUser.longitude == ""){
          $scope.currentGPS(1);
        }
        }
        if($('#Locationval').text().substr(0,9) == "Lattitude" || $('#Locationval').text() == "Location" || $('#Locationval').text() == "Searching" && check == true){
             var data1 = LocationService.GetUserSelectedLocation();
             //($scope.newobs['location'].substr(0,9));
         var code="https://maps.googleapis.com/maps/api/geocode/json?latlng="+data1.latitude+","+data1.longitude;

             $http.get(code).success(function(dataval){
               //console.log(dataval.results[0]);
               $("#Locationval").text(dataval.results[0]["formatted_address"]);
               //$scope.newobs.location = dataval.results[0]["formatted_address"];

             });
        }
   }, 2000);

});




appne.controller('SettingsController', function($scope, $state, LocationService) {

  //alert("hi");
  var setStorage = localStorage.getItem('SETTINGS');
      var setValues = JSON.parse(setStorage);
      var wifiSettings = setValues.wifiSetting;
      //alert(token);
      var manualUploads = setValues.manualUpload;
      //alert(wifiSettings +", "+manualUploads);
  $scope.settingsList = [
    { text: "Upload over WIFI", subtext: "Use only WIFI to upload observations in queue", checked: wifiSettings },
    { text: "Upload Manually", subtext: "Prevents automated uploading of observations from the queue" , checked: manualUploads }
  ];
  
  $scope.setChange = function(){
    //alert($scope.settingsList[0].checked);
    //alert($scope.settingsList[1].checked);
    setValues.wifiSetting = $scope.settingsList[0].checked ;
    setValues.manualUpload = $scope.settingsList[1].checked ;
    localStorage.setItem('SETTINGS',JSON.stringify(setValues));
  }
  });

appne.controller('aboutController', function($scope,$location,$ionicSideMenuDelegate){
       var obsId = $location.path().split("/")[3];
       if(obsId == 2){
         $scope.showMenu = false;
         $ionicSideMenuDelegate.canDragContent(false);
       }else {
         $scope.showMenu = true;
       }

});

appne.controller('ViewOnMapController', function($scope, $state, BrowseService) {

  //alert("hi");
  var ListObsDetails=BrowseService.getObsList();
  /*alert(ListObsDetails[0]['topology']);

  var lat = ListObsDetails[0]['topology'].split("(")[1].split(" ")[0];
  var lng1 = ListObsDetails[0]['topology'].split("(")[1].split(" ")[1];
    var lng = lng1.split(")")[0];
    console.log(lat,lng);*/

var myOptions = {
      center: new google.maps.LatLng(75.13991099999998, 27.6094),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP

    };
    var map = new google.maps.Map(document.getElementById("map"), myOptions);

    var marker, i;
    //alert(ListObsDetails.length);
    for (var i = 0; i < ListObsDetails.length; i++){
      var lng = ListObsDetails[i]['topology'].split("(")[1].split(" ")[0];
      var lat1 = ListObsDetails[i]['topology'].split("(")[1].split(" ")[1];
      var lat = lat1.split(")")[0];
      latlngset = new google.maps.LatLng(lat, lng);
      //alert(latlngset);
      var marker = new google.maps.Marker({  
          map: map, position: latlngset  
        });
        map.setCenter(marker.getPosition())
    
    var CommonName, sciName;
      if(Object.keys(ListObsDetails[i].maxVotedReco).length >0){

        if(ListObsDetails[i].maxVotedReco.hasOwnProperty('commonNamesRecoList')){
              CommonName = ListObsDetails[i].maxVotedReco.commonNamesRecoList[0]["name"];
          }else {
            CommonName="";
          }

        if(ListObsDetails[i].maxVotedReco.hasOwnProperty('sciNameReco')){
                sciName = ListObsDetails[i].maxVotedReco.sciNameReco.name;

          } 
      
    }else{
      sciName="Unknown";
      CommonName="";
    }
    var iconUrl=ListObsDetails[i].thumbnail;
    var id=ListObsDetails[i].id;

    //$scope.item = {"id":id,"iconUrl":iconUrl, "scientificName":sciName, "CommonName":commonname}
    //console.log($scope.item);
      var content = '<ion-list class="item-icon-right"> <ion-item class="item-thumbnail-left"> <a style="margin-left: -105px;text-decoration: none;" href="#/app/browsedetails/'+id+'"><img height="50px" src="'+iconUrl+'" alt="'+sciName+' photo"><p style="margin-left: 58px;margin-top: -44px;font-size: 19px;color:black;">'+sciName+'</p><p style="margin-left: 55px;margin-top: -8px;font-size: smaller;color:#666;">'+CommonName+'</p><i class="icon ion-chevron-right " style="right:-8px;"></i></ion-item></ion-list>'//<div><h1 onclick=\"alert('clicked')\">hi</h1></div>"

     var infowindow = new google.maps.InfoWindow()

    google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
          return function() {
             infowindow.setContent(content);
             infowindow.open(map,marker);
          };
      })(marker,content,infowindow)); 

    }

});

appne.controller('GPSController', function($scope, $state,$http, $timeout, LocationService,$location,$cordovaSQLite) {

//alert($location.path());
var noTextChange = 0;
$scope.myScopeVar = LocationService.GetCurrentAdd();

setTimeout(function(){
      if($('button').hasClass('hide')){
        //alert('came');
        $('button').removeClass('hide');
        //$('ion-view').css('padding-top','44px');
        //$('ion-content').css('margin-top','43px');
      }else if($('ion-nav-bar').hasClass('hide')){
        //alert('came');
        $('ion-nav-bar').removeClass('hide');
        //$('ion-view').css('padding-top','44px');
        //$('ion-content').css('margin-top','43px');
      }
        //$('ion-view').css('padding-top','0');
        //$('ion-content').css('margin-top','-1px');
      
    },100);
var data1 = LocationService.getCurrentLocation();
 var myLatlng = new google.maps.LatLng(data1.latitude, data1.longitude);
 //var myLatlng = new google.maps.LatLng(11.9384867, 79.8352657);
 
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
 
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        //alert(map);
        changeMarker();
        var mp;
        /*navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.mapval = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }
          console.log($scope.mapval);
          

            /*map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
              //map.setOptions({draggable: true});
              var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location",
                draggable:true
            });
              
              myLocation.bindTo('position',map,'center');
              changeMarker()
        });*/
//alert("gps");
        
        function changeMarker(){
          //alert('mp');
          $('<div/>').addClass('centerMarker myMarker').appendTo(map.getDiv())
           mp = $('.centerMarker');
          mp.data('win',new google.maps.InfoWindow({content:'this is the center'}));
          mp.data('win').bindTo('position',map,'center');
          //alert(mp);
          //console.log(loc);
          google.maps.event.addListener(mp.data('win'), 'position_changed', function(){
              //console.log('Current Latitude:',evt.latLng.lat(),'Current Longitude:',evt.latLng.lng());
              console.log(mp.data('win').getPosition().lat());
              //var locations = {mp.data('win').getPosition();
              //console.log(locations);
              //var p = [];
              /*angular.forEach(locations, function(value, key){ 
                
                p.push(value); 
              });*/
              var newLoc = {"H":mp.data('win').getPosition().lat(),"L":mp.data('win').getPosition().lng()};
              LocationService.SetUserSelectedLocation(newLoc);
              if(noTextChange == 0){
                updating("texttop");
              }else{
                noTextChange = 0
              }

              });
        }
        $(function () {
            $(document).on('tap', '#texttop', function() {
              //alert($scope.newobs.boxVal);
              $(".myMarker").removeClass('centerMarker');
              mp = "";
            
            });
        });
            $('#map').on('tap', function() {
              //alert($scope.newobs.boxVal);
                noTextChange = 0

              if(!$(".myMarker").hasClass('centerMarker')){
                $(".myMarker").addClass('centerMarker');
              }
            
            });
        $(function () {
            $(document).on('change', '#texttop', function() {
              $(".myMarker").removeClass('centerMarker');
              mp = "";
              //alert($scope.newobs.boxVal);
              $timeout(function(){
               noTextChange = 1;

                var geocoder = new google.maps.Geocoder();
                //alert($("#texttop").val());
                geocoder.geocode({'address': $("#texttop").val()}, function(results, status) {
                  if (status === google.maps.GeocoderStatus.OK) {
                    mp = $('.myMarker');
                    var newLoc = {"H":results[0].geometry.location.lat(),"L":results[0].geometry.location.lng()};
                    //alert(JSON.stringify(newLoc));
                     LocationService.SetUserSelectedLocation(newLoc);
                     myLatlng = new google.maps.LatLng(newLoc['H'], newLoc['L']);

                    mp.data('win').setPosition(myLatlng)
                    $(".myMarker").addClass('centerMarker');

                  } else {
                    //showToast($cordovaToast,'Location not found for the following reason: ' + status);
                  }
                });

              },1000);
            
            });
        });


 
        $scope.doSomething = function(){
          //alert($('#checking').html());
          $("#Locationval").text($("#texttop").val())
          $state.go("app.newObservation");
        }

        $scope.goStatus = function(){
         $state.go('app.observationStatus');

        }
        $scope.registerLocation = function(){
          updating("Locationvalue1");

          $state.go('newUser');

        }
        $scope.goToNew = function(){
          $state.go('newUser');

        }

        $scope.statusLocation = function(){
          //alert('came')
          $scope.dbId = $location.path().split("/")[3];
          //alert($location.path())
          var newLocation = $("#texttop").text();
          var query1 = "SELECT * FROM OBSERVATION WHERE ID ="+$scope.dbId;
        $cordovaSQLite.execute(db, query1).then(function(res) {
                  var uLatLong = LocationService.GetUserSelectedLocation();

          $scope.statusSubmit = JSON.parse(res.rows.item(0)['obslist']);
          $scope.statusSubmit['placeName']  = newLocation;
          $scope.statusSubmit['areas']      =  "POINT("+uLatLong.longitude+" "+uLatLong.latitude+")" ;
          var query = "UPDATE OBSERVATION SET STATUS='PENDING', OBSLIST='"+JSON.stringify($scope.statusSubmit)+"' WHERE ID ="+$scope.dbId ;
              $cordovaSQLite.execute(db, query).then(function(result) {
                  $state.go("app.observationStatus");
              });
        
        });
        }

         $scope.getLocation = function(){
          //console.log($('#Locationval').html());
          /*var data = LocationService.GetUserSelectedLocation()//.then(function(data){
          console.log(data);
          var code="https://maps.googleapis.com/maps/api/geocode/json?latlng="+data.latitude+","+data.longitude;
      
           $http.get(code).success(function(dataval){
            //console.log(dataval.results[0]);
              
               
                LocationService.SetUserSelectedLocAdd(dataval.results[0]["formatted_address"]);
              $state.go("app.editDetails",{},{cache:true});
            });*/
    
          LocationService.SetUserSelectedLocAdd($("#texttop").val());
              $state.go("app.editDetails",{},{cache:true});
        }

        function updating(id){
          var data = LocationService.GetUserSelectedLocation()//.then(function(data){
          console.log(data);
      var code="https://maps.googleapis.com/maps/api/geocode/json?latlng="+data.latitude+","+data.longitude;
      
      $http.get(code).success(function(dataval){
            //console.log(dataval.results[0]);
            if(id == 1){
              //alert("came");
              LocationService.SetUserSelectedLocAdd(dataval.results[0]["formatted_address"]);
            }else{
            $("#"+id).text(dataval.results[0]["formatted_address"])
            $("#"+id).val(dataval.results[0]["formatted_address"])            }
          });
        }

});

function onGPS($cordovaGeolocation,LocationService,$ionicPopup){

  //alert('came');
  var posOptions = {timeout: 3000, maximumAge: 90000, enableHighAccuracy: false};
   $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
       var lat  = position.coords.latitude;
       var lng = position.coords.longitude;
       //alert(lng);
       LocationService.setCurrentLocation(lat,lng);
       var loc = {"H":position.coords.latitude,"L": position.coords.longitude};
        LocationService.SetUserSelectedLocation(loc);
     }, function(data) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, {timeout: 2000, enableHighAccuracy: true});
      function onSuccess(position){
       // alert('succ');
        //alert(JSON.stringify(position));
        var lat  = position.coords.latitude;
        var lng = position.coords.longitude;
        LocationService.setCurrentLocation(lat,lng);
      var loc = {"H":position.coords.latitude,"L": position.coords.longitude};
       LocationService.SetUserSelectedLocation(loc);
    
      }
       function onError(error){
      //alert(JSON.stringify(error));
    //alert(error.message);
    //var settingName = "location_source";
     /* var alertPopup = $ionicPopup.alert({
            title: 'GPS',
            content: "Location not found.Please enable gps in high accuracy mode. Click 'OK' to go to settings"//'You must submit atleast one image'
          });

       alertPopup.then(function(res) {
         cordova.plugins.settings.openSetting(settingName, success,failure);
       });*/
  /*var confirmPopup = $ionicPopup.confirm({
          title: 'GPS',
          template: "Location not found.Please enable gps in high accuracy mode. Click 'OK' to go to settings"
        });
         confirmPopup.then(function(result) {

            if(result) {

                     cordova.plugins.settings.openSetting(settingName, success,failure);

            } else {

            }

          });*/

}
     });
}
 


appne.controller('HomeController',[ '$scope', '$state', '$window', '$timeout', '$http', 'BrowseService','LocationService', '$ionicSideMenuDelegate','UserGroupService','$cordovaSQLite', '$ionicPlatform', 'ApiEndpoint', 'NewObservationService' ,'$filter' , '$ionicHistory' , '$cordovaToast', '$cordovaProgress' , '$cordovaGeolocation', '$ionicPopup',function($scope,$state,$window,$timeout,$http,BrowseService,LocationService,$ionicSideMenuDelegate, UserGroupService, $cordovaSQLite, $ionicPlatform, ApiEndpoint, NewObservationService,$filter,$ionicHistory,$cordovaToast,$cordovaProgress,$cordovaGeolocation,$ionicPopup){
  
//$ionicSideMenuDelegate.canDragContent(true);
//$cordovaSQLite.deleteDB("observationQueue.db");
 //$ionicPlatform.on('online', pendingObservation);
//alert($ionicPlatform.on('online', pendingObservation, false));
  var check ;
  var wCheck ;
  var editCheck = 0; 
  var setStorage = localStorage.getItem('SETTINGS');
      var setValues = JSON.parse(setStorage);
      var wifiSettings = setValues.wifiSetting;
      //alert(token);
      var manualUploads = setValues.manualUpload;
      var setHome = localStorage.getItem('Home');
      var executeVal = JSON.parse(setHome);
      var execObs = executeVal.ExecuteVal;
  //$ionicHistory.clearCache();
$scope.speciesGroups = [{"id":1,"name":"All"},{"id":8,"name":"Mammals"},{"id":6,"name":"Birds"},{"id":11,"name":"Fish"},{"id":5,"name":"Amphibians"},{"id":9,"name":"Reptiles"},{"id":10,"name":"Molluscs"},{"id":7,"name":"Arthropods"},{"id":4,"name":"Plants"},{"id":3,"name":"Fungi"},{"id":2,"name":"Others"}];
  $scope.goNewObs = function(){
    $ionicHistory.clearCache().then(function(){ 
      $state.go('app.newObservation');
    })
       /*var tokenVal = localStorage.getItem('USER_KEY');
      var tokenVar = JSON.parse(tokenVal);
      var countVal = tokenVar.nId;
        if(countVal==0){
          tokenVar.nId = 1;
          localStorage.setItem('USER_KEY',JSON.stringify(tokenVar));
          $state.go("app.newObservation");
        }else{
              $state.go("app.newObservation",null,{reload:true});

        }*/
  }
  $scope.goBrowseObs = function(){
    $scope.listPopup = $ionicPopup.show({
         template: '<ion-list class="item-icon-right">                                '+
                   '  <ion-item class="item " id="uGroup{{usrgrps.id}}" ng-repeat="usrgrps in speciesGroups " ng-click="goToBrowse({{usrgrps.id}});" > '+
                   '    {{usrgrps.name}}                             '+
                   '  </ion-item>                             '+
                   '</ion-list>                               ',
         title: 'Select Groups',
         scope: $scope,
         buttons: [
           { text: 'Cancel' },
         ]
       });  
   
   }

   $scope.goToBrowse = function(browseId){
     $scope.listPopup.close();
      BrowseService.setSpeciesGroupID(browseId);
     $ionicHistory.clearCache().then(function(){ 
          $state.go('app.browse');
        })
   }

   $scope.deleteMultiple = function(obsId, resource){
    //alert(resource);
    var tokenvar = localStorage.getItem('USER_KEY');
    var tokenvar1 = JSON.parse(tokenvar);
    var userid = tokenvar1.userID;
    $scope.getParams = {
    "offset": 0,
    "user": userid,
    "max":1
    }
    BrowseService.GetBrowseList($scope.listParams).then(function(obsList){

        //alert(obsList["data"]["model"]["observationInstanceList"].length);
        if(obsList["data"]["model"]["observationInstanceList"].length > 0){
          //$cordovaProgress.hide();
          for(var i=0; i<obsList["data"]["model"]["observationInstanceList"][0]['resource'].length; i++){
                     // alert(obsList["data"]["model"]["observationInstanceList"][0]['resource'][i]['url'].split('//')[2]);

            var z = resource.localeCompare(obsList["data"]["model"]["observationInstanceList"][0]['resource'][i]['url'].split('//')[2])
            //if(resource == obsList["data"]["model"]["observationInstanceList"][0]['resource'][i]['url'].split('//')[2]){
              //alert(z);
              if(z == 0){
               var query = "DELETE FROM OBSERVATION  WHERE ID ="+obsId;
              $cordovaSQLite.execute(db, query).then(function(res) {
                            console.log("INSERT ID -> " + res.insertId);
                            //alert('success')
                                    //$state.go('app.observationStatus');

               }, function (err) {
              //alert(err);
                console.error(err);
              });
            }
          }
        } 
      } );
   
   }
  //$scope.showButton = false;
  //alert(Icheck());
  /*offlinesubmission();
  $scope.callMethod = 0;
  function offlinesubmission(){
    var query = "SELECT count(ID) FROM OBSERVATION WHERE STATUS= 'PENDING' ";
    
    $cordovaSQLite.execute(db, query).then(function(res) {
      console.log(res);
      $scope.pendingCount = res.rows['length'];
      if(check == true){

      pendingObservation();
    }
      //alert(JSON.stringify(res));
    }, function (err) {
      alert(err);
        console.error("newwww"+err);
    });
    
  }*/
  observationStatusController($scope, NewObservationService, $cordovaSQLite);
   $ionicPlatform.ready(function() {
    var setvar3 = localStorage.getItem('countvariables');
   var getVar3 = JSON.parse(setvar3);
    check = Icheck();
    wCheck = wifiCheck();
    //alert(check + "," + wCheck);
      if(check == true && wifiSettings == false && manualUploads == false && execObs == 0){

         getVar3.successVal = 0;
        getVar3.failedVal = 0;
              
      localStorage.setItem('countvariables',JSON.stringify(getVar3));
        pendingObservation();
      } else if (check == true && wifiSettings == true && manualUploads == false && execObs == 0){
        if(wCheck){
           getVar3.successVal = 0;
           getVar3.failedVal = 0;
              
          localStorage.setItem('countvariables',JSON.stringify(getVar3));
          pendingObservation();
        }
      }
      });
                     onGPS($cordovaGeolocation,LocationService,$ionicPopup);

/*$timeout(function() {
          //$scope.closeLogin();
          //alert('came');
        
            cordova.plugins.diagnostic.isLocationEnabled(function(enabled){
              //alert(enabled);
                if(enabled ){
                  //alert('hh');
                     $ionicPlatform.ready(function() {

                  onGPS($cordovaGeolocation,LocationService,$ionicPopup);
                });
                } else {

                  //var settingName = "location_source";
                
              var confirmPopup = $ionicPopup.alert({
                      title: 'GPS',
                      template: "Location not found.Please enable Location Services for the app"
                    });
                     

                }

            }, function(error){
                alert("The following error occurred: "+error);
            });
    }, 1000);*/

       var obsid;
   $scope.execPendingObservation = function(){
  
     var setHome1 = localStorage.getItem('Home');
      var executeVal1 = JSON.parse(setHome1);
      var execObs1 = executeVal1.ExecuteVal;
      //alert(execObs1)
       var setvar2 = localStorage.getItem('countvariables');
        var getVar2 = JSON.parse(setvar2);
        


        var iCheck = Icheck();
        wCheck = wifiCheck();

      if(iCheck == true && wifiSettings == false && execObs1 == 0){
        showToast($cordovaToast,"observations will be submitted soon");
        //alert("t,f");
        getVar2.successVal = 0;
        getVar2.failedVal = 0;
              
      localStorage.setItem('countvariables',JSON.stringify(getVar2));
        pendingObservation();
      } else if(iCheck == true && wifiSettings == true && execObs1 == 0){
        //alert("t,t");
        if(wCheck == true){
          showToast($cordovaToast,"observations will be submitted soon");
          getVar2.successVal = 0;
        getVar2.failedVal = 0;
              
      localStorage.setItem('countvariables',JSON.stringify(getVar2));
          pendingObservation();
        }else{
          showToast($cordovaToast,"No WIFI connection");
        }
      } else if(iCheck == false){
        //alert("f,f");
        showToast($cordovaToast,"No internet connection");
      }
   }
   $scope.execFailedObservation = function(){
    var dbCount=0;
      var query = "SELECT * FROM OBSERVATION WHERE STATUS= ? ";
        $cordovaSQLite.execute(db, query, ['FAILED']).then(function(res) {
           if(res.rows.length >0){
            for(var i=0; i<res.rows.length; i++){
              $scope.failedID = res.rows.item(i)['id'];
              var query1 = "UPDATE OBSERVATION SET STATUS='PENDING' WHERE ID ="+$scope.failedID;
              $cordovaSQLite.execute(db, query1).then(function(res1) {
                dbCount++;
                //alert(res.rows.length+" "+dbCount);
               observationStatusController($scope, NewObservationService, $cordovaSQLite, $filter);
                if(res.rows.length == dbCount){
                  showToast($cordovaToast,$filter('translate')('inPending'));
                   $scope.execPendingObservation();
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
 function pendingObservation(){
  //$scope.callMethod++;
  //alert('pendingObservation');
  if(executeVal.ExecuteVal == 0){
    executeVal.ExecuteVal = 1;
    localStorage.setItem('Home',JSON.stringify(executeVal));
  }

  $scope.offlineSubmit ={};
  var query = "SELECT * FROM OBSERVATION WHERE STATUS= ? ORDER BY ROWID ASC LIMIT 1 ";
  //alert(query);
  $cordovaSQLite.execute(db, query, ['PENDING']).then(function(res) {
      //alert(res.rows.length);
      if(res.rows.length >0){
        $scope.idVal = res.rows.item(0)['id'];
                $scope.offlineSubmit = JSON.parse(res.rows.item(0)['obslist']);

          var query1 = "UPDATE OBSERVATION SET STATUS='PROCESSING' WHERE ID ="+$scope.idVal;
        $cordovaSQLite.execute(db, query1).then(function(res) {
         // alert('came');
                      //console.log("INSERT ID -> " + res.insertId);
        observationStatusController($scope, NewObservationService, $cordovaSQLite);

        
        $scope.offlineSubmit['fromDate'] = $filter('date')( $scope.offlineSubmit.fromDate,"dd/MM/yyyy" );

         if($scope.offlineSubmit['placeName'].substr(0,9) == "Lattitude"){
         // alert('if')
          var sendLat = $scope.offlineSubmit['areas'].split(" ")[1].split(")")[0];
          var sendLong = $scope.offlineSubmit['areas'].split(" ")[0].split("(")[1];
          var code="https://maps.googleapis.com/maps/api/geocode/json?latlng="+sendLat+","+sendLong;
          
          $http.get(code).success(function(dataval){
               // alert(dataval.results[0]["formatted_address"]);
            $scope.offlineSubmit['placeName'] = dataval.results[0]["formatted_address"];
            fileUpload();
          });
          
        } else {
          //alert("else");
          fileUpload();
        }

         }, function (err) {
        //alert(err);
          console.error(err);
        });
       
     }else {
      executeVal.ExecuteVal = 0;
      localStorage.setItem('Home',JSON.stringify(executeVal));
     }
   }, function (err) {
     //alert(err);
       console.error("newwww"+err);
   });


 }
//console.log($ionicSideMenuDelegate);
  /*LocationService.GetLocation().then(function(data){
  console.log(data);
  });*/
  
BrowseService.GetBrowseInfo().then(function(speciesGroup){

  console.log(speciesGroup);

} );

UserGroupService.GetJoinedGroups().then(function(groups){

  console.log(groups['data']['model']);
  UserGroupService.SetUserJoinGroups(groups);
  if(localStorage.getItem('UserGroupArray')!== null){
    localStorage.removeItem('UserGroupArray');
    localStorage.setItem('UserGroupArray',JSON.stringify(groups));
  } else {
    localStorage.setItem('UserGroupArray',JSON.stringify(groups));
  }
});






 function fileUpload(){
  //alert("fileUpload");
    var calcPerc = 0;

      $scope.times = 0;
      $scope.storingImg = $scope.offlineSubmit['imagePath'];
      var tokenvar = localStorage.getItem('USER_KEY');
      var tokenvar1 = JSON.parse(tokenvar);
      var token = tokenvar1.userKey;
      var appkey = "a51dd31d-9697-4d45-8b1a-ce117ea4b548";//"fc9a88b5-fac9-4f01-bc12-70e148f40a7f";
      $scope.count =0;
      $scope.newImageStr = [];
      //console.log($scope.newobs);
       $scope.nativeImg = [];



       for(var i = 0;i < $scope.offlineSubmit['imagePath'].length; i++){
       // alert('came');
       
          var imageLink = $scope.offlineSubmit['imagePath'][i]['path'] ;
          if(imageLink.match("http://")){
             editCheck = 1;
           var nameCreate =  "/"+imageLink.split('//')[2];

              $scope.newImageStr.push(nameCreate);
              $scope.count++;
              if($scope.count == $scope.offlineSubmit['imagePath'].length){
              //alert("parse");
              console.log("win parsing "+ $scope.count +" called parse resource");
              //console.log(Object.keys($scope.newImageStr).length);
              storeResourceDetails();
             }
          } else {
              $scope.nativeImg.push(imageLink);
          }
        }



       var options = new FileUploadOptions();
       //alert($scope.offlineSubmit['imagePath'].length);
       //alert($scope.offlineSubmit['imagePath'][0]['path']);
        //for(var i = 0;i < $scope.offlineSubmit['imagePath'].length; i++){
          //var imageLink = $scope.offlineSubmit['imagePath'][i]['path'] ;
          for(var i = 0;i < $scope.nativeImg.length; i++){
          var imageLink = $scope.nativeImg[i] ;
          //alert('file up');
            options.fileKey = "resources",
            options.fileName = imageLink.substr(imageLink.lastIndexOf('/')+1),
            options.chunkedMode = false,
            options.mimeType = "image/jpg",
            options.httpMethod = "POST",
            options.headers =  {
            "X-Auth-Token":token,
            "X-AppKey":appkey
          }

          var ft = new FileTransfer();

           ft.onprogress = function(progressEvent) {
            //alert(JSON.stringify(progressEvent));
              if (progressEvent.lengthComputable) {
                //loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
                var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                
                if(perc>calcPerc){
                  //alert(perc);
                  $('#myProgress #ft-prog').css('width', ""+perc+"%");
                   calcPerc = perc ;
                }
              } else {
                //loadingStatus.increment();
              }
          };

          var uri = encodeURI(ApiEndpoint.url+"/observation/upload_resource?resType=species.participation.Observation");
          
          //alert("file");
          ft.upload(imageLink, uri, succes, failed, options);
        }

      }

          function succes(data){
            //alert("file upload success");
            var parsedData = JSON.parse(data.response);
           

             var jArray = [];
             jArray = parsedData["model"]["observations"]["resources"];
             //alert(jArray[0]);

             if(jArray!=null && jArray.length>0){
                for(var i=0; i<jArray.length; i++){

                  $scope.newImageStr.push(jArray[i]["fileName"]);

                }
              $scope.count++;
             }

             //alert($scope.count);

             if($scope.count == $scope.offlineSubmit['imagePath'].length){
              //alert("parse");
              console.log("win parsing "+ $scope.count +" called parse resource");
              console.log(Object.keys($scope.newImageStr).length);
              storeResourceDetails();
             }
          }
          function failed(err){
            $scope.times++;
            //alert("file transfer"+err);
            if($scope.times == 1){
            storeStatusCheck();
          }
            console.log("error:fail " + JSON.stringify(err));
          }
          

          function storeResourceDetails(){
            var count1 = 0;
            console.log("newImgstr" + Object.keys($scope.newImageStr).length);
            //alert(Object.keys($scope.newImageStr).length);
            for(var i=0; i<Object.keys($scope.newImageStr).length; i++){
              //alert()
              count1++;
              $scope.offlineSubmit["file_"+(i+1)] = $scope.newImageStr[i];
              $scope.offlineSubmit["type_"+(i+1)] = "IMAGE";
              $scope.offlineSubmit["license_"+(i+1)] = $scope.offlineSubmit['imagePath'][i]['license'];
              
              if(count1 == Object.keys($scope.newImageStr).length){
                //alert("entered");
                            delete $scope.offlineSubmit['imagePath'];

                submitObservation();
              }
            }
            //console.log($scope.submitObsParams);
            
          }

          function storeStatusCheck(){
            //alert("store status check");
            var sciName;
            var commonName;
            var obsNotes;
            if($scope.offlineSubmit.hasOwnProperty('recoName')){
            } else {
                $scope.offlineSubmit['recoName'] = "Unknown"  
            }
            if($scope.offlineSubmit.hasOwnProperty('commonName')){
              /*if($scope.offlineSubmit['commonName'].length>0){
               commonName = $scope.offlineSubmit['commonName'];
             }*/
            } else {
              $scope.offlineSubmit['commonName']  = ''
            }
             $scope.offlineSubmit['imagePath'] = $scope.storingImg;

            var query = "UPDATE OBSERVATION SET STATUS='FAILED', OBSLIST='"+JSON.stringify($scope.offlineSubmit)+"' WHERE ID ="+$scope.idVal;
              $cordovaSQLite.execute(db, query).then(function(res) {
                var setvar = localStorage.getItem('countvariables');
              var getVar = JSON.parse(setvar);
                getVar.failedVal++;
              
              showToast($cordovaToast,"Successfull: "+getVar.successVal+" failed: "+getVar.failedVal);
              localStorage.setItem('countvariables',JSON.stringify(getVar));
                  //console.log("INSERT ID -> " + res.insertId);
                  callOffline();
                 // alert("transacted");
              }, function (err) {
                //alert(err);
                  console.error("erorrrrrr   "+err);
              });
              
          }
              
          

          function submitObservation(){
            
            
            if($scope.offlineSubmit['recoName'] == "Unknown"){
                delete $scope.offlineSubmit['recoName'];
            }
            if($scope.offlineSubmit['commonName'] == ""){
              delete $scope.offlineSubmit['commonName'];
            }
            
            console.log($scope.offlineSubmit);
            if($scope.offlineSubmit.hasOwnProperty('observationId')){
              obsid = $scope.offlineSubmit['observationId'];
              delete $scope.offlineSubmit['observationId'];
            }
            if($scope.offlineSubmit.hasOwnProperty('file_name')){
              delete $scope.offlineSubmit['file_name'];
            }

            //alert($scope.offlineSubmit['fromDate']);
          if(editCheck==0){
            NewObservationService.SubmitObservation($scope.offlineSubmit).then(function(obsResponse){
              
              //alert("success" + obsResponse.data.success);
               if(obsResponse.data.success == true){
                var setvar = localStorage.getItem('countvariables');
                var getVar = JSON.parse(setvar);
                getVar.successVal++;
              
                showToast($cordovaToast,"Successfull: "+getVar.successVal+" failed: "+getVar.failedVal);
                localStorage.setItem('countvariables',JSON.stringify(getVar));
                var query1 = "DELETE FROM OBSERVATION WHERE ID ="+$scope.idVal;
               //alert(query1);
                $cordovaSQLite.execute(db, query1).then(function(result) {
                  callOffline();
                    //console.log("INSERT ID -> " + res.insertId);
                    //alert("transacted");
                }, function (err) {
                  //alert(err);
                    console.error("erorrrrrr   "+err);
                });

              }
              if(obsResponse.data.success == false){
             $scope.offlineSubmit["file_name"] = $scope.newImageStr[0].slice(1);

               storeStatusCheck();
              }
              console.log(obsResponse);
            },
            function(err){
             // alert("Nosuccess");
              $scope.offlineSubmit["file_name"] = $scope.newImageStr[0].slice(1);

              console.log(err);
              var iCheck2 = Icheck();
              //alert("Internet connection "+iCheck2);
              if(iCheck2 == true){
                 var setvar = localStorage.getItem('countvariables');
                 var getVar = JSON.parse(setvar);
                 getVar.successVal++;
              
                  showToast($cordovaToast,"Successfull: "+getVar.successVal+" failed: "+getVar.failedVal);
                  localStorage.setItem('countvariables',JSON.stringify(getVar));
                var query1 = "DELETE FROM OBSERVATION WHERE ID ="+$scope.idVal;

                   //alert(query1);
                    $cordovaSQLite.execute(db, query1).then(function(result) {
                      callOffline();
                        //console.log("INSERT ID -> " + res.insertId);
                        //alert("transacted");
                    }, function (err) {
                      //alert(err);
                        console.error("erorrrrrr   "+err);
                    });
              }else{
                storeStatusCheck();
              }

               
            });

          }
        else {

          NewObservationService.EditSubmitObservation($scope.offlineSubmit,obsid).then(function(obsResponse){
              
              //alert("success" + obsResponse.data.success);
              if(obsResponse.data.success == true){
                var query1 = "DELETE FROM OBSERVATION WHERE ID ="+$scope.idVal;
               //alert(query1);
                $cordovaSQLite.execute(db, query1).then(function(result) {
                  callOffline();
                    //console.log("INSERT ID -> " + res.insertId);
                    //alert("transacted");
                }, function (err) {
                  //alert(err);
                    console.error("erorrrrrr   "+err);
                });

              }
              if(obsResponse.data.success == false){
                //alert("error1");
               storeStatusCheck();
              }
              console.log(obsResponse);
            },
            function(err){
              //alert("Nosuccess");
              console.log(err);
               storeStatusCheck();
            });

          }
        }

          function callOffline(){
            observationStatusController($scope, NewObservationService, $cordovaSQLite);
            if(check == true){
              pendingObservation();
            }else {
              executeVal.ExecuteVal = 0;
              localStorage.setItem('Home',JSON.stringify(executeVal));
            }
          }
          $scope.locationFind = function(dbID){
            var iCheck = Icheck();

                if(iCheck == false){
                  showToast($cordovaToast,"No Internet");
                  return;
                }else {
                  //$('ion-nav-bar').addClass('hide');
                  $state.go('app.getLocation',{statusId:dbID});
                }

          }


}]);
function success(){
    ionic.Platform.exitApp();
   // alert('succ');
  }

  function failure(){
    //alert('failure');
  }
appne.controller('MyCollectionCtrl',[ '$scope', '$http', 'BrowseService','LocationService', '$ionicPopup', '$cordovaProgress', 'UserGroupService', '$ionicHistory', '$state', function($scope,$http,BrowseService,LocationService,$ionicPopup,$cordovaProgress,UserGroupService,$ionicHistory,$state){

//console.log($("#myCollectionMsg").html());
    BrowseService.SetTrackOrder(3);

  $scope.details = [];
  $scope.innerDetails = [];
  $scope.arrayIDBrowse = [];
var tokenvar = localStorage.getItem('USER_KEY');
var tokenvar1 = JSON.parse(tokenvar);
var userid = tokenvar1.userID;

$scope.listParams = {
  "offset": 0,
  "user": userid
}
var inter = Icheck();
  if(inter == false){
    $ionicPopup.alert({
      title: 'ERROR',
      content: "Plase make sure, you are connected to internet"//'You must submit atleast one image'
    });
    return;
  } else {
    $cordovaProgress.showSimple(true) ;
    BrowseService.GetBrowseList($scope.listParams).then(function(obsList){

      //alert(obsList["data"]["model"]["observationInstanceList"].length);
      if(obsList["data"]["model"]["observationInstanceList"].length > 0){
        $cordovaProgress.hide();
        $("div #myCollectionList").show();
        arrayData($scope,obsList["data"]["model"]["observationInstanceList"],1,BrowseService);
      } else {
        $cordovaProgress.hide();
        $("div #myCollectionMsg").show();
      }
    } );

    UserGroupService.GetJoinedGroups().then(function(groups){

      console.log(groups['data']['model']);
      UserGroupService.SetUserJoinGroups(groups);
     
    });
  }

$scope.loadMore = function() {
    $scope.noMoreItemsAvailable = false;

    $scope.listParams.offset = $scope.listParams.offset + 24;
    


    BrowseService.GetBrowseList($scope.listParams).then(function(obsList){

      console.log(obsList);
      arrayData($scope,obsList["data"]["model"]["observationInstanceList"],2,BrowseService);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    } );
    
  };
  $scope.goNewObs = function(){
    $ionicHistory.clearCache().then(function(){
      $state.go('app.newObservation');
    })
  }
  UserGroupService.GetUserGroups().then(function(groups){

    console.log(groups['data']['model']);
    UserGroupService.SetUserGroups(groups['data']['model']['userGroupInstanceList']);
  });

}]);

appne.controller('ListController',[ '$scope', '$state','$http', 'BrowseService', '$ionicPopup','UserGroupService', function($scope,$state,$http,BrowseService,$ionicPopup,UserGroupService){
  internetCheck($ionicPopup);
      BrowseService.SetTrackOrder(1);

  $scope.showButton = true;
  $scope.details = [];
  $scope.innerDetails = [];
  $(".modal1").show();
  $scope.arrayIDBrowse = [];
  var groupID = BrowseService.getSpeciesGroupID();
$scope.listParams = {
  offset:0,
  sGroup:groupID,
  type:"nearBy",
  maxRadius:50000,
  max:12
}

setTimeout(function(){
      if($('ion-nav-bar').hasClass('hide')){
        //alert('came');
        $('ion-nav-bar').removeClass('hide');
        //$('ion-view').css('padding-top','44px');
        //$('ion-content').css('margin-top','43px');
      }
    },100);
BrowseService.GetBrowseList($scope.listParams).then(function(obsList){

  console.log("hel");
  arrayData($scope,obsList["data"]["model"]["observationInstanceList"],1,BrowseService);
} );

  $scope.loadMore = function() {
   // alert("hi");
    $scope.noMoreItemsAvailable = false;

    $scope.listParams.offset = $scope.listParams.offset + 12;
    


    BrowseService.GetBrowseList($scope.listParams).then(function(obsList){

      console.log(obsList);
      arrayData($scope,obsList["data"]["model"]["observationInstanceList"],2,BrowseService);
     $scope.$broadcast('scroll.infiniteScrollComplete');
    } );

    //$scope.$broadcast('scroll.infiniteScrollComplete');
    /*$http.get('js/data.json').success(function(data) {
      //console.log(data.observationInstanceList);
      arrayData($scope,data.observationInstanceList,2);
      
      //$scope.$digest();
//$timeout(function() {
  $scope.$broadcast('scroll.infiniteScrollComplete');
//});
    });*/
  };
  UserGroupService.GetUserGroups().then(function(groups){

    console.log(groups['data']['model']);
    UserGroupService.SetUserGroups(groups['data']['model']['userGroupInstanceList']);
  });

  $scope.enableMap = function(){
   // alert('map');
    $state.go("app.viewMap");
  }
 
}]);

appne.controller('ObsNearByCtrl', [ '$scope', '$state', '$http', 'BrowseService','LocationService', '$ionicPopup',function($scope,$state,$http,BrowseService,LocationService,$ionicPopup){

internetCheck($ionicPopup);
    BrowseService.SetTrackOrder(2);

 $scope.details = [];
  $scope.innerDetails = [];
  $scope.arrayIDBrowse = [];
$(".modal1").show();
  var groupID = BrowseService.getSpeciesGroupID();

setTimeout(function(){
      if($('ion-nav-bar').hasClass('hide')){
        //alert('came');
        $('ion-nav-bar').removeClass('hide');
        //$('ion-view').css('padding-top','44px');
        //$('ion-content').css('margin-top','43px');
      }
    },100);
$scope.listParams = {
  "offset":0,
  "type":"nearBy",
  "sGroup":groupID,
  "maxRadius":50000,
  "long":'',
  "lat":'',
  'max':12
}
var location = LocationService.getCurrentLocation();

$scope.listParams["long"] = location["longitude"];
$scope.listParams["lat"] = location["latitude"];


BrowseService.GetBrowseList($scope.listParams).then(function(obsList){
  console.log("hel");
  arrayData($scope,obsList["data"]["model"]["observationInstanceList"],1,BrowseService);
} );

  $scope.loadMore = function() {

    $scope.listParams.offset = $scope.listParams.offset + 12;
    
    BrowseService.GetBrowseList($scope.listParams).then(function(obsList){

      console.log(obsList);
      arrayData($scope,obsList["data"]["model"]["observationInstanceList"],2,BrowseService);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    } );


    
  };

  $scope.enableMap = function(){
    //alert('map');
    $state.go("app.viewMap");
  }
  
}]);


appne.controller('JoinGroupCtrl',[ '$scope', '$http','$compile','UserGroupService', '$ionicPopup', '$cordovaProgress', function($scope,$http,$compile,UserGroupService,$ionicPopup,$cordovaProgress){
  console.log("jgroup");
$scope.usrGrpDetails = [];
var inter = Icheck($ionicPopup);
      if(inter == false){
        $ionicPopup.alert({
            title: 'ERROR',
            content: "Plase make sure, you are connected to internet"//'You must submit atleast one image'
          });
        return;
      } else {
        $cordovaProgress.showSimple(true) ;
  /*$http.get('js/userGroup.json').success(function(data){
    //$scope.artists = data;
    //console.log($scope.artists.observationInstanceList );
    userGroupData($scope,data.userGroupInstanceList);
    
  });*/
console.log($(".button").html());
//$("div .hell").hide()
$scope.noMoreGroups = true;

      $scope.listParams = {
        "offset":0,
        "max":24
      }

UserGroupService.GetUserGroups($scope.listParams).then(function(groups){
      //var groups = UserGroupService.GetUserJoinGroups()
        console.log(groups);
          $cordovaProgress.hide();

        //$cordovaProgress.hide();
        userGroupData($scope,groups['data']['model'].userGroupInstanceList,UserGroupService);
      });
    }

  $scope.loadMore = function() {

    $scope.listParams.offset = $scope.listParams.offset + 24;
    
    UserGroupService.GetUserGroups($scope.listParams).then(function(groups){

      userGroupData($scope,groups['data']['model'].userGroupInstanceList,UserGroupService);
      if(groups['data']['model']['userGroupInstanceList'].length<24){
        $scope.noMoreGroups = false;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    } );


    
  };
   /*$http.get('js/joinedGroup.json').success(function(data){
    //$scope.artists = data;
    console.log(data.observations );
    checkGroup($scope,data.observations);
    
  });*/

  /*UserGroupService.GetJoinedGroups().then(function(userGroups){

  console.log(userGroups);
  console.log($("#button1 ").html());
  checkGroup($scope,userGroups['data']['model'].observations);
  //userGroupData($scope,groups['data']['model'].userGroupInstanceList);
});*/
  $scope.join = function(id,name){

    console.log(id,name);
    console.log(UserGroupService);


    var confirmPopup = $ionicPopup.confirm({
           title: 'Join Group',
           template: 'Do you really want to join in '+name 
         });
          confirmPopup.then(function(result) {

             if(result) {

              UserGroupService.JoinGroup(id).then(function(groups){

                console.log(groups);
                $("#button"+id).hide();
                $("#joinedicon"+id).addClass("icon ion-checkmark-round");

              });
             } else {

             }

           });

  }

}]);

appne.filter('htmlContent', function($sce) {

    return function(val) {

        return $sce.trustAsHtml(val);

    };
});

appne.controller('NotificationController', function($scope, $state,$http, $ionicModal,NotificationService,$ionicPopup,$filter,$cordovaToast) {

     $("#noNotifications").hide();


    internetCheck($ionicPopup);

      $scope.items =[];
      $scope.values = {
        "offset": 0,
        "max":12
      }
      $scope.sendNotify = false;
      var tokenvar = localStorage.getItem('USER_KEY');
      var tokenvar1 = JSON.parse(tokenvar);
      var userId = tokenvar1.userID;
      /*if(tokenvar1.Role != undefined && tokenvar1.Role != ""){
      $scope.sendNotify = true;

      }*/

        $(".modal1").show();

      NotificationService.GetListNotifications($scope.values).then(function(response){
          $(".modal1").hide();

          if(response.data.length == 0){
            $("#noNotifications").show();
          }else {
            for(var i=0;i<response.data.length;i++){
              $scope.items.push({"id":i,"title":response.data[i]['title'],"desc":response.data[i]['description'],"time":$filter('date')(response.data[i]['dateCreated'])});
            }
          }

        });



      $scope.text = {
         description:'',
         title:'',
         userId:userId
      }
      $scope.showImages = function(id){
        $scope.itemVal = id;
        $scope.checkValue = true;
      $ionicModal.fromTemplateUrl("templates/showNotification.html", {
                  cache:false,
                 scope: $scope,
                 animation: 'slide-in-up'
                 }).then(function(modal) {
                 $scope.modal = modal;
                 $scope.modal.show();
                 });
               }
      $scope.closeModal = function() {
       $scope.modal.hide();
       $scope.modal.remove()
      };
      $scope.hasMoreData = true;
      $scope.loadMore = function() {
        $scope.values.offset = $scope.values.offset + 12
        NotificationService.GetListNotifications($scope.values).then(function(response){

          if(response.data.length<12){
                  $scope.hasMoreData = false;
          }
        for(var i=0;i<response.data.length;i++){
        $scope.items.push({"id":i,"title":response.data[i]['title'],"desc":response.data[i]['description'],"time":$filter('date')(response.data[i]['dateCreated'])});
       }
        console.log(JSON.stringify(response));

        });

      };
      $scope.sendNewNotification = function(){
        $scope.checkValue = false;
        $ionicModal.fromTemplateUrl("templates/showNotification.html", {
          cache:false,
       scope: $scope,
       animation: 'slide-in-up'
       }).then(function(modal) {
       $scope.modal = modal;
       $scope.modal.show();
       });
      }
      /*$scope.pushNotification = function(){

        if($scope.text.description == '' || $scope.text.title ==''){
                showIonicAlert($ionicPopup,'Please enter all fields');
                return;

        }
                $(".modal1").show();

                $scope.closeModal();

        console.log($scope.text.pushNotify);
        NotificationService.setTokenDetails($scope.text).then(function(response1){
                        $scope.items =[];

          NotificationService.GetListNotifications().then(function(response){
                    $(".modal1").hide();

            for(var i=0;i<response.data.length;i++){
             $scope.items.push({"id":i,"title":response.data[i]['title'],"desc":response.data[i]['description'],"time":$filter('date')(response.data[i]['dateCreated'])});
            }
          });
        });
        var tokens =[];
        NotificationService.GetTokens().then(function(userTokens){

          for(var i = 0;i < userTokens.data.length;i++){
              tokens.push(userTokens.data[i])

          }

            var privateKey = '1d73dec2bd5d10538f670e286439a6e227b3cbf37fd3eb7e';
            var auth = btoa(privateKey + ':');
            var appId = "2aada8cd";
            var req = {
            method: 'POST',
            url: 'https://push.ionic.io/api/v1/push',
            headers: {
              'Content-Type': 'application/json',
              'X-Ionic-Application-Id': appId,
              'Authorization': 'basic ' + auth
            },
            data: {
              "tokens": tokens,
              "notification": {
                "alert":$scope.text.description
              }
            }
          };
              $http(req).success(function(resp){
                // Handle success
               showToast($cordovaToast,"Notification Sent")
                
                $scope.text = {
                description:'',
                title:'',
                userId:1
              }
              }).error(function(error){
                // Handle error 
               showToast($cordovaToast,"ERROR: Notification not Sent")
              });

          
        });
        
      }*/
});


function arrayData($scope,observationInstanceList,num,BrowseService){

BrowseService.setObsList(observationInstanceList);
  console.log("hi");
  //var arr = [];
  var sciName;
  var iconUrl;
  var commonname;
  var id;
  $scope.arr=[];

  for(var i=0;i<observationInstanceList.length;i++){

    if(Object.keys(observationInstanceList[i].maxVotedReco).length >0){

      if(observationInstanceList[i].maxVotedReco.hasOwnProperty('commonNamesRecoList')){
            commonname = observationInstanceList[i].maxVotedReco.commonNamesRecoList[0]["name"];
        }else {
          commonname="";
        }
        /*if(observationInstanceList[i].maxVotedReco.sciNameReco.hasOwnProperty('taxonomyDefinition')){
                sciName = observationInstanceList[i].maxVotedReco.sciNameReco.taxonomyDefinition.name;

          }else if(observationInstanceList[i].maxVotedReco.hasOwnProperty('sciNameReco')){
                sciName = observationInstanceList[i].maxVotedReco.sciNameReco.name;

          } */
          if(observationInstanceList[i].maxVotedReco.hasOwnProperty('sciNameReco')){
            if(observationInstanceList[i].maxVotedReco.sciNameReco.hasOwnProperty('taxonomyDefinition')){
              sciName = observationInstanceList[i].maxVotedReco.sciNameReco.taxonomyDefinition.name;
            }else{
              sciName = observationInstanceList[i].maxVotedReco.sciNameReco.name;
            }
          }else{
            sciName = '';
          }
      
    }else{
      sciName="Unknown";
      commonname="";
    }
    iconUrl=observationInstanceList[i].thumbnail;
    id=observationInstanceList[i].id;
    //alert(sciName);
    if(num==1){
    $scope.details.push({"id":id,"iconUrl":iconUrl,"scientificName":sciName,"CommonName":commonname});
    //$scope.details = arr;
    }else{
      $scope.arr.push({"id":id,"iconUrl":iconUrl,"scientificName":sciName,"CommonName":commonname});
      
    //
    
    }
    $scope.arrayIDBrowse.push(id);
    if(i == (observationInstanceList.length)-1){
      BrowseService.SetIDArrayBrowse($scope.arrayIDBrowse);

    }
  }
  $(".modal1").hide();
$scope.details = $scope.details.concat($scope.arr);
//BrowseService.setObsList($scope.details);
 
console.log($scope.details);
$scope.noMoreItemsAvailable = false;

}

function userGroupData($scope,userGroupInstanceList,UserGroupService){

  var usrGrp = [];

  for(i=0;i<userGroupInstanceList.length;i++){

    $scope.usrGrpDetails.push({"id":userGroupInstanceList[i].id,"name":userGroupInstanceList[i].name});

  }
  

  UserGroupService.GetJoinedGroups().then(function(userGroups){

    console.log(userGroups);
    console.log($("#button1 ").html());
    checkGroup($scope,userGroups['data']['model'].observations);
    //userGroupData($scope,groups['data']['model'].userGroupInstanceList);
  });

}

function checkGroup($scope,joinedgroup){

  var joinGrpid;

  for(i=0;i<joinedgroup.length;i++){

    joinGrpid = joinedgroup[i].id;
    console.log(joinGrpid);
    //console.log($("#button1 ").html());
    $("#button"+joinGrpid).hide();
    $("#joinedicon"+joinGrpid).addClass("icon ion-checkmark-round");
     
  }
 
  
}

function internetCheck($ionicPopup){
  console.log(window.Connection);
  if(window.Connection) {
    //alert("connection");
    if(navigator.connection.type == Connection.NONE) {
      //alert("no connection");
        $ionicPopup.alert({
            title: 'ERROR',
            content: "Plase make sure, you are connected to internet"//'You must submit atleast one image'
          });
      return false;
    }
  }
}

function Icheck(){
  var connectionVal ;
  console.log(window.Connection);
  if(window.Connection) {
    //alert("connection");
    if(navigator.connection.type == Connection.NONE) {
      
      connectionVal = false;
    } else {
      connectionVal = true;
    }
  }
  return connectionVal;
}

function wifiCheck(){
  var connectionVal ;
  console.log(window.Connection);
  if(window.Connection) {
    //alert("connection");
    if(navigator.connection.type == Connection.WIFI) {
      
      connectionVal = true;
    } else {
      connectionVal = false;
    }
  }
  return connectionVal;
}































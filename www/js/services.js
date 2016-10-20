var appnService = angular.module('starter.services', [])

appnService.factory('LoginService', function($http, ApiEndpoint, $ionicPopup){

	return {
     GetUserDetails : function(data){
     	console.log(data);
        return $http({
                method: "POST",
                url : ApiEndpoint.url + '/login',
                params : data,
            }).success(function(result) {
                //console.log("Auth.signin.success!")
                console.log(result);
                //return result;
            }).error(function(d, status, headers, config) {
            	//$cordovaProgress.hide();
            	//alert("cm")
            	$(".modal1").hide();
                console.log(JSON.stringify(d));
                showDailog($ionicPopup,"Please check your username and password");
        });

    },

    /*return {
        'GetUserDetails':GetUserDetails
    };*/
    RegisterUser : function(data){
    	$(".modal1").show();
    	return $http({
                method: "POST",
                url : ApiEndpoint.url + '/register/user',
                params : data,
            }).success(function(result) {
                //console.log("Auth.signin.success!")
                console.log(result);
                //return result;
            }).error(function(d, status, headers, config) {
                
                //alert("Please checkyour username and password");
                showDailog($ionicPopup,"Unknown error, Please try again")
        });
    },

    ForgotPassword : function(email){
    	$(".modal").show();
    	return $http({
                method: "POST",
                url : ApiEndpoint.url + '/register/forgotPassword?email='+email,
               // params : data,
            }).success(function(result) {
                //console.log("Auth.signin.success!")
                console.log(result);
                //return result;
            }).error(function(d, status, headers, config) {
                
                console.log(d);
                showDailog($ionicPopup,"Unknown error, Please try again")
        });
    },
    GoogleUserlogin : function(token){
    	//alert(token);
    	return $http({
                method: "GET",
                url : ApiEndpoint.url + '/oauth/callback/google',
                params : {"access_token":token},
            }).success(function(response) {
            	//alert("came");
                console.log(response)
                //alert(JSON.stringify(response));
                //return result;
            }).error(function(d, status, headers, config) {
               // $(".modal").hide();
               //$cordovaProgress.hide();
                $(".modal1").hide();
                //alert("Please checkyour username and password");
                console.log(d);
                console.log(JSON.stringify(config));
                //alert("Unknown error");
        });
     },

      FacebookUserlogin : function(tokenVal){
    	//alert(tokenVal);
    	return $http({
                method: "GET",
                url : ApiEndpoint.url + '/oauth/callback/facebook',
                params : {"access_token":tokenVal},
            }).success(function(response) {
            	//alert("came");
                console.log(response)
                //alert(JSON.stringify(response));
                //return result;
            }).error(function(d, status, headers, config) {
                ///$(".modal").hide();
                //$cordovaProgress.hide();
                $(".modal1").hide();
                //alert("Please checkyour username and password");
                console.log(config);
                console.log("console  "+JSON.stringify(d));
                //alert("Unknown error");
        });
     }
	
	

    
	};
});

appnService.factory('BrowseService', function($http,ApiEndpoint, $ionicPopup, $cordovaProgress){

	var items = [];
	var observationDetails = [];
		var arrayID = [];

	var tokenvar = localStorage.getItem('USER_KEY');
      var tokenvar1 = JSON.parse(tokenvar);
      var token = tokenvar1.userKey;
      var justCount = 0;
      var orderNumber;
      var appkey = "a4fbb540-0385-4fff-b5da-590ddb9e2552";// "2b808e98-ab16-4b39-8096-c72eebd18dc0";
	return {
		GetBrowseInfo: function(){
				return $http({
					method : "GET",
					url : ApiEndpoint.url + '/speciesGroup/list',
					headers : {"X-Auth-Token":token},

				}).success(function(data) {
					console.log("Auth.signin.success!")
					
					 items = data;
					 console.log(items);
					//return items;
			    }).error(function(data, status, headers, config) {
							console.log("Auth.signin.error!")
			        		
			    });
		},
		getGroupVal: function(){
			console.log(items);
			return items;
		},
		GetBrowseList: function(data){
			//justCount++;
			console.log(data);
			//if(justCount)
			
			return $http({
					method : "GET",
					url : ApiEndpoint.url + '/observation/list',
					headers : {"X-Auth-Token":token},
					params : data,
				}).success(function(data) {
					console.log("Auth.signin.success!")
					
					 //items = data;
					 //console.log(items);
					//return items;
			    }).error(function(data, status, headers, config) {
			    	//$cordovaProgress.hide();
			    	console.log(config);
							console.log("Auth.signin.error!")
			        		
			    });
		},
		setObsList: function(ListData){

					observationDetails = observationDetails.concat(ListData);
					console.log(observationDetails);
					return null;

		},
		getObsList: function(){
			return observationDetails;
		},
		GetComments: function(obsId){
			//alert(obsId);
			return $http({
					method : "GET",
					url : ApiEndpoint.url + '/comment/getComments?commentHolderId='+obsId+'&rootHolderId='+obsId+'&rootHolderType=species.participation.Observation&commentHolderType=species.participation.Observation&refTime=1403071938526&max=30&timeLine=newer',
					//headers : {"X-Auth-Token":token},
					//params : data,
				}).success(function(data) {
					console.log("Auth.signin.success!")
					//console.log(data);
					 //items = data;
					 //console.log(items);
					//return items;
			    }).error(function(data, status, headers, config) {
							console.log(data);
			        		
			    });
		},
		GetRecommendationVotes: function(obsId){
			return $http({
					method : "GET",
					url : ApiEndpoint.url + '/observation/'+obsId+'/getRecommendationVotes',
					headers : {"X-Auth-Token":token},
					params : {"max":10},
				}).success(function(data) {
					console.log("Auth.signin.success!")
					console.log(data);
					 //items = data;
					 //console.log(items);
					//return items;
			    }).error(function(data, status, headers, config) {
							console.log("Auth.signin.error!")
							console.log(data)
			        		
			    });
		},
		AddRecommendationVotes: function(obsId, paramsData){
			return $http({
					method : "POST",
					url : ApiEndpoint.url + '/observation/'+obsId+'/addRecommendationVote',
					headers : {
						"X-Auth-Token":token,
						"X-AppKey" : appkey
					},
					params : paramsData,
				}).success(function(data) {
					console.log("Auth.signin.success!")
					console.log(data);
					 //items = data;
					 //console.log(items);
					//return items;
			    }).error(function(data, status, headers, config) {
							console.log("Auth.signin.error!")
							console.log(data);
							console.log(config);
							console.log(headers);
			        		
			    });
		},
		RemoveRecommendationVotes: function(obsId, recoId){
			return $http({
					method : "GET",
					url : ApiEndpoint.url + '/observation/'+obsId+'/removeRecommendationVote',
					headers : {
						"X-Auth-Token":token,
						"X-AppKey" : appkey
					},
					params : {"recoId":recoId},
				}).success(function(data) {
					console.log("Auth.signin.success!")
					console.log(data);
					 //items = data;
					 //console.log(items);
					//return items;
			    }).error(function(data, status, headers, config) {
							console.log("Auth.signin.error!")
			        		
			    });
		},
		AgreeRecommendationVotes: function(obsId, recoId){
			return $http({
					method : "GET",
					url : ApiEndpoint.url + '/observation/addAgreeRecommendationVote?',
					headers : {
						"X-Auth-Token":token,
						"X-AppKey" : appkey
					},
					params : {
						"recoId":recoId,
						"obvId" :obsId,

					},
				}).success(function(data) {
					console.log("Auth.signin.success!")
					console.log(data);
					 //items = data;
					 //console.log(items);
					//return items;
			    }).error(function(data, status, headers, config) {
			    	showDailog($ionicPopup,"Please check your internet connection and try after sometime");
			    	console.log(JSON.stringify(data));
							console.log("Auth.signin.error!")
			        		
			    });
		},

		GetActivityFeed: function(obsId, time){
			//alert(time);
			return $http({
					method : "GET",
					url : ApiEndpoint.url + '/activityFeed/getFeeds',
					//headers : {"X-Auth-Token":token},
					params : {
						'rootHolderId' : obsId,
						'rootHolderType':'species.participation.Observation',
						'activityHolderId':'',
						'activityHolderType':'',
						'feedType':'Specific',
						'feedCategory':'',
						'feedClass':'',
						'feedPermission':'editable',
						'feedOrder':'oldestFirst',
						'subRootHolderId':'',
						'subRootHolderType':'',
						'feedHomeObjectId':obsId,
						'feedHomeObjectType':'species.participation.Observation',
						'webaddress':'',
						'userGroupFromUserProfile':'',
						'refreshType':'manual',
						'timeLine':'older',
						'refTime': time,
						//'newerTimeRef':'1440567887119',
						//'olderTimeRef':'1440491857591',
						'user':''

					},
				}).success(function(data) {
					console.log("Auth.signin.success!")
					//console.log(data);
					 //items = data;
					 //console.log(items);
					//return items;
			    }).error(function(data, status, headers, config) {
							console.log(data);
							console.log(config);
			        		
			    });
		},
		GetServerTime: function(){
				return $http({
					method : "GET",
					url : ApiEndpoint.url + '/activityFeed/getServerTime',
					headers : {"X-Auth-Token":token},

				}).success(function(data) {
					console.log("Auth.signin.success!")
					
			    }).error(function(data, status, headers, config) {
							console.log("Auth.signin.error!")
			        		
			    });
		},
		AddComments: function(paramsList){
				return $http({
					method : "POST",
					url : ApiEndpoint.url + '/comment/addComment',
					headers : {
						"X-Auth-Token":token,
						"X-AppKey" : appkey
					},
					params : paramsList,
				}).success(function(data) {
					console.log("Auth.signin.success!")
					console.log(data);
					
			    }).error(function(data, status, headers, config) {
							console.log("Auth.signin.error!")
							console.log(data);
			        		
			    });
		},
		DeleteComment: function(id){
				return $http({
					method : "GET",
					url : ApiEndpoint.url + '/comment/removeComment',
					headers : {
						"X-Auth-Token":token,
						"X-AppKey" : appkey
					},
					params : {"commentId":id},
				}).success(function(data) {
					console.log("Auth.signin.success!")
					console.log(data);
					
			    }).error(function(data, status, headers, config) {
							console.log("Auth.signin.error!")
							console.log(data);
			        		
			    });
		},
		SetIDArrayBrowse: function(arrayOfId){
			arrayID = arrayOfId;
		},
		GetIDArrayBrowse: function(){
			return arrayID;
		},
		SetTrackOrder: function(orderValue){
			orderNumber = orderValue;
		},
		GetTrackOrder: function(){
			return orderNumber;
		}


	};
});

appnService.factory('LocationService', function($q){

	var currentLocation = {
		//latitude:"11.93707847595214",
		//longitude:"79.83552551269528"
		latitude:"",
		longitude:""
	}

	var userSelectLoc = {
		latitude:"",
		longitude:""
	}

	var detailedAdd = '';
		var curntAdd = "";


	return {
		/*GetLocation : function(){
				var d = $q.defer();
				//console.log(d);
				alert('came');
			navigator.geolocation.getCurrentPosition(function (pos) {
            currentLocation.latitude = pos.coords.latitude;
            currentLocation.longitude = pos.coords.longitude;
            d.resolve(currentLocation);
        },function(err){

        	alert("err"+JSON.stringify(err));
        }, {
                    enableHighAccuracy: true,
                    timeout: 30000,
                    maximumAge: 10000
                });
        return d.promise
	},*/
	setCurrentLocation: function(laat, loong){
		 currentLocation.latitude = laat;
		 currentLocation.longitude = loong;
		 //alert(laat+" "+loong);
	},
	getCurrentLocation: function(){
		//alert(JSON.stringify(currentLocation));
		return currentLocation;
	},
	SetUserSelectedLocation: function(data){
		//alert(data.G);
		userSelectLoc.latitude = data.H;
		userSelectLoc.longitude = data.L;
		return null;
	},
	GetUserSelectedLocation: function(){
		return userSelectLoc;
	},
	SetUserSelectedLocAdd: function(address){
		detailedAdd = address;
	},
	GetUserSelectedLocAdd: function(){
		return detailedAdd ;
	},
	SetCurrentAdd: function(addVal){
		curntAdd = addVal;
	},
	GetCurrentAdd: function(){
		return curntAdd ;
	}
	};


});

appnService.factory('NotificationService', function($http,ApiEndpoint){

	if(localStorage.getItem('USER_KEY') !== null){
	  var tokenvar = localStorage.getItem('USER_KEY');
      var tokenvar1 = JSON.parse(tokenvar);
      var token = tokenvar1.userKey;
  	}

	return {
		GetTokens: function(){
				return $http({
					method : "GET",
					url : ApiEndpoint.url + '/pushNotification/pushTokenlist',
					headers : {
						"X-Auth-Token":token
					},
				}).success(function(data) {
					console.log("Auth.signin.success!")
				
					 //console.log(data);
					//return items;
			    }).error(function(data, status, headers, config) {
							console.log("Auth.signin.error!")
			        		
			    });
		},
		setTokenDetails: function(tokenText){
				return $http({
					method : "POST",
					url : ApiEndpoint.url + '/pushNotification/save',
					headers : {
						"X-Auth-Token":token
					},
					params : tokenText,
				}).success(function(data) {
					console.log("Auth.signin.success!")
				
					 //console.log(data);
					//return items;
			    }).error(function(data, status, headers, config) {
							console.log(JSON.stringify(data));
			        		
			    });
		},
		GetListNotifications: function(paramsData){
				return $http({
					method : "GET",
					url : ApiEndpoint.url + '/pushNotification/list',
					headers : {
						"X-Auth-Token":token
					},
					params : paramsData
				}).success(function(data) {
					console.log("Auth.signin.success!")
				
					 //console.log(data);
					//return items;
			    }).error(function(data, status, headers, config) {
			    	  $(".modal1").hide();

							console.log(JSON.stringify(data));
			        		
			    });
		},
		SaveTokens: function(tokenVal){
				return $http({
					method : "POST",
					url : ApiEndpoint.url + '/pushNotification/pushTokensave',
					headers : {
						//"X-Auth-Token":token
					},
					params : {"deviceToken":tokenVal}
				}).success(function(data) {
					console.log("Auth.signin.success!")
				
					 //console.log(data);
					//return items;
			    }).error(function(data, status, headers, config) {
			    	  $(".modal1").hide();

							//alert(JSON.stringify(data));
			        		
			    });
		},
		GetAppVersion: function(){
				return $http({
					method : "GET",
					url : ApiEndpoint.url + '/pushNotification/getappVersion',
					headers : {
						//"X-Auth-Token":token
					},
					//params : {"deviceToken":tokenVal}
				}).success(function(data) {
					console.log("Auth.signin.success!")
				
					 //console.log(data);
					//return items;
			    }).error(function(data, status, headers, config) {
			    	  $(".modal1").hide();

							//alert(JSON.stringify(data));
			        		
			    });
		}


	};
});

appnService.factory('UserGroupService', function($http,ApiEndpoint,$cordovaProgress){

	var tokenvar = localStorage.getItem('USER_KEY');
      var tokenvar1 = JSON.parse(tokenvar);
      var token = tokenvar1.userKey;
      //alert(token);
      var userId = tokenvar1.userID;
      var appkey = "a4fbb540-0385-4fff-b5da-590ddb9e2552";
      //alert(userId);
      var userGroups;
      var groupList;

	return {
		GetUserGroups: function(data){
				return $http({
					method : "GET",
					url : ApiEndpoint.url + '/group/list',
					headers : {
						"X-Auth-Token":token
					},
					params : data,
					//param : {"max":50,"format":"json"}
				}).success(function(data) {
					console.log("Auth.signin.success!")
				
					 //console.log(data);
					//return items;
			    }).error(function(data, status, headers, config) {
			    	$cordovaProgress.hide();
							console.log("Auth.signin.error!")
			        		
			    });
		},
		GetJoinedGroups: function(){
			return $http({
					method : "GET",
					url : ApiEndpoint.url + '/userGroup/getUserUserGroups',
					headers : {"X-Auth-Token":token},
					params : {"limit":50,"id":parseInt(userId)}
				}).success(function(data) {
					console.log("Auth.signin.success!")
				
					 //console.log(data);
					//return items;
			    }).error(function(data, status, headers, config) {
							console.log("get usrgrp error")
			        		
			    });
		},
		JoinGroup: function(id){
			console.log(token);
			return $http({
					method : "GET",
					url : ApiEndpoint.url + '/group/'+ id +'/joinUs',
					headers : {
						"X-Auth-Token":token,
						"X-AppKey":appkey
					}
					//params : {"id":id}
				}).success(function(data) {
					console.log("joining success!")
				
					 //console.log(data);
					//return items;
			    }).error(function(data, status, headers, config) {
							console.log("joining error!")
							console.log(data);
				        		
			    });
		},
		PostToGroup: function(param){
			console.log(param);
			return $http({
					method : "POST",
					url : ApiEndpoint.url + '/userGroup/bulkPost',
					headers : {
						"X-Auth-Token":token,
						"X-AppKey":appkey
					},
					params : param,
					//params : {"id":id}
				}).success(function(data) {
					console.log("joining success!")
				
					 console.log(data);
					 alert("success")
					//return items;
			    }).error(function(data, status, headers, config) {
							console.log("joining error!")
							console.log(data);
				        		
			    });
		},
		SetUserJoinGroups: function(groups){

			userGroups = groups;
			return null;
		},
		GetUserJoinGroups: function(){
			return userGroups;
		},
		SetUserGroups : function(userGroup){

			groupList = userGroup;
			return null;
		},
		GetUserGroupsList: function(){
			return groupList;
		}
	};

});

appnService.factory('NewObservationService', function($http,ApiEndpoint, $ionicPopup){

	  var tokenvar = localStorage.getItem('USER_KEY');
	  var tokenvar1 = JSON.parse(tokenvar);
	  var token = tokenvar1.userKey;
	  var userId = tokenvar1.userID;
	  //var id = tokenvar1.nId;
	  var appkey = "a4fbb540-0385-4fff-b5da-590ddb9e2552";//"fc9a88b5-fac9-4f01-bc12-70e148f40a7f";
	  var statusDetails = [];
	  var obsDetailVals = [];
	 

	  return {
	  	SubmitObservation: function(paramsData){
				return $http({
					method : "POST",
					url : ApiEndpoint.url + '/observation/save',
					headers : {
						"X-Auth-Token":token,
						"X-AppKey":appkey
					},
					params : paramsData
				}).success(function(data) {
					console.log("Obs submitted!")
				
					 //console.log(data);
					//return items;
			    }).error(function(data, status, headers, config) {
			    	//showDailog($ionicPopup,"Unknown error while submiting observation, Please try again later");
							console.log("submission error");
							console.log("data"+data);
							console.log("headers"+headers);
							console.log("config"+config);
							//SetStatus("FAILURE");
			        		
			    });
		},
		/*SetStatus: function(sName, cName, status, date, location, notes, imageArray){
			
			alert(id);
			if(id==0){
				id++;
				statusDetails.push({"id":id, "sciName":sName, "commonName":cName, "status":status, "date":date, "location":location, "notes":notes, "imgArr":imageArray});
				localStorage.setItem('StatusArray',JSON.stringify(statusDetails));
				return;
			} else{
				id++;
				alert("statusfun");
				var getStatusVal = 	localStorage.getItem('StatusArray');
				var parsed = JSON.parse(getStatusVal);
				alert(parsed);

				parsed.push({"id":id, "sciName":sName, "commonName":cName, "status":status, "date":date, "location":location, "notes":notes, "imgArr":imageArray});

				//getStatusVal.push({"id":id, "sciName":sName, "commonName":cName, "status":status, "date":date, "location":location, "notes":notes, "imgArr":imageArray});

				localStorage.setItem('StatusArray',JSON.stringify(parsed));
				return;
			}
			
			tokenvar1.nId = id;
			//statusDetails.push({"id":id, "sciName":sName, "commonName":cName, "status":status, "date":date, "location":location, "notes":notes, "imgArr":imageArray});
			//localStorage.setItem('StatusArray',JSON.stringify(statusDetails));
			
			localStorage.setItem('USER_KEY',JSON.stringify(tokenvar1));
			return null;
		},*/
		SetDetails: function(details){
			 statusDetails = details;
		},
		GetDetails: function(){
			return statusDetails;
		},
		SetEditObsDetails: function(obsDetails){
			//alert("editdetails");
			obsDetailVals = obsDetails;
		},
		GetEditObsDetails: function(){
			return obsDetailVals;
		},
		DeleteObservation: function(id){
			return $http({
					method : "POST",
					url : ApiEndpoint.url + '/observation/'+id+'/flagDeleted',
					headers : {
						"X-Auth-Token":token,
						"X-AppKey":appkey
					}
					//params : paramsData
				}).success(function(data) {
					console.log("Obs deleted!")
				
					 //console.log(data);
					//return items;
			    }).error(function(data, status, headers, config) {
			    	//showDailog($ionicPopup,"Unknown error while Deleting observation, Please try again later");
							console.log("submission error");
							console.log("data"+JSON.stringify(data));
							console.log("headers"+headers);
							console.log("config"+config);
							//SetStatus("FAILURE");
			        		
			    });
		},
		EditSubmitObservation: function(paramsData,id){
			//alert(id);
			//alert(JSON.stringify(paramsData));
			
				return $http({
					method : "PUT",
					url : ApiEndpoint.url + '/observation/'+id,
					headers : {
						"X-Auth-Token":token,
						"X-AppKey":appkey
					},
					params : paramsData
				}).success(function(data) {
					console.log("Obs submitted!")
				
					 //console.log(data);
					//return items;
			    }).error(function(data, status, headers, config) {
			    	//alert("edit error");
			    	//showDailog($ionicPopup,"Unknown error while editing observation, Please try again later");
							console.log("submission error");
							console.log("data"+data);
							console.log("headers"+headers);
							console.log("config"+config);
							//SetStatus("FAILURE");
			        		
			    });
		}
	  };



});

 function showDailog($ionicPopup,message){

      $ionicPopup.alert({
          title: 'ERROR',
          content: message//'You must submit atleast one image'
        });
    }










var app = angular.module('app', []);
app.factory('getFighterCards', function ($http) {

  var API_ROOT = 'fighters'
  return {
    get: function () {
      return $http
        .get(API_ROOT)
        .then(function (resp) {
          return resp.data
        })
    }
  }

});

app.controller('mainCtrl', function($scope, $http, getFighterCards) {

  $scope.formData = {
    hp: 50,
    agility: 50,
    strength: 50,
    magic: 50
  };

  $scope.fighters = [];
  $scope.selectedFighters = [];

  $scope.headOptions = [
    {ext: '1.png'},
    {ext: '2.jpg'},
    {ext: '1.png'},
    {ext: '2.jpg'},
    {ext: '1.png'},
    {ext: '2.jpg'}
  ];

  $scope.bodyOptions = [
    {ext: '1.png'},
    {ext: '2.jpg'},
    {ext: 'male.png'}
  ];

  $scope.weaponOptions = [
    {ext: '1.png'},
    {ext: '2.png'},
    {ext: '3.png'}
  ];

  getFighterCards.get()
    .then(function (data) {
      console.log('hello');
      $scope.fighters = data;
      console.log($scope.fighters);
    });

  $scope.addFighter = function() {
    //check for valid formData, if not, reject the request
    $http({
       url: 'fighters',
       method: "POST",
       data: $scope.formData
    }).success(function(data, status, headers, config) {
      console.log("Post Fighter Success", data);
    }).error(function(data, status, headers, config) {
      console.log("Post Fighter Failed");
    });
    $scope.fighters.push($scope.formData);
    $scope.formData = {
      hp: 50,
      agility: 50,
      strength: 50,
      magic: 50
    };
    $scope.editMode = false;
  }

  $scope.createFighter = function() {
    $scope.editMode = true;
  }

  $scope.setHead = function(head) {
    $scope.formData.head = JSON.parse(JSON.stringify(head));
  }
  $scope.setBody = function(body) {
    $scope.formData.body = JSON.parse(JSON.stringify(body));
  }
  $scope.setWeapon = function(weapon) {
    console.log(weapon);
    $scope.formData.weapon = JSON.parse(JSON.stringify(weapon));
  }
  
  $scope.updateStats = function(attr1, attr2, type) {
    console.log('update stats');
      if (attr1 + attr2 > 100) {
        $scope.formData[type] = 100 - attr1;
      }
  }
  
  $scope.selectFighter = function(f) {
    if ($scope.selectedFighters.length && f == $scope.selectedFighters[0]) {
      $scope.selectedFighters = [];
      return;
    }
    $scope.selectedFighters.push(f);
    if ($scope.selectedFighters.length == 2) {
      $scope.startBattle();
    }
  }
  
  $scope.startBattle = function() {
    console.log("LOL");
  }

});

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function getFormattedTime() {
    var d = new Date();
    var date = (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear();
    var meridian = 'AM';
    var h = addZero(d.getHours());
    if (parseInt(h) > 12) { h = parseInt(h) - 12; meridian = 'PM'; }
    var m = addZero(d.getMinutes());
    return date + ' at ' + h + ":" + m + ' ' + meridian;
}


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
  $scope.fighterCheckBox = [];
  
  $scope.remainingHP = [];
  $scope.battleHistory = [];
  $scope.lastAction = '';
  $scope.currentFighter = 0;
  $scope.gameOver= false;
  $scope.battleCounter = 0;

  $scope.headOptions = [
    {ext: '1.gif'},
    {ext: '2.gif'},
    {ext: '3.jpg'},
    {ext: '4.jpg'},
    {ext: '5.png'},
    {ext: '1.png'},
    {ext: 'clement.png'},
    {ext: '2.jpg'}
    
  ];

  $scope.bodyOptions = [
    {ext: 'female.png'},
    {ext: 'male.png'},
    {ext: '1.jpg'},
    {ext: 'goku.png'}
  ];

  $scope.weaponOptions = [
    {ext: '3.png'},
    {ext: '4.jpg'},
    {ext: 'chainsaw.jpg'},
    {ext: 'rod.png'}
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
    $scope.battleHistory = []
    $scope.battleMode = true;
    $scope.battleCounter = 1;
    
    var startStr = 'A battle has started between ' + $scope.selectedFighters[0].name
     + ' and ' + $scope.selectedFighters[1].name + '!!!';
    $scope.battleHistory.push(startStr)
    $scope.remainingHP = [$scope.selectedFighters[0].hp, $scope.selectedFighters[1].hp]
    if ($scope.selectedFighters[0].agility > $scope.selectedFighters[1].agility) {
      $scope.currentFighter = 0;
      $scope.lastAction = $scope.selectedFighters[0].name + ' goes first';
    } else {
      $scope.currentFighter = 1;
      $scope.lastAction = $scope.selectedFighters[1].name + ' goes first';
    }
    setTimeout(function() {
      for (let i=0; i < $scope.fighterCheckBox.length; i++) {
        $scope.fighterCheckBox[i] = false;
      }
    }, 100);
  }
  
  $scope.nextBattleAction = function() {
    
    var criticalHit = false;
    var opponent = ($scope.currentFighter + 1) % 2
    var damageDealt = 0;
    var multiplier = 1;
    
    damageDealt = 3 + Math.floor($scope.selectedFighters[$scope.currentFighter].strength / 3);
    
    criticalHit = Math.floor(Math.random() * 100) <= $scope.selectedFighters[$scope.currentFighter].magic
    
    if (criticalHit) {
      var multiplier = Math.floor(Math.random() * 2 + 2.25);
      damageDealt *= multiplier;
    }
    
    
    $scope.remainingHP[opponent] -= damageDealt;
    $scope.battleHistory.unshift($scope.lastAction);
    $scope.lastAction = $scope.selectedFighters[$scope.currentFighter].name    + ' hit ' +
      $scope.selectedFighters[opponent].name + ' for ' + damageDealt + '!!!';
    
    if (criticalHit) {
      $scope.lastAction = 'CRITICAL HIT X' + multiplier + '!!! ' + $scope.lastAction;
    }
    
    $scope.lastAction = $scope.battleCounter + ': ' + $scope.lastAction
    
    if ($scope.remainingHP[opponent] <= 0) {
      $scope.gameOver = true;
      $scope.battleHistory.unshift($scope.lastAction);
      $scope.lastAction = $scope.selectedFighters[$scope.currentFighter].name + ' WINS!!!'
      
    }
    
    $scope.currentFighter = opponent;
    $scope.battleCounter++;
    
    
  }
  
  $scope.endBattle = function() {
    $scope.selectedFighters = [];
    $scope.battleMode = false;
    $scope.gameOver = false;
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


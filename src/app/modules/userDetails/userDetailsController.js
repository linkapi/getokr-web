'use strict'

var appModule = require('../../appModule');

appModule.controller('userDetailsController', UserDetailsController);

UserDetailsController.$inject = ['objectiveService', '$localStorage', 'userService', 'planningSessionService', 'modalService', 'keyResultService', '$stateParams', '$window', 'mainService', 'companyService', '$location', 'notificationService']

function UserDetailsController(objectiveService, $localStorage, userService, planningSessionService, modalService, keyResultService, $stateParams, $window, mainService, companyService, $location, notificationService) {
  this.objectiveService = objectiveService
  this.$localStorage = $localStorage
  this.userService = userService
  this.planningSessionService = planningSessionService
  this.modalService = modalService
  this.keyResultService = keyResultService
  this.$stateParams = $stateParams
  this.$window = $window
  this.mainService = mainService
  this.companyService = companyService
  this.$location = $location
  this.notificationService = notificationService
  this.objectives = []
  this.notificationObjectives = []
  this.userLogged = userService.getUserFactory()
  this.initialize()
}

UserDetailsController.prototype.initialize = function () {
  var that = this

  if (this.planningSessionService.getPlanningFactory()) {
    this.selectedPlanning = this.planningSessionService.getPlanningFactory()
    this.$localStorage.planning = this.selectedPlanning;
    that.loadUser()
  } else if (this.$localStorage.planning) {
    this.selectedPlanning = this.$localStorage.planning
    that.loadUser()
  } else {
    var query = {
      type: 'company'
    }
    this.planningSessionService.getPlanningsByType(query)
      .then(function (res) {
        that.selectedPlanning = res.data[res.data.length - 1]
        that.loadUser()
      })
      .catch(function (err) {
        console.log(err)
      })

  }

}

UserDetailsController.prototype.verifyPermission = function (objective, index, type) {
  var that = this

  if (objective.public)
    return true

  if (type == 'owner') {
    if (objective.owner._id == this.userLogged._id)
      return true
    else
      this.objectives.ownerObjectives.splice(index, 1)
  } else {
    var isContributor = false

    _.forEach(objective.contributors, function (contributor) {
      if (contributor._id == that.userLogged._id)
        isContributor = true
    })

    if (isContributor)
      return true

    this.objectives.contributorObjectives.splice(index, 1)
  }

  return false
}

UserDetailsController.prototype.loadUser = function () {
  var that = this

  this.userService.getUserById(this.$stateParams.id)
    .then(function (res) {
      that.user = res.data

      if (that.selectedPlanning) {
        if (that.selectedPlanning.childPlannings.length) {
          if (that.$localStorage.selectedPlanning) {
            that.selectedPlanning = JSON.parse(that.$localStorage.selectedPlanning)
          } else {
            that.selectedPlanning = that.selectedPlanning.childPlannings[that.selectedPlanning.childPlannings.length - 1]
          }
        }
      }

      that.getObjectives(that.selectedPlanning);
      that.getCompany();

    })
    .catch(function (err) {
      console.log(err)
    })
}

UserDetailsController.prototype.getObjectives = function (selectedPlanning) {
  if (!selectedPlanning)
    return;

  var that = this;
  var query = {}

  query.planning = selectedPlanning._id
  query.deactivate = false

  that.objectiveService.getObjectivesByPlanning(query)
    .then(function (res) {
      that.getUserObjectives(res.data)
      that.checkIns = that.getCheckIns(that.objectives)
      that.verifyCheckInsNotifications(that.objectives)
    })
    .catch(function (err) {
      console.log(err)
    })

}

UserDetailsController.prototype.getCompany = function () {
  var that = this;

  that.companyService.findCompanyById(that.user.company)
    .then(function (res) {
      that.company = res.data

    })
    .catch(function (err) {
      console.log(err)
    })

}


UserDetailsController.prototype.getUserObjectives = function (allObjectives) {
  var that = this,
    isNotContributor = true

  _.remove(allObjectives, function (objective) {
    isNotContributor = true
    if (objective.contributors.length)
      _.forEach(objective.contributors, function (contributor) {
        if (contributor._id == that.user._id) {
          isNotContributor = false
        }
      })
    if (objective.owner && that.user._id)
      return objective.owner._id != that.user._id && isNotContributor
  })

  _.remove(allObjectives, function (objective) {
    return objective.hierarchy == 'main'
  })

  that.user.objectives = allObjectives;

  that.objectives.ownerObjectives = []
  that.objectives.contributorObjectives = []
  that.objectives.mainObjectives = []

  _.forEach(that.user.objectives, function (obj) {
    if (obj.ownerType == 'user') {
      if (obj.owner._id == that.user._id)
        that.objectives.ownerObjectives.push(obj)
      else
        that.objectives.contributorObjectives.push(obj)
    }

    if (obj.mainObjective)
      that.objectiveService.getObjectiveById(obj.mainObjective._id)
        .then(function (res) {
          var exists = false
          _.forEach(that.objectives.mainObjectives, function (mainObj) {
            if (res.data._id == mainObj._id)
              exists = true
          })
          if (!exists)
            that.objectives.mainObjectives.push(res.data)
        })
        .catch(function (err) {
          console.log(err)
        })
  })
}

UserDetailsController.prototype.getCheckIns = function (objectives) {
  var checkIns = [],
    that = this,
    allObjectives = []

  Array.prototype.push.apply(allObjectives, objectives.ownerObjectives)
  Array.prototype.push.apply(allObjectives, objectives.contributorObjectives)

  _.forEach(allObjectives, function (objective) {
    _.forEach(objective.keyResults, function (key) {
      if (key._id.isActive)
        _.forEach(key._id.checkIns, function (checkIn) {
          if (checkIn._id)
            if (checkIn._id.createdBy == that.user._id) {
              checkIn._id.key = key._id.name
              checkIn._id.format = key._id.format
              checkIns.push(checkIn._id)
            }
        })
    })
  })

  checkIns = _.sortBy(checkIns, function (o) {
    return new moment(o.insertDate);
  }).reverse();

  return checkIns.slice(0, 20)
}

UserDetailsController.prototype.getInitials = function (ownerObj) {
  var first,
    last

  first = this.user.firstName ? this.user.firstName[0].toUpperCase() : ''
  last = this.user.lastName ? this.user.lastName[0].toUpperCase() : ''

  return first + last
}

UserDetailsController.prototype.changeProgressBarStatus = function (object) {
  var progress = object,
    progressBar,
    bar

  if (!this.company.customize || !this.company.customize.progressBar.length)
    return 'progress-bar-success';
  else {
    bar = _.find(this.company.customize.progressBar, function (o) {
      if (parseInt(o.begin) <= progress && progress <= parseInt(o.end))
        return o
    });
    if (!bar) {
      _.forEach(this.company.customize.progressBar, function (o) {
        if (o.end == 100)
          bar = o
      })
      return bar.color
    }
    return bar.color
  }

}

UserDetailsController.prototype.calculateUserPerformance = function () {
  var that = this,
    allObjectives = [],
    objectivesProgressSum = 0,
    keysProgressSum = 0

  Array.prototype.push.apply(allObjectives, that.objectives.ownerObjectives)
  Array.prototype.push.apply(allObjectives, that.objectives.contributorObjectives)

  if (!allObjectives.length)
    return 0

  _.forEach(allObjectives, function (objective) {
    objectivesProgressSum += Number(objective.progress)
  })

  return (objectivesProgressSum / allObjectives.length).toFixed(0)

}

UserDetailsController.prototype.objectiveDetails = function (objective, event) {
  var that = this

  this.planningSessionService.setPlanningFactory(this.selectedPlanning)
  that.objectiveService.setObjectiveFactory(objective)
  //that.$location.path('/objective/' + objective._id)
  if (event.ctrlKey)
    that.$window.open('#/objective/' + objective._id)
  else
    that.$location.path('/objective/' + objective._id)

  this.mixpanel('Clicou no objetivo para visualizar seus detalhes')
};

UserDetailsController.prototype.formatDate = function (date) {
  return moment(date).format('L')
}

UserDetailsController.prototype.formatTime = function (date) {
  return moment(date).format('LT')
}

UserDetailsController.prototype.verifyLogicalKeyStatus = function (key) {
  var that = this,
    result

  _.forEach(that.objectives.ownerObjectives, function (ownerObj) {
    _.forEach(ownerObj.keyResults, function (keyResult) {
      if (keyResult._id.name == key) {
        if (keyResult._id.finished)
          result = 'Concluído'
        else
          result = 'Não concluído'
      }
    })
  })

  if (result == 'Concluído' || result == 'Não concluído')
    return result

  _.forEach(that.objectives.contributorObjectives, function (contributorObj) {
    _.forEach(contributorObj.keyResults, function (keyResult) {
      if (keyResult._id.name == key) {
        if (keyResult._id.finished)
          result = 'Concluído'
        else
          result = 'Não concluído'
      }
    })
  })

  return result
}

UserDetailsController.prototype.verifyCheckInsNotifications = function (objectives) {
  var that = this,
    date = new Date(),
    allObjectives = [],
    notification = {}

  Array.prototype.push.apply(allObjectives, objectives.ownerObjectives)
  Array.prototype.push.apply(allObjectives, objectives.contributorObjectives)

  _.forEach(allObjectives, function (objective) {
    var existsCheckin = false
    if (!objective.keyResults.length)
      existsCheckin = true
    _.forEach(objective.keyResults, function (keyResult) {
      moment.locale('pt-br');
      var inicio = keyResult._id.updateDate,
        days = moment().diff(inicio, 'days'),
        count,
        result

      if (days < 7) {
        existsCheckin = true
        return false
      }
    })
    if (!existsCheckin) {
      that.showNotification = true
      that.notificationObjectives.push(objective)
      that.notificationObjectives.length

    }
  })
}

UserDetailsController.prototype.mixpanel = function (msg) {
  mixpanel.track(msg);
}

'use strict'

var appModule = require('../../appModule')
var _ = require('lodash')

appModule.controller('teamController', TeamController)

TeamController.$inject = ['$rootScope', 'modalService', 'planningSessionService', 'objectiveService', 'mainService', 'companyService', 'keyResultService', 'userService', 'tagService', '$location', '$localStorage', '$window'];

function TeamController($rootScope, modalService, planningSessionService, objectiveService, mainService, companyService, keyResultService, userService, tagService, $location, $localStorage, $window) {
    this.$rootScope = $rootScope
    this.modalService = modalService
    this.planningSessionService = planningSessionService
    this.objectiveService = objectiveService
    this.mainService = mainService
    this.companyService = companyService
    this.keyResultService = keyResultService
    this.userService = userService
    this.tagService = tagService
    this.$location = $location
    this.$localStorage = $localStorage
    this.$window = $window
    this.plannings = []
    this.companyPlannings = []
    this.objectives = []
    this.keyResults = []
    this.users = []
    this.tags = []
    this.loadView = false
    this.tagsForSelection = []
    this.selectedObjective = {}
    this.selectedFilterTab = 'tags'
    this.filter = {
        company: userService.getUserFactory().company,
        tags: [],
        owner: [],
        hierarchy: ''
    }

    var that = this

    this.$rootScope.$on('newPlanning', function (event, args) {
        that.selectedPlanning = angular.copy(that.planningSessionService.getPlanningFactory())
        that.initialize()
    })

    this.$rootScope.$on('editPlanning', function (event, args) {
        that.filterChildPlannings(args)
        that.selectedCompanyPlanning = args
        that.loadObjectives()
        that.saveSelectedCompanyPlanning()

    });

    this.$rootScope.$on('cfpLoadingBar:completed', function (event, args) {
        that.loadView = true
    })

    this.$rootScope.$on('cfpLoadingBar:started', function (event, args) {
        that.loadView = false
    })

    this.$rootScope.$on('cfpLoadingBar:loading', function (event, args) {
        that.loadView = false
    })

    this.initialize()
}

TeamController.prototype.initialize = function () {
    var that = this

    this.user = this.userService.getUserFactory()
    this.planningSessionService.setPlanningHierarchyFactory('')

    this.companyService.findCompanyById(this.user.company)
        .then(function (res) {
            that.company = res.data
        })
        .catch(function (err) {
            console.log(err)
        })

    this.companyService.getCompanyUsers()
        .then(function (res) {
            that.usersFilter = _.forEach(res.data, function (user) {
                user.customName = user.firstName + ' ' + user.lastName
            })
        })
        .catch(function (err) {
            console.log(err)
        })

    this.loadPlannings()
    this.loadUsers()

}

TeamController.prototype.loadUsers = function () {
    var that = this,
        query = {}

    query.filter = that.filter.owner

    this.companyService.getCompanyUsers(query)
        .then(function (res) {
            that.users = res.data

            that.userService.setUsersListFactory(that.users)
            that.loadObjectives()
        })
        .catch(function (err) {
            console.log(err)
        })
}

TeamController.prototype.loadPlannings = function () {
    var that = this

    var query = {
        type: 'company'
    }

    that.planningSessionService.getPlanningsByType(query)
        .then(function (res) {
            that.companyPlannings = res.data

            if (!that.companyPlannings)
                return

            if (that.$localStorage.selectedCompanyPlanning != undefined) {
                that.selectedCompanyPlanning = JSON.parse(that.$localStorage.selectedCompanyPlanning)

                that.planningSessionService.getPlanningById(that.selectedCompanyPlanning)
                    .then(function (res) {
                        that.selectedCompanyPlanning = res.data
                        that.plannings = that.selectedCompanyPlanning.childPlannings

                        that.saveSelectedCompanyPlanning()
                        that.setSelectedPlanning(that.selectedCompanyPlanning)
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            } else {
                that.selectedCompanyPlanning = that.companyPlannings[that.companyPlannings.length - 1]
                if (that.selectedCompanyPlanning) {
                    that.plannings = that.selectedCompanyPlanning.childPlannings
                    that.saveSelectedCompanyPlanning()
                    that.setSelectedPlanning(that.selectedCompanyPlanning)
                }
            }
        })
        .catch(function (err) {
            console.log(err)
        })
}

TeamController.prototype.setSelectedPlanning = function (selectedCompanyPlanning) {
    var that = this

    if (that.selectedCompanyPlanning.childPlannings) {
        that.filterChildPlannings(that.selectedCompanyPlanning)

        if (that.$localStorage.selectedPlanning != undefined)
            that.selectedPlanning = JSON.parse(that.$localStorage.selectedPlanning)

        if (!that.selectedPlanning) {
            that.selectedPlanning = that.plannings[that.plannings.length - 1]
            that.saveSelectedObjectivePlanning()
        }
    }
    that.loadObjectives()
}

TeamController.prototype.loadObjectives = function () {
    var that = this,
        query = {},
        planningId

    that.planningSessionService.setCompanyPlanningFactory(that.selectedCompanyPlanning)

    that.filter.hierarchy = "!main"

    if (!that.selectedPlanning || !that.plannings.length)
        return

    planningId = that.selectedPlanning._id

    if (that.selectedCompanyPlanning && !that.selectedPlanning._id) {
        that.selectedPlanning = that.selectedCompanyPlanning.childPlannings[that.selectedCompanyPlanning.childPlannings.length - 1]

        if (that.selectedCompanyPlanning.childPlannings.length)
            planningId = that.selectedPlanning._id || that.selectedPlanning.data._id
        else
            that.objectives = []
    } else
        that.objectives = []

    query.planning = planningId
    query.deactivate = false

    that.objectiveService.getObjectivesByPlanning(query)
        .then(function (res) {
            _.forEach(that.users, function (user) {
                that.getUsersObjectives(res.data, user)
            })
        })
        .catch(function (err) {
            console.log(err)
        })
}

TeamController.prototype.getUsersObjectives = function (allObjectives, user) {
    var that = this

    user.objectives = _.filter(allObjectives, function (objective) {
        var isNotContributor = true
        if (objective.hierarchy == 'main')
            return false
        if (objective.ownerType == 'user') {
            if (objective.contributors.length)
                _.forEach(objective.contributors, function (contributor) {
                    if (contributor._id == user._id)
                        isNotContributor = false
                })
            return objective.owner._id == user._id || !isNotContributor
        } else
            return false

    })

    if (!user.objectives)
        return

    user.ownerObjectives = []
    user.contributorObjectives = []

    _.forEach(user.objectives, function (obj) {
        if (obj.ownerType == 'user') {
            if (obj.owner._id == user._id)
                user.ownerObjectives.push(obj)
            else
                user.contributorObjectives.push(obj)
        }
    })
}

TeamController.prototype.calculateUserPerformance = function (user) {
    var that = this,
        allObjectives = [],
        objectivesProgressSum = 0

    if (!user.ownerObjectives || !user.contributorObjectives)
        return

    if (user.ownerObjectives.length == 0 && user.contributorObjectives.length == 0)
        return

    Array.prototype.push.apply(allObjectives, user.ownerObjectives)
    Array.prototype.push.apply(allObjectives, user.contributorObjectives)

    _.forEach(allObjectives, function (objective) {
        objectivesProgressSum += Number(objective.progress)
    })
    return (objectivesProgressSum / allObjectives.length).toFixed(0)
}

TeamController.prototype.showEndMessage = function (planning) {
    var that = this

    that.endPlanningMessage(planning.type, function (isConfirm) {
        if (isConfirm) {
            that.keepObjectivesMessage(function (isConfirm) {
                if (isConfirm)
                    that.endPlanning(planning, isConfirm)
                else
                    that.endPlanning(planning, isConfirm)
            })
        }
    })
    this.mixpanel('Clicou no ícone para encerrar o ciclo')
}

TeamController.prototype.endPlanningMessage = function (type, callback) {
    swal({
        title: type == 'objective' ? "Você está prestes a encerrar o ciclo tático" : "Você está prestes a encerrar o ciclo estratégico",
        text: "Este ciclo continuará disponível somente para visualização, tem certeza que deseja encerrá-lo?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#86AF49",
        confirmButtonText: "Encerrar",
        cancelButtonText: "Cancelar",
        cancelButtonColor: "DD6B55",
        closeOnConfirm: false,
        closeOnCancel: true
    }, callback)


}

TeamController.prototype.keepObjectivesMessage = function (callback) {
    swal({
        title: "Os objetivos do ciclo ficarão disponíveis somente para visualização",
        text: "Deseja dar continuidade aos objetivos deste ciclo no novo ciclo?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#86AF49",
        confirmButtonText: "Sim, desejo!",
        cancelButtonText: "Não",
        closeOnConfirm: true,
        closeOnCancel: true
    }, callback)
}

TeamController.prototype.endPlanning = function (planning, keepObjectives) {
    var that = this,
        endingPlanning = {}

    planning.isFinished = true

    if (keepObjectives && planning.type == 'objective')
        endingPlanning.objectivesToKeep = that.objectivesToKeep

    if (keepObjectives && planning.type == 'company') {
        endingPlanning.objectivesToKeep = that.objectives
        endingPlanning.tacticalCiclesToKeep = planning.childPlannings
    }

    if (planning.type != 'company')
        endingPlanning.companyPlanning = this.selectedCompanyPlanning

    that.planningSessionService.updatePlanning(planning)
        .then(function (data) {})
        .catch(function (err) {
            console.log(err);
        });

    if (planning.type == 'objective')
        that.planningSessionService.setPlanningTypeFactory('objective')
    else
        that.planningSessionService.setPlanningTypeFactory('company')

    that.planningSessionService.setPlanningFactory('')
    that.planningSessionService.setPlanningListFactory(that.plannings)
    that.modalService.searchModal('addPlanning', endingPlanning);
}

TeamController.prototype.addObjective = function () {
    this.objectiveService.setMyOkrFactory(this.selectedTab)
    this.planningSessionService.setPlanningFactory(this.selectedPlanning)
    this.objectiveService.setObjectiveFactory()
    this.modalService.searchModal('addObjective');
}

TeamController.prototype.editObjective = function (objective) {
    this.objectiveService.setMyOkrFactory(this.selectedTab)
    this.planningSessionService.setPlanningFactory(this.selectedPlanning)
    this.objectiveService.setObjectiveFactory(objective)
    this.modalService.searchModal('editObjective');
}

TeamController.prototype.addKeyResult = function (objective) {
    this.objectiveService.setObjectiveFactory(objective)
    this.keyResultService.setKeyResultFactory()
    this.modalService.searchModal('addKeyResult');
}

TeamController.prototype.addSession = function () {
    this.planningSessionService.setPlanningFactory()
    this.planningSessionService.setPlanningTypeFactory('objective')
    this.planningSessionService.setPlanningListFactory(this.plannings)
    this.modalService.searchModal('addPlanning', this.selectedCompanyPlanning)

}

TeamController.prototype.addCompanySession = function () {
    this.planningSessionService.setPlanningFactory()
    this.planningSessionService.setPlanningTypeFactory('company')
    this.modalService.searchModal('addPlanning');
    this.mixpanel('Clicou no botão "+criar novo" para criar um ciclo estratégico para a empresa')
}

TeamController.prototype.editKeyResult = function (key, objective) {
    this.objectiveService.setObjectiveFactory(objective)
    this.keyResultService.setKeyResultFactory(key)
    this.modalService.searchModal('updateKeyResult');
}

TeamController.prototype.editPlanningSession = function (planning) {
    this.planningSessionService.setPlanningFactory(planning)
    this.planningSessionService.setPlanningTypeFactory(planning.type)
    this.modalService.searchModal('updatePlanning');
    this.mixpanel('Clicou no ícone para editar o ciclo')

}

TeamController.prototype.delete = function (objective) {
    var that = this

    swal({
            title: "Você tem certeza?",
            text: "Após arquivado o objetivo não será mais visualizado!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Sim, tenho certeza!",
            cancelButtonText: "Não, cancelar!",
            closeOnConfirm: false,
            closeOnCancel: true
        },
        function (isConfirm) {
            if (isConfirm) {
                that.mainService.delete(objective._id)
                    .then(function (res) {
                        swal("Arquivado!", "O objetivo foi arquivado.", "success");
                        that.loadObjectives()
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        });
}

TeamController.prototype.deleteKeyResult = function (key) {
    var that = this

    swal({
            title: "Você tem certeza?",
            text: "Após arquivada a chave não será mais visualizada!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Sim, tenho certeza!",
            cancelButtonText: "Não, cancelar!",
            closeOnConfirm: false,
            closeOnCancel: true
        },
        function (isConfirm) {
            if (isConfirm) {
                that.mainService.deleteKeyResult(key)
                    .then(function (res) {
                        swal("Arquivada!", "A chave foi arquivada.", "success");
                        that.loadObjectives()
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        });
}

TeamController.prototype.removeObjectiveChild = function (mainObjective, childObjectiveIndex) {
    var that = this

    swal({
            title: "Você tem certeza?",
            text: "O objetivo será retirado da meta!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Sim, tenho certeza!",
            cancelButtonText: "Não, cancelar!",
            closeOnConfirm: false,
            closeOnCancel: true
        },
        function (isConfirm) {
            if (isConfirm) {
                mainObjective.childObjectives.splice(childObjectiveIndex, 1)
                that.objectiveService.updateObjective(mainObjective)
                    .then(function (res) {
                        swal("Removido!", "O objetivo foi removido.", "success");
                        that.loadObjectives()
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        });
}

TeamController.prototype.checkChildObjectiveProgress = function (objective) {
    var that = this,
        objectiveProgress = 0,
        keyResultProgress

    if (objective.keyResults.length == 0)
        return 'Objetivo Não Iniciado'

    _.forEach(objective.keyResults, function (keyResult) {
        keyResultProgress = parseFloat(keyResult._id.progress)
        if (keyResultProgress == 100)
            objectiveProgress++
    })

    if (objectiveProgress == objective.keyResults.length)
        return 'Finalizado'

    return objectiveProgress + '/' + objective.keyResults.length
}

TeamController.prototype.changeProgressBarStatus = function (object) {
    var progress = 0,
        progressBar,
        bar

    if (object == undefined)
        progress = 0
    else
        progress = object
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

TeamController.prototype.getInitials = function (ownerObj, ownerKey) {
    var first,
        last

    first = ownerObj.firstName ? ownerObj.firstName[0].toUpperCase() : ''
    last = ownerObj.lastName ? ownerObj.lastName[0].toUpperCase() : ''

    if (ownerKey) {
        first = ownerKey.firstName ? ownerKey.firstName[0].toUpperCase() : ''
        last = ownerKey.lastName ? ownerKey.lastName[0].toUpperCase() : ''

        return first + last
    }

    return first + last
}

TeamController.prototype.getName = function (ownerObj, ownerKey) {
    var first,
        last

    if (ownerKey) {
        first = ownerKey.firstName
        last = ownerKey.lastName

        return first + ' ' + last
    }

    first = ownerObj.firstName
    last = ownerObj.lastName

    return first + ' ' + last
}

TeamController.prototype.userHaveName = function (user) {
    if (user.firstName == undefined)
        return user.username

    return user.firstName + ' ' + user.lastName
}

TeamController.prototype.formatCriteria = function (key) {
    var viewCriteria = ''

    viewCriteria = key.criteria == 'atLeast' ? 'No Mínimo (' : 'No Máximo ('

    if (key.format == 'money')
        viewCriteria += 'R$ ' + key.targetValue.toFixed(2) + ')'
    else if (key.format == 'percent')
        viewCriteria += (key.targetValue * 100).toFixed(0) + '%)'
    else
        viewCriteria += key.targetValue + ')'

    return viewCriteria
}

TeamController.prototype.formatActual = function (key) {
    var viewActual = ''

    if (key.format == 'money')
        viewActual += 'R$ ' + key.currentValue.toFixed(2)
    else if (key.format == 'percent')
        viewActual += (key.targetValue * 100).toFixed(0) + '%'
    else
        viewActual += key.currentValue

    return viewActual
}

TeamController.prototype.formatInitial = function (key) {
    var viewActual = ''

    if (!key.inicialValue)
        return

    if (key.format == 'money')
        viewActual += 'R$ ' + key.inicialValue.toFixed(2)
    else if (key.format == 'percent')
        viewActual += key.inicialValue * 100 + '%'
    else
        viewActual += key.inicialValue

    return viewActual
}

TeamController.prototype.generateGraph = function (key) {
    this.keyResultService.setKeyResultFactory(key)
    this.modalService.searchModal('checkInGraph');
}

TeamController.prototype.mixpanel = function (msg) {
    mixpanel.track(msg);
}

TeamController.prototype.archivatePlanning = function (planning) {
    var that = this;

    swal({
            title: "Você tem certeza?",
            text: "Após arquivado o ciclo não será mais visualizado!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Sim, tenho certeza!",
            cancelButtonText: "Não, cancelar!",
            closeOnConfirm: false,
            closeOnCancel: true
        },
        function (isConfirm) {
            if (isConfirm) {
                that.planningSessionService.archivatePlanning(planning)
                    .then(function (data) {
                        swal("Arquivado!", "O ciclo foi arquivado.", "success");
                        that.objectives = []
                        that.selectedPlanning = that.plannings[that.plannings.length - 1]
                        that.selectedCompanyPlanning = that.companyPlannings[that.companyPlannings.length - 1]
                        that.loadPlannings()
                    })
                    .then(function (data) {
                        angular.copy(data, that.planningSessionService.getPlanningListFactory())
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            }
        })
    this.mixpanel('Clicou no ícone para arquivar o ciclo')

};

TeamController.prototype.userDetails = function (user, event) {
    var that = this,
        objectives = {
            ownerObjectives: user.ownerObjectives,
            contributorObjectives: user.contributorObjectives
        }
    this.planningSessionService.setPlanningFactory(this.selectedPlanning)
    this.objectiveService.setObjectiveListFactory(objectives)


    if (event.ctrlKey)
        that.$window.open('#/userdetails/' + user._id)
    else
        that.$location.path('/userdetails/' + user._id)

    this.mixpanel('Clicou no usuário para visualizar seus detalhes')
};

TeamController.prototype.showPlanningIcons = function (index, bool) {
    this.selectedCompanyPlanning.childPlannings[index].show = bool
    this.showIcons = true;
};

TeamController.prototype.showCompanyPlanningIcons = function (index, bool) {
    this.companyPlannings[index].show = bool
    this.showIcons = true;
};

TeamController.prototype.filterChildPlannings = function (planning) {
    this.plannings = planning.childPlannings

    this.planningSessionService.setPlanningListFactory(this.plannings)

    this.selectedPlanning = planning.childPlannings[planning.childPlannings.length - 1]

    if (!this.selectedPlanning)
        this.objectives = []
};

TeamController.prototype.saveSelectedCompanyPlanning = function () {
    if (this.selectedCompanyPlanning) {
        delete this.$localStorage.selectedCompanyPlanning
        this.$localStorage.selectedCompanyPlanning = JSON.stringify(this.selectedCompanyPlanning._id)
    }
}

TeamController.prototype.saveSelectedObjectivePlanning = function () {
    if (this.selectedPlanning) {
        delete this.$localStorage.selectedPlanning
        this.$localStorage.selectedPlanning = JSON.stringify(this.selectedPlanning)
    }

}

TeamController.prototype.setFilterStorage = function () {
    delete this.$localStorage.filter
    this.$localStorage.filter = JSON.stringify(this.filter)
}

TeamController.prototype.resetFilter = function () {
    this.filter = {
        company: this.userService.getUserFactory().company,
        tags: [],
        owner: [],
        hierarchy: ''
    }
}

TeamController.prototype.setTabStorage = function (tab) {
    this.selectedTab = tab

    if (this.$localStorage.tab)
        delete this.$localStorage.tab

    this.$localStorage.tab = tab
}

TeamController.prototype.setFilterTabStorage = function (tab) {
    this.selectedFilterTab = tab

    if (this.$localStorage.filterTab)
        delete this.$localStorage.filterTab

    this.$localStorage.filterTab = tab
}

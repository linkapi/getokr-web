'use strict'

var appModule = require('../../appModule')
var _ = require('lodash')

CompanyOkrController.$inject = ['$rootScope', '$location', 'modalService', 'planningSessionService', 'objectiveService', 'mainService', 'companyService', 'keyResultService', 'loginService', 'userService', 'tagService', '$window', '$localStorage'];

function CompanyOkrController($rootScope, $location, modalService, planningSessionService, objectiveService, mainService, companyService, keyResultService, loginService, userService, tagService, $window, $localStorage) {
    this.$rootScope = $rootScope
    this.$location = $location
    this.modalService = modalService
    this.planningSessionService = planningSessionService
    this.objectiveService = objectiveService
    this.mainService = mainService
    this.companyService = companyService
    this.keyResultService = keyResultService
    this.loginService = loginService
    this.userService = userService
    this.tagService = tagService
    this.$window = $window
    this.$localStorage = $localStorage
    this.objectives = []
    this.keyResults = []
    this.users = []
    this.user = userService.getUserFactory()
    this.tags = []
    this.loadView = false
    this.tagsForSelection = []
    this.selectedObjective = {}
    this.selectedTab = 'company'
    this.isCollapsed = []
    this.filter = {
        company: userService.getUserFactory().company,
        tags: [],
        owner: [],
        hierarchy: '',
        active: true
    }
    this.childObjectivePlannings = {
        planningsIds: [],
        plannings: []
    }

    var that = this

    this.$rootScope.$on('logout', function (event, data) {
        that.loginService.logoutFactory()
        that.userService.logoutFactory()
        that.$location.path('/login')
    })

    this.$rootScope.$on('newPlanning', function (event, data) {
        that.initialize()
    })

    this.$rootScope.$on('editCompanyPlanning', function (event, args) {
        that.loadPlannings()

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


CompanyOkrController.prototype.initialize = function () {
    var that = this

    this.planningSessionService.setPlanningHierarchyFactory('main')
    this.planningSessionService.setPlanningFactory('')

    this.companyService.findCompanyById(this.user.company)
        .then(function (res) {
            that.company = res.data
        })
        .catch(function (err) {
            console.log(err)
        })

    this.loadPlannings()
    this.loadObjectives()
    this.loadUsers()
    this.loadTags()
}

CompanyOkrController.prototype.loadPlannings = function () {
    var that = this,
        query = {
            type: 'company'
        }

    that.planningSessionService.getPlanningsByType(query)
        .then(function (res) {
            that.plannings = res.data
            that.planningSessionService.setPlanningListFactory(that.plannings)

            if (that.$localStorage.selectedCompanyPlanning != undefined) {
                that.selectedPlanning = JSON.parse(that.$localStorage.selectedCompanyPlanning)
                that.planningSessionService.getPlanningById(that.selectedPlanning)
                    .then(function (res) {
                        that.selectedPlanning = res.data
                        that.saveSelectedPlanning()
                        that.loadObjectives()

                        that.planningSessionService.setPlanningFactory(that.selectedPlanning)
                        that.planningSessionService.setCompanyPlanningFactory(that.selectedPlanning)
                        that.loadObjectives()
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            } else {
                that.selectedPlanning = that.plannings[that.plannings.length - 1]
                that.saveSelectedPlanning()

                that.planningSessionService.setPlanningFactory(that.selectedPlanning)
                that.planningSessionService.setCompanyPlanningFactory(that.selectedPlanning)
                that.loadObjectives()
            }
        })
        .catch(function (err) {
            console.log(err)
        })
}

CompanyOkrController.prototype.loadUsers = function () {
    var that = this

    this.companyService.getCompanyUsers()
        .then(function (res) {
            that.users = _.forEach(res.data, function (user) {
                user.customName = user.firstName + ' ' + user.lastName
            })
            that.userService.setUsersListFactory(that.users)
        })
        .catch(function (err) {
            console.log(err)
        })
}

CompanyOkrController.prototype.loadTags = function () {
    var that = this

    this.companyService.getCompanyTags(this.userService.getUserFactory().company)
        .then(function (res) {
            that.tags = res.data.map(function (tag) {
                that.tagsForSelection.push(tag.name);
                return {
                    name: tag.name,
                    letter: tag.name.substring(0, 1).toUpperCase()
                }
            })
            that.tagsLoaded = true
        })
        .catch(function (err) {
            console.log(err)
        })
}

CompanyOkrController.prototype.loadObjectives = function () {
    var that = this,
        filterFactory,
        query = {},
        planningId

    that.filter.hierarchy = "main"

    if (!that.planningSessionService.getPlanningListFactory())
        return

    if (!that.selectedPlanning)
        return

    planningId = that.selectedPlanning._id

    if (!that.filter.active) {
        query.tags = that.filter.tags
        query.planning = planningId
        query.deactivate = !that.filter.active

        that.objectiveService.getObjectivesByPlanning(query)
            .then(function (res) {
                that.objectives = res.data
                that.objectiveService.setObjectiveListFactory(that.objectives)
            })
            .catch(function (err) {
                console.log(err)
            })
    } else {
        query.tags = that.filter.tags
        query.planning = planningId
        query.deactivate = !that.filter.active

        that.objectiveService.getObjectivesByPlanning(query)
            .then(function (res) {
                that.objectives = res.data;

                _.forEach(that.objectives, function (objective) {
                    that.isCollapsed.push(false)
                    that.getChildObjectivesPlannings(objective.childObjectives)
                })
            })
            .catch(function (err) {
                console.log(err)
            })
    }


    filterFactory = that.tagService.getFilterFactory()

    if (filterFactory != undefined)
        that.filter.tags = filterFactory


}

CompanyOkrController.prototype.getChildObjectivesPlannings = function (childObjective) {
    var that = this

    _.remove(childObjective, function (child) {
        if (child._id.deactivate) {
            return child
        }
    })

    _.forEach(childObjective, function (child) {
        if (child._id.planning)
            if (_.indexOf(that.childObjectivePlannings.planningsIds, child._id.planning._id) == -1) {
                that.childObjectivePlannings.planningsIds.push(child._id.planning._id)
                that.childObjectivePlannings.plannings.push(child._id.planning)
            }
    })
}

CompanyOkrController.prototype.collapseOne = function (collapseIndex) {
    var that = this

    this.isCollapsed[collapseIndex] = !this.isCollapsed[collapseIndex]
}

CompanyOkrController.prototype.filterChildsByPlanning = function (objective, planning) {
    if (objective._id.deactivate || !objective._id.planning || !planning)
        return false

    if (objective._id.planning._id == planning._id)
        return true
}

CompanyOkrController.prototype.verifyChildsByPlanning = function (objective, planning) {
    var exists = false

    _.forEach(objective.childObjectives, function (child) {
        if (child._id.planning)
            if (child._id.planning._id == planning._id)
                exists = true
    })
    return exists
}

CompanyOkrController.prototype.addObjective = function () {
    this.objectiveService.setObjectiveFactory()
    this.modalService.searchModal('addObjective')
    this.mixpanel('Clicou no botão "+ criar" para criar um objetivo da empresa')
}

CompanyOkrController.prototype.editObjective = function (objective) {
    var data = {
        _id: objective
    }

    this.objectiveService.setObjectiveFactory(data)
    this.modalService.searchModal('editObjective')
    this.mixpanel('Clicou no ícone para editar o objetivo da empresa')
}

CompanyOkrController.prototype.showEndMessage = function (planning) {
    var that = this

    that.endPlanningMessage(function (isConfirm) {
        if (isConfirm) {
            that.keepObjectivesMessage(function (isConfirm) {
                if (isConfirm)
                    that.endPlanning(planning, isConfirm)
                else
                    that.endPlanning(planning, isConfirm)
            })
        }
    })
}

CompanyOkrController.prototype.endPlanningMessage = function (callback) {
    swal({
        title: "Você está prestes a encerrar o ciclo estratégico",
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

CompanyOkrController.prototype.keepObjectivesMessage = function (callback) {
    swal({
        title: "Os objetivos do ciclo serão arquivados",
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

CompanyOkrController.prototype.endPlanning = function (planning, keepObjectives) {
    var that = this,
        endingPlanning = {}

    planning.isFinished = true

    if (keepObjectives) {
        endingPlanning.tacticalCiclesToKeep = planning.childPlannings
        endingPlanning.objectivesToKeep = that.objectives
    }


    that.planningSessionService.updatePlanning(planning)
        .then(function (data) {})
        .catch(function (err) {
            console.log(err);
        });

    that.planningSessionService.setPlanningFactory('')
    that.planningSessionService.setPlanningListFactory(that.plannings)
    that.planningSessionService.setPlanningTypeFactory('company')
    that.modalService.searchModal('addPlanning', endingPlanning);
}

CompanyOkrController.prototype.addKeyResult = function (objective) {
    this.objectiveService.setObjectiveFactory(objective)
    this.keyResultService.setKeyResultFactory()
    this.modalService.searchModal('addKeyResult');
}

CompanyOkrController.prototype.editKeyResult = function (key) {
    this.objectiveService.setObjectiveFactory()
    this.keyResultService.setKeyResultFactory(key)
    this.modalService.searchModal('updateKeyResult');
}

CompanyOkrController.prototype.check = function (bool) {
    this.filter.active = bool
    this.loadObjectives()
    this.mixpanel('Clicou no botão "ativos / arquivados" para visualizar os objetivos ativos / arquivados da empresa')
}

CompanyOkrController.prototype.delete = function (objective) {
    var that = this

    swal({
            title: "Você tem certeza?",
            text: objective.deactivate ? "O objetivo será reativado!" : "Após arquivado o objetivo não será visualizado!",
            type: objective.deactivate ? "info" : "warning",
            showCancelButton: true,
            confirmButtonColor: objective.deactivate ? "#86AF49" : "#DD6B55",
            confirmButtonText: objective.deactivate ? "Reativar!" : "Sim, tenho certeza!",
            cancelButtonText: "Não, cancelar!",
            closeOnConfirm: false,
            closeOnCancel: true
        },
        function (isConfirm) {
            if (isConfirm) {
                that.mainService.delete(objective)
                    .then(function (res) {
                        swal(
                            objective.deactivate ? "Reativado!" : "Arquivado!",
                            objective.deactivate ? "O objetivo foi reativado." : "O objetivo foi arquivado.",
                            "success");
                        that.loadObjectives()
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        });
    this.mixpanel('Clicou no ícone para arquivar o objetivo da empresa')
}

CompanyOkrController.prototype.deleteKeyResult = function (key) {
    var that = this

    swal({
            title: "Você tem certeza?",
            text: "Após removida não conseguiremos recuperar a key!",
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
                        swal("Removido!", "A key result foi removida.", "success");
                        that.loadObjectives()
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        });
}

CompanyOkrController.prototype.removeObjectiveChild = function (mainObjective, childObjectiveIndex) {
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

CompanyOkrController.prototype.checkChildObjectiveProgress = function (objective) {
    var that = this,
        objectiveProgress = 0

    if (objective.keyResults.length == 0)
        return 'Objetivo não iniciado'

    _.forEach(objective.keyResults, function (keyResult) {
        if (keyResult._id.progress == 100)
            objectiveProgress++
    })
    if (objectiveProgress == objective.keyResults.length)
        return 'Finalizado'

    return objectiveProgress + '/' + objective.keyResults.length + ' Concluído(s)'
}

CompanyOkrController.prototype.changeProgressBarStatus = function (object, type) {
    var progress = object.progress,
        bar

    if (object.deactivate)
        return 'progress-bar-default';
    else if (!this.company.customize)
        return 'progress-bar-success';
    else if (!this.company.customize.progressBar.length)
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

CompanyOkrController.prototype.getInitials = function (objective) {
    var first,
        last

    if (objective._id.ownerType == 'user') {
        first = objective._id.owner.firstName ? objective._id.owner.firstName[0].toUpperCase() : ''
        last = objective._id.owner.lastName ? objective._id.owner.lastName[0].toUpperCase() : ''
    } else {
        first = objective._id.team.name ? objective._id.team.name[0].toUpperCase() : ''
        last = ''
    }

    return first + last
}

CompanyOkrController.prototype.editPlanningSession = function (planning) {
    this.planningSessionService.setPlanningFactory(planning)
    this.modalService.searchModal('updatePlanning')
    this.mixpanel('Clicou no ícone para editar ciclo estratégico')
}

CompanyOkrController.prototype.archivatePlanning = function (planning) {
    var that = this;

    swal({
            title: "Você tem certeza?",
            text: "Após arquivado o ciclo estratégico não será mais visualizado!",
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
                        swal("Arquivado!", "O ciclo estratégico foi arquivado.", "success");
                        that.objectives = []
                        that.initialize()
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
    this.mixpanel('Clicou no ícone para arquivar ciclo estratégico')
};

CompanyOkrController.prototype.showPlanningIcons = function (index, bool) {
    this.plannings[index].show = bool
    this.showIcons = true;
};

CompanyOkrController.prototype.addSession = function () {
    this.planningSessionService.setPlanningFactory()
    this.planningSessionService.setPlanningTypeFactory('company')
    this.modalService.searchModal('addPlanning')
    this.mixpanel('Clicou no botão "+criar novo" para criar um ciclo estratégico para a empresa')
}

CompanyOkrController.prototype.mixpanel = function (msg) {
    mixpanel.track(msg)
}

CompanyOkrController.prototype.saveSelectedPlanning = function () {
    if (this.selectedPlanning) {
        delete this.$localStorage.selectedCompanyPlanning
        this.$localStorage.selectedCompanyPlanning = JSON.stringify(this.selectedPlanning._id)
    }
}

CompanyOkrController.prototype.objectiveDetails = function (objective, event) {
    var that = this
    this.planningSessionService.setPlanningFactory(this.selectedPlanning)
    that.objectiveService.setObjectiveFactory(objective)

    if (event.ctrlKey)
        that.$window.open('#/objective/' + objective._id._id)
    else
        that.$location.path('/objective/' + objective._id._id)

    this.mixpanel('Clicou no objetivo para visualizar seus detalhes')
};

CompanyOkrController.prototype.resetFilter = function () {
    this.filter.tags = []
}

appModule.controller('companyOkrController', CompanyOkrController)

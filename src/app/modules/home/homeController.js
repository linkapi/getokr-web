'use strict'

var appModule = require('../../appModule')
var _ = require('lodash')

HomeController.$inject = ['$rootScope', 'modalService', 'planningSessionService', 'objectiveService', 'mainService', 'companyService', 'keyResultService', 'userService', 'notificationService', 'tagService', '$location', '$localStorage', '$window', 'teamService'];

function HomeController($rootScope, modalService, planningSessionService, objectiveService, mainService, companyService, keyResultService, userService, notificationService, tagService, $location, $localStorage, $window, teamService) {
    this.$rootScope = $rootScope
    this.modalService = modalService
    this.planningSessionService = planningSessionService
    this.objectiveService = objectiveService
    this.mainService = mainService
    this.companyService = companyService
    this.keyResultService = keyResultService
    this.userService = userService
    this.notificationService = notificationService
    this.tagService = tagService
    this.$location = $location
    this.$localStorage = $localStorage
    this.$window = $window
    this.teamService = teamService
    this.plannings = []
    this.companyPlannings = []
    this.objectives = []
    this.keyResults = []
    this.users = []
    this.notification = []
    this.tags = []
    this.loadView = false
    this.tagsForSelection = []
    this.selectedObjective = {}
    this.selectedTab = 'myOkr'
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

HomeController.prototype.initialize = function () {
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

    this.loadPlannings()
    this.loadUsers()
    this.loadTags()

    if (this.$localStorage.filter && this.selectedTab != 'myOkr')
        this.filter = JSON.parse(this.$localStorage.filter)

    if (this.$localStorage.tab) {
        this.selectedTab = this.$localStorage.tab

        if (this.selectedTab == 'all')
            this.getFilter()

        this.getFilterTab()

        this.loadObjectives()
    }
}

HomeController.prototype.loadPlannings = function () {
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

HomeController.prototype.setSelectedPlanning = function (selectedCompanyPlanning) {
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
    that.planningsLoaded = true
}

HomeController.prototype.loadUsers = function () {
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

HomeController.prototype.loadTags = function () {
    var that = this

    this.companyService.getCompanyTags(this.userService.getUserFactory().company)
        .then(function (res) {
            that.tags = res.data.map(function (tag) {
                that.tagsForSelection.push(tag.name)
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

HomeController.prototype.loadObjectives = function () {
    var that = this,
        query = {},
        planningId

    that.planningSessionService.setCompanyPlanningFactory(that.selectedCompanyPlanning)

    that.filter.hierarchy = "!main"

    if (!that.selectedPlanning)
        return

    if (!that.plannings.length)
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
    query.user = that.user._id
    query.hierarchy = ['child', 'none']
    query.tags = that.filter.tags
    query.owners = that.filter.owner
    query.deactivate = false
    query.selectedTab = that.selectedTab
    that.objectiveService.getObjectivesByPlanning(query)
        .then(function (res) {
            that.objectivesToKeep = angular.copy(res.data)
            that.objectives = res.data;
        })
        .catch(function (err) {
            console.log(err)
        })
}

HomeController.prototype.showEndMessage = function (planning) {
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

HomeController.prototype.endPlanningMessage = function (type, callback) {
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

HomeController.prototype.keepObjectivesMessage = function (callback) {
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

HomeController.prototype.endPlanning = function (planning, keepObjectives) {
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

HomeController.prototype.addObjective = function () {
    this.objectiveService.setMyOkrFactory(this.selectedTab)
    this.planningSessionService.setPlanningFactory(this.selectedPlanning)
    this.objectiveService.setObjectiveFactory()
    this.modalService.searchModal('addObjective');
    this.mixpanel('Clicou no botão "criar objetivo" para criar um objetivo pessoal')
}

HomeController.prototype.editObjective = function (objective) {
    this.objectiveService.setMyOkrFactory(this.selectedTab)
    this.planningSessionService.setPlanningFactory(this.selectedPlanning)
    this.objectiveService.setObjectiveFactory(objective)
    this.modalService.searchModal('editObjective');
}

HomeController.prototype.addKeyResult = function (objective) {
    this.objectiveService.setObjectiveFactory(objective)
    this.keyResultService.setKeyResultFactory()
    this.modalService.searchModal('addKeyResult');
}

HomeController.prototype.addSession = function () {
    this.planningSessionService.setPlanningFactory()
    this.planningSessionService.setPlanningTypeFactory('objective')
    this.planningSessionService.setPlanningListFactory(this.plannings)
    this.modalService.searchModal('addPlanning', this.selectedCompanyPlanning)
    this.mixpanel('Clicou no botão "+criar novo" para criar um ciclo tático para a empresa')

}

HomeController.prototype.addCompanySession = function () {
    this.planningSessionService.setPlanningFactory()
    this.planningSessionService.setPlanningTypeFactory('company')
    this.modalService.searchModal('addPlanning');
    this.mixpanel('Clicou no botão "+criar novo" para criar um ciclo estratégico para a empresa')
}

HomeController.prototype.editKeyResult = function (key, objective) {
    this.objectiveService.setObjectiveFactory(objective)
    this.keyResultService.setKeyResultFactory(key)
    this.modalService.searchModal('updateKeyResult');
}

HomeController.prototype.editPlanningSession = function (planning) {
    this.planningSessionService.setPlanningFactory(planning)
    this.planningSessionService.setPlanningTypeFactory(planning.type)
    this.modalService.searchModal('updatePlanning')
    this.mixpanel('Clicou no ícone para editar o ciclo')
}

HomeController.prototype.delete = function (objective) {
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

HomeController.prototype.deleteKeyResult = function (key) {
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

HomeController.prototype.createTeam = function () {
    var that = this,
        team = {}

    team._id = '598dfff02ae4433808707afe'
    team.name = 'teste'
    team.active = false
    team.leader = this.user._id
    team.members = []
    team.members.push(this.user._id)
    team.insertDate = new Date()
    team.company = this.user.company
    team.objectives = []
    team.objectives.push('595eb035ef6ad200158a2e5c')

    this.teamService.getTeams(this.user.company)
        .then(function (res) {})
        .catch(function (err) {
            console.log(err)
        })
}

HomeController.prototype.removeObjectiveChild = function (mainObjective, childObjectiveIndex) {
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

HomeController.prototype.changeProgressBarStatus = function (object, type) {
    var progress = object.progress,
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

HomeController.prototype.getInitials = function (ownerObj, ownerKey) {
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

HomeController.prototype.getName = function (ownerObj, ownerKey) {
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

HomeController.prototype.userHaveName = function (user) {
    if (user.firstName == undefined)
        return user.username

    return user.firstName + ' ' + user.lastName
}

HomeController.prototype.formatCriteria = function (key) {
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

HomeController.prototype.formatActual = function (key) {
    var viewActual = ''

    if (key.format == 'money')
        viewActual += 'R$ ' + key.currentValue.toFixed(2)
    else if (key.format == 'percent')
        viewActual += (key.targetValue * 100).toFixed(0) + '%'
    else
        viewActual += key.currentValue

    return viewActual
}

HomeController.prototype.formatInitial = function (key) {
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

HomeController.prototype.generateGraph = function (key) {
    this.keyResultService.setKeyResultFactory(key)
    this.modalService.searchModal('checkInGraph');
}

HomeController.prototype.mixpanel = function (msg) {
    mixpanel.track(msg);
}

HomeController.prototype.archivatePlanning = function (planning) {
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

HomeController.prototype.objectiveDetails = function (objective, event) {
    var that = this

    this.planningSessionService.setPlanningFactory(this.selectedPlanning)
    that.objectiveService.setObjectiveFactory(objective)

    if (event.ctrlKey)
        that.$window.open('#/objective/' + objective._id)
    else
        that.$location.path('/objective/' + objective._id)

    this.mixpanel('Clicou no objetivo para visualizar seus detalhes')
};

HomeController.prototype.showPlanningIcons = function (index, bool) {
    this.selectedCompanyPlanning.childPlannings[index].show = bool
    this.showIcons = true;
};

HomeController.prototype.showCompanyPlanningIcons = function (index, bool) {
    this.companyPlannings[index].show = bool
    this.showIcons = true;
};

HomeController.prototype.filterChildPlannings = function (planning) {
    this.plannings = planning.childPlannings

    this.planningSessionService.setPlanningListFactory(this.plannings)

    this.selectedPlanning = planning.childPlannings[planning.childPlannings.length - 1]

    if (!this.selectedPlanning)
        this.objectives = []
};

HomeController.prototype.saveSelectedCompanyPlanning = function () {
    if (this.selectedCompanyPlanning) {
        delete this.$localStorage.selectedCompanyPlanning
        this.$localStorage.selectedCompanyPlanning = JSON.stringify(this.selectedCompanyPlanning._id)
    }
}

HomeController.prototype.saveSelectedObjectivePlanning = function () {
    if (this.selectedPlanning) {
        delete this.$localStorage.selectedPlanning
        this.$localStorage.selectedPlanning = JSON.stringify(this.selectedPlanning)
    }

}


HomeController.prototype.getFilter = function () {
    if (this.$localStorage.filter)
        this.filter = JSON.parse(this.$localStorage.filter)
}

HomeController.prototype.setFilterStorage = function () {
    delete this.$localStorage.filter
    this.$localStorage.filter = JSON.stringify(this.filter)
}

HomeController.prototype.resetFilter = function () {
    this.filter = {
        company: this.userService.getUserFactory().company,
        tags: [],
        owner: [],
        hierarchy: ''
    }
}

HomeController.prototype.setTabStorage = function (tab) {
    this.selectedTab = tab

    if (this.$localStorage.tab)
        delete this.$localStorage.tab

    this.$localStorage.tab = tab
    this.mixpanel('Clicou na tab meus OKRs / geral')
}

HomeController.prototype.setFilterTabStorage = function (tab) {
    this.selectedFilterTab = tab

    if (this.$localStorage.filterTab)
        delete this.$localStorage.filterTab

    this.$localStorage.filterTab = tab
    this.mixpanel('Clicou na tab tags / responsável')
}

HomeController.prototype.getFilterTab = function () {
    if (this.$localStorage.filterTab)
        this.selectedFilterTab = this.$localStorage.filterTab
    else
        return

}

HomeController.prototype.newNotification = function () {
    var notification = {}

    notification.name = 'Check-in'
    notification.owner = '5971fb4bd4d72329a0740c7a'
    notification.description = 'Realizar check-in'
    notification.insertDate = new Date()
    notification.daysToTrigger = 7
    notification.active = true
    this.notificationService.newNotification(notification)
        .then(function (res) {})
        .catch(function (err) {
            console.log(err);
        });
}

HomeController.prototype.updateNotification = function () {
    var notification = {}

    notification._id = '5991e350df37791234c4c46f'
    notification.name = 'abcd'
    notification.owner = '5971fb4bd4d72329a0740c7a'
    notification.description = 'teste'
    notification.date = new Date()
    notification.objectives = ['590b2a486817360015977cfd', '590b8f1de3f4c0001570b840']

    this.notificationService.updateNotification(notification)
        .then(function (res) {})

        .catch(function (err) {
            console.log(err);
        });
}

HomeController.prototype.deactivateNotification = function () {
    var notification = {}

    notification._id = '5992f69c040da203288e1797'
    this.notificationService.deactivateNotification(notification)
        .then(function (res) {
            swal("A notificação foi removida");
        })

        .catch(function (err) {
            console.log(err);
        });
}

appModule.controller('homeController', HomeController)

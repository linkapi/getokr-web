'use strict'

var appModule = require('../../../appModule');

appModule.controller('objectiveController', ObjectiveController);

ObjectiveController.$inject = ['$uibModalInstance', 'items', 'companyService', 'objectiveService', 'userService', 'planningSessionService', 'tagService', 'teamService', '$window', '$localStorage', '$stateParams', '$location']

function ObjectiveController($uibModalInstance, items, companyService, objectiveService, userService, planningSessionService, tagService, teamService, $window, $localStorage, $stateParams, $location) {
    this.$uibModalInstance = $uibModalInstance
    this.$location = $location
    this.items = items
    this.companyService = companyService
    this.objectiveService = objectiveService
    this.userService = userService
    this.planningSessionService = planningSessionService
    this.$window = $window
    this.$localStorage = $localStorage
    this.$stateParams = $stateParams
    this.tags = []
    this.user = this.userService.getUserFactory()
    this.tagsForSelection = []
    this.ownerOptions = []
    this.objective = {}
    this.objective.public = true
    this.obj = {}
    this.companySession = ''
    this.tagService = tagService
    this.teamService = teamService
    this.mainObjectives
    this.objectivesForMacros = []
    this.filter = {
        company: userService.getUserFactory().company,
        tags: [],
        hierarchy: '',
        active: true
    }
    this.initialize()
}

ObjectiveController.prototype.initialize = function () {
    if (this.planningSessionService.getPlanningFactory()) {
        this.planning = this.planningSessionService.getPlanningFactory()._id
        this.planningType = this.planningSessionService.getPlanningTypeFactory()
    }

    if (this.planningSessionService.getCompanyPlanningFactory()) {
        this.companyPlanning = this.planningSessionService.getCompanyPlanningFactory()._id
        this.companySession = this.companyPlanning
    }

    this.myOkr = this.objectiveService.getMyOkrFactory()
    if (this.tagService.getFilterFactory())
        this.filter = this.tagService.getFilterFactory()

    if (this.planningSessionService.getPlanningHierarchyFactory())
        this.hierarchy = this.planningSessionService.getPlanningHierarchyFactory()

    if (this.items) {
        this.objective = angular.copy(this.items)
        this.obj = angular.copy(this.objectiveService.getObjectiveFactory())
    } else if (this.objectiveService.getObjectiveFactory()) {
        this.obj = angular.copy(this.objectiveService.getObjectiveFactory())

        this.objective = angular.copy(this.objectiveService.getObjectiveFactory()._id)

        if (!this.objective.name)
            this.objective = this.obj
    }

    if (this.objective.owner && !this.items)
        this.objective.owner = this.objective.owner._id || this.objective.owner

    this.loadUsers();
    this.loadTags();
    this.loadMainObjectives()
    this.loadTeams()

}

ObjectiveController.prototype.loadTeams = function () {
    var that = this
    this.teamService.getTeams(this.user.company)
        .then(function (res) {
            that.teams = res.data

            Array.prototype.push.apply(that.ownerOptions, that.users)
            // Array.prototype.push.apply(that.ownerOptions, that.teams)
        })
        .catch(function (err) {
            console.log(err)
        })
}

ObjectiveController.prototype.loadMainObjectives = function () {
    var that = this,
        query = {}

    query.planning = JSON.parse(that.$localStorage.selectedCompanyPlanning)
    query.deactivate = false

    if (!query.planning)
        return

    that.objectiveService.getObjectivesByPlanning(query)
        .then(function (res) {
            var query = {}

            query.planning = that.planning
            query.deactivate = false

            that.mainObjectives = res.data;



            that.objectiveService.getObjectivesByPlanning(query)
                .then(function (res) {
                    res.data = _.filter(res.data, function (objective) {
                        if (objective.owner)
                            return objective.owner.isAdministrator || objective.owner.canCreate
                    })


                    Array.prototype.push.apply(that.mainObjectives, res.data)
                })
                .catch(function (err) {
                    console.log(err)
                })
        })
        .catch(function (err) {
            console.log(err)
        })

}

ObjectiveController.prototype.checkModalInputs = function () {
    if (this.hierarchy == 'main' && !this.objective.name)
        return true

    if (this.planningType == 'personal' && !this.objective.name)
        return true

    if (this.planningType != 'personal' && this.hierarchy != 'main' && this.myOkr == 'all' && !this.objective.name)
        return true

    if (this.planningType != 'personal' && this.hierarchy != 'main' && !this.objective.name && this.myOkr != 'all')
        return true

    return false
}

ObjectiveController.prototype.save = function () {

    this.mixpanel('Salvou o objetivo')

    if (this.objectiveService.getObjectiveFactory() && this.planning) {
        return this.editObjective()

    }

    if (this.objectiveService.getObjectiveFactory() && !this.planning)
        return this.editObjectiveCompany()

    if (this.planning)
        return this.newObjective()

    return this.newObjectiveCompany()
}

ObjectiveController.prototype.newObjective = function () {
    var that = this
    if (this.hierarchy)
        this.objective.hierarchy = this.hierarchy

    if (this.planning)
        this.objective.planning = this.planning

    if (this.objective.owner == undefined)
        this.objective.owner = that.user._id

    if (this.objective.mainObjective) {
        this.objective.hierarchy = 'child'
        this.objective.mainObjective = this.objective.mainObjective._id
    }

    if (this.objective.owner.name) {
        this.objective.team = this.objective.owner._id
        this.objective.ownerType = 'team'
        delete this.objective.owner
    } else
        this.objective.ownerType = 'user'

    this.objective.deactivate = false

    this.objectiveService.newObjective(this.objective)
        .then(function (res) {
            return that.planningSessionService.getPlanningByIdAndHierarchy(that.planning, that.filter)
        })
        .then(function (res) {
            that.objectives = res.data.objectives;

            if (that.myOkr == 'myOkr')
                _.remove(that.objectives, function (objective) {
                    if (objective._id.owner)
                        return objective._id.owner._id != that.userService.getUserFactory()._id
                })

            angular.copy(that.objectives, that.objectiveService.getObjectiveListFactory())
            that.closeModal()
            that.$window.location.reload()
        })
        .catch(function (err) {
            console.log(err);
        });
};

ObjectiveController.prototype.newObjectiveCompany = function () {
    var that = this,
        objectives

    this.objective.hierarchy = 'main'

    this.objectiveService.newObjective(this.objective)
        .then(function (res) {
            objectives = that.objectiveService.getObjectiveListFactory();
            objectives.push(res.data)
            that.closeModal()
        })
        .catch(function (err) {
            console.log(err);
        });
};

ObjectiveController.prototype.editObjective = function () {
    var that = this

    if (this.objective.mainObjective)
        this.objective.hierarchy = 'child'

    if (!this.objective.mainObjective && this.objective.hierarchy != 'main')
        this.objective.hierarchy = 'none'


    if (this.objective.ownerType == 'team') {
        if (this.objective.team.firstName) {
            this.objective.owner = this.objective.team._id
            this.objective.ownerType = 'user'
            delete this.objective.team
        }
    } else {
        if (this.objective.owner.name) {
            this.objective.team = this.objective.owner._id
            this.objective.ownerType = 'team'
            delete this.objective.owner
        }
    }

    this.objectiveService.updateObjective(this.objective)
        .then(function (res) {
            return that.planningSessionService.getPlanningByIdAndHierarchy(that.planning, that.filter)
        })
        .then(function (res) {
            that.objectives = res.data.objectives;
            if (that.myOkr == 'myOkr')
                _.remove(that.objectives, function (objective) {
                    return objective._id.owner._id != that.userService.getUserFactory()._id
                })
            angular.copy(that.objectives, that.objectiveService.getObjectiveListFactory())
            that.objectiveService.setObjectiveFactory(that.objective)
            that.closeModal()
            that.$window.location.reload();

        })
        .catch(function (err) {
            console.log(err);
        });
};

ObjectiveController.prototype.editObjectiveCompany = function () {
    var that = this,
        objectives,
        i

    this.objectiveService.updateObjective(this.objective)
        .then(function (res) {
            objectives = that.objectiveService.getObjectiveListFactory();
            i = _.findIndex(objectives, function (o) {
                return o._id == that.objective._id
            })
            that.closeModal()
        })
        .catch(function (err) {
            console.log(err);
        });
};

ObjectiveController.prototype.loadUsers = function () {
    if (this.userService.getUsersListFactory()) {
        this.users = this.userService.getUsersListFactory()
        this.$localStorage.users = this.users
    } else
        this.users = this.$localStorage.users
}

ObjectiveController.prototype.loadTags = function () {
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
        })
        .catch(function (err) {
            console.log(err)
        })
}

ObjectiveController.prototype.setupTag = function () {
    var toggle = angular.element('.tag-component .dropdown-toggle');
    var searchBar = angular.element('.tag-component .dropdown-header input');
    toggle.html('<span></span>');
    toggle.addClass('fa fa-tags appointment-tags-toggle');
    searchBar.attr('placeholder', 'Pesquisar tag');
};

ObjectiveController.prototype.selectTeam = function (team) {
    var that = this;

    that.objective.owner = team.leader

    if (team.members)
        that.objective.contributors = team.members

}


ObjectiveController.prototype.getInitials = function (firstName, lastName) {
    var first,
        last

    first = firstName ? firstName[0].toUpperCase() : ''
    last = lastName ? lastName[0].toUpperCase() : firstName[1].toUpperCase()

    return first + last
}

ObjectiveController.prototype.closeModal = function () {
    this.$uibModalInstance.close('cancel')
};

ObjectiveController.prototype.clearText = function ($select) {
    $select.search = '';
};

ObjectiveController.prototype.mixpanel = function (msg) {
    mixpanel.track(msg);
}

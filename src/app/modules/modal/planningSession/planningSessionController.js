'use strict'

var appModule = require('../../../appModule');

appModule.controller('planningSessionController', PlanningSessionController);

PlanningSessionController.$inject = ['$uibModalInstance', 'items', 'planningSessionService', '$rootScope', 'objectiveService', '$window', '$localStorage', 'keyResultService']

function PlanningSessionController($uibModalInstance, items, planningSessionService, $rootScope, objectiveService, $window, $localStorage, keyResultService) {

    this.$uibModalInstance = $uibModalInstance
    this.items = items
    this.planningSessionService = planningSessionService
    this.$rootScope = $rootScope
    this.objectiveService = objectiveService
    this.$window = $window
    this.$localStorage = $localStorage
    this.keyResultService = keyResultService
    this.planning = {}
    this.updatePlanning = {}
    this.planning.startDate = new Date()
    this.startDatePickerOptions = {
        showWeeks: false,
        initDate: this.planning.startDate,
        minDate: new Date()
    };
    this.endDatePickerOptions = {
        showWeeks: false,
        minDate: this.planning.startDate
    };

    this.initialize();
}

PlanningSessionController.prototype.initialize = function () {
    if (this.items)
        if (this.items.childPlannings)
            this.childPlannings = angular.copy(this.items.childPlannings)

    this.plannings = this.getPlanningsId(angular.copy(this.planningSessionService.getPlanningListFactory()))

    if (!this.plannings)
        this.plannings = []
    if (this.planningSessionService.getPlanningFactory()) {
        this.planning = angular.copy(this.planningSessionService.getPlanningFactory())
        this.planning.startDate = new Date(this.planning.startDate)
        this.planning.endDate = new Date(this.planning.endDate)
    }
    this.type = this.planningSessionService.getPlanningTypeFactory()
};

PlanningSessionController.prototype.getPlanningsId = function (plannings) {
    var planningsId = []
    _.forEach(plannings, function (planning) {
        planningsId.push(planning._id)
    })
    return planningsId
}

PlanningSessionController.prototype.getKeyResultsId = function (keys) {
    var keysId = []
    _.forEach(keys, function (key) {
        keysId.push(key._id._id)
    })
    return keysId
}

PlanningSessionController.prototype.closeModal = function () {
    this.$uibModalInstance.close('cancel')
};

PlanningSessionController.prototype.updateMinDate = function () {
    this.endDatePickerOptions.minDate = moment(this.planning.startDate).add(1, 'days')
    delete this.planning.endDate
};

PlanningSessionController.prototype.save = function () {

    if (!this.planning.name) {
        swal("Atenção!", "Você esqueceu de dar nome ao seu plano.", "warning");
        return
    }

    if (!this.planning.startDate || !this.planning.endDate) {
        swal("Atenção!", "É necessário que você preencha a data de início e a de fim.", "warning");
        return
    }

    if (this.planning.endDate < this.planning.startDate) {
        swal("Data inválida!", "A data de fim é anterior a data de início..", "warning");
        return
    }

    if (this.planningSessionService.getPlanningFactory())
        this.editPlanning()
    else
        this.newPlanning()

};

PlanningSessionController.prototype.newPlanning = function () {
    var that = this;

    this.planning.type = this.type

    if (this.planning.type == 'objective') {
        this.planningSessionService.newPlanning(this.planning)
            .then(function (data) {
                delete that.$localStorage.selectedPlanning
                that.planning = data.data
                that.$rootScope.$broadcast('newPlanning', that.planning)
                that.plannings.push(data.data._id)
                that.planningSessionService.setPlanningTypeFactory('')
                angular.copy(that.planning, that.planningSessionService.getPlanningFactory())
                that.closeModal()
                that.editPlanning()

                if (that.items.objectivesToKeep)
                    that.createObjectivesToKeep(data.data._id)
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    if (this.planning.type == 'company') {
        if (that.items) {
            if (that.items.tacticalCiclesToKeep)
                this.planning.childPlannings = this.getPlanningsId(angular.copy(that.items.tacticalCiclesToKeep))
        }

        this.planningSessionService.newPlanning(this.planning)
            .then(function (data) {
                delete that.$localStorage.selectedCompanyPlanning
                that.planning = data.data
                that.$rootScope.$broadcast('newPlanning', that.planning)
                that.planningSessionService.setPlanningTypeFactory('')
                angular.copy(that.plannings, that.planningSessionService.getPlanningListFactory())
                that.closeModal()

                if (that.items) {
                    if (that.items.objectivesToKeep)
                        that.createCompanyObjectivesToKeep(data.data._id)
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    }
};

PlanningSessionController.prototype.createObjectivesToKeep = function (planningId) {
    var that = this,
        objectivePromises = [],
        keyResultPromises = [],
        max = 0


    if (!that.items.objectivesToKeep)
        return

    _.forEach(that.items.objectivesToKeep, function (objective) {
        if (!objective.deactivate) {
            delete objective._id
            objective.planning = planningId

            _.forEach(objective.keyResults, function (key) {
                if (key._id.isActive) {
                    delete key._id._id
                    delete key._id.currentValue
                    delete key._id.inicialValue
                    delete key._id.targetValue
                    delete key._id.checkIns

                    if (key._id.type == 'boolean')
                        key._id.finished = false

                    keyResultPromises.push(that.keyResultService.newKeyResult(key._id))
                }
            })
            Promise.all(keyResultPromises)
                .then(function (res) {
                    var keyResultsIds = [],
                        lastMaxIndex = 0

                    _.forEach(res, function (key, index) {
                        if (index > max)
                            keyResultsIds.push(key.data._id)
                        lastMaxIndex = index
                    })
                    max = lastMaxIndex

                    objective.keyResults = keyResultsIds
                    objectivePromises.push(that.objectiveService.newObjective(objective))

                })
                .catch(function (err) {
                    console.log(err);
                });
        }
    })
    /////////////////////fim logica do back
    Promise.all(objectivePromises)
        .then(function (res) {
            angular.copy(that.planning, that.planningSessionService.getPlanningFactory())
        })
        .catch(function (err) {
            console.log(err);
        });
}

PlanningSessionController.prototype.createCompanyObjectivesToKeep = function (planningId) {
    var that = this

    if (!that.items.objectivesToKeep)
        return

    _.forEach(that.items.objectivesToKeep, function (o) {
        delete o._id
        o.planning = planningId
        that.objectiveService.newObjective(o)
            .then(function (res) {

            })
            .catch(function (err) {
                console.log(err);
            });
    })
}

PlanningSessionController.prototype.editPlanning = function () {
    var that = this;

    if (that.items && !that.items.companyPlanning) {
        that.items.childPlannings = that.plannings
        this.planningSessionService.updatePlanning(that.items)
            .then(function (data) {
                angular.copy(that.items.childPlannings, that.planningSessionService.getPlanningListFactory())
                angular.copy(that.items, that.planningSessionService.getPlanningFactory())
                that.editedPlaning = that.items
                that.editedPlaning.childPlannings = that.childPlannings
                //that.items.childPlannings = that.childPlannings
                that.$rootScope.$broadcast('editPlanning', that.editedPlaning)
                that.closeModal()
                //that.$window.location.reload()
            })
            .catch(function (err) {
                console.log(err);
            });
    } else if (that.items && that.items.companyPlanning) {
        that.items.companyPlanning.childPlannings = that.plannings

        this.planningSessionService.updatePlanning(that.items.companyPlanning)
            .then(function (data) {
                angular.copy(data.data, that.planningSessionService.getPlanningListFactory())
                that.closeModal()
            })
            .catch(function (err) {
                console.log(err);
            });
    } else {
        this.planningSessionService.updatePlanning(this.planning)
            .then(function (data) {
                that.$rootScope.$broadcast('editCompanyPlanning')
                angular.copy(that.planning, that.planningSessionService.getPlanningFactory())
                that.closeModal()
            })
            .catch(function (err) {
                console.log(err);
            });
    }

};

PlanningSessionController.prototype.archivatePlanning = function (planning) {
    var that = this;

    this.planningSessionService.archivatePlanning(planning)
        .then(function (data) {
            return that.planningSessionService.getPlannings()
        })
        .then(function (data) {
            angular.copy(data, that.planningSessionService.getPlanningListFactory())
        })
        .catch(function (err) {
            console.log(err);
        });
};

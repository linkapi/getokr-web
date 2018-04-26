'use strict'

var appModule = require('../../../appModule');

appModule.controller('keyResultController', KeyResultController);

KeyResultController.$inject = ['$uibModalInstance', 'items', 'keyResultService', 'objectiveService', 'userService', 'companyService', '$window']

function KeyResultController($uibModalInstance, items, keyResultService, objectiveService, userService, companyService, $window) {
    this.$uibModalInstance = $uibModalInstance
    this.items = items
    this.keyResultService = keyResultService
    this.objectiveService = objectiveService
    this.userService = userService
    this.user = userService.getUserFactory()
    this.companyService = companyService
    this.$window = $window
    this.keyResult = {}
    this.objective;

    this.initialize()
}

KeyResultController.prototype.initialize = function () {
    if (this.items) {
        this.keyResult = angular.copy(this.items)
        this.keyResult.owner = this.keyResult.owner._id
    } else if (this.keyResultService.getKeyResultFactory()) {
        this.keyResult = this.keyResultService.getKeyResultFactory()

        if (this.keyResult.owner)
            this.keyResult.owner = this.keyResult.owner._id
    }

    this.loadUsers()
    this.objective = angular.copy(this.objectiveService.getObjectiveFactory())

    if (!this.keyResult.name) {
        this.keyResult = {}
        this.keyResult.objective = this.objective._id
        this.keyResult.owner = this.user._id
        this.keyResult.format = 'unitary'
    }
    this.users = this.userService.getUsersListFactory()

    this.oldTarget = angular.copy(this.keyResult.targetValue)
    this.oldType = angular.copy(this.keyResult.type)
    this.oldCriteria = angular.copy(this.keyResult.criteria)
}

KeyResultController.prototype.loadUsers = function () {
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

KeyResultController.prototype.checkKeyId = function () {
    if (!this.keyResult._id)
        return false

    return true
}

KeyResultController.prototype.checkOwner = function () {
    if (this.user._id == this.objective.owner._id)
        return false

    return true
}


KeyResultController.prototype.save = function () {

    if (this.keyResult.targetValue == this.keyResult.inicialValue && this.keyResult.type != 'boolean' && !this.keyResult._id) {
        swal("Valores incosistentes!", "O valor inicial definido é igual ao valor alvo.", "warning");
        return
    }

    if (this.keyResult.targetValue == this.keyResult.currentValue && this.keyResult.type != 'boolean' && this.keyResult._id && !this.keyResult.inicialValue) {
        swal("Valores incosistentes!", "Defina um valor realizado diferente do valor alvo.", "warning");
        return
    }

    if (this.keyResult.criteria == "atMost" && this.keyResult.currentValue == undefined)
        if (this.keyResult.targetValue > this.keyResult.inicialValue) {
            swal("Valores incosistentes!", "O valor inicial definido é menor que o valor alvo e seu critério é: 'Menor ou igual'.", "warning");
            return
        }
    if (this.keyResult.criteria == "atLeast")
        if (this.keyResult.targetValue < this.keyResult.inicialValue) {
            swal("Valores incosistentes!", "O valor inicial definido é maior que o valor alvo e seu critério é: 'Maior ou igual'.", "warning");
            return
        }

    if (this.keyResultService.getKeyResultFactory() || this.items) {
        this.editKeyResult()
        return
    }

    this.newKeyResult()
    this.mixpanel('Salvou um resultado chave')

}

KeyResultController.prototype.newKeyResult = function () {
    var that = this,
        i,
        owner = {}

    this.keyResult.currentValue = 0 + this.keyResult.inicialValue
    this.keyResult.objective = that.objective._id

    this.keyResultService.newKeyResult(this.keyResult)
        .then(function (res) {
            i = _.findIndex(that.users, function (o) {
                return o._id == that.keyResult.owner
            });
            that.keyResult = {
                _id: res.data
            }
            that.keyResult._id.owner = {
                '_id': that.users[i]._id,
                'firstName': that.users[i].firstName,
                'lastName': that.users[i].lastName
            }
            that.objective.keyResults.push(that.keyResult)
            angular.copy(that.objective, that.objectiveService.getObjectiveFactory())
            that.closeModal()
            that.$window.location.reload();
        })
        .catch(function (err) {
            console.log(err);
        });
};

KeyResultController.prototype.editKeyResult = function () {
    var that = this,
        i,
        owner = {}

    if (that.oldTarget != this.keyResult.targetValue) {
        this.keyResult.recalculate = true
        // this.keyResult.inicialValue = this.keyResult.currentValue
    }

    if (that.oldName != this.keyResult.name) {
        this.keyResult.recalculate = true
        // this.keyResult.inicialValue = this.keyResult.currentValue
    }

    if (that.oldType != this.keyResult.type) {
        this.keyResult.recalculate = true

        if (this.keyResult.type == 'boolean') {
            this.keyResult.finished = false

            delete this.keyResult.inicialValue
            delete this.keyResult.currentValue
            delete this.keyResult.targetValue
        } else
            this.keyResult.finished = false
    }

    if (that.oldCriteria != this.keyResult.criteria) {
        this.keyResult.recalculate = true

        if (this.keyResult.criteria == "atMost")
            if (this.keyResult.targetValue > this.keyResult.currentValue) {
                swal("Valores incosistentes!", "O valor inicial definido é menor que o valor alvo e seu critério é: 'Menor ou igual'.", "warning");
                return
            }
        if (this.keyResult.criteria == "atLeast")
            if (this.keyResult.targetValue < this.keyResult.currentValue) {
                swal("Valores incosistentes!", "O valor inicial definido é maior que o valor alvo e seu critério é: 'Maior ou igual'.", "warning");
                return
            }
    }

    if (!this.keyResult.inicialValue && this.keyResult.type == 'number') {
        this.keyResult.recalculate = true
        this.keyResult.inicialValue = this.keyResult.currentValue
    }

    this.keyResult.edit = true

    this.keyResultService.updateKeyResult(this.keyResult)
        .then(function (res) {
            i = _.findIndex(that.users, function (o) {
                return o._id == that.keyResult.owner
            });
            that.keyResult.owner = {
                '_id': that.users[i]._id,
                'firstName': that.users[i].firstName,
                'lastName': that.users[i].lastName
            }
            angular.copy(that.keyResult, that.keyResultService.getKeyResultFactory())
            that.closeModal()
            that.$window.location.reload();
        })
        .catch(function (err) {
            console.log(err);
        });
};

KeyResultController.prototype.verifyRequiredFields = function () {
    if (this.keyResult._id) {
        if (!this.keyResult.name || !this.keyResult.type)
            return true

        if (this.keyResult.type == 'number' && this.hideInput) {
            if (this.keyResult.targetValue == undefined || this.keyResult.currentValue == undefined)
                return true
        }

        if (this.keyResult.type == 'number' && (this.keyResult.targetValue == undefined || this.keyResult.currentValue == undefined))
            return true

        return false
    }

    if (this.keyResult.type == 'number') {
        if (!this.keyResult.name || !this.keyResult.type || !this.keyResult.owner)
            return true

        if (this.keyResult.type == 'number' && this.keyResult.format != 'percent') {
            if (this.keyResult.targetValue == undefined || this.keyResult.inicialValue == undefined || !this.keyResult.criteria)
                return true
        } else {
            if (this.keyResult.inicialValue == undefined || !this.keyResult.criteria)
                return true
        }
    } else {
        if (!this.keyResult.name || !this.keyResult.type || !this.keyResult.owner)
            return true
    }

    return false

}

KeyResultController.prototype.closeModal = function () {
    this.$uibModalInstance.close('cancel')
};

KeyResultController.prototype.mixpanel = function (msg) {
    mixpanel.track(msg);

}

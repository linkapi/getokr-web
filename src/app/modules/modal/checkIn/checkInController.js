'use strict'

var appModule = require('../../../appModule');

appModule.controller('checkInController', CheckInController);

CheckInController.$inject = ['$uibModalInstance', 'userService', 'keyResultService', '$window', 'items', 'objectiveService', 'uploadService', 'commentService']

function CheckInController($uibModalInstance, userService, keyResultService, $window, items, objectiveService, uploadService, commentService) {
    this.$uibModalInstance = $uibModalInstance
    this.userService = userService
    this.keyResultService = keyResultService
    this.$window = $window
    this.items = items
    this.objective
    this.objectiveService = objectiveService
    this.uploadService = uploadService
    this.commentService = commentService
    this.user = this.userService.getUserFactory()
    this.keyResult
    this.newValue = []
    this.data = []
    this.checkInModifications = []
    this.logicalCurrents = []
    this.comment = {}

    this.initialize()
}

CheckInController.prototype.initialize = function () {
    var that = this

    _.forEach(this.items.keyResults, function (key, index) {
        if (key._id.type == 'boolean')
            that.logicalCurrents[index] = key._id.finished
    })
};

CheckInController.prototype.setNewValue = function (key, index) {

    if (this.checkInModifications.length && !this.trustLevelChanged)
        _.remove(this.checkInModifications, function (modification) {
            if (modification.keyId == key._id)
                return modification
        })

    if(this.trustLevelChanged){
        this.trustLevelChanged = !this.trustLevelChanged

        var index = _.findIndex(this.checkInModifications, function(modification){
            return modification.keyId == key._id
        })

        if(index == -1){
            this.checkInModifications.push({
                trustLevel: key.trustLevel,
                keyId: key._id
            })
            return
        } else {
            this.checkInModifications[index].trustLevel = key.trustLevel
            return
        }
        
    }
    if (typeof (this.newValue[index]) != 'number' && typeof (this.newValue[index]) != 'boolean')
        return

    if (this.items.keyResults[index]._id.currentValue == this.newValue[index] && typeof (this.newValue[index]) == 'number')
        return

    if (this.logicalCurrents[index] == this.newValue[index] && typeof (this.newValue[index]) == 'boolean')
        return

    this.checkInModifications.push({
        newValue: this.newValue[index],
        keyId: key._id,

    })
};

CheckInController.prototype.formatDate = function (date) {
    return moment(date).format('L')
}

CheckInController.prototype.formatTime = function (date) {
    return moment(date).format('LTS')
}

CheckInController.prototype.getLastCheckInDate = function (key) {
    return this.formatDate(key._id.checkIns[key._id.checkIns.length - 1]._id.insertDate)
}

CheckInController.prototype.getLastCheckInTime = function (key) {
    return this.formatTime(key._id.checkIns[key._id.checkIns.length - 1]._id.insertDate)
}

CheckInController.prototype.save = function () {
    var that = this,
        keyResultPromises = [],        
        changesToTrustLevel = false

    that.comment.keysModified = []
    that.comment.newValues = []

    _.forEach(this.checkInModifications, function (checkIn) {
        _.forEach(that.items.keyResults, function (key) {            
            key._id.recalculate = true

            if (checkIn.keyId == key._id._id) {
                if (key._id.type == 'number' && checkIn.newValue!=undefined && checkIn.newValue != key._id.currentValue) {
                    key._id.oldValue = key._id.currentValue
                    key._id.currentValue = checkIn.newValue  

                    if(checkIn.trustLevel)  
                        key._id.changesToTrustLevel = true

                    keyResultPromises.push(that.keyResultService.updateKeyResult(key._id))

                    if(that.comment.keysModified.indexOf(key._id._id) == -1)
                        that.comment.keysModified.push(key._id._id)

                    that.comment.newValues.push(key._id.currentValue)
                }
                else if(checkIn.trustLevel){
                    changesToTrustLevel = true
                    key._id.trustLevel = checkIn.trustLevel   
                    key._id.changesToTrustLevel = changesToTrustLevel      
                    keyResultPromises.push(that.keyResultService.updateKeyResult(key._id))
                    if(that.comment.keysModified.indexOf(key._id._id) == -1)
                        that.comment.keysModified.push(key._id._id)

                } else{                 
                    keyResultPromises.push(that.keyResultService.updateKeyResult(key._id))

                    if(that.comment.keysModified.indexOf(key._id._id) == -1) 
                        that.comment.keysModified.push(key._id._id)
                }
            }
        })
    })


    if (that.commentContent != '')
        that.comment.content = that.commentContent

    if (!this.comment.keysModified.length && !this.comment.newValues.length && !changesToTrustLevel) {
        swal("Sem mudanças!", "Não há alterações para salvar.", "warning");
        return
    }

    if(this.archive && !that.comment.content){
        swal("Sem comentário!", "Faça um comentário sobre o anexo antes de salvar.", "warning");
        return
    }

    if(this.archive){
        this.uploadService.createUpload(this.archive, this.user._id)    
        .then(function(res){
            that.createCheckIn(keyResultPromises, res.data)
            delete that.archive
        })
        .catch(function(err){
            console.log(err)
        })
    } else
        this.createCheckIn(keyResultPromises)
};

CheckInController.prototype.createCheckIn = function (keyResultPromises, file) {  
    var that = this

    if(file){
        that.comment.upload = file._id
        that.comment.link = file.link
        that.comment.archive_name = file.archive_name
    }

    that.comment.createdBy = that.user._id
    that.comment.objective = that.items._id
    that.comment.insertDate = new Date()

    if(that.comment.content)
        this.commentService.createComment(that.comment)
        .then(function(res){
            
        })
        .catch(function(res){
            console.log(res)
        })

    Promise.all(keyResultPromises)
        .then(function (res) {
            that.closeModal()
            that.$window.location.reload()
        })
        .catch(function (err) {
            console.log(err)
        })
}

CheckInController.prototype.fileSelected = function () {    
    var fileInput = document.getElementById("file-input")

    if(fileInput.files[0]){
        if(fileInput.files[0].$error == 'maxSize'){
            swal("Arquivo muito grande!", "O arquivo selecionado excede o limite de " + fileInput.files[0].$errorParam + ".", "warning");
            return
        }
        this.archive = fileInput.files[0]
    }        
    else
        delete this.archive
}

CheckInController.prototype.getInitials = function (ownerObj) {
    var first,
        last

    first = ownerObj.firstName ? ownerObj.firstName[0].toUpperCase() : ''
    last = ownerObj.lastName ? ownerObj.lastName[0].toUpperCase() : ''

    return first + last
}

CheckInController.prototype.closeModal = function () {
    this.$uibModalInstance.close('cancel')
};

CheckInController.prototype.mixpanel = function (msg) {
    mixpanel.track(msg);

}

'use strict'

var appModule = require('../../appModule');

appModule.controller('objectiveDetailsController', ObjectiveDetailsController);

ObjectiveDetailsController.$inject = ['objectiveService', '$localStorage', 'userService', 'planningSessionService', 'modalService', 'keyResultService', '$stateParams', '$window', 'mainService', 'companyService', 'uploadService', 'commentService']

function ObjectiveDetailsController(objectiveService, $localStorage, userService, planningSessionService, modalService, keyResultService, $stateParams, $window, mainService, companyService, uploadService, commentService) {
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
    this.uploadService = uploadService
    this.commentService = commentService
    this.comments = []
    this.block = false
    this.existsComments = false
    this.commentsLength = 0
    this.commentsLimit = 5
    this.isEditingComment = []

    this.initialize()
}

ObjectiveDetailsController.prototype.initialize = function () {
    var that = this

    this.user = this.userService.getUserFactory()

    this.companyService.findCompanyById(this.user.company)
        .then(function (res) {
            that.company = res.data
        })
        .catch(function (err) {
            console.log(err)
        })

    if (this.planningSessionService.getPlanningFactory()) {
        this.selectedPlanning = this.planningSessionService.getPlanningFactory()
        this.$localStorage.planning = this.selectedPlanning;
    } else
        this.selectedPlanning = this.$localStorage.planning

    this.objectiveService.getObjectiveById(this.$stateParams.id)
        .then(function (res) {
            that.objective = res.data

            that.objectiveService.setObjectiveFactory(that.objective)
            that.checkIns = that.getCheckIns(that.objective)

            that.commentService.getComments(that.objective._id)
                .then(function (res) {
                    that.comments = res.data
                    that.commentsLength = that.comments.length

                    if (that.commentsLength)
                        that.existsComments = true
                    else
                        return

                    that.comments = _.sortBy(that.comments, function (comment) {
                        return new moment(comment.insertDate);
                    }).reverse();

                    that.comments.slice(0, 50)

                })
                .catch(function (err) {
                    console.log(err)
                })
        })
        .catch(function (err) {
            console.log(err)
        })
}

ObjectiveDetailsController.prototype.getKeyNames = function (keys) {
    var keyNames = []

    _.forEach(keys, function (key) {
        keyNames.push(key.name)
    })

    return keyNames.join('\n')
}

ObjectiveDetailsController.prototype.getCheckIns = function (objective) {
    var checkIns = []

    _.forEach(objective.keyResults, function (key) {
        if (key._id.isActive)
            _.forEach(key._id.checkIns, function (checkIn) {
                if (!checkIn._id)
                    return

                checkIn._id.key = key._id.name
                checkIn._id.format = key._id.format
                checkIns.push(checkIn._id)
            })
    })

    checkIns = _.sortBy(checkIns, function (o) {
        return new moment(o.insertDate);
    }).reverse();

    return checkIns.slice(0, 50)
}

ObjectiveDetailsController.prototype.changeProgressBarStatus = function (object) {
    if (!object)
        return

    var progress = object.progress,
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

ObjectiveDetailsController.prototype.getInitials = function (key) {
    if (!this.objective)
        return

    var first,
        last

    if (key) {
        first = key.firstName ? key.firstName[0].toUpperCase() : ''
        last = key.lastName ? key.lastName[0].toUpperCase() : ''
    } else {
        if (this.objective.ownerType == 'user') {
            first = this.objective.owner.firstName ? this.objective.owner.firstName[0].toUpperCase() : ''
            last = this.objective.owner.lastName ? this.objective.owner.lastName[0].toUpperCase() : ''
        } else {
            first = this.objective.team.name ? this.objective.team.name[0].toUpperCase() : ''
            last = ''
        }
    }

    return first + last
}

ObjectiveDetailsController.prototype.editObjective = function () {
    this.planningSessionService.setPlanningFactory(this.selectedPlanning)
    this.modalService.searchModal('editObjective', this.objective);
    this.mixpanel('Clicou no ícone para editar objetivo')
}

ObjectiveDetailsController.prototype.editKeyResult = function (key) {
    this.objectiveService.setObjectiveFactory(this.objective)
    this.modalService.searchModal('updateKeyResult', key);
    this.mixpanel('Clicou no ícone para editar resultado chave')
}

ObjectiveDetailsController.prototype.addKeyResult = function () {
    this.objectiveService.setObjectiveFactory(this.objective)
    this.keyResultService.setKeyResultFactory()
    this.modalService.searchModal('addKeyResult')
    this.mixpanel('Clicou no botão "+ Novo resultado chave"')
}

ObjectiveDetailsController.prototype.addCheckIn = function (key) {
    if (!key) {
        this.keyResultService.setKeyResultListFactory(this.objective.keyResults)
        this.modalService.searchModal('addCheckIn', this.objective)
        this.mixpanel('Clicou no botão fazer check-in')
    } else {
        this.keyResultService.setKeyResultListFactory(key)
        var objective = angular.copy(this.objective)
        objective.keyResults = _.filter(objective.keyResults, function (keyResult) {
            return keyResult._id.name == key._id.name
        })
        this.modalService.searchModal('addCheckIn', objective)
        this.mixpanel('Clicou no botão fazer check-in')
    }
}

ObjectiveDetailsController.prototype.fileSelected = function () {
    var fileInput = document.getElementById("file-input")

    if (fileInput.files[0]) {
        if (fileInput.files[0].$error == 'maxSize') {
            swal("Arquivo muito grande!", "O arquivo selecionado excede o limite de " + fileInput.files[0].$errorParam + ".", "warning");
            return
        }
        this.archive = fileInput.files[0]
    } else
        delete this.archive
}

ObjectiveDetailsController.prototype.deleteKeyResult = function (key) {
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
                        that.initialize()
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        });
    this.mixpanel('Clicou no ícone para arquivar resultado chave')
}

ObjectiveDetailsController.prototype.formatNumber = function (keyValue, format) {
    if (format == 'percent')
        return keyValue.toFixed(0)

    return keyValue.toFixed(2)
}

ObjectiveDetailsController.prototype.showCommentIcons = function (index, bool) {
    this.comments[index].show = bool
};

ObjectiveDetailsController.prototype.deleteComment = function (index, event) {
    var that = this

    event.preventDefault();

    if (this.user._id == this.comments[index].createdBy._id) {
        swal({
                title: "Você tem certeza?",
                text: "Após excluído, o comentário não pode ser recuperado!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Sim, tenho certeza!",
                cancelButtonText: "Não, cancelar!",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm) {
                    that.commentService.delete(that.comments[index])
                        .then(function (res) {
                            that.comments.splice(index, 1)
                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                    that.commentsLength--
                }
            });
    } else {
        swal("Permissão negada!", "Você não é o dono deste comentário, somente o dono pode excluí-lo.", "error")
    }
    this.mixpanel('Deletou um comentário em detalhes do objetivo')

}

ObjectiveDetailsController.prototype.verifyKeyPressed = function (index, event, textArea, objCheckIn) {
    var that = this

    if (this.user._id != this.comments[index].createdBy._id)
        swal("Permissão negada!", "Você não é o dono deste comentário, somente o dono pode editá-lo.", "error");

    if (!event || !textArea || !objCheckIn)
        setTimeout(function () {
            if (that.comments[index].content != undefined) {
                that.commentService.updateComment(that.comments[index])
                    .then(function (res) {
                        that.comments[index] = res.data
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        }, 50)
    else
        setTimeout(function () {
            that.comments[index].content = textArea.$parent.$data
        }, 50)

};

ObjectiveDetailsController.prototype.newComment = function (event) {
    var that = this

    if (this.archive) {
        this.uploadService.createUpload(this.archive, this.user._id)
            .then(function (res) {
                that.createComment(res.data)
                delete that.archive
            })
            .catch(function (err) {
                console.log(err)
            })
    } else {
        this.createComment()
    }
}

ObjectiveDetailsController.prototype.createComment = function (file) {
    var comment = {},
        that = this

    if (file) {
        comment.upload = file._id
        comment.link = file.link
        comment.archive_name = file.archive_name
    }

    comment.content = document.getElementById("commentTextArea").value;
    document.getElementById("commentTextArea").value.replace(/\n/g, "")
    document.getElementById("commentTextArea").value = ""


    comment.objective = this.objective._id
    comment.createdBy = this.user._id
    comment.insertDate = new Date()

    this.commentsLength++
        this.existsComments = true

    this.commentService.createComment(comment)
        .then(function (res) {
            that.comments.push(res.data)
            that.comments = _.sortBy(that.comments, function (comment) {
                return new moment(comment.insertDate);
            }).reverse();

            return that.comments.slice(0, 50)
        })
        .catch(function (err) {
            console.log(err)
        })

    this.mixpanel('Criou um novo comentário em detalhes do objetivo')
}

ObjectiveDetailsController.prototype.archivateObjective = function () {
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
                that.mainService.delete(that.objective)
                    .then(function (res) {
                        swal("Arquivado!", "O objetivo foi arquivado.", "success");
                        that.$window.history.back();
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        });
    this.mixpanel('Clicou no ícone para arquivar objetivo')
}

ObjectiveDetailsController.prototype.generateGraph = function (key) {
    this.keyResultService.setKeyResultFactory(key)
    this.modalService.searchModal('checkInGraph');
    this.mixpanel('Clicou no ícone para gerar gráfico de check in de resultado chave')
}

ObjectiveDetailsController.prototype.back = function () {
    this.$window.history.back();
}

ObjectiveDetailsController.prototype.formatDate = function (date) {
    return moment(date).format('L')
}

ObjectiveDetailsController.prototype.getLastUpdate = function (date) {
    return moment(date).fromNow(true)
}

ObjectiveDetailsController.prototype.formatTime = function (date) {
    return moment(date).format('LT')
}

ObjectiveDetailsController.prototype.verifyLogicalKeyStatus = function (key) {
    var that = this,
        result

    _.forEach(that.objective.keyResults, function (keyResult) {
        if (keyResult._id.name == key) {
            if (keyResult._id.finished)
                result = 'Concluído'
            else
                result = 'Não concluído'
        }
    })
    return result
}

ObjectiveDetailsController.prototype.getLastCheckInDate = function (key) {
    if (!key._id.checkIns)
        return

    if (key._id.checkIns[key._id.checkIns.length - 1]._id)
        return this.getLastUpdate(key._id.checkIns[key._id.checkIns.length - 1]._id.insertDate)

    return
}

ObjectiveDetailsController.prototype.getLastCheckInTime = function (key) {
    if (key._id.checkIns[key._id.checkIns.length - 1]._id)
        return this.formatTime(key._id.checkIns[key._id.checkIns.length - 1]._id.insertDate)

    return
}

ObjectiveDetailsController.prototype.checkInsValue = function (value) {
    return (value * 100).toFixed(0)
}

ObjectiveDetailsController.prototype.mixpanel = function (msg) {
    mixpanel.track(msg);
}

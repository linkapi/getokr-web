'use strict'

var appModule = require('../../appModule')
var _ = require('lodash')

FeedController.$inject = ['objectiveService', 'planningSessionService', 'userService', 'checkInService', 'keyResultService', 'companyService', 'trackService', '$localStorage', '$rootScope', '$location', '$anchorScroll', '$window'];

function FeedController(objectiveService, planningSessionService, userService, checkInService, keyResultService, companyService, trackService, $localStorage, $rootScope, $location, $anchorScroll, $window) {
    this.objectiveService = objectiveService
    this.planningSessionService = planningSessionService
    this.userService = userService
    this.checkInService = checkInService
    this.keyResultService = keyResultService
    this.companyService = companyService
    this.trackService = trackService

    this.$localStorage = $localStorage
    this.$rootScope = $rootScope
    this.$location = $location
    this.$anchorScroll = $anchorScroll
    this.$window = $window

    this.user = this.userService.getUserFactory()
    this.loadView = false
    this.range = 'week'
    this.users = []
    this.filter = {
        company: userService.getUserFactory().company,
        tags: [],
        owner: [],
        hierarchy: ''
    }
    this.keyResults = []
    this.tracks = []
    this.skip = 0
    this.anchorIndex = 0

    var that = this

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

FeedController.prototype.initialize = function () {
    var that = this

    this.companyService.getCompanyUsers()
        .then(function (res) {
            that.usersFilter = _.forEach(res.data, function (user) {
                user.customName = user.firstName + ' ' + user.lastName
            })
        })
        .catch(function (err) {
            console.log(err)
        })

    this.loadUsers()
}

FeedController.prototype.loadTracks = function (dateRange) {
    var that = this,
        query = {
            company: this.userService.getUserFactory().company,
            range: dateRange || that.range,
            skip: that.skip,
            owners: that.filter.owner
        }

    if (dateRange != undefined)
        this.range = dateRange

    this.trackService.getCompanyTracks(query)
        .then(function (res) {
            if (!res.data.length) {
                that.hideButtons = true
                return
            }
            that.$location.hash('feed' + (that.anchorIndex - 1));
            that.$anchorScroll();
            _.forEach(res.data, function (track) {
                that.tracks.push(track)
                that.anchorIndex++
            })

        })
        .catch(function (err) {
            console.log(err)
        })
}

FeedController.prototype.getUpperCase = function (user) {
    return (user.firstName).toUpperCase() + ' ' + (user.lastName).toUpperCase()
}

FeedController.prototype.loadUsers = function () {
    var that = this

    this.companyService.getCompanyUsers()
        .then(function (res) {
            if (that.filter.owner.length)
                _.remove(res.data, function (user) {
                    var filter = [],
                        exists = false
                    _.forEach(that.filter.owner, function (owner, index) {
                        filter.push(false)
                        if (user._id.indexOf(owner) != -1)
                            filter[index] = true
                    })
                    _.forEach(filter, function (bool) {
                        if (bool)
                            exists = true
                    })
                    if (!exists)
                        return user
                })
            that.users = _.forEach(res.data, function (user) {
                user.customName = user.firstName + ' ' + user.lastName
            })
            that.userService.setUsersListFactory(that.users)
            that.loadTracks()
        })
        .catch(function (err) {
            console.log(err)
        })
}

FeedController.prototype.userHaveName = function (user) {
    if (user.firstName == undefined)
        return user.username

    return user.firstName + ' ' + user.lastName
}

FeedController.prototype.formatDate = function (date) {
    return moment(date).format('L')
}

FeedController.prototype.formatTime = function (date) {
    return moment(date).format('LT')
}

FeedController.prototype.showMore = function () {
    if (this.range == 'week')
        this.skip += 10
    else if (this.range == 'month')
        this.skip += 20
    else
        this.skip += 50

    this.loadTracks()
}

FeedController.prototype.formatCurrent = function (checkIn) {
    if (checkIn.keyResult.type == 'number') {
        if (checkIn.keyResult.format == 'unitary')
            return checkIn.value
        else if (checkIn.keyResult.format == 'money')
            return 'R$' + new Number(checkIn.value).toFixed(2)
        else
            return (checkIn.value * 100).toFixed(0) + '%'
    }
}

FeedController.prototype.formatTarget = function (checkIn) {
    if (checkIn.keyResult.type == 'number') {
        if (checkIn.keyResult.format == 'unitary')
            return checkIn.keyResult.targetValue
        else if (checkIn.keyResult.format == 'money')
            return 'R$' + new Number(checkIn.keyResult.targetValue).toFixed(2)
        else
            return (checkIn.keyResult.targetValue * 100).toFixed(0) + '%'
    }
}

FeedController.prototype.formatOldValue = function (checkIn) {
    if (checkIn.keyResult.type == 'number') {
        if (checkIn.keyResult.format == 'unitary')
            return checkIn.oldValue
        else if (checkIn.keyResult.format == 'money')
            return 'R$' + new Number(checkIn.oldValue).toFixed(2)
        else
            return (checkIn.oldValue * 100).toFixed(0) + '%'
    }
}

FeedController.prototype.isKeyFinished = function (key) {
    if (key.type == 'number') {
        if (key.criteria == 'atLeast' && key.currentValue >= key.targetValue)
            return true
        if (key.criteria == 'atMost' && key.currentValue <= key.targetValue)
            return true
        return false
    } else {
        if (key.finished)
            return true
        return false
    }
}

FeedController.prototype.resetData = function (dateRange) {
    this.skip = 0
    this.anchorIndex = 0
    this.tracks = []

    this.loadTracks(dateRange || this.range)
    this.mixpanel('Clicou no botão última semana / último mês na tela Últimas atualizações')
}

FeedController.prototype.createMessage = function (track) {
    var message = ''
    if (track.type == 'create')
        message += ' criou '
    else if (track.type == 'update')
        message += ' modificou '
    else
        message += ' arquivou '

    switch (track.target) {
        case 'keyResult':
            message += 'o resultado chave'
            break
        case 'trustLevel':
            if (track.keyResult.trustLevel == 'low')
                message += 'para BAIXO o nível de confiança do resultado chave'
            else if (track.keyResult.trustLevel == 'normal')
                message += 'para NORMAL o nível de confiança do resultado chave'
            else
                message += 'para ALTO o nível de confiança do resultado chave'
            break
        case 'objective':
            message += 'o objetivo'
            break
        case 'checkIn':
            message = 'fez um check-in em '
            break
        case 'planning':
            message += 'o ciclo'
            break
        case 'comment':
            message += 'um comentário no objetivo'
            break
        case 'user':
            if (track.type == 'create')
                message += ' um usuário'
            else
                message += ' o usuário'
            break
        case 'team':
            message += 'o time'
            break
    }

    return message
}

FeedController.prototype.verifyUserCreation = function (track) {
    if (track.target == 'user' && track.type == 'create')
        return false

    return true
}

FeedController.prototype.filterByUser = function () {
    this.skip = 0
    this.tracks = []
    this.anchorIndex = 0
    this.loadUsers()
}

FeedController.prototype.getObjectName = function (track) {
    switch (track.target) {
        case 'keyResult':
            return track.keyResult.name
            break
        case 'trustLevel':
            return track.keyResult.name
            break
        case 'objective':
            return track.objective.name
            break
        case 'planning':
            return track.planning.name
            break
        case 'comment':
            return track.comment.objective.name
            break
        case 'user':
            return track.user.firstName + ' ' + track.user.lastName
            break
        case 'team':
            return track.team.name
            break
        case 'checkIn':
            return track.checkIn.keyResult.name
            break
    }
}

FeedController.prototype.getIcon = function (track) {
    switch (track.target) {
        case 'keyResult':
            return 'fa fa-key m-r-xs'
            break
        case 'trustLevel':
            return 'fa fa-key m-r-xs'
            break
        case 'objective':
            return 'ion-ribbon-b m-r-xs'
            break
        case 'planning':
            return 'glyphicon glyphicon-calendar m-r-xs'
            break
        case 'comment':
            return 'ion-ribbon-b m-r-xs'
            break
        case 'user':
            return 'fa fa-user m-r-xs'
            break
        case 'team':
            return 'fa fa-users m-r-xs'
            break
        case 'checkIn':
            return 'fa fa-key m-r-xs'
            break
    }
}

FeedController.prototype.mixpanel = function (msg) {
    mixpanel.track(msg);
}

FeedController.prototype.resetFilter = function () {
    this.filter.owner = []

    this.filterByUser()
}

appModule.controller('feedController', FeedController)

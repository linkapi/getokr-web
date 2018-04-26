'use strict'

var appModule = require('../../appModule');

appModule.controller('tagsController', TagController);

function TagController(tagService, userService, $window) {
    this.tagService = tagService
    this.userService = userService
    this.$window = $window
    this.tags = []

    this.initialize()
}

TagController.prototype.initialize = function () {
    var that = this

    this.tagService.getCompanyTags(this.userService.getUserFactory().company)
        .then(function (res) {
            that.tags = res.data.map(function (tag, n, key) {
                return {
                    name: tag.name,
                    letter: tag.name.substring(0, 1).toUpperCase(),
                    _id: tag._id
                };
            })
        })
        .catch(function (err) {
            console.log(err)
        })
}

TagController.prototype.createTag = function () {
    var that = this,
        exists,
        newTag = {
            company: this.userService.getUserFactory().company
        }

    exists = _.findIndex(that.tags, function (e) {
        return e.name == that.newTagName
    });

    if (exists != -1) {
        swal("Esta tag já existe!")
        return
    }

    newTag.name = that.newTagName

    this.tagService.create(newTag)
        .then(function (res) {
            that.newTagName = ''
            that.initialize()
        })
        .catch(function (err) {
            that.newTagName = ''
            console.log(err)
        })
};

TagController.prototype.delete = function (id) {
    var that = this

    this.tagService.delete(id)
        .then(function (res) {
            that.initialize()
        })
        .catch(function (err) {
            console.log(err)
        })
}


TagController.prototype.focusOnPopup = function () {
    document.getElementById('newTagName').focus();
}

TagController.prototype.back = function () {
    this.$window.history.back();
}

TagController.prototype.mixpanel = function (msg) {
    mixpanel.track(msg);

}
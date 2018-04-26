var appModule = require('../../appModule');

appModule.service('commentService', CommentService);

CommentService.$inject = ['$http', 'Configuration']

function CommentService($http, Configuration) {
  this.$http = $http;
  this.Configuration = Configuration;
}

CommentService.prototype.createComment = function(comment) {
    return this.$http({
        method: 'POST',
        url: this.Configuration.serviceUrl + 'comment',
        data: comment
    })
}

CommentService.prototype.updateComment = function(comment) {
    return this.$http({
        method: 'PATCH',
        url: this.Configuration.serviceUrl + 'comment/' + comment._id,
        data: comment
    })
}

CommentService.prototype.delete = function(comment) {
    return this.$http({
        method: 'DELETE',
        url: this.Configuration.serviceUrl + 'comment/' + comment._id
    })
}

CommentService.prototype.getComments = function(objectiveId) {
    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + 'comment/' + objectiveId
    });
}
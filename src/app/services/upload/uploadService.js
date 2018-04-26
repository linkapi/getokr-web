'use strict'

var appModule = require('../../appModule')

appModule.service('uploadService', UploadService)

function UploadService($http, Configuration, Upload) {
    this.urlBase = Configuration.serviceUrl
    this.$http = $http
    this.Upload = Upload
}

UploadService.prototype.createUpload = function (file, upload) {
    return this.Upload.upload({
        url: this.urlBase + 'upload',
        method: 'POST',
        data: {
            'Content-Type': file.type,
            filename: file.name,
            file: file,
            user: upload            
        }
    })
}




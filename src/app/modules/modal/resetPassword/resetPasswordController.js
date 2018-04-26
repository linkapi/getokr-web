'use strict'

var appModule = require('../../../appModule');

appModule.controller('resetPasswordController', ResetPasswordController);

ResetPasswordController.$inject = ['$uibModalInstance', 'userService']

function ResetPasswordController($uibModalInstance, userService) {

    this.currentPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
    this.$uibModalInstance = $uibModalInstance;
    this.userService = userService;
    this.user = userService.getUserFactory()._id;

}

ResetPasswordController.prototype.closeModal = function () {
    var that = this
    that.$uibModalInstance.close();
};

ResetPasswordController.prototype.save = function () {
    var that = this
    if (that.currentPassword) {
        if (that.newPassword !== that.confirmNewPassword) {
            swal("Senha inválida", "Confirmação de senha não confere", "warning");
            return false;
        } else {
            this.changePassword();
        }
    }
};

ResetPasswordController.prototype.changePassword = function () {
    var that = this,
        data

    data = {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
        user: this.user
    }


    that.userService.changePassword(data)
        .then(function () {
            swal("Senha alterada!", "Sua senha foi modificada com sucesso", "success");
            that.$uibModalInstance.close();
        })
        .catch(function (err) {
            if (err.status === 400) {
                swal("Senha inválida", "Senha atual incorreta", 'warning');
            } else if (err.status !== 500) {
                swal("Erro!", "Ocorreu um erro inesperado", "error");
                console.log(err);
            }
        });
}

ResetPasswordController.prototype.mixpanel = function (msg) {
    mixpanel.track(msg);

}
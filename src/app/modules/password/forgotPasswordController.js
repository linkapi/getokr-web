'use strict';

var appModule = require('../../appModule');

ForgotPasswordController.$inject = ['forgotPasswordService', '$location', '$stateParams'];

function ForgotPasswordController(forgotPasswordService, $location, $stateParams) {
    this.forgotPasswordService = forgotPasswordService
    this.$location = $location
    this.$stateParams = $stateParams
    this.forgotButtonText = "Redefinir minha senha";
    this.email
    this.token
    this.newPassword
    this.newPasswordConfirmation

    this.initialize()
}

ForgotPasswordController.prototype.initialize = function () {
    var that = this

    if(this.$stateParams.token)
        that.token = true
}

ForgotPasswordController.prototype.sendResetLink = function () {
    var that = this
    mixpanel.track("Usuário pediu para redefinir a senha");

    that.forgotPasswordService.sendResetLink(this.email)
        .then(function (res) {
            that.$location.path('/login')
            swal("E-mail enviado!", "Um link de recuperação de senha foi enviado. Por favor, acesse seu e-mail para continuar o procedimento.", "success");
        })
        .catch(function (err) {
            console.log(err);
        });
}

ForgotPasswordController.prototype.changePassword = function () {
    var that = this
    mixpanel.track("Usuário pediu para redefinir a senha");

    if(that.newPassword != that.newPasswordConfirmation)
        swal("Senhas não conferem!", "A senha diverge da confirmação da senha, informe-as novamente por favor.", "error");
    else{
        that.forgotPasswordService.changePassword(this.$stateParams.token, that.newPassword)
        .then(function (res) {
            that.$location.path('/login')
            swal("Senha alterada!", "Pronto, você possui uma nova senha, faça seu login agora.", "success");
        })
        .catch(function (err) {
            console.log(err);
        });
    }
    
}

appModule.controller('forgotPasswordController', ForgotPasswordController);
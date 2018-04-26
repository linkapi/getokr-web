'use strict'


module.exports = function () {
    require('./login/loginService')
    require('./main/mainService')
    require('./planningSession/planningSessionService')
    require('./objective/objectiveService')
    require('./company/companyService')
    require('./keyResult/keyResultService')
    require('./utils/sweet-alert')
    require('./checkIn/checkInService')
    require('./httpInterceptor')
    require('./modal/modalService')
    require('./user/userService')
    require('./tag/tagService')
    require('./team/teamService')
    require('./password/forgotPasswordService')
    require('./security/securityService')
    require('./notification/notificationService')
    require('./upload/uploadService')
    require('./comment/commentService')
    require('./track/trackService')

}

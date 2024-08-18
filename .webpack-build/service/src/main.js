/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core/envs/index.ts":
/*!********************************!*\
  !*** ./src/core/envs/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.envs = void 0;
exports.envs = {
    FROM_ADDRESS: String(process.env.FROM_ADDRESS),
    AWS_REGION: String(process.env.AWS_REGION),
};


/***/ }),

/***/ "./src/core/helpers/email-template-manager.helper.ts":
/*!***********************************************************!*\
  !*** ./src/core/helpers/email-template-manager.helper.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailTemplateManager = void 0;
class EmailTemplateManager {
    rawTemplate;
    modifiedTemplate;
    replacements;
    constructor(rawTemplate) {
        this.modifiedTemplate = this.rawTemplate = rawTemplate;
        Object.freeze(this.rawTemplate);
    }
    get(args) {
        this.replacements = args;
        this.execReplacements();
        return this.modifiedTemplate;
    }
    execReplacements() {
        Object.keys(this.replacements).forEach((key) => (this.modifiedTemplate = this.modifiedTemplate.replace(new RegExp(`@@${key}`, "g"), this.replacements[key])));
    }
}
exports.EmailTemplateManager = EmailTemplateManager;


/***/ }),

/***/ "./src/core/infra/aws/SES/send-email-command.ts":
/*!******************************************************!*\
  !*** ./src/core/infra/aws/SES/send-email-command.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SESSendEmailCommand = void 0;
const client_ses_1 = __webpack_require__(/*! @aws-sdk/client-ses */ "@aws-sdk/client-ses");
class SESSendEmailCommand {
    execute(props) {
        const { destination, message, source } = props;
        const destinationConfig = {
            CcAddresses: destination.ccAddress,
            ToAddresses: destination.toAddress,
        };
        const emailBodyConfig = {
            Html: {
                Charset: "UTF-8",
                Data: message.content,
            },
        };
        const emailSubjectConfig = {
            Charset: "UTF-8",
            Data: message.subject,
        };
        return new client_ses_1.SendEmailCommand({
            Destination: destinationConfig,
            Message: {
                Body: emailBodyConfig,
                Subject: emailSubjectConfig,
            },
            Source: source.fromAddress,
        });
    }
}
exports.SESSendEmailCommand = SESSendEmailCommand;


/***/ }),

/***/ "./src/core/infra/aws/SES/ses-client.ts":
/*!**********************************************!*\
  !*** ./src/core/infra/aws/SES/ses-client.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sesClient = void 0;
const envs_1 = __webpack_require__(/*! ../../../envs */ "./src/core/envs/index.ts");
const client_ses_1 = __webpack_require__(/*! @aws-sdk/client-ses */ "@aws-sdk/client-ses");
exports.sesClient = new client_ses_1.SESClient({ region: envs_1.envs.AWS_REGION });


/***/ }),

/***/ "./src/core/infra/email-creator.ts":
/*!*****************************************!*\
  !*** ./src/core/infra/email-creator.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailCreator = void 0;
class EmailCreator {
    emailProvider;
    emailTemplateManager;
    constructor(emailProvider, emailTemplateManager) {
        this.emailProvider = emailProvider;
        this.emailTemplateManager = emailTemplateManager;
    }
    async send(templateParams, emailParams) {
        const content = this.emailTemplateManager.get(templateParams);
        const emailInfo = this.setEmailInfo();
        await this.emailProvider.send({
            content,
            ...emailInfo,
            ...emailParams,
        });
    }
}
exports.EmailCreator = EmailCreator;


/***/ }),

/***/ "./src/core/providers/email-provider.ts":
/*!**********************************************!*\
  !*** ./src/core/providers/email-provider.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailProvider = void 0;
const ses_client_1 = __webpack_require__(/*! ../infra/aws/SES/ses-client */ "./src/core/infra/aws/SES/ses-client.ts");
class EmailProvider {
    sesSendEmailCommand;
    constructor(sesSendEmailCommand) {
        this.sesSendEmailCommand = sesSendEmailCommand;
    }
    async send({ ...props }) {
        const sendEmailCommand = this.sesSendEmailCommand.execute({
            message: {
                content: props.content,
                subject: props.subject,
            },
            source: {
                fromAddress: props.fromAddress,
            },
            destination: {
                ccAddress: [],
                toAddress: props.toAddress,
            },
        });
        return await ses_client_1.sesClient.send(sendEmailCommand);
    }
}
exports.EmailProvider = EmailProvider;


/***/ }),

/***/ "./src/functions/email/factories/welcome.factory.ts":
/*!**********************************************************!*\
  !*** ./src/functions/email/factories/welcome.factory.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SendEmailWelcomeFactory = void 0;
const email_provider_1 = __webpack_require__(/*! ../../../core/providers/email-provider */ "./src/core/providers/email-provider.ts");
const welcome_procedure_1 = __webpack_require__(/*! ../procedures/welcome.procedure */ "./src/functions/email/procedures/welcome.procedure.ts");
const template_creator_1 = __webpack_require__(/*! ../templates/welcome/template.creator */ "./src/functions/email/templates/welcome/template.creator.ts");
const send_email_command_1 = __webpack_require__(/*! ../../../core/infra/aws/SES/send-email-command */ "./src/core/infra/aws/SES/send-email-command.ts");
class SendEmailWelcomeFactory {
    create() {
        const sesSendEmailCommand = new send_email_command_1.SESSendEmailCommand();
        const emailProvider = new email_provider_1.EmailProvider(sesSendEmailCommand);
        const welcomeEmailTemplate = new template_creator_1.WelcomeEmailTemplate();
        return new welcome_procedure_1.SendEmailWelcomeProcedure(emailProvider, welcomeEmailTemplate);
    }
}
exports.SendEmailWelcomeFactory = SendEmailWelcomeFactory;


/***/ }),

/***/ "./src/functions/email/handler.ts":
/*!****************************************!*\
  !*** ./src/functions/email/handler.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SendEmailHandler = void 0;
const welcome_factory_1 = __webpack_require__(/*! ./factories/welcome.factory */ "./src/functions/email/factories/welcome.factory.ts");
class SendEmailHandler {
    async handler(event, context) {
        const type = event.pathParameters.type;
        const body = JSON.parse(event.body);
        const welcome = new welcome_factory_1.SendEmailWelcomeFactory().create();
        switch (type) {
            case "welcome":
                welcome.execute(body);
                break;
        }
        return {
            appName: event.appName || "aws-serverless-template",
            appVersion: event.appVersion || "v1",
            functionVersion: context.functionVersion,
            functionName: context.functionName,
        };
    }
}
exports.SendEmailHandler = SendEmailHandler;


/***/ }),

/***/ "./src/functions/email/procedures/welcome.procedure.ts":
/*!*************************************************************!*\
  !*** ./src/functions/email/procedures/welcome.procedure.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SendEmailWelcomeProcedure = void 0;
const email_creator_1 = __webpack_require__(/*! ../../../core/infra/email-creator */ "./src/core/infra/email-creator.ts");
const envs_1 = __webpack_require__(/*! ../../../core/envs */ "./src/core/envs/index.ts");
class SendEmailWelcomeProcedure extends email_creator_1.EmailCreator {
    constructor(emailProvider, emailTemplateManager) {
        super(emailProvider, emailTemplateManager);
    }
    async execute(input) {
        return await this.send({}, { toAddress: input.toAddress });
    }
    setEmailInfo() {
        return {
            subject: "Boas vindas",
            fromAddress: envs_1.envs.FROM_ADDRESS,
        };
    }
}
exports.SendEmailWelcomeProcedure = SendEmailWelcomeProcedure;


/***/ }),

/***/ "./src/functions/email/templates/welcome/template.creator.ts":
/*!*******************************************************************!*\
  !*** ./src/functions/email/templates/welcome/template.creator.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WelcomeEmailTemplate = void 0;
const welcome_template_1 = __webpack_require__(/*! ./welcome.template */ "./src/functions/email/templates/welcome/welcome.template.ts");
const email_template_manager_helper_1 = __webpack_require__(/*! ../../../../core/helpers/email-template-manager.helper */ "./src/core/helpers/email-template-manager.helper.ts");
class WelcomeEmailTemplate extends email_template_manager_helper_1.EmailTemplateManager {
    constructor() {
        super(welcome_template_1.welcomeTemplate);
    }
}
exports.WelcomeEmailTemplate = WelcomeEmailTemplate;


/***/ }),

/***/ "./src/functions/email/templates/welcome/welcome.template.ts":
/*!*******************************************************************!*\
  !*** ./src/functions/email/templates/welcome/welcome.template.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.welcomeTemplate = void 0;
exports.welcomeTemplate = `
<!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>GoalFlow</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <style>
    .separator {
      height: 2px;
      margin-top: 10px;
      background-color: #f3f5f9;
    }
  </style>
</head>

<body style="margin: 0; padding: 0">
  <table style="background-color: #f3f5f9">
    <tr>
      <td style="width: 50px"></td>
      <td>
        <table style="
              background-color: #f3f5f9;
              font-family: Inter, Helvetica, Arial, sans-serif;
              max-width: 600px;
              min-width: 300px;
            ">
          <tr style="height: 10px"></tr>
          <tr>
            <td style="border-top: 3px solid #FF941A">
              <table style="
                    width: 100%;
                    background-color: #ffffff;
                    border-radius: 0px 0px 8px 8px;
                  ">
                <tr>
                  <td style="height: 20px"></td>
                  <td style="height: 20px"></td>
                  <td style="height: 20px"></td>
                </tr>
                <tr style="text-align: center">
                  <td style="width: 20px"></td>

                  <td>
                    <div class="logo">
                      <span class="letter-1">Launch<span class="letter-2">Motion</span></span>
                    </div>
                    <h2 style="
                          font-size: 26px;
                          color: #444444;
                          font-weight: bold;
                        ">
                      Boas vindas
                    </h2>
                  </td>
                  <td style="width: 20px"></td>
                </tr>
                <tr>
                  <td style="width: 20px"></td>
                  <td>
                    <div class="separator"></div>
                  </td>
                </tr>
                <tr>
                  <td style="width: 20px"></td>
                  <td style="
                        width: 88%;
                        font-size: 16px;
                        color: #6b7786;
                        line-height: 1.8;
                        text-align: justify;
                      ">
                    <p>
                      Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for
                      previewing layouts and visual mockups.
                    </p>
                  </td>
                  <td style="width: 20px"></td>
                </tr>
                <tr style="height: 20px"></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="height: 20px"></td>
          </tr>
        </table>
      </td>
      <td style="width: 50px"></td>
    </tr>
  </table>
</body>

</html>
`;


/***/ }),

/***/ "@aws-sdk/client-ses":
/*!**************************************!*\
  !*** external "@aws-sdk/client-ses" ***!
  \**************************************/
/***/ ((module) => {

module.exports = require("@aws-sdk/client-ses");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sendEmail = void 0;
const handler_1 = __webpack_require__(/*! ./functions/email/handler */ "./src/functions/email/handler.ts");
const sendEmail = new handler_1.SendEmailHandler().handler;
exports.sendEmail = sendEmail;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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d3Mtc2VydmVybGVzcy8uL3NyYy9jb3JlL2VudnMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vYXdzLXNlcnZlcmxlc3MvLi9zcmMvY29yZS9oZWxwZXJzL2VtYWlsLXRlbXBsYXRlLW1hbmFnZXIuaGVscGVyLnRzIiwid2VicGFjazovL2F3cy1zZXJ2ZXJsZXNzLy4vc3JjL2NvcmUvaW5mcmEvYXdzL1NFUy9zZW5kLWVtYWlsLWNvbW1hbmQudHMiLCJ3ZWJwYWNrOi8vYXdzLXNlcnZlcmxlc3MvLi9zcmMvY29yZS9pbmZyYS9hd3MvU0VTL3Nlcy1jbGllbnQudHMiLCJ3ZWJwYWNrOi8vYXdzLXNlcnZlcmxlc3MvLi9zcmMvY29yZS9pbmZyYS9lbWFpbC1jcmVhdG9yLnRzIiwid2VicGFjazovL2F3cy1zZXJ2ZXJsZXNzLy4vc3JjL2NvcmUvcHJvdmlkZXJzL2VtYWlsLXByb3ZpZGVyLnRzIiwid2VicGFjazovL2F3cy1zZXJ2ZXJsZXNzLy4vc3JjL2Z1bmN0aW9ucy9lbWFpbC9mYWN0b3JpZXMvd2VsY29tZS5mYWN0b3J5LnRzIiwid2VicGFjazovL2F3cy1zZXJ2ZXJsZXNzLy4vc3JjL2Z1bmN0aW9ucy9lbWFpbC9oYW5kbGVyLnRzIiwid2VicGFjazovL2F3cy1zZXJ2ZXJsZXNzLy4vc3JjL2Z1bmN0aW9ucy9lbWFpbC9wcm9jZWR1cmVzL3dlbGNvbWUucHJvY2VkdXJlLnRzIiwid2VicGFjazovL2F3cy1zZXJ2ZXJsZXNzLy4vc3JjL2Z1bmN0aW9ucy9lbWFpbC90ZW1wbGF0ZXMvd2VsY29tZS90ZW1wbGF0ZS5jcmVhdG9yLnRzIiwid2VicGFjazovL2F3cy1zZXJ2ZXJsZXNzLy4vc3JjL2Z1bmN0aW9ucy9lbWFpbC90ZW1wbGF0ZXMvd2VsY29tZS93ZWxjb21lLnRlbXBsYXRlLnRzIiwid2VicGFjazovL2F3cy1zZXJ2ZXJsZXNzL2V4dGVybmFsIGNvbW1vbmpzIFwiQGF3cy1zZGsvY2xpZW50LXNlc1wiIiwid2VicGFjazovL2F3cy1zZXJ2ZXJsZXNzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2F3cy1zZXJ2ZXJsZXNzLy4vc3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmVudnMgPSB2b2lkIDA7XG5leHBvcnRzLmVudnMgPSB7XG4gICAgRlJPTV9BRERSRVNTOiBTdHJpbmcocHJvY2Vzcy5lbnYuRlJPTV9BRERSRVNTKSxcbiAgICBBV1NfUkVHSU9OOiBTdHJpbmcocHJvY2Vzcy5lbnYuQVdTX1JFR0lPTiksXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkVtYWlsVGVtcGxhdGVNYW5hZ2VyID0gdm9pZCAwO1xuY2xhc3MgRW1haWxUZW1wbGF0ZU1hbmFnZXIge1xuICAgIHJhd1RlbXBsYXRlO1xuICAgIG1vZGlmaWVkVGVtcGxhdGU7XG4gICAgcmVwbGFjZW1lbnRzO1xuICAgIGNvbnN0cnVjdG9yKHJhd1RlbXBsYXRlKSB7XG4gICAgICAgIHRoaXMubW9kaWZpZWRUZW1wbGF0ZSA9IHRoaXMucmF3VGVtcGxhdGUgPSByYXdUZW1wbGF0ZTtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZSh0aGlzLnJhd1RlbXBsYXRlKTtcbiAgICB9XG4gICAgZ2V0KGFyZ3MpIHtcbiAgICAgICAgdGhpcy5yZXBsYWNlbWVudHMgPSBhcmdzO1xuICAgICAgICB0aGlzLmV4ZWNSZXBsYWNlbWVudHMoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kaWZpZWRUZW1wbGF0ZTtcbiAgICB9XG4gICAgZXhlY1JlcGxhY2VtZW50cygpIHtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5yZXBsYWNlbWVudHMpLmZvckVhY2goKGtleSkgPT4gKHRoaXMubW9kaWZpZWRUZW1wbGF0ZSA9IHRoaXMubW9kaWZpZWRUZW1wbGF0ZS5yZXBsYWNlKG5ldyBSZWdFeHAoYEBAJHtrZXl9YCwgXCJnXCIpLCB0aGlzLnJlcGxhY2VtZW50c1trZXldKSkpO1xuICAgIH1cbn1cbmV4cG9ydHMuRW1haWxUZW1wbGF0ZU1hbmFnZXIgPSBFbWFpbFRlbXBsYXRlTWFuYWdlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TRVNTZW5kRW1haWxDb21tYW5kID0gdm9pZCAwO1xuY29uc3QgY2xpZW50X3Nlc18xID0gcmVxdWlyZShcIkBhd3Mtc2RrL2NsaWVudC1zZXNcIik7XG5jbGFzcyBTRVNTZW5kRW1haWxDb21tYW5kIHtcbiAgICBleGVjdXRlKHByb3BzKSB7XG4gICAgICAgIGNvbnN0IHsgZGVzdGluYXRpb24sIG1lc3NhZ2UsIHNvdXJjZSB9ID0gcHJvcHM7XG4gICAgICAgIGNvbnN0IGRlc3RpbmF0aW9uQ29uZmlnID0ge1xuICAgICAgICAgICAgQ2NBZGRyZXNzZXM6IGRlc3RpbmF0aW9uLmNjQWRkcmVzcyxcbiAgICAgICAgICAgIFRvQWRkcmVzc2VzOiBkZXN0aW5hdGlvbi50b0FkZHJlc3MsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGVtYWlsQm9keUNvbmZpZyA9IHtcbiAgICAgICAgICAgIEh0bWw6IHtcbiAgICAgICAgICAgICAgICBDaGFyc2V0OiBcIlVURi04XCIsXG4gICAgICAgICAgICAgICAgRGF0YTogbWVzc2FnZS5jb250ZW50LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZW1haWxTdWJqZWN0Q29uZmlnID0ge1xuICAgICAgICAgICAgQ2hhcnNldDogXCJVVEYtOFwiLFxuICAgICAgICAgICAgRGF0YTogbWVzc2FnZS5zdWJqZWN0LFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gbmV3IGNsaWVudF9zZXNfMS5TZW5kRW1haWxDb21tYW5kKHtcbiAgICAgICAgICAgIERlc3RpbmF0aW9uOiBkZXN0aW5hdGlvbkNvbmZpZyxcbiAgICAgICAgICAgIE1lc3NhZ2U6IHtcbiAgICAgICAgICAgICAgICBCb2R5OiBlbWFpbEJvZHlDb25maWcsXG4gICAgICAgICAgICAgICAgU3ViamVjdDogZW1haWxTdWJqZWN0Q29uZmlnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFNvdXJjZTogc291cmNlLmZyb21BZGRyZXNzLFxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLlNFU1NlbmRFbWFpbENvbW1hbmQgPSBTRVNTZW5kRW1haWxDb21tYW5kO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnNlc0NsaWVudCA9IHZvaWQgMDtcbmNvbnN0IGVudnNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9lbnZzXCIpO1xuY29uc3QgY2xpZW50X3Nlc18xID0gcmVxdWlyZShcIkBhd3Mtc2RrL2NsaWVudC1zZXNcIik7XG5leHBvcnRzLnNlc0NsaWVudCA9IG5ldyBjbGllbnRfc2VzXzEuU0VTQ2xpZW50KHsgcmVnaW9uOiBlbnZzXzEuZW52cy5BV1NfUkVHSU9OIH0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkVtYWlsQ3JlYXRvciA9IHZvaWQgMDtcbmNsYXNzIEVtYWlsQ3JlYXRvciB7XG4gICAgZW1haWxQcm92aWRlcjtcbiAgICBlbWFpbFRlbXBsYXRlTWFuYWdlcjtcbiAgICBjb25zdHJ1Y3RvcihlbWFpbFByb3ZpZGVyLCBlbWFpbFRlbXBsYXRlTWFuYWdlcikge1xuICAgICAgICB0aGlzLmVtYWlsUHJvdmlkZXIgPSBlbWFpbFByb3ZpZGVyO1xuICAgICAgICB0aGlzLmVtYWlsVGVtcGxhdGVNYW5hZ2VyID0gZW1haWxUZW1wbGF0ZU1hbmFnZXI7XG4gICAgfVxuICAgIGFzeW5jIHNlbmQodGVtcGxhdGVQYXJhbXMsIGVtYWlsUGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmVtYWlsVGVtcGxhdGVNYW5hZ2VyLmdldCh0ZW1wbGF0ZVBhcmFtcyk7XG4gICAgICAgIGNvbnN0IGVtYWlsSW5mbyA9IHRoaXMuc2V0RW1haWxJbmZvKCk7XG4gICAgICAgIGF3YWl0IHRoaXMuZW1haWxQcm92aWRlci5zZW5kKHtcbiAgICAgICAgICAgIGNvbnRlbnQsXG4gICAgICAgICAgICAuLi5lbWFpbEluZm8sXG4gICAgICAgICAgICAuLi5lbWFpbFBhcmFtcyxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5FbWFpbENyZWF0b3IgPSBFbWFpbENyZWF0b3I7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRW1haWxQcm92aWRlciA9IHZvaWQgMDtcbmNvbnN0IHNlc19jbGllbnRfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYS9hd3MvU0VTL3Nlcy1jbGllbnRcIik7XG5jbGFzcyBFbWFpbFByb3ZpZGVyIHtcbiAgICBzZXNTZW5kRW1haWxDb21tYW5kO1xuICAgIGNvbnN0cnVjdG9yKHNlc1NlbmRFbWFpbENvbW1hbmQpIHtcbiAgICAgICAgdGhpcy5zZXNTZW5kRW1haWxDb21tYW5kID0gc2VzU2VuZEVtYWlsQ29tbWFuZDtcbiAgICB9XG4gICAgYXN5bmMgc2VuZCh7IC4uLnByb3BzIH0pIHtcbiAgICAgICAgY29uc3Qgc2VuZEVtYWlsQ29tbWFuZCA9IHRoaXMuc2VzU2VuZEVtYWlsQ29tbWFuZC5leGVjdXRlKHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiBwcm9wcy5jb250ZW50LFxuICAgICAgICAgICAgICAgIHN1YmplY3Q6IHByb3BzLnN1YmplY3QsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc291cmNlOiB7XG4gICAgICAgICAgICAgICAgZnJvbUFkZHJlc3M6IHByb3BzLmZyb21BZGRyZXNzLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgY2NBZGRyZXNzOiBbXSxcbiAgICAgICAgICAgICAgICB0b0FkZHJlc3M6IHByb3BzLnRvQWRkcmVzcyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYXdhaXQgc2VzX2NsaWVudF8xLnNlc0NsaWVudC5zZW5kKHNlbmRFbWFpbENvbW1hbmQpO1xuICAgIH1cbn1cbmV4cG9ydHMuRW1haWxQcm92aWRlciA9IEVtYWlsUHJvdmlkZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU2VuZEVtYWlsV2VsY29tZUZhY3RvcnkgPSB2b2lkIDA7XG5jb25zdCBlbWFpbF9wcm92aWRlcl8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvcmUvcHJvdmlkZXJzL2VtYWlsLXByb3ZpZGVyXCIpO1xuY29uc3Qgd2VsY29tZV9wcm9jZWR1cmVfMSA9IHJlcXVpcmUoXCIuLi9wcm9jZWR1cmVzL3dlbGNvbWUucHJvY2VkdXJlXCIpO1xuY29uc3QgdGVtcGxhdGVfY3JlYXRvcl8xID0gcmVxdWlyZShcIi4uL3RlbXBsYXRlcy93ZWxjb21lL3RlbXBsYXRlLmNyZWF0b3JcIik7XG5jb25zdCBzZW5kX2VtYWlsX2NvbW1hbmRfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb3JlL2luZnJhL2F3cy9TRVMvc2VuZC1lbWFpbC1jb21tYW5kXCIpO1xuY2xhc3MgU2VuZEVtYWlsV2VsY29tZUZhY3Rvcnkge1xuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgY29uc3Qgc2VzU2VuZEVtYWlsQ29tbWFuZCA9IG5ldyBzZW5kX2VtYWlsX2NvbW1hbmRfMS5TRVNTZW5kRW1haWxDb21tYW5kKCk7XG4gICAgICAgIGNvbnN0IGVtYWlsUHJvdmlkZXIgPSBuZXcgZW1haWxfcHJvdmlkZXJfMS5FbWFpbFByb3ZpZGVyKHNlc1NlbmRFbWFpbENvbW1hbmQpO1xuICAgICAgICBjb25zdCB3ZWxjb21lRW1haWxUZW1wbGF0ZSA9IG5ldyB0ZW1wbGF0ZV9jcmVhdG9yXzEuV2VsY29tZUVtYWlsVGVtcGxhdGUoKTtcbiAgICAgICAgcmV0dXJuIG5ldyB3ZWxjb21lX3Byb2NlZHVyZV8xLlNlbmRFbWFpbFdlbGNvbWVQcm9jZWR1cmUoZW1haWxQcm92aWRlciwgd2VsY29tZUVtYWlsVGVtcGxhdGUpO1xuICAgIH1cbn1cbmV4cG9ydHMuU2VuZEVtYWlsV2VsY29tZUZhY3RvcnkgPSBTZW5kRW1haWxXZWxjb21lRmFjdG9yeTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TZW5kRW1haWxIYW5kbGVyID0gdm9pZCAwO1xuY29uc3Qgd2VsY29tZV9mYWN0b3J5XzEgPSByZXF1aXJlKFwiLi9mYWN0b3JpZXMvd2VsY29tZS5mYWN0b3J5XCIpO1xuY2xhc3MgU2VuZEVtYWlsSGFuZGxlciB7XG4gICAgYXN5bmMgaGFuZGxlcihldmVudCwgY29udGV4dCkge1xuICAgICAgICBjb25zdCB0eXBlID0gZXZlbnQucGF0aFBhcmFtZXRlcnMudHlwZTtcbiAgICAgICAgY29uc3QgYm9keSA9IEpTT04ucGFyc2UoZXZlbnQuYm9keSk7XG4gICAgICAgIGNvbnN0IHdlbGNvbWUgPSBuZXcgd2VsY29tZV9mYWN0b3J5XzEuU2VuZEVtYWlsV2VsY29tZUZhY3RvcnkoKS5jcmVhdGUoKTtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFwid2VsY29tZVwiOlxuICAgICAgICAgICAgICAgIHdlbGNvbWUuZXhlY3V0ZShib2R5KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYXBwTmFtZTogZXZlbnQuYXBwTmFtZSB8fCBcImF3cy1zZXJ2ZXJsZXNzLXRlbXBsYXRlXCIsXG4gICAgICAgICAgICBhcHBWZXJzaW9uOiBldmVudC5hcHBWZXJzaW9uIHx8IFwidjFcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uVmVyc2lvbjogY29udGV4dC5mdW5jdGlvblZlcnNpb24sXG4gICAgICAgICAgICBmdW5jdGlvbk5hbWU6IGNvbnRleHQuZnVuY3Rpb25OYW1lLFxuICAgICAgICB9O1xuICAgIH1cbn1cbmV4cG9ydHMuU2VuZEVtYWlsSGFuZGxlciA9IFNlbmRFbWFpbEhhbmRsZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU2VuZEVtYWlsV2VsY29tZVByb2NlZHVyZSA9IHZvaWQgMDtcbmNvbnN0IGVtYWlsX2NyZWF0b3JfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb3JlL2luZnJhL2VtYWlsLWNyZWF0b3JcIik7XG5jb25zdCBlbnZzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29yZS9lbnZzXCIpO1xuY2xhc3MgU2VuZEVtYWlsV2VsY29tZVByb2NlZHVyZSBleHRlbmRzIGVtYWlsX2NyZWF0b3JfMS5FbWFpbENyZWF0b3Ige1xuICAgIGNvbnN0cnVjdG9yKGVtYWlsUHJvdmlkZXIsIGVtYWlsVGVtcGxhdGVNYW5hZ2VyKSB7XG4gICAgICAgIHN1cGVyKGVtYWlsUHJvdmlkZXIsIGVtYWlsVGVtcGxhdGVNYW5hZ2VyKTtcbiAgICB9XG4gICAgYXN5bmMgZXhlY3V0ZShpbnB1dCkge1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zZW5kKHt9LCB7IHRvQWRkcmVzczogaW5wdXQudG9BZGRyZXNzIH0pO1xuICAgIH1cbiAgICBzZXRFbWFpbEluZm8oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdWJqZWN0OiBcIkJvYXMgdmluZGFzXCIsXG4gICAgICAgICAgICBmcm9tQWRkcmVzczogZW52c18xLmVudnMuRlJPTV9BRERSRVNTLFxuICAgICAgICB9O1xuICAgIH1cbn1cbmV4cG9ydHMuU2VuZEVtYWlsV2VsY29tZVByb2NlZHVyZSA9IFNlbmRFbWFpbFdlbGNvbWVQcm9jZWR1cmU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuV2VsY29tZUVtYWlsVGVtcGxhdGUgPSB2b2lkIDA7XG5jb25zdCB3ZWxjb21lX3RlbXBsYXRlXzEgPSByZXF1aXJlKFwiLi93ZWxjb21lLnRlbXBsYXRlXCIpO1xuY29uc3QgZW1haWxfdGVtcGxhdGVfbWFuYWdlcl9oZWxwZXJfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi9jb3JlL2hlbHBlcnMvZW1haWwtdGVtcGxhdGUtbWFuYWdlci5oZWxwZXJcIik7XG5jbGFzcyBXZWxjb21lRW1haWxUZW1wbGF0ZSBleHRlbmRzIGVtYWlsX3RlbXBsYXRlX21hbmFnZXJfaGVscGVyXzEuRW1haWxUZW1wbGF0ZU1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcih3ZWxjb21lX3RlbXBsYXRlXzEud2VsY29tZVRlbXBsYXRlKTtcbiAgICB9XG59XG5leHBvcnRzLldlbGNvbWVFbWFpbFRlbXBsYXRlID0gV2VsY29tZUVtYWlsVGVtcGxhdGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMud2VsY29tZVRlbXBsYXRlID0gdm9pZCAwO1xuZXhwb3J0cy53ZWxjb21lVGVtcGxhdGUgPSBgXG48IURPQ1RZUEUgaHRtbFxuICBQVUJMSUMgXCItLy9XM0MvL0RURCBYSFRNTCAxLjAgVHJhbnNpdGlvbmFsLy9FTlwiIFwiaHR0cDovL3d3dy53My5vcmcvVFIveGh0bWwxL0RURC94aHRtbDEtdHJhbnNpdGlvbmFsLmR0ZFwiPlxuPGh0bWwgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCI+XG5cbjxoZWFkPlxuICA8bWV0YSBodHRwLWVxdWl2PVwiQ29udGVudC1UeXBlXCIgY29udGVudD1cInRleHQvaHRtbDsgY2hhcnNldD1VVEYtOFwiIC8+XG4gIDx0aXRsZT5Hb2FsRmxvdzwvdGl0bGU+XG4gIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MS4wXCIgLz5cblxuICA8c3R5bGU+XG4gICAgLnNlcGFyYXRvciB7XG4gICAgICBoZWlnaHQ6IDJweDtcbiAgICAgIG1hcmdpbi10b3A6IDEwcHg7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjNmNWY5O1xuICAgIH1cbiAgPC9zdHlsZT5cbjwvaGVhZD5cblxuPGJvZHkgc3R5bGU9XCJtYXJnaW46IDA7IHBhZGRpbmc6IDBcIj5cbiAgPHRhYmxlIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogI2YzZjVmOVwiPlxuICAgIDx0cj5cbiAgICAgIDx0ZCBzdHlsZT1cIndpZHRoOiA1MHB4XCI+PC90ZD5cbiAgICAgIDx0ZD5cbiAgICAgICAgPHRhYmxlIHN0eWxlPVwiXG4gICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmM2Y1Zjk7XG4gICAgICAgICAgICAgIGZvbnQtZmFtaWx5OiBJbnRlciwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZjtcbiAgICAgICAgICAgICAgbWF4LXdpZHRoOiA2MDBweDtcbiAgICAgICAgICAgICAgbWluLXdpZHRoOiAzMDBweDtcbiAgICAgICAgICAgIFwiPlxuICAgICAgICAgIDx0ciBzdHlsZT1cImhlaWdodDogMTBweFwiPjwvdHI+XG4gICAgICAgICAgPHRyPlxuICAgICAgICAgICAgPHRkIHN0eWxlPVwiYm9yZGVyLXRvcDogM3B4IHNvbGlkICNGRjk0MUFcIj5cbiAgICAgICAgICAgICAgPHRhYmxlIHN0eWxlPVwiXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1xuICAgICAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiAwcHggMHB4IDhweCA4cHg7XG4gICAgICAgICAgICAgICAgICBcIj5cbiAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJoZWlnaHQ6IDIwcHhcIj48L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwiaGVpZ2h0OiAyMHB4XCI+PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cImhlaWdodDogMjBweFwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICA8dHIgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cIndpZHRoOiAyMHB4XCI+PC90ZD5cblxuICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibG9nb1wiPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibGV0dGVyLTFcIj5MYXVuY2g8c3BhbiBjbGFzcz1cImxldHRlci0yXCI+TW90aW9uPC9zcGFuPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxoMiBzdHlsZT1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDI2cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAjNDQ0NDQ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICBmb250LXdlaWdodDogYm9sZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPlxuICAgICAgICAgICAgICAgICAgICAgIEJvYXMgdmluZGFzXG4gICAgICAgICAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwid2lkdGg6IDIwcHhcIj48L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwid2lkdGg6IDIwcHhcIj48L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2VwYXJhdG9yXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwid2lkdGg6IDIwcHhcIj48L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwiXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogODglO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICM2Yjc3ODY7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLWhlaWdodDogMS44O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dC1hbGlnbjoganVzdGlmeTtcbiAgICAgICAgICAgICAgICAgICAgICBcIj5cbiAgICAgICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICAgICAgTG9yZW0gaXBzdW0gaXMgcGxhY2Vob2xkZXIgdGV4dCBjb21tb25seSB1c2VkIGluIHRoZSBncmFwaGljLCBwcmludCwgYW5kIHB1Ymxpc2hpbmcgaW5kdXN0cmllcyBmb3JcbiAgICAgICAgICAgICAgICAgICAgICBwcmV2aWV3aW5nIGxheW91dHMgYW5kIHZpc3VhbCBtb2NrdXBzLlxuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwid2lkdGg6IDIwcHhcIj48L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgPHRyIHN0eWxlPVwiaGVpZ2h0OiAyMHB4XCI+PC90cj5cbiAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgPC90cj5cbiAgICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGQgc3R5bGU9XCJoZWlnaHQ6IDIwcHhcIj48L3RkPlxuICAgICAgICAgIDwvdHI+XG4gICAgICAgIDwvdGFibGU+XG4gICAgICA8L3RkPlxuICAgICAgPHRkIHN0eWxlPVwid2lkdGg6IDUwcHhcIj48L3RkPlxuICAgIDwvdHI+XG4gIDwvdGFibGU+XG48L2JvZHk+XG5cbjwvaHRtbD5cbmA7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAYXdzLXNkay9jbGllbnQtc2VzXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc2VuZEVtYWlsID0gdm9pZCAwO1xuY29uc3QgaGFuZGxlcl8xID0gcmVxdWlyZShcIi4vZnVuY3Rpb25zL2VtYWlsL2hhbmRsZXJcIik7XG5jb25zdCBzZW5kRW1haWwgPSBuZXcgaGFuZGxlcl8xLlNlbmRFbWFpbEhhbmRsZXIoKS5oYW5kbGVyO1xuZXhwb3J0cy5zZW5kRW1haWwgPSBzZW5kRW1haWw7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
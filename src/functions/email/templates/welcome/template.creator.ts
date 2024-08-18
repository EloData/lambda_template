import { welcomeTemplate } from "./welcome.template";
import { EmailTemplateManager } from "../../../../core/helpers/email-template-manager.helper";

export class WelcomeEmailTemplate extends EmailTemplateManager {
  constructor() {
    super(welcomeTemplate);
  }
}

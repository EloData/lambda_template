export abstract class EmailTemplateManager<T = Record<any, any>> {
  protected rawTemplate: string;
  protected modifiedTemplate: string;

  protected replacements: Record<any, any>;

  constructor(rawTemplate: string) {
    this.modifiedTemplate = this.rawTemplate = rawTemplate;
    Object.freeze(this.rawTemplate);
  }

  public get(args: T): string {
    this.replacements = args;
    this.execReplacements();
    return this.modifiedTemplate;
  }

  protected execReplacements(): void {
    Object.keys(this.replacements).forEach(
      (key) =>
        (this.modifiedTemplate = this.modifiedTemplate.replace(
          new RegExp(`@@${key}`, "g"),
          this.replacements[key]
        ))
    );
  }
}

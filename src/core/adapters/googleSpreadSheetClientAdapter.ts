import { GoogleSpreadsheet } from 'google-spreadsheet';
import { GoogleSpreadSheetJwtAuthAdapter } from './googleSpreadSheetJwtAuthAdapter';

export class GoogleSpreadsheetClientAdapter {
  constructor(
    private readonly spreadsheetApiKey: string,
    private readonly googleSpreadSheetJwtAuthAdapter: GoogleSpreadSheetJwtAuthAdapter,
  ) {}

  public async create(): Promise<GoogleSpreadsheet> {
    const clientJwtAuth = await this.googleSpreadSheetJwtAuthAdapter.auth();
    const googleSpreadsheet = new GoogleSpreadsheet(
      this.spreadsheetApiKey,
      clientJwtAuth,
    );
    await googleSpreadsheet.loadInfo();
    return googleSpreadsheet;
  }
}

import { GoogleSpreadsheetClientAdapter } from '../adapters/googleSpreadSheetClientAdapter';
import { GoogleSpreadSheetJwtAuthAdapter } from '../adapters/googleSpreadSheetJwtAuthAdapter';
import { envs } from '../constants/env';

export class GoogleSpreadsheetClientFactory {
  public static create() {
    return new GoogleSpreadsheetClientAdapter(
      envs.GOOGLE_SPREAD_SHEET_KEY,
      new GoogleSpreadSheetJwtAuthAdapter(),
    );
  }
}

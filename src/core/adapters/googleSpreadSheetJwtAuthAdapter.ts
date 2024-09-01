import { JWT } from 'google-auth-library';
import { envs } from '../constants/env';

export class GoogleSpreadSheetJwtAuthAdapter {
  public async auth(): Promise<JWT> {
    return new JWT({
      email: envs.GOOGLE_SPREAD_SHEET_CLIENT_EMAIL,
      key: envs.GOOGLE_SPREAD_SHEET_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }
}

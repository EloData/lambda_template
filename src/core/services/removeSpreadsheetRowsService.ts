import { GoogleSpreadsheet } from 'google-spreadsheet';
import { BaseGoogleSpreadsheetService } from './baseGoogleSpreadsheetService';
import {
  RemoveSpreadsheetRowsProtocol,
  RemoveSpreadsheetRowsProtocolDto,
} from '@/core/protocols/googleSpreadSheet/removeSpreadsheetRowsProtocol';

export class RemoveSpreadsheetRowsService
  extends BaseGoogleSpreadsheetService
  implements RemoveSpreadsheetRowsProtocol
{
  constructor(googleSpreadsheet: GoogleSpreadsheet) {
    super(googleSpreadsheet);
  }

  async execute(
    params: RemoveSpreadsheetRowsProtocolDto.Params,
  ): Promise<void> {
    await this.getWorkSpreadsheet().clearRows(params);
  }
}

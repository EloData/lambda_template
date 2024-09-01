import { GoogleSpreadsheet } from 'google-spreadsheet';
import { BaseGoogleSpreadsheetService } from './baseGoogleSpreadsheetService';
import {
  AddSpreadsheetRowsProtocol,
  AddSpreadsheetRowsProtocolDto,
} from '@/core/protocols/googleSpreadSheet/addSpreadsheetRowsProtocol';

export class AddSpreadsheetRowsService
  extends BaseGoogleSpreadsheetService
  implements AddSpreadsheetRowsProtocol
{
  constructor(googleSpreadsheet: GoogleSpreadsheet) {
    super(googleSpreadsheet);
  }

  async execute(params: AddSpreadsheetRowsProtocolDto.Params): Promise<void> {
    await this.getWorkSpreadsheet().addRow(params);
  }
}

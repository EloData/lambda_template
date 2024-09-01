import { GoogleSpreadsheet } from 'google-spreadsheet';
import { BaseGoogleSpreadsheetService } from './baseGoogleSpreadsheetService';
import {
  GetAllSpreadsheetRowsProtocol,
  GetAllSpreadsheetRowsProtocolDto,
} from '@/core/protocols/googleSpreadSheet/getAllSpreadsheetRowsProtocol';

export class GetAllSpreadsheetRowsService
  extends BaseGoogleSpreadsheetService
  implements GetAllSpreadsheetRowsProtocol
{
  constructor(googleSpreadsheet: GoogleSpreadsheet) {
    super(googleSpreadsheet);
  }

  async execute(
    filters = {},
  ): Promise<GetAllSpreadsheetRowsProtocolDto.Response> {
    const rows = await this.getWorkSpreadsheet().getRows();
    const jsonData = this.toJSON(rows);
    return filters ? this.filterRows(jsonData, filters) : jsonData;
  }
}

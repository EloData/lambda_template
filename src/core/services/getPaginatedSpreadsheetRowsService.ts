import { GoogleSpreadsheet } from 'google-spreadsheet';
import { BaseGoogleSpreadsheetService } from './baseGoogleSpreadsheetService';
import {
  GetPaginatedSpreadsheetRowsProtocol,
  GetPaginatedSpreadsheetRowsProtocolDto,
} from '@/core/protocols/googleSpreadSheet/getPaginatedSpreadsheetRowsProtocol';
import { GenericRecordData } from '../interfaces/genericRowData';

export class GetPaginatedSpreadsheetRowsService
  extends BaseGoogleSpreadsheetService
  implements GetPaginatedSpreadsheetRowsProtocol
{
  constructor(googleSpreadsheet: GoogleSpreadsheet) {
    super(googleSpreadsheet);
  }

  async execute(
    params: GetPaginatedSpreadsheetRowsProtocolDto.Params,
  ): Promise<GetPaginatedSpreadsheetRowsProtocolDto.Response> {
    const rows = await this.getWorkSpreadsheet().getRows();

    const filteredRows = this.filterRows(
      this.toJSON(rows),
      params.filters || {},
    );

    const total = filteredRows.length;
    const paginatedRows = this.getSlicedRowsData(params, filteredRows);

    return {
      data: paginatedRows,
      currentPage: params.page,
      totalPages: Math.ceil(total / params.limit),
      totalCount: total,
    };
  }

  private getSlicedRowsData(
    params: GetPaginatedSpreadsheetRowsProtocolDto.Params,
    rowsData: GenericRecordData[],
  ): GenericRecordData[] {
    const startRowIndex = (params.page - 1) * params.limit;
    return rowsData.slice(startRowIndex, startRowIndex + params.limit);
  }
}

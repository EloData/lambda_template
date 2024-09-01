import { GenericRecordData } from '@/core/interfaces/genericRowData';
import { GoogleSpreadsheetRow } from 'google-spreadsheet';

export interface GetPaginatedSpreadsheetRowsProtocol {
  execute(
    params: GetPaginatedSpreadsheetRowsProtocolDto.Params,
  ): Promise<GetPaginatedSpreadsheetRowsProtocolDto.Response>;
}

export namespace GetPaginatedSpreadsheetRowsProtocolDto {
  export type GetRowsResponse = GenericRecordData[];
  export type SpreadsheetRows = GoogleSpreadsheetRow<GenericRecordData>[];
  export type Params = { page: number; limit: number; filters: any };
  export type Response = {
    data: GetRowsResponse;
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
}

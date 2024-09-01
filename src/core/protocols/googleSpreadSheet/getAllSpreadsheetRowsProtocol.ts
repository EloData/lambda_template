import { GenericRecordData } from '@/core/interfaces/genericRowData';

export interface GetAllSpreadsheetRowsProtocol {
  execute(): Promise<GetAllSpreadsheetRowsProtocolDto.Response>;
}

export namespace GetAllSpreadsheetRowsProtocolDto {
  export type Response = GenericRecordData[];
}

export interface AddSpreadsheetRowsProtocol {
  execute(params: AddSpreadsheetRowsProtocolDto.Params): Promise<void>;
}

export namespace AddSpreadsheetRowsProtocolDto {
  type RowCellData = string | number | boolean | Date;
  export type Params = RowCellData[] | Record<string, RowCellData>;
}

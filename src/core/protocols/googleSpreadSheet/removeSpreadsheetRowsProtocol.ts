export interface RemoveSpreadsheetRowsProtocol {
  execute(params: RemoveSpreadsheetRowsProtocolDto.Params): Promise<void>;
}

export namespace RemoveSpreadsheetRowsProtocolDto {
  export type Params = {
    start: number;
    end: number;
  };
}

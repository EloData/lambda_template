import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
  GoogleSpreadsheetRow,
} from 'google-spreadsheet';
import { GenericRecordData } from '../interfaces/genericRowData';

export abstract class BaseGoogleSpreadsheetService {
  constructor(private readonly googleSpreadsheet: GoogleSpreadsheet) {}

  getWorkSpreadsheet(index = 0): GoogleSpreadsheetWorksheet {
    return this.googleSpreadsheet.sheetsByIndex.at(index);
  }

  filterRows(
    rows: GenericRecordData[],
    filters: GenericRecordData,
  ): GenericRecordData[] {
    return rows.filter((row) =>
      Object.entries(filters).every(([key, value]) =>
        row[key]?.toString().includes(value.toString()),
      ),
    );
  }

  toJSON(
    rowsData: GoogleSpreadsheetRow<GenericRecordData>[],
  ): GenericRecordData[] {
    return rowsData.map((row) => row.toObject());
  }
}

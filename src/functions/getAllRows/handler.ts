import { GoogleSpreadsheetClientFactory } from '@/core/factories/googleSpreadsheetClientFactory';
import { GetAllSpreadsheetRowsService } from '@/core/services/getAllSpreadsheetRowsService';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

export class HandleGetAllRows {
  async handler({ queryStringParameters }: APIGatewayProxyEventV2) {
    const googleSpreadsheetClientAdapter =
      GoogleSpreadsheetClientFactory.create();

    const service = new GetAllSpreadsheetRowsService(
      await googleSpreadsheetClientAdapter.create(),
    );

    return await service.execute(queryStringParameters);
  }
}

import { GoogleSpreadsheetClientFactory } from '@/core/factories/googleSpreadsheetClientFactory';
import { AddSpreadsheetRowsService } from '@/core/services/addSpreadsheetRowsService';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

export class HandleAddRows {
  async handler({ body }: APIGatewayProxyEventV2) {
    const inputData = JSON.parse(body);

    const googleSpreadsheetClientAdapter =
      GoogleSpreadsheetClientFactory.create();

    const service = new AddSpreadsheetRowsService(
      await googleSpreadsheetClientAdapter.create(),
    );

    await service.execute(inputData);
    return { success: true };
  }
}

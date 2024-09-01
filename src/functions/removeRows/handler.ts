import { GoogleSpreadsheetClientFactory } from '@/core/factories/googleSpreadsheetClientFactory';
import { RemoveSpreadsheetRowsService } from '@/core/services/removeSpreadsheetRowsService';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

export class HandleRemoveRows {
  async handler({ body }: APIGatewayProxyEventV2) {
    const inputData = JSON.parse(body);

    const googleSpreadsheetClientAdapter =
      GoogleSpreadsheetClientFactory.create();

    const service = new RemoveSpreadsheetRowsService(
      await googleSpreadsheetClientAdapter.create(),
    );

    await service.execute(inputData);
    return { success: true };
  }
}

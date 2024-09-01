import { GoogleSpreadsheetClientFactory } from '@/core/factories/googleSpreadsheetClientFactory';
import { GetPaginatedSpreadsheetRowsService } from '@/core/services/getPaginatedSpreadsheetRowsService';
import { APIGatewayProxyEventV2, Context } from 'aws-lambda';

export class HandleGetPaginatedRows {
  async handler(
    { queryStringParameters }: APIGatewayProxyEventV2,
    _context: Context,
  ) {
    const { page, limit, ...filters } = queryStringParameters;

    const googleSpreadsheetClientAdapter =
      GoogleSpreadsheetClientFactory.create();

    const service = new GetPaginatedSpreadsheetRowsService(
      await googleSpreadsheetClientAdapter.create(),
    );

    return await service.execute({
      filters,
      page: Number(page),
      limit: Number(limit),
    });
  }
}

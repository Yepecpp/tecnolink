import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, ApiProperty, ApiQuery, getSchemaPath } from "@nestjs/swagger";

class PaginatedDto<TData> {
  @ApiProperty()
  total: number;
  @ApiProperty()
  totalFound: number;
  @ApiProperty()
  data: TData[];
}
export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(PaginatedDto, model),
    ApiQuery({
      name: "limit",
      type: Number,
      required: false,
      description: "Limit the results returned",
    }),
    ApiQuery({
      name: "offset",
      type: Number,
      required: false,
      description: "Offset the results returned",
    }),
    ApiQuery({
      name: "sort",
      type: String,
      required: false,
      description: "Sort the results returned",
    }),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              data: {
                type: "array",
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};

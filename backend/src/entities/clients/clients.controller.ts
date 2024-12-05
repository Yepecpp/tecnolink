import { Body, Controller, Get, HttpException, Param, Post, Query, Put, Delete, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { ClientsService } from "./clients.service";
import { validateObjectId } from "@/utils/mongoose.filter";
import { ClientZod, IClient } from "@/interfaces/clients.i";
import { Clients } from "./clients.schema";
import { ApiPaginatedResponse } from "@/decorators";
import { UserDocument, UserRoles } from "@/interfaces";

@Controller("clients")
@ApiTags("clients")
export class ClientsController {
  constructor(private clientService: ClientsService) {}
  @Get("/")
  @ApiPaginatedResponse(Clients)
  async GetAll(@Query() query): Promise<{ data: IClient[]; total: number; totalFound: number }> {
    const clients = await this.clientService.findAllClients(query);
    return {
      data: clients.data.map((client) => client.toJSON()),
      totalFound: clients.data.length,
      total: clients.total,
    };
  }
  @Get("/detail/:id")
  async GetOne(@Param("id") id: string): Promise<IClient> {
    if (!validateObjectId(id)) {
      throw new HttpException("invalid id", 400);
    }
    const client = await this.clientService.findClientById(id);
    return client.toJSON();
  }
  @Post("/")
  async Create(@Body() body: { data: IClient }): Promise<IClient> {
    if (!body.data) {
      throw new HttpException("req.data not reciebed", 400);
    }
    const parseResult = await ClientZod.safeParseAsync(body.data);
    if (!parseResult.success) {
      throw new HttpException("Bad Request", 400);
    }
    const client = await this.clientService.createClient(parseResult.data);
    return client.toJSON();
  }
  @Put("/")
  async Update(@Body() body: { data: IClient }, @Req() request: Request): Promise<{ data: IClient; status: string }> {
    const userData = request.user as UserDocument;
    if (!body.data) {
      throw new HttpException("req.data not recibed", 400);
    }

    const parseResult = await ClientZod.safeParseAsync(body.data);
    if (!parseResult.success) {
      throw new HttpException("Bad Request", 400);
    }
    if (UserRoles.tecnician === userData.role && parseResult.data) {
      const dbClient = await this.clientService.findClientById(parseResult.data.id);
      if (!dbClient) {
        throw new HttpException("Client not found", 404);
      }
      if (dbClient.code !== parseResult.data.code) {
        throw new HttpException("You can't change the client code", 403);
      }
    }
    const client = await this.clientService.updateClientById(body.data.id, parseResult.data);
    return { data: client.toJSON(), status: "ok" };
  }
  @Delete("/:id")
  async Delete(@Param("id") id: string): Promise<{ data: IClient; status: string }> {
    if (!validateObjectId(id)) {
      throw new HttpException("invalid id", 400);
    }
    const client = await this.clientService.deleteClientById(id);
    return { data: client.toJSON(), status: "deleted" };
  }
  @Delete("/many/")
  async DeleteMany(@Body() body: { ids: string[] }): Promise<{ status: string }> {
    if (!body.ids) {
      throw new HttpException("req.ids not recibed", 400);
    }
    const ids = body.ids.filter((id) => validateObjectId(id));
    const client = await this.clientService.deleteManyClients(ids);
    return { status: "deleted" };
  }
}

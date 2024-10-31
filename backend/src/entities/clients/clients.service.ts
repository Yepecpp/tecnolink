import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Clients } from "./clients.schema";
import { ClientDocument, IClient } from "@/interfaces/clients.i";
import { Model } from "mongoose";
import { MongooseFilter, createMongooseFilter } from "@/utils/mongoose.filter";

@Injectable()
export class ClientsService {
  constructor(@InjectModel(Clients.name) private clientModel: Model<ClientDocument>) {}
  async createClient(client: IClient): Promise<ClientDocument> {
    if (client.id) {
      delete client.id;
    }
    const createdClient = new this.clientModel(client);
    return createdClient.save();
  }
  async findAllClients(query: any): Promise<{ data: ClientDocument[]; total: number }> {
    const filter = await createMongooseFilter(query, this.clientModel.schema.paths);
    const promises = Promise.allSettled([
      this.clientModel.find(filter.filter).limit(filter.limit).skip(filter.offset).sort(filter.sort),
      this.clientModel.countDocuments(filter.filter),
    ]);
    const [data, total] = await promises;
    if (data.status === "rejected") {
      throw new HttpException(data.reason, 500);
    }
    if (total.status === "rejected") {
      throw new HttpException(total.reason, 500);
    }
    return { data: data.value, total: total.value };
  }
  async findClientById(id: string): Promise<ClientDocument> {
    const dbClient = await this.clientModel.findById(id);
    if (!dbClient) {
      throw new HttpException("Client not found", 404);
    }
    return dbClient;
  }
  async findClientOne(filter: MongooseFilter<IClient>): Promise<ClientDocument> {
    return this.clientModel.findOne(filter.filter);
  }
  async updateClientById(id: string, client: IClient): Promise<ClientDocument> {
    const dbClient = await this.clientModel.findById(id);
    if (!dbClient) {
      throw new HttpException("Client not found", 404);
    }
    return this.clientModel.findByIdAndUpdate(id, client, { new: true });
  }
  async deleteClientById(id: string): Promise<ClientDocument> {
    const dbClient = await this.clientModel.findById(id);
    if (!dbClient) {
      throw new HttpException("Client not found", 404);
    }
    return this.clientModel.findByIdAndDelete(id);
  }
  async deleteManyClients(id: string[]): Promise<void> {
    const dbClients = await this.clientModel.find({ _id: { $in: id } });
    if (!dbClients) {
      throw new HttpException("Clients not found", 404);
    }
    this.clientModel.deleteMany({ _id: { $in: id } });
    return;
  }
}

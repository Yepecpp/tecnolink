import mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import dotenv from "dotenv";

import { User, UserSchema } from "@/entities/users/users.schema";
import { ClientZod, IClient } from "@/interfaces";
import { Clients, ClientSchema } from "@/entities";

dotenv.config();

type UserDocument = mongoose.HydratedDocument<User>;
type ClientDocument = mongoose.HydratedDocument<Clients>;
const userModel = mongoose.model<UserDocument>(User.name, UserSchema);
const clientModel = mongoose.model<mongoose.HydratedDocument<Clients>>(Clients.name, ClientSchema);

async function initDb() {
  await mongoose.connect(process.env.MONGODB_URI, JSON.parse(process.env.MONGOOSE_OPTIONS));
  console.log("Checking database");
  let userCheck = await initializeUsers();
  console.log("Database checked");
  // console.log("Inserting clients");
  // await insertManyClients(
  //   clientList.map((client) => {
  //     return {
  //       ...client,
  //       code: client.codigo,
  //       isGeolocated: client.address?.geoRef ? true : false,
  //       type: "company",
  //       category: client.type,
  //       cellPhone: client.cellPhone === "" || client.cellPhone.length <= 6 ? undefined : client.cellPhone,
  //     };
  //   }),
  // );
  mongoose.connection.close();
  process.exit(0);
}

initDb();

async function initializeUsers() {
  //select where branch is not the first branch of the company
  const usersCount = await userModel.countDocuments();
  if (usersCount === 0) {
    const salt = await bcrypt.genSalt(10);
    const user = await userModel.create({
      name: "Admin",
      lastname: "Admin",
      login: {
        username: "admin",
        provider: "local",
        email: "admin@admin.com",
        password: await bcrypt.hash("admin", salt),
        lastPasswordChange: new Date(),
      },
      role: "admin",
      status: "active",
      cellPhone: "1234567890",
      identity: {
        idNumber: "1234567890",
        idType: "id",
      },
      lastName: "Admin",
    });
    await user.save();
    console.log("Admin created");
    return;
  }
}

const insertManyClients = async (clientList: Clients[]) => {
  const dbClientList = await clientModel.find();
  const clientsParsed: IClient[] = [];
  for (const client of clientList) {
    const clientData = ClientZod.safeParse(client);
    if (!clientData.success) {
      console.log((clientData as any).error);
      console.log(client);
      continue;
    }
    clientsParsed.push(clientData.data);
    console.log(`Client ${client.name} created`);
  }
  console.log(clientsParsed.length);
  await clientModel.insertMany(clientsParsed);
  console.log("Clients created");
};

const updateManyClients = async (clientList: IClient[]) => {
  //multiple updates
  const clientDbList = await clientModel.find();
  const clientsParsed: IClient[] = [];
  for (const client of clientList) {
    const clientExists = clientDbList.find((dbClient) => dbClient._id.toString() === client?.id?.toString());
    if (!clientExists) {
      console.log(`Client ${client.name} does not exist`);
      continue;
    }
    const clientData = ClientZod.safeParse(client);
    if (!clientData.success) {
      console.log((clientData as any).error);
      console.log(client);
      continue;
    }
    clientsParsed.push(clientData.data);
    clientExists.set(clientData.data);
    await clientExists.save();
    console.log(`Client ${client.name} updated`);
  }

  console.log("Clients updated");
  console.log(clientsParsed.length);
  // await clientModel.updateMany(
  //   { _id: { $in: clientsParsed.map((client) => client.id) } },
  //   clientsParsed.map((client) => {
  //     return {
  //       $set: {
  //         ...client,
  //         updatedAt: new Date(),
  //       },
  //     };
  //   }),
  // );
};

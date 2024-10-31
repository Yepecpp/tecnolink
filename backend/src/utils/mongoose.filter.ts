import { HttpException } from "@nestjs/common";
import { SchemaType } from "mongoose";

import { zodObjectId } from "@/interfaces/common/id.ci";
import { base64ToJson } from "./base-64";

export type MongooseFilter<T> = {
  filter: Partial<T & { _id: string }>;
  limit?: number;
  offset?: number;
  contains?: string;
  sort?: keyof T;
};

const queryByType = (
  key: IKeyDetail,
  value: any,
): {
  [key: string]: any;
} => {
  if (value === undefined || value === null) {
    return { [key.name]: value };
  }

  if (key.type === "String") {
    if (typeof value === "object") {
      const keys = Object.keys(value);
      if (keys.length !== 1 || !keys[0].includes("$")) {
        return null;
      }

      return { [key.name]: value };
    }
    return { [key.name]: { $regex: new RegExp(value, "i") } };
  }
  if (key.type === "Number") {
    //check if is a number
    if (isNaN(value)) {
      return null;
    }
    return { [key.name]: Number(value) };
  }
  if (key.type === "Boolean") {
    return { [key.name]: { $eq: value } };
  }
  //TODO: check what type of array is
  if (key.type === "Array" && key.name === "tags") {
    return { [key.name]: { $in: value } };
  }
  if (key.type === "ObjectId") {
    const result = validateObjectId(value, false);
    if (!result) {
      return null;
    }
    return { [key.name]: result };
  }

  return null;
};

export const createMongooseFilter = async <T>(
  query: Record<string, any>,
  paths: { [key: string]: SchemaType<any, any> },
): Promise<MongooseFilter<T>> => {
  const { q } = query;
  delete query.q;
  const data: MongooseFilter<T> = q ? base64ToJson(q) : {};
  const { limit, offset, sort, contains } = data;
  const modelPaths = keysOfSchema(paths);
  const modelKeys = modelPaths.map((e) => e.name);
  let filter = {};
  if (sort && modelPaths && typeof sort === "string") {
    //sort contains a - at the begining remove it
    let checksort = sort as string;
    if (sort.startsWith("-")) {
      checksort = sort.slice(1);
    }
    if (!modelKeys.includes(checksort)) throw new HttpException("Invalid sort field", 400);
  }
  if (contains !== undefined) {
    const queryMap = modelPaths.map((path) => queryByType(path, contains)).filter((e) => e !== null);
    filter = { ...filter, $or: queryMap };
  }
  for (const key in query) {
    const value = query[key];
    if (key === "id" || key === "_id") {
      filter = { ...filter, _id: validateObjectId(value) };
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(query, key)) {
      const matchKey = modelPaths.find((e) => e.name === key);
      if (!matchKey) {
        throw new HttpException(`Invalid filter field ${key}`, 400);
      }
      const match = queryByType(matchKey, value);
      if (!match) {
        throw new HttpException(`Invalid filter value ${value} for field ${key}`, 400);
      }
      filter = { ...filter, ...match };
    } else throw new HttpException(`Invalid filter field ${key}`, 400);
  }
  return {
    filter,
    limit: parseNumber(limit),
    offset: parseNumber(offset),
    sort: sort as keyof T,
  };
};
interface IKeyDetail {
  name: string;
  type: string;
}
export const keysOfSchema = (paths: { [key: string]: SchemaType<any, any> }): IKeyDetail[] => {
  const keys: IKeyDetail[] = [];
  //const  recurcionKeys = (){}
  for (const key in paths) {
    //prohibeted filters

    if (key === "__v") {
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(paths, key)) {
      //if is a nested object, use recursion
      if (paths[key].instance === "Embedded") {
        const subKeys = keysOfSchema(paths[key].schema.paths);
        for (const subKey of subKeys) {
          keys.push({ name: `${key}.${subKey.name}`, type: subKey.type });
        }
        continue;
      }
      keys.push({
        name: key,
        type: paths[key].instance,
      });
    }
  }
  return keys;
};

export const parseNumber = (value: string | number | undefined): number | null => {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  return isNaN(parsed) ? null : parsed;
};

export const validateObjectId = (id: string, throwEx: boolean = true): string => {
  const result = zodObjectId.safeParse(id);
  if (!result.success && throwEx) {
    throw new HttpException("Invalid ObjectId", 400);
  } else if (!result.success) {
    return null;
  }
  return result.data;
};

//check if 2 arrays of string contains the same values
export const compareArrays = (a: string[], b: string[]): boolean => {
  return a.length === b.length && a.every((v) => b.includes(v));
};

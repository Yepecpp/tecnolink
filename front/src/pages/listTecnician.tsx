import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PhoneIcon,
  MailIcon,
  CreditCardIcon as IdCardIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { IUser } from "@/types";
import { getAllUsers } from "@/services/users/list";

// Mock data for demonstration
const technicians = [
  {
    id: "1",
    name: "John Doe",
    lastName: "Smith",
    login: { email: "john.doe@example.com" },
    cellPhone: "+1234567890",
    status: "active",
    identity: { idType: "id", idNumber: "ID123456" },
  },
  {
    id: "2",
    name: "Jane",
    lastName: "Johnson",
    login: { email: "jane.johnson@example.com" },
    cellPhone: "+1987654321",
    status: "inactive",
    identity: { idType: "passport", idNumber: "PP789012" },
  },
  {
    id: "3",
    name: "Bob",
    lastName: "Williams",
    login: { email: "bob.williams@example.com" },
    cellPhone: "+1122334455",
    status: "active",
    identity: { idType: "id", idNumber: "ID789012" },
  },
  {
    id: "4",
    name: "Alice",
    lastName: "Brown",
    login: { email: "alice.brown@example.com" },
    cellPhone: "+1555666777",
    status: "active",
    identity: { idType: "passport", idNumber: "PP345678" },
  },
  // Add more mock technicians as needed
];

export default function TechnicianGrid() {
  const [data, setData] = useState<IUser[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllUsers({ limit: 100 });
      if (data && data.data) setData(data.data);
    };
    fetchData();
  }, []);
  return (
    <div className="container mx-auto py-8 ">
      <h1 className="text-3xl font-bold mb-6">Technicians</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 m-4">
        {data
          ?.filter(
            (technician) =>
              technician.role === "tecnician" && technician.status === "active"
          )
          .map((technician) => (
            <Card key={technician.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${technician.name} ${technician.lastName}`}
                      alt={`${technician.name} ${technician.lastName}`}
                    />
                    <AvatarFallback>
                      {technician.name[0]}
                      {technician.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {technician.name} {technician.lastName}
                    </CardTitle>
                    <Badge
                      variant={
                        technician.status === "active" ? "default" : "secondary"
                      }
                    >
                      {technician.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MailIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{technician.login.email}</span>
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{technician.cellPhone}</span>
                  </div>
                  <div className="flex items-center">
                    <IdCardIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {technician.identity.idType.toUpperCase()}:{" "}
                      {technician.identity.idNumber}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}

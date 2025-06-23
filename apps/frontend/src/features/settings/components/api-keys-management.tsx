import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heading } from "@/components/ui/heading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconPlus } from "@tabler/icons-react";
import { MoreHorizontal } from "lucide-react";

const apiKeys = [
  {
    name: "Public Data API",
    createdAt: "Sep 6, 2024 2:08 am",
    status: "Active",
  },
  {
    name: "Product Info API",
    createdAt: "Sep 12, 2024 2:07 pm",
    status: "Active",
  },
  {
    name: "User Data API",
    createdAt: "Aug 20, 2024 7:59 am",
    status: "Revoked",
  },
];

export function ApiKeysManagement() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Public API Settings"
          description="Manage and configure access to the Public API."
        />
        <Button>
          <IconPlus />
          New
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>API Name</TableHead>
            <TableHead>Date of Creation</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.map((key) => (
            <TableRow key={key.name}>
              <TableCell className="font-medium">{key.name}</TableCell>
              <TableCell>{key.createdAt}</TableCell>
              <TableCell>
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    key.status === "Active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {key.status}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Copy API Key</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Revoke Access
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

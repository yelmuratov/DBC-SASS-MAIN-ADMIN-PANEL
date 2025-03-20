"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useCompanyStore } from "@/store/companyStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import AddUserModal from "@/components/AddUserModal";
import EditUserModal from "@/components/EditUserModal";

export default function UsersPage() {
  const users = useUserStore((state) => state.users);
  const fetchUsers = useUserStore((state) => state.fetchUsers);
  const deleteUser = useUserStore((state) => state.deleteUser);
  const loading = useUserStore((state) => state.loading);
  const submitting = useUserStore((state) => state.submitting);

  const companies = useCompanyStore((state) => state.companies);
  const fetchCompanies = useCompanyStore((state) => state.fetchCompanies);

  useEffect(() => {
    fetchUsers();
    if (companies.length === 0) {
      fetchCompanies();
    }
  }, [fetchUsers, fetchCompanies, companies.length]);

  const getCompanyName = (companyId: number) => {
    const company = companies.find((c) => c.id === companyId);
    return company ? company.name : "N/A";
  };

  if (loading) {
    return <div className="text-center p-6">Loading users...</div>;
  }

  if (!Array.isArray(users) || users.length === 0) {
    return <div className="text-center p-6">No users found.</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Manage Users</h1>
        <AddUserModal />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id || `temp-${index}`}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.first_name}</TableCell>
              <TableCell>{user.last_name}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone || "N/A"}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{getCompanyName(user.company)}</TableCell>
              <TableCell className="flex gap-2">
                <EditUserModal user={user} />
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={submitting}
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this user?")) {
                      deleteUser(user.id);
                    }
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
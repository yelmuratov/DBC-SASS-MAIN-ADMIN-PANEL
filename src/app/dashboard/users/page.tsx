"use client";

import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { useCompanyStore } from "@/store/companyStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, EyeOff, Copy } from "lucide-react";
import AddUserModal from "@/components/AddUserModal";
import EditUserModal from "@/components/EditUserModal";
import toast from "react-hot-toast";

// FTP Password Cell with Eye & Copy
function FtpPasswordCell({ password }: { password: string }) {
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(password);
      toast.success("FTP password copied!");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type={visible ? "text" : "password"}
        value={password}
        readOnly
        className="bg-transparent border-none outline-none w-24 text-sm"
      />
      <button onClick={() => setVisible(!visible)} type="button">
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      <button onClick={handleCopy} type="button">
        <Copy size={16} />
      </button>
    </div>
  );
}

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Manage Users</h1>
        <AddUserModal />
      </div>

      {!Array.isArray(users) || users.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">No users found.</div>
      ) : (
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
              <TableHead>FTP Username</TableHead>
              <TableHead>FTP Password</TableHead>
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
                {user.company ? (
                  <>
                    <TableCell>{getCompanyName(user.company)}</TableCell>
                    <TableCell>{user.user_company?.ftp_username || "N/A"}</TableCell>
                    <TableCell>
                      {user.user_company?.ftp_password ? (
                        <FtpPasswordCell password={user.user_company.ftp_password} />
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell colSpan={3}>N/A</TableCell>
                  </>
                )}
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
      )}
    </div>
  );
}

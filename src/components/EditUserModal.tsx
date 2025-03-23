"use client";

import { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { useCompanyStore } from "@/store/companyStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { User } from "@/types/user";

// Schema
const userSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  company: z.number().min(1, "Company is required"),
});

interface EditUserModalProps {
  user: User;
}

export default function EditUserModal({ user }: EditUserModalProps) {
  const { updateUser } = useUserStore();
  const { companies, fetchCompanies } = useCompanyStore();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role, // ✅ FIXED: missing role
      company: user.company,
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && companies.length === 0) {
      fetchCompanies();
    }
  };

  const onSubmit = async (data: Omit<User, "id">) => {
    console.log("Submitting data:", data); // ✅ Debugging
    try {
      await updateUser(user.id, data);
      setOpen(false);
    } catch (error) {
      console.error("Update failed:", error); // ✅ Debugging
      alert(`${error}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit, (errorData) => {
            console.error("Validation Errors:", errorData); // ✅ Debug
          })}
          className="space-y-4"
        >
          <div>
            <Input {...register("first_name")} placeholder="First Name" />
            {errors.first_name && (
              <p className="text-red-500 text-sm">{errors.first_name.message}</p>
            )}
          </div>
          <div>
            <Input {...register("last_name")} placeholder="Last Name" />
            {errors.last_name && (
              <p className="text-red-500 text-sm">{errors.last_name.message}</p>
            )}
          </div>
          <div>
            <Input {...register("username")} placeholder="Username" />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>
          <div>
            <Input {...register("email")} type="email" placeholder="Email" />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Input {...register("phone")} placeholder="Phone" />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          {/* Role Select */}
          <div>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role.message}</p>
            )}
          </div>

          {/* Company Select */}
          <div>
            <Controller
              control={control}
              name="company"
              render={({ field }) => (
                <Select
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.company && (
              <p className="text-red-500 text-sm">{errors.company.message}</p>
            )}
          </div>

          {/* Optional: Show all errors for debugging */}
          {Object.keys(errors).length > 0 && (
            <div className="text-red-500 text-sm">
              <pre>{JSON.stringify(errors, null, 2)}</pre>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update User"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

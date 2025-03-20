"use client";

import { useState } from "react";
import { useCompanyStore } from "@/store/companyStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";

const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  website: z.string().min(1, "Website is required"),
  is_active: z.boolean(),
});

interface EditCompanyModalProps {
  company: Company;
}

export default function EditCompanyModal({ company }: EditCompanyModalProps) {
  const { updateCompany, fetchCompanies } = useCompanyStore();
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: company,
  });

  const onSubmit = async (data: Omit<Company, "id">) => {
    try {
      await updateCompany(company.id, { ...data, id: company.id });
      await fetchCompanies(); // Fallback: Re-fetch the list
      setOpen(false);
    } catch (error) {
      alert("Failed to update company. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input {...register("name")} placeholder="Company Name" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <Input {...register("address")} placeholder="Address" />
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
          </div>
          <div>
            <Input {...register("phone")} placeholder="Phone" />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>
          <div>
            <Input {...register("email")} type="email" placeholder="Email" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <Input {...register("website")} placeholder="Website" />
            {errors.website && <p className="text-red-500 text-sm">{errors.website.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Company"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
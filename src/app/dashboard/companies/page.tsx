"use client";

import { useEffect } from "react";
import { useCompanyStore } from "@/store/companyStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import AddCompanyModal from "@/components/AddCompanyModal";
import EditCompanyModal from "@/components/EditCompanyModal";
import { Company } from "@/types/company";


export default function CompaniesPage() {
  const companies = useCompanyStore((state) => state.companies);
  const fetchCompanies = useCompanyStore((state) => state.fetchCompanies);
  const deleteCompany = useCompanyStore((state) => state.deleteCompany);
  const loading = useCompanyStore((state) => state.loading);
  const submitting = useCompanyStore((state) => state.submitting);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  if (loading) {
    return <div className="text-center p-6">Loading companies...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Manage Companies</h1>
        <AddCompanyModal />
      </div>

      {(!Array.isArray(companies) || companies.length === 0) ? (
        <div className="text-center py-10 text-muted-foreground">No companies found.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company: Company, index: number) => (
              <TableRow key={company.id || `temp-${index}`}>
                <TableCell>{company.id}</TableCell>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.address || "N/A"}</TableCell>
                <TableCell>{company.phone || "N/A"}</TableCell>
                <TableCell>{company.email || "N/A"}</TableCell>
                <TableCell>{company.website || "N/A"}</TableCell>
                <TableCell className="flex gap-2">
                  <EditCompanyModal company={company} />
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={submitting}
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this company?")) {
                        deleteCompany(company.id);
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

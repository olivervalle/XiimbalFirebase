import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { BusinessFilter as BusinessFilterType } from "../../types/business";
import FilterSelect from "./FilterSelect";

const formSchema = z.object({
  searchTerm: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BusinessFilterProps {
  onFilterChange: (filters: BusinessFilterType) => void;
  initialFilters?: BusinessFilterType;
}

export default function BusinessFilter({
  onFilterChange,
  initialFilters = {},
}: BusinessFilterProps) {
  const [filters, setFilters] = useState<BusinessFilterType>(initialFilters);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchTerm: initialFilters?.searchTerm || "",
    },
  });

  const handleSearchSubmit = (values: FormValues) => {
    const newFilters = { ...filters };

    if (values.searchTerm) {
      newFilters.searchTerm = values.searchTerm;
    } else {
      delete newFilters.searchTerm;
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFilterChange = (newFilters: BusinessFilterType) => {
    // Preserve the search term if it exists
    if (filters.searchTerm) {
      newFilters.searchTerm = filters.searchTerm;
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="mb-6 space-y-4">
      <Form {...form}>
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="searchTerm"
            render={({ field }) => (
              <FormItem className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <FormControl>
                    <Input
                      placeholder="Buscar negocios..."
                      className="pl-10"
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSearchSubmit(form.getValues());
                        }
                      }}
                    />
                  </FormControl>
                  {field.value && (
                    <button
                      type="button"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 inline-flex items-center justify-center rounded-full hover:bg-muted"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.setValue("searchTerm", "");
                        handleSearchSubmit({
                          ...form.getValues(),
                          searchTerm: "",
                        });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </FormItem>
            )}
          />
        </div>
      </Form>

      <FilterSelect
        onFilterChange={handleFilterChange}
        initialFilters={initialFilters}
      />
    </div>
  );
}

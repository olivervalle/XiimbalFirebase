import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BusinessFilter as BusinessFilterType } from "@/types/business";
import SimpleFilterSelect from "./SimpleFilterSelect";

const formSchema = z.object({
  searchTerm: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BusinessFilterProps {
  onFilterChange: (filters: BusinessFilterType) => void;
  initialFilters?: BusinessFilterType;
}

export default function SimpleBusinessFilter({
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

  const handleFilterChange = (filterValues: BusinessFilterType) => {
    // Create a new filter object with the new values
    const newFilters = { ...filterValues };
    
    // Keep the search term if it exists
    if (filters.searchTerm) {
      newFilters.searchTerm = filters.searchTerm;
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
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
                      onChange={(e) => {
                        field.onChange(e);
                        // Apply filter automatically when typing
                        if (e.target.value === "") {
                          handleSearchSubmit({
                            searchTerm: "",
                          });
                        }
                      }}
                    />
                  </FormControl>
                  {field.value && (
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 inline-flex items-center justify-center rounded-full hover:bg-muted"
                      onClick={() => {
                        form.setValue("searchTerm", "");
                        handleSearchSubmit({
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

      <SimpleFilterSelect 
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />
    </div>
  );
}
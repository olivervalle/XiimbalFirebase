import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { BusinessFilter as BusinessFilterType } from "../../types/business";

const formSchema = z.object({
  searchTerm: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BusinessFilterProps {
  onFilterChange: (filters: BusinessFilterType) => void;
  initialFilters?: BusinessFilterType;
}

export default function InlineBusinessFilter({
  onFilterChange,
  initialFilters = {},
}: BusinessFilterProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchTerm: initialFilters.searchTerm || "",
    },
  });

  const [filters, setFilters] = useState<BusinessFilterType>(initialFilters);
  const [category, setCategory] = useState(initialFilters.category || "");
  const [location, setLocation] = useState(initialFilters.location || "");
  const [minRating, setMinRating] = useState<string>(
    initialFilters.minRating?.toString() || ""
  );

  // Categories and locations data
  const categories = [
    "Restaurant",
    "Technology",
    "Garden & Landscape",
    "Health & Fitness",
    "Retail",
    "Pet Services",
  ];

  const locations = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
  ];

  const ratings = ["1", "2", "3", "4", "5"];

  useEffect(() => {
    const newFilters: BusinessFilterType = {
      ...filters,
      searchTerm: form.getValues().searchTerm,
      category: category || undefined,
      location: location || undefined,
      minRating: minRating ? parseInt(minRating) : undefined,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [form.getValues().searchTerm, category, location, minRating]);

  const clearFilters = () => {
    form.reset({ searchTerm: "" });
    setCategory("");
    setLocation("");
    setMinRating("");
  };

  const hasActiveFilters =
    form.getValues().searchTerm ||
    category ||
    location ||
    minRating;

  return (
    <div className="space-y-4">
      <Form {...form}>
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <FormField
            control={form.control}
            name="searchTerm"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search businesses..."
                      className="pl-8"
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={minRating} onValueChange={setMinRating}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Min Rating" />
            </SelectTrigger>
            <SelectContent>
              {ratings.map((rating) => (
                <SelectItem key={rating} value={rating}>
                  {rating}★ & Up
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              className="w-full md:w-auto"
              onClick={clearFilters}
            >
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </Form>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {form.getValues().searchTerm && (
            <Badge variant="secondary">
              Search: {form.getValues().searchTerm}
            </Badge>
          )}
          {category && <Badge variant="secondary">Category: {category}</Badge>}
          {location && <Badge variant="secondary">Location: {location}</Badge>}
          {minRating && (
            <Badge variant="secondary">Min Rating: {minRating}★</Badge>
          )}
        </div>
      )}
    </div>
  );
}
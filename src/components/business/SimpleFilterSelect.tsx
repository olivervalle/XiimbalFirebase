import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BusinessFilter } from "@/types/business";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterSelectProps {
  onFilterChange: (filters: BusinessFilter) => void;
  initialFilters?: BusinessFilter;
}

export default function SimpleFilterSelect({
  onFilterChange,
  initialFilters = {},
}: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState(initialFilters.category || "");
  const [location, setLocation] = useState(initialFilters.location || "");
  const [minRating, setMinRating] = useState<string>(
    initialFilters.minRating?.toString() || ""
  );
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

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
    "Seaside",
    "Techville",
    "Greenfield",
    "Healthville",
    "Bookville",
    "Petville",
  ];

  // Update active filters when values change
  useEffect(() => {
    const active = [];
    if (category) active.push("category");
    if (location) active.push("location");
    if (minRating) active.push("minRating");
    setActiveFilters(active);
  }, [category, location, minRating]);

  // Event handlers
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    applyFilters(value, location, minRating);
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    applyFilters(category, value, minRating);
  };

  const handleRatingChange = (value: string) => {
    setMinRating(value);
    applyFilters(category, location, value);
  };

  const handleReset = () => {
    setCategory("");
    setLocation("");
    setMinRating("");
    setIsOpen(false);
    onFilterChange({});
  };

  const applyFilters = (cat: string, loc: string, rating: string) => {
    const newFilters: BusinessFilter = {};

    if (cat) newFilters.category = cat;
    if (loc) newFilters.location = loc;
    if (rating) newFilters.minRating = parseInt(rating);

    onFilterChange(newFilters);
  };

  const removeFilter = (filterType: string) => {
    switch (filterType) {
      case "category":
        setCategory("");
        break;
      case "location":
        setLocation("");
        break;
      case "minRating":
        setMinRating("");
        break;
    }

    // Update filters after removing one
    const updatedFilters: BusinessFilter = {};
    if (filterType !== "category" && category) updatedFilters.category = category;
    if (filterType !== "location" && location) updatedFilters.location = location;
    if (filterType !== "minRating" && minRating) updatedFilters.minRating = parseInt(minRating);

    onFilterChange(updatedFilters);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filtros</span>
              {activeFilters.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <h3 className="font-medium mb-4">Filtrar Negocios</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Categoría
                </label>
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las Categorías</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Ubicación
                </label>
                <Select value={location} onValueChange={handleLocationChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las Ubicaciones</SelectItem>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Calificación Mínima
                </label>
                <Select value={minRating} onValueChange={handleRatingChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Calificación mínima" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Cualquier Calificación</SelectItem>
                    <SelectItem value="5">★★★★★ (5)</SelectItem>
                    <SelectItem value="4">★★★★☆ (4+)</SelectItem>
                    <SelectItem value="3">★★★☆☆ (3+)</SelectItem>
                    <SelectItem value="2">★★☆☆☆ (2+)</SelectItem>
                    <SelectItem value="1">★☆☆☆☆ (1+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" className="w-full" onClick={handleReset}>
                Reiniciar Filtros
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {category && (
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
              <span>Categoría: {category}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => removeFilter("category")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {location && (
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
              <span>Ubicación: {location}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => removeFilter("location")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {minRating && (
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
              <span>Calificación: {minRating}+ estrellas</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => removeFilter("minRating")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
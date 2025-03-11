import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BusinessFilter } from "@/types/business";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface FilterSelectProps {
  onFilterChange: (filters: BusinessFilter) => void;
  initialFilters?: BusinessFilter;
}

export default function NewFilterSelect({
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

  // Datos de categorías y ubicaciones
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

  // Actualizar filtros activos cuando cambian los valores
  useEffect(() => {
    const active = [];
    if (category) active.push("category");
    if (location) active.push("location");
    if (minRating) active.push("minRating");
    setActiveFilters(active);
  }, [category, location, minRating]);

  // Manejadores de eventos
  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
  };

  const handleRatingChange = (value: string) => {
    setMinRating(value);
  };

  const handleReset = () => {
    setCategory("");
    setLocation("");
    setMinRating("");
    setIsOpen(false);
    onFilterChange({});
  };

  const handleApply = () => {
    const newFilters: BusinessFilter = {};

    if (category) newFilters.category = category;
    if (location) newFilters.location = location;
    if (minRating) newFilters.minRating = parseInt(minRating);

    onFilterChange(newFilters);
    setIsOpen(false);
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

    // Actualizar filtros después de eliminar uno
    const updatedFilters: BusinessFilter = {};
    if (filterType !== "category" && category) updatedFilters.category = category;
    if (filterType !== "location" && location) updatedFilters.location = location;
    if (filterType !== "minRating" && minRating) updatedFilters.minRating = parseInt(minRating);

    onFilterChange(updatedFilters);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
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
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Filtrar Negocios</SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-6">
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
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Button variant="outline" className="flex-1" onClick={handleReset}>
                Reiniciar
              </Button>
              <Button className="flex-1" onClick={handleApply}>
                Aplicar Filtros
              </Button>
            </div>
          </SheetContent>
        </Sheet>
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
                ×
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
                ×
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
                ×
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
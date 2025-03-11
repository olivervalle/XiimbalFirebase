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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface FilterSelectProps {
  onFilterChange: (filters: BusinessFilter) => void;
  initialFilters?: BusinessFilter;
}

export default function FilterSelect({
  onFilterChange,
  initialFilters = {},
}: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState(initialFilters.category || "");
  const [location, setLocation] = useState(initialFilters.location || "");
  const [minRating, setMinRating] = useState<string>(
    initialFilters.minRating?.toString() || "",
  );
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Sample data
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

  useEffect(() => {
    updateActiveFilters();
  }, [category, location, minRating]);

  const updateActiveFilters = () => {
    const active = [];
    if (category) active.push("category");
    if (location) active.push("location");
    if (minRating) active.push("minRating");
    setActiveFilters(active);
  };

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

  return (
    <div className="mb-6">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            className="flex gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filtros</span>
            {activeFilters.length > 0 && (
              <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {activeFilters.length}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Filtrar Negocios</SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Categoría
              </label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
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

            <div>
              <label className="text-sm font-medium mb-2 block">
                Ubicación
              </label>
              <Select value={location} onValueChange={handleLocationChange}>
                <SelectTrigger>
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

            <div>
              <label className="text-sm font-medium mb-2 block">
                Calificación Mínima
              </label>
              <Select value={minRating} onValueChange={handleRatingChange}>
                <SelectTrigger>
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

      {activeFilters.length > 0 && (
        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <h2 className="font-semibold mb-2">Filtros Activos:</h2>
          <ul className="space-y-1">
            {category && (
              <li>
                <span className="font-medium">Categoría:</span> {category}
              </li>
            )}
            {location && (
              <li>
                <span className="font-medium">Ubicación:</span> {location}
              </li>
            )}
            {minRating && (
              <li>
                <span className="font-medium">Calificación Mínima:</span>{" "}
                {minRating}+ estrellas
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

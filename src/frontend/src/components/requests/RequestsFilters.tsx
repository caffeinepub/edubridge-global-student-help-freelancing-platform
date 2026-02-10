import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface RequestsFiltersProps {
  onSearchChange: (search: string) => void;
  onOfflineOnlyChange: (offlineOnly: boolean) => void;
  onCityChange: (city: string) => void;
  showLocationFilters?: boolean;
}

export default function RequestsFilters({
  onSearchChange,
  onOfflineOnlyChange,
  onCityChange,
  showLocationFilters = true,
}: RequestsFiltersProps) {
  const [search, setSearch] = useState('');
  const [offlineOnly, setOfflineOnly] = useState(false);
  const [city, setCity] = useState('');

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange(value);
  };

  const handleOfflineToggle = (checked: boolean) => {
    setOfflineOnly(checked);
    onOfflineOnlyChange(checked);
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    onCityChange(value);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search requests..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {showLocationFilters && (
            <>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Filter by city..."
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  disabled={!offlineOnly}
                />
              </div>

              <div className="flex items-end pb-2">
                <div className="flex items-center space-x-2">
                  <Switch id="offline-only" checked={offlineOnly} onCheckedChange={handleOfflineToggle} />
                  <Label htmlFor="offline-only" className="cursor-pointer">
                    Offline requests only
                  </Label>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useCreatePropertyMutation } from '../api/propertyApi';

export default function AddProperty() {
  const [addresses, setAddresses] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchPostcode, setSearchPostcode] = useState('');
  const [open, setOpen] = useState(false);
  const [createProperty, { isLoading, isSuccess, error }] = useCreatePropertyMutation();


  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      address: '',
      city: '',
      postalCode: ''
    }
  });

  const searchPostalCode = async () => {
    if (!searchPostcode.trim()) {
      setSearchError('Please enter a postal code');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setAddresses([]);

    try {
      const response = await fetch(
        `https://api.getaddress.io/find/${encodeURIComponent(searchPostcode)}?api-key=cNYlJmv1_USJfme3bZ7KQg45271`
      );

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        setSearchError('Failed to parse API response');
        return;
      }

      if (!response.ok) {
        // If API returns an error message, show it
        const apiErrorMsg = data && (data.Message || data.message || data.error);
        setSearchError(apiErrorMsg || 'Failed to fetch addresses');
        return;
      }

      if (data.addresses && data.addresses.length > 0) {
        const formattedAddresses = data.addresses.map(addr => {
          const parts = addr.split(',').map(part => part.trim());
          return parts.join(', ');
        });
        setAddresses(formattedAddresses);
      } else {
        setSearchError('No addresses found for this postal code');
      }
    } catch (error) {
      // Show error message if available
      setSearchError(error?.message || error?.Message || 'An error occurred while searching');
      console.error('Error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddressSelect = (e) => {
    const index = e.target.value;
    if (index === '') {
      return;
    }

    const selectedAddress = addresses[parseInt(index)];
    const parts = selectedAddress.split(',').map(part => part.trim()).filter(part => part !== '');

    // API returns: [line_1, line_2, line_3, locality, town_or_city, county]
    // Extract address components
    let addressLine = '';
    let city = '';
    
    if (parts.length >= 2) {
      // Combine non-empty parts except the last one (which is typically the city)
      addressLine = parts.slice(0, -1).join(', ');
      // Last non-empty part is the city
      city = parts[parts.length - 1];
    } else if (parts.length === 1) {
      addressLine = parts[0];
    }

    setValue('address', addressLine);
    setValue('city', city);
    setValue('postalCode', searchPostcode);
  };

  const onSubmit = async (data) => {
    console.log('Form submitted:', data);
    await createProperty(data);
    alert('Property added successfully!\n\n' + JSON.stringify(data, null, 2));
    setOpen(false);
    reset();
    setAddresses([]);
    setSearchPostcode('');
    setSearchError('');
  };

  const handleCancel = () => {
    reset();
    setAddresses([]);
    setSearchPostcode('');
    setSearchError('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Property</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Property</DialogTitle>
          <DialogDescription>
            Enter property details below. You can search by postal code to auto-fill the address fields.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Postal Code Search */}
          <div className="grid gap-2">
            <Label htmlFor="search-postcode">Search by Postal Code</Label>
            <div className="flex gap-2">
              <Input
                id="search-postcode"
                type="text"
                value={searchPostcode}
                onChange={(e) => setSearchPostcode(e.target.value.toUpperCase())}
                placeholder="e.g., NW3 4TX"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    searchPostalCode();
                  }
                }}
              />
              <Button
                type="button"
                onClick={searchPostalCode}
                disabled={isSearching}
                size="md"
                variant="secondary"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            {searchError && (
              <p className="text-sm text-red-500">{searchError}</p>
            )}
          </div>

          {/* Address Dropdown */}
          {addresses.length > 0 && (
            <div className="grid gap-2">
              <Label htmlFor="select-address">Select Address</Label>
              <select
                id="select-address"
                onChange={handleAddressSelect}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Choose an address...</option>
                {addresses.map((option, index) => (
                  <option key={index} value={index}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Address Field */}
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Enter street address"
              {...register('address', { required: 'Address is required' })}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          {/* City Field */}
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Enter city"
              {...register('city', { required: 'City is required' })}
            />
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>

          {/* Postal Code Field */}
          <div className="grid gap-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              placeholder="Enter postal code"
              {...register('postalCode', { 
                required: 'Postal code is required',
                pattern: {
                  value: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
                  message: 'Please enter a valid UK postal code'
                }
              })}
            />
            {errors.postalCode && (
              <p className="text-sm text-red-500">{errors.postalCode.message}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button" onClick={handleCancel}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit(onSubmit)}>
            Add Property
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
"'use client'"
import { Button } from '@/components/ui/button'
import React from 'react'
import { SearchInput } from '../../shared/_components/SearchInput'
import AddProperty from './CreatePropertyButton'

export const PropertiesActions = () => {
      const handleSearch = async (address: string) => {
    // Simulate API call
    console.log("Searching for:", address)
    
    // Example: Make your API call here
    // const response = await fetch(`/api/search?address=${encodeURIComponent(address)}`)
    // const data = await response.json()
    // Handle the response...
  }
    
  return (
    <div className='flex gap-5'>
        
        <AddProperty/>
        <SearchInput
        onSearch={handleSearch}
        placeholder="Enter an address to search..."
        debounceMs={1000}
        maxLength={100}
        />
    </div>
  )
}

"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface SearchFormData {
  query: string
}

interface SearchInputProps {
  onSearch?: (value: string) => Promise<void> | void
  placeholder?: string
  debounceMs?: number
  maxLength?: number
}

export function SearchInput({
  onSearch,
  placeholder = "Search...",
  debounceMs = 500,
  maxLength = 100,
}: SearchInputProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSearching, setIsSearching] = React.useState(false)

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SearchFormData>({
    defaultValues: {
      query: searchParams.get("q") ?? "",
    },
  })

  const queryValue = watch("query")

  // Debounced search effect
  React.useEffect(() => {
    const trimmed = queryValue.trim()

    // Skip if over limit
    if (trimmed.length > maxLength) {
      return
    }

    const debounceTimer = setTimeout(async () => {
      setIsSearching(true)

      try {
        const params = new URLSearchParams(searchParams.toString())
        
        if (trimmed) {
          // Set search params if there's a query
          params.set("q", trimmed)
          params.set("page", "1")
          params.set("limit", "10")
        } else {
          // Remove search params if query is empty
          params.delete("q")
        }
        
        router.push(`?${params.toString()}`)

        if (onSearch && trimmed) {
          await onSearch(trimmed)
        }
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsSearching(false)
      }
    }, debounceMs)

    return () => clearTimeout(debounceTimer)
  }, [queryValue, debounceMs, maxLength])

  const handleClear = () => {
    setValue("query", "")
    // The useEffect will handle URL update automatically
  }

  const charCount = queryValue.length
  const isOverLimit = charCount > maxLength

  return (
    <div className="flex flex-col gap-2 w-100 max-w-2xl">
      <div className="relative flex items-center gap-2">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="h-4 w-4" />
        </div>

        <Input
          {...register("query", {
            maxLength: {
              value: maxLength,
              message: `Input must not exceed ${maxLength} characters`,
            },
          })}
          placeholder={placeholder}
          className={`pl-10 pr-10${
            isOverLimit ? "border-red-500 focus-visible:ring-red-500" : ""
          }`}
        />

        {queryValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {isSearching && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div>
          {errors.query && (
            <span className="text-red-600">{errors.query.message}</span>
          )}
        </div>
        <span
          className={`${
            isOverLimit ? "text-red-600 font-medium" : "text-gray-500"
          }`}
        >
          {charCount}/{maxLength}
        </span>
      </div>
    </div>
  )
}

// Example usage component
export default function SearchExample() {
  const handleSearch = async (query: string) => {
    console.log("Searching for:", query)
  }

  return (
    <div className="p-8">
      <SearchInput
        onSearch={handleSearch}
        placeholder="Search anything..."
        debounceMs={500}
        maxLength={100}
      />
    </div>
  )
}
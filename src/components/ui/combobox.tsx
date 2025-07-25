
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function Combobox({ options, value, onChange, placeholder }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((option) => option.value.toLowerCase() === value.toLowerCase())?.label
            : placeholder || "Select option..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput 
            placeholder="Search or create..."
            value={inputValue}
            onValueChange={setInputValue}
          />
           <CommandList>
                <CommandEmpty>
                    <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                            onChange(inputValue);
                            setOpen(false);
                        }}
                    >
                       Create "{inputValue}"
                    </Button>
                </CommandEmpty>
                <CommandGroup>
                {filteredOptions.map((option) => (
                    <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                        onChange(currentValue.toLowerCase() === value.toLowerCase() ? "" : option.value)
                        setOpen(false)
                    }}
                    >
                    <Check
                        className={cn(
                        "mr-2 h-4 w-4",
                        value.toLowerCase() === option.value.toLowerCase() ? "opacity-100" : "opacity-0"
                        )}
                    />
                    {option.label}
                    </CommandItem>
                ))}
                </CommandGroup>
           </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

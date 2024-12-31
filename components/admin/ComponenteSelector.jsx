"use client";

import * as React from "react";
import { PopoverProps } from "@radix-ui/react-popover";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { useMutationObserver } from "@/hooks/use-mutation-observer";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";

const ComponenteSelector = ({
  componentes,
  categorias,
  allowEmpty = false,
  value,
  onValueChange,
  ...props
}) => {
  // Si value es un ID, buscar el componente correspondiente
  const initialComponente = React.useMemo(() => {
    return typeof value === "number" || typeof value === "string"
      ? componentes.find((c) => c.id === value)
      : value;
  }, [value, componentes]);

  const [open, setOpen] = React.useState(false);
  const [selectedComponente, setSelectedComponente] =
    React.useState(initialComponente);
  const [peekedComponente, setPeekedComponente] =
    React.useState(initialComponente);

  // Actualizar cuando cambia el valor externamente
  React.useEffect(() => {
    const componente =
      typeof value === "number" || typeof value === "string"
        ? componentes.find((c) => c.id === value)
        : value;
    setSelectedComponente(componente);
    setPeekedComponente(componente);
  }, [value, componentes]);

  const handleSelect = (componente) => {
    setSelectedComponente(componente);
    setOpen(false);
    onValueChange?.(componente);
  };

  return (
    <div className="grid gap-2">
      <HoverCard openDelay={200}>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          Selecciona un componente para agregar a la plantilla.
        </HoverCardContent>
      </HoverCard>
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a componente"
            className="w-full justify-between"
          >
            {selectedComponente
              ? selectedComponente.attributes.nombre
              : "Seleccionar un componente..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[250px] p-0">
          <HoverCard>
            <HoverCardContent
              side="left"
              align="start"
              forceMount
              className="min-h-[280px]"
            >
              <div className="grid gap-2">
                <h4 className="font-medium leading-none">
                  {peekedComponente?.attributes.nombre || "Ninguno"}
                </h4>
                <div className="text-sm text-muted-foreground">
                  {peekedComponente?.attributes.descripcion ||
                    "No se seleccionará ningún componente"}
                </div>
                <div className="flex items-center gap-2">
                  {peekedComponente?.attributes.imagen?.data && (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${peekedComponente.attributes.imagen.data.attributes.url}`}
                      alt={peekedComponente.attributes.nombre}
                      width={400}
                      height={100}
                    />
                  )}
                </div>
              </div>
            </HoverCardContent>
            <Command loop>
              <CommandList className="h-[var(--cmdk-list-height)] max-h-[400px]">
                <CommandInput placeholder="Buscar componentes..." />
                <CommandEmpty>No se encontraron componentes.</CommandEmpty>
                <HoverCardTrigger />
                {allowEmpty && (
                  <CommandGroup heading="Opciones">
                    <CommandItem
                      onSelect={() => handleSelect(null)}
                      className="data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground"
                    >
                      Ninguno
                      <Check
                        className={cn(
                          "ml-auto",
                          selectedComponente === null
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  </CommandGroup>
                )}
                {categorias.map((categoria) => (
                  <CommandGroup key={categoria} heading={categoria}>
                    {componentes
                      .filter(
                        (componente) =>
                          componente.attributes.categoria === categoria
                      )
                      .map((componente) => (
                        <ComponenteItem
                          key={componente.id}
                          componente={componente}
                          isSelected={selectedComponente?.id === componente.id}
                          onPeek={(componente) =>
                            setPeekedComponente(componente)
                          }
                          onSelect={() => handleSelect(componente)}
                        />
                      ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </HoverCard>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const ComponenteItem = ({ componente, isSelected, onSelect, onPeek }) => {
  const ref = React.useRef(null);

  useMutationObserver(ref, (mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "aria-selected" &&
        ref.current?.getAttribute("aria-selected") === "true"
      ) {
        onPeek(componente);
      }
    });
  });

  return (
    <CommandItem
      key={componente.id}
      onSelect={onSelect}
      ref={ref}
      className="data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground"
    >
      {componente.attributes.nombre}
      <Check
        className={cn("ml-auto", isSelected ? "opacity-100" : "opacity-0")}
      />
    </CommandItem>
  );
};

export default ComponenteSelector;

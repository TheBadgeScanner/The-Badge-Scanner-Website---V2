// File: components/ui/collapsible.tsx
import { useState } from "react";
import { Button } from "./button";

const Collapsible = ({ children, open, onOpenChange, ...props }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isOpen = open !== undefined ? open : internalOpen;
  const handleOpenChange = onOpenChange || setInternalOpen;
  
  return (
    <div {...props}>
      {children}
    </div>
  );
};

const CollapsibleTrigger = ({ children, ...props }) => {
  return (
    <Button variant="ghost" size="sm" {...props}>
      {children}
    </Button>
  );
};

const CollapsibleContent = ({ children, ...props }) => {
  return (
    <div {...props}>
      {children}
    </div>
  );
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent };

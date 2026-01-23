import React from "react";
import { Toaster as Sonner, toast } from "sonner";

function Toaster(props) {
  return (
    <Sonner
      richColors
      position="top-right"
      closeButton
      duration={4000}
      className="toaster group top-20"
      toastOptions={{
        classNames: {
          toast:
            "group toast border shadow-lg",
          description: "opacity-90",
          actionButton:
            "bg-primary text-primary-foreground",
          cancelButton:
            "bg-muted text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };

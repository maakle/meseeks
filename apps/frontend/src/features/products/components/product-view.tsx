"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import ProductForm from "./product-form";

export function ProductView() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(buttonVariants(), "text-xs md:text-sm")}
      >
        <IconPlus className="mr-2 h-4 w-4" /> Add New
      </Button>

      <Modal
        title="Add New Product"
        description="Create a new product with all the details"
        isOpen={isOpen}
        onClose={handleClose}
        size="xl"
      >
        <ProductForm initialData={null} onSubmit={handleSubmit} />
      </Modal>
    </>
  );
}

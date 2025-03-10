"use client"

import { hotels } from "@/data/hotels"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/hotels/columns"
import { useState } from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

export default function HotelsPage() {
  const [lightbox, setLightbox] = useState({
    open: false,
    image: ""
  });

  const tableColumns = columns({ 
    onImageClick: (image: string) => setLightbox({ open: true, image })
  });

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Hotels Management</h2>
        <p className="text-muted-foreground">
          Manage your hotel listings and properties
        </p>
      </div>
      <div className="mt-6">
        <DataTable columns={tableColumns} data={hotels.featured} />
      </div>
      <Lightbox
        open={lightbox.open}
        close={() => setLightbox({ open: false, image: "" })}
        slides={[{ src: lightbox.image }]}
      />
    </div>
  )
}
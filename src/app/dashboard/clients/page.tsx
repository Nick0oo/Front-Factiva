"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ClientsList } from './components/ClientsList'
import { NewClientModal } from './components/NewClientModal'
import { Client } from './models/client.types'

export default function ClientsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editClient, setEditClient] = useState<Client | null>(null)
  const [refreshFlag, setRefreshFlag] = useState(0)

  const handleEdit = (client: Client) => {
    setEditClient(client)
    setModalOpen(true)
  }

  const handleCreate = () => {
    setEditClient(null)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditClient(null)
  }

  const handleClientSaved = () => {
    setRefreshFlag(f => f + 1)
    handleCloseModal()
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
        </Button>
      </div>
      <ClientsList 
        onEdit={handleEdit}
        refreshFlag={refreshFlag}
      />
      <NewClientModal 
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialData={editClient || undefined}
        isEdit={!!editClient}
        onClientSaved={handleClientSaved}
      />
    </div>
  )
}
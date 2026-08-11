'use client';

import React, { useState } from 'react';
import { Button, useToast } from '@repo/ui/components';
import PageHeader from 'components/common/PageHeader';
import { useToolMutations } from 'hooks/mutations/useToolMutations';
import ToolsTableContainer from './ToolsTableContainer';

const ToolsPageContainer = () => {
  const { toast } = useToast();

  const { deleteTool } = useToolMutations();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined);

  const openAddModal = () => {
    setEditId(undefined);
    setModalOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const openEditModal = (id: number) => {
    setEditId(id);
    setModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteId(undefined);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTool.mutateAsync(deleteId);
      toast({ variant: 'success', title: 'Blog deleted successfully.' });
      closeDeleteModal();
    } catch (error) {
      toast({
        variant: 'error',
        title: error instanceof Error ? error.message : 'Failed to delete blog.'
      });
    }
  };

  return (
    <section>
      <PageHeader title="Tools">
        <Button variant="filled" color="primary">
          Add Tools
        </Button>
      </PageHeader>
      <ToolsTableContainer onEdit={openEditModal} onDelete={openDeleteModal} />
    </section>
  );
};

export default ToolsPageContainer;

'use client';

import React, { useState } from 'react';
import { Button, useToast } from '@repo/ui/components';
import DeleteConfirmationModal from 'components/common/DeleteConfirmationModal';
import PageHeader from 'components/common/PageHeader';
import ToolsModal from 'components/modal/ToolsModal';
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
      const res = await deleteTool.mutateAsync(deleteId);
      if (res.success) {
        toast({
          variant: 'success',
          title: res.message ?? 'Blog deleted successfully.'
        });
      } else {
        toast({
          variant: 'error',
          title: res.message ?? 'Blog delete failed.'
        });
      }
      closeDeleteModal();
    } catch (error) {
      toast({
        variant: 'error',
        title: error instanceof Error ? error.message : 'Failed to delete blog.'
      });
    }
  };

  return (
    <>
      <section>
        <PageHeader title="Tools">
          <Button variant="filled" color="primary" onClick={openAddModal}>
            Add Tools
          </Button>
        </PageHeader>
        <ToolsTableContainer
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      </section>
      <ToolsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editId={editId}
      />
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteTool.isPending}
        title="Delete blog"
        description="Are you sure you want to delete this tool? This action cannot be undone."
      />
    </>
  );
};

export default ToolsPageContainer;

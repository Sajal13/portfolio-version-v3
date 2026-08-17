'use client';

import { useState } from 'react';
import { Button, useToast } from '@repo/ui/components';
import DeleteConfirmationModal from 'components/common/DeleteConfirmationModal';
import PageHeader from 'components/common/PageHeader';
import { useSkillMutations } from 'hooks/mutations/useSkillMutations';
import SkillsModal from './SkillModal';
import SkillsTableContainer from './SkillsTableContainer';

const SkillsContainer = () => {
  const { toast } = useToast();
  const { deleteSkill } = useSkillMutations();
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const openAddModal = () => {
    setEditId(null);
    setOpenModal(true);
  };

  const closeModal = () => {
    setEditId(null);
    setOpenModal(false);
  };

  const onEditClick = (id: number) => {
    setEditId(id);
    setOpenModal(true);
  };

  const onDeleteClick = (id: number) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteId(null);
    setOpenDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSkill.mutateAsync(deleteId);
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
    <>
      <section>
        <PageHeader title="Skills">
          <Button variant="filled" color="primary" onClick={openAddModal}>
            Add Skill
          </Button>
        </PageHeader>
        <SkillsTableContainer onEdit={onEditClick} onDelete={onDeleteClick} />

        <SkillsModal
          open={openModal}
          onClose={closeModal}
          editId={editId ?? undefined}
        />
      </section>
      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteSkill.isPending}
        title="Delete Skill"
        description="Are you sure you want to delete this skill? This action cannot be undone."
      />
    </>
  );
};

export default SkillsContainer;

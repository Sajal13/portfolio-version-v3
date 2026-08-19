'use client';

import { useState } from 'react';
import { useToast } from '@repo/ui/components';
import DeleteConfirmationModal from 'components/common/DeleteConfirmationModal';
import PageHeader from 'components/common/PageHeader';
import { useContactMutations } from 'hooks/mutations/useContactMutations';
import ContactTableContainer from './ContactTableContainer';
import ContactViewModal from './ContactViewModal';

const ContactContainer = () => {
  const { toast } = useToast();
  const { deleteContact } = useContactMutations();
  const [viewId, setViewId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const onOpenViewModal = (id: number) => {
    setViewId(id);
    setOpenModal(true);
  };

  const closeModal = () => {
    setViewId(null);
    setOpenModal(false);
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
      const res = await deleteContact.mutateAsync(deleteId);
      if (res.success) {
        toast({
          variant: 'success',
          title: res.message ?? 'Contact deleted successfully.'
        });
      } else {
        toast({
          variant: 'error',
          title: res.message ?? 'Failed to delete contact.'
        });
      }
      closeDeleteModal();
    } catch (error) {
      toast({
        variant: 'error',
        title:
          error instanceof Error ? error.message : 'Failed to delete contact.'
      });
    }
  };
  return (
    <>
      <section>
        <PageHeader title="Contact" />
        <ContactTableContainer
          onView={onOpenViewModal}
          onDelete={onDeleteClick}
        />
        <ContactViewModal
          open={openModal}
          onClose={closeModal}
          viewId={viewId ?? undefined}
        />
      </section>
      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteContact.isPending}
        title="Delete Contact"
        description="Are you sure you want to delete this contact? This action cannot be undone."
      />
    </>
  );
};

export default ContactContainer;

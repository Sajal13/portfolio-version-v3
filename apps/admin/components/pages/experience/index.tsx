'use client';

import { useEffect, useMemo, useState } from 'react';
import { Experience } from '@repo/types';
import { Button, useToast } from '@repo/ui/components';
import { useQueryClient } from '@tanstack/react-query';
import DeleteConfirmationModal from 'components/common/DeleteConfirmationModal';
import PageHeader from 'components/common/PageHeader';
import { useExperienceMutations } from 'hooks/mutations/useExperienceMutations';
import { useGetAllExperiences } from 'hooks/queries/useExperienceQueries';
import { queryKeys } from 'lib/queryKeys';
import ExperienceModal from './ExperienceModal';
import ExperienceTableContainer from './ExperienceTableContainer';
import ExperienceViewModal from './ExperienceViewModal';

const sortByOrder = (list: Experience[]) =>
  [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

// Stamps order = index + 1 on every item based on its current array
// position. Called right after a drag so the "Order" column reflects
// the new arrangement immediately, without waiting on the server.
const withStampedOrder = (list: Experience[]): Experience[] =>
  list.map((item, index) => ({ ...item, order: index + 1 }));

const ExperienceContainer = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetAllExperiences();
  const { deleteExperience, updateExperiencePositions } =
    useExperienceMutations();

  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewId, setViewId] = useState<number | null>(null);

  const [items, setItems] = useState<Experience[]>([]);

  useEffect(() => {
    if (data) {
      setItems(sortByOrder(data));
    }
  }, [data]);

  // The "true" order as last confirmed by the server — used to detect
  // whether the current local arrangement has actually changed.
  const originalOrderIds = useMemo(
    () => (data ? sortByOrder(data).map((item) => item.id) : []),
    [data]
  );

  const isReordered = useMemo(() => {
    if (items.length !== originalOrderIds.length) return false;
    return items.some((item, index) => item.id !== originalOrderIds[index]);
  }, [items, originalOrderIds]);

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

  const onViewClick = (id: number) => {
    setViewId(id);
    setOpenViewModal(true);
  };

  const closeViewModal = () => {
    setViewId(null);
    setOpenViewModal(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await deleteExperience.mutateAsync(deleteId);
      if (res.success) {
        toast({
          variant: 'success',
          title: res.message ?? 'Experience deleted successfully.'
        });
      } else {
        toast({
          variant: 'error',
          title: res.message ?? 'Failed to delete experience.'
        });
      }
      closeDeleteModal();
    } catch (error) {
      toast({
        variant: 'error',
        title:
          error instanceof Error
            ? error.message
            : 'Failed to delete experience.'
      });
    }
  };

  // Step 1: drag ends → AdvanceTable gives us the reordered array →
  // stamp fresh `order` values so the Order column updates instantly,
  // purely client-side. Nothing hits the network yet.
  const handleReorder = (newItems: Experience[]) => {
    setItems(withStampedOrder(newItems));
  };

  // Step 2: user clicks "Update Position" → send { id, order } pairs →
  // on success, write the already-correct optimistic `items` straight
  // into the query cache (no flicker), then invalidate in the
  // background to reconcile with the server's source of truth.
  const handleUpdatePositions = async () => {
    try {
      await updateExperiencePositions.mutateAsync({
        positions: items.map((item) => ({
          id: item.id,
          order: item.order
        }))
      });

      queryClient.setQueryData(queryKeys.experiences.list(), items);
      toast({ variant: 'success', title: 'Order updated successfully.' });
    } catch (error) {
      toast({
        variant: 'error',
        title:
          error instanceof Error ? error.message : 'Failed to update order.'
      });
    }
  };

  return (
    <>
      <section>
        <PageHeader title="Experience">
          <div className="flex items-center gap-3">
            <Button
              variant="filled"
              color="secondary"
              onClick={handleUpdatePositions}
              disabled={!isReordered || updateExperiencePositions.isPending}
            >
              {updateExperiencePositions.isPending
                ? 'Updating...'
                : 'Update Position'}
            </Button>
            <Button variant="filled" color="primary" onClick={openAddModal}>
              Add Experience
            </Button>
          </div>
        </PageHeader>
        <ExperienceTableContainer
          items={items}
          isLoading={isLoading}
          onReorder={handleReorder}
          onEdit={onEditClick}
          onDelete={onDeleteClick}
          onView={onViewClick}
        />

        <ExperienceModal
          open={openModal}
          onClose={closeModal}
          editId={editId ?? undefined}
        />

        <ExperienceViewModal
          open={openViewModal}
          onClose={closeViewModal}
          viewId={viewId ?? undefined}
        />
      </section>
      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteExperience.isPending}
        title="Delete Experience"
        description="Are you sure you want to delete this experience? This action cannot be undone."
      />
    </>
  );
};

export default ExperienceContainer;

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Testimonial } from '@repo/types';
import { Button, useToast } from '@repo/ui/components';
import { useQueryClient } from '@tanstack/react-query';
import DeleteConfirmationModal from 'components/common/DeleteConfirmationModal';
import PageHeader from 'components/common/PageHeader';
import { useTestimonialMutations } from 'hooks/mutations/useTestimonialMutations';
import { useGetAllTestimonials } from 'hooks/queries/useTestimonialQueries';
import { queryKeys } from 'lib/queryKeys';
import TestimonialModal from './TestimonialModal';
import TestimonialTableContainer from './TestimonialTableContainer';
import TestimonialViewModal from './TestimonialViewModal';

const sortByOrder = (list: Testimonial[]) =>
  [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

const withStampedOrder = (list: Testimonial[]): Testimonial[] =>
  list.map((item, index) => ({ ...item, order: index + 1 }));

const TestimonialContainer = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetAllTestimonials();
  const { deleteTestimonial, updateTestimonialPositions } =
    useTestimonialMutations();

  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewId, setViewId] = useState<number | null>(null);

  const [items, setItems] = useState<Testimonial[]>([]);

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
      const res = await deleteTestimonial.mutateAsync(deleteId);
      if (res.success) {
        toast({
          variant: 'success',
          title: res.message ?? 'Testimonial deleted successfully.'
        });
      } else {
        toast({
          variant: 'error',
          title: res.message ?? 'Failed to Delete testimonial.'
        });
      }
      closeDeleteModal();
    } catch (error) {
      toast({
        variant: 'error',
        title:
          error instanceof Error
            ? error.message
            : 'Failed to delete testimonial.'
      });
    }
  };

  const handleReorder = (newItems: Testimonial[]) => {
    setItems(withStampedOrder(newItems));
  };

  const handleUpdatePositions = async () => {
    try {
      const res = await updateTestimonialPositions.mutateAsync({
        positions: items.map((item) => ({
          id: item.id,
          order: item.order
        }))
      });

      queryClient.setQueryData(queryKeys.testimonial.list(), items);
      if (res.success) {
        toast({
          variant: 'success',
          title: res.message ?? 'Order updated successfully.'
        });
      } else {
        toast({
          variant: 'error',
          title: res.message ?? 'Failed to update order.'
        });
      }
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
        <PageHeader title="Testimonials">
          <div className="flex items-center gap-3">
            <Button
              variant="filled"
              color="secondary"
              onClick={handleUpdatePositions}
              disabled={!isReordered || updateTestimonialPositions.isPending}
            >
              {updateTestimonialPositions.isPending
                ? 'Updating...'
                : 'Update Position'}
            </Button>
            <Button variant="filled" color="primary" onClick={openAddModal}>
              Add Testimonial
            </Button>
          </div>
        </PageHeader>
        <TestimonialTableContainer
          items={items}
          isLoading={isLoading}
          onReorder={handleReorder}
          onEdit={onEditClick}
          onDelete={onDeleteClick}
          onView={onViewClick}
        />

        <TestimonialModal
          open={openModal}
          onClose={closeModal}
          editId={editId ?? undefined}
        />

        <TestimonialViewModal
          open={openViewModal}
          onClose={closeViewModal}
          viewId={viewId ?? undefined}
        />
      </section>
      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteTestimonial.isPending}
        title="Delete Testimonial"
        description="Are you sure you want to delete this testimonial? This action cannot be undone."
      />
    </>
  );
};

export default TestimonialContainer;

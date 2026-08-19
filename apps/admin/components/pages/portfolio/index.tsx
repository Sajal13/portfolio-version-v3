'use client';

import { useEffect, useMemo, useState } from 'react';
import { Portfolio } from '@repo/types';
import { Button, useToast } from '@repo/ui/components';
import { useQueryClient } from '@tanstack/react-query';
import DeleteConfirmationModal from 'components/common/DeleteConfirmationModal';
import PageHeader from 'components/common/PageHeader';
import { usePortfolioMutations } from 'hooks/mutations/usePortfolioMutations';
import { useGetAllPortfolios } from 'hooks/queries/usePortfolioQueries';
import { queryKeys } from 'lib/queryKeys';
import PortfolioModal from './PortfolioModal';
import PortfolioTableContainer from './PortfolioTableContainer';
import PortfolioViewModal from './PortfolioViewModal';

const sortByOrder = (list: Portfolio[]) =>
  [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

// Stamps order = index + 1 on every item based on its current array
// position. Called right after a drag so the "Order" column reflects
// the new arrangement immediately, without waiting on the server.
const withStampedOrder = (list: Portfolio[]): Portfolio[] =>
  list.map((item, index) => ({ ...item, order: index + 1 }));

const PortfolioContainer = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetAllPortfolios();
  const { deletePortfolio, updatePortfolioPositions } = usePortfolioMutations();

  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewId, setViewId] = useState<number | null>(null);

  // Local, reorderable copy of the list. Reset from server data whenever
  // it changes (initial load, or after a successful position save).
  const [items, setItems] = useState<Portfolio[]>([]);

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
      await deletePortfolio.mutateAsync(deleteId);
      toast({ variant: 'success', title: 'Portfolio deleted successfully.' });
      closeDeleteModal();
    } catch (error) {
      toast({
        variant: 'error',
        title:
          error instanceof Error ? error.message : 'Failed to delete portfolio.'
      });
    }
  };

  // Step 1: drag ends → AdvanceTable gives us the reordered array →
  // stamp fresh `order` values so the Order column updates instantly,
  // purely client-side. Nothing hits the network yet.
  const handleReorder = (newItems: Portfolio[]) => {
    setItems(withStampedOrder(newItems));
  };

  // Step 2: user clicks "Update Position" → send { id, order } pairs →
  // on success, write the already-correct optimistic `items` straight
  // into the query cache (no flicker), then invalidate in the
  // background to reconcile with the server's source of truth.
  const handleUpdatePositions = async () => {
    try {
      await updatePortfolioPositions.mutateAsync({
        positions: items.map((item) => ({
          id: item.id,
          order: item.order
        }))
      });

      queryClient.setQueryData(queryKeys.portfolio.list(), items);
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
        <PageHeader title="Portfolio">
          <div className="flex items-center gap-3">
            <Button
              variant="filled"
              color="secondary"
              onClick={handleUpdatePositions}
              disabled={!isReordered || updatePortfolioPositions.isPending}
            >
              {updatePortfolioPositions.isPending
                ? 'Updating...'
                : 'Update Position'}
            </Button>
            <Button variant="filled" color="primary" onClick={openAddModal}>
              Add Portfolio
            </Button>
          </div>
        </PageHeader>
        <PortfolioTableContainer
          items={items}
          isLoading={isLoading}
          onReorder={handleReorder}
          onEdit={onEditClick}
          onDelete={onDeleteClick}
          onView={onViewClick}
        />

        <PortfolioModal
          open={openModal}
          onClose={closeModal}
          editId={editId ?? undefined}
        />

        <PortfolioViewModal
          open={openViewModal}
          onClose={closeViewModal}
          viewId={viewId ?? undefined}
        />
      </section>
      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={deletePortfolio.isPending}
        title="Delete Portfolio"
        description="Are you sure you want to delete this portfolio project? This action cannot be undone."
      />
    </>
  );
};

export default PortfolioContainer;

'use client';

import React, { useMemo, useState } from 'react';
import { useToast } from '@repo/ui/components';
import DeleteConfirmationModal from 'components/common/DeleteConfirmationModal';
import UserTable, { usersTableColumn } from 'components/tables/UsersTable';
import { AdvanceTableProvider } from 'context/AdvanceTableProvider';
import { useUserMutations } from 'hooks/mutations/useUserMutations';
import { useGetAllUsers } from 'hooks/queries/useUserQueries';
import { useAdvanceTable } from 'hooks/useAdvanceTable';

const UserTableContainer = () => {
  const { deleteUser } = useUserMutations();
  const { toast } = useToast();

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleDeleteModalOpen = (id: number) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteId(null);
    setOpenDeleteModal(false);
  };

  const { data, isLoading } = useGetAllUsers();

  const columns = useMemo(() => usersTableColumn(handleDeleteModalOpen), []);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await deleteUser.mutateAsync(deleteId);
      if (res.success) {
        toast({
          variant: 'success',
          title: res.message ?? 'Blog deleted successfully.'
        });
      } else {
        toast({
          variant: 'error',
          title: res.message ?? 'Failed to delete blog.'
        });
      }
      handleDeleteModalClose();
    } catch (error) {
      toast({
        variant: 'error',
        title: error instanceof Error ? error.message : 'Failed to delete blog.'
      });
    }
  };

  const table = useAdvanceTable({
    data: data ?? [],
    columns,
    selection: true,
    pagination: true,
    pageSize: 10
  });
  return (
    <AdvanceTableProvider table={table}>
      <UserTable isLoading={isLoading} />

      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteUser.isPending}
        title="Delete user"
        description="Are you sure you want to delete this user? This action cannot be undone."
      />
    </AdvanceTableProvider>
  );
};

export default UserTableContainer;

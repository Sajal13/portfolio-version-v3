import React, { useMemo, useState } from 'react';
import { useToast } from '@repo/ui/components';
import DeleteConfirmationModal from 'components/common/DeleteConfirmationModal';
import BlogsTable, { blogsTableColumns } from 'components/tables/BlogsTable';
import { AdvanceTableProvider } from 'context/AdvanceTableProvider';
import { useBlogMutations } from 'hooks/mutations/useBlogMutations';
import { useGetAllBlogs } from 'hooks/queries/useBlogQueries';
import { useAdvanceTable } from 'hooks/useAdvanceTable';

interface BlogsTableContainerProps {
  onEdit: (id: number) => void;
}
const BlogsTableContainer = ({ onEdit }: BlogsTableContainerProps) => {
  const { toast } = useToast();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { deleteBlog } = useBlogMutations();
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined);

  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteId(undefined);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await deleteBlog.mutateAsync(deleteId);
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
      closeDeleteModal();
    } catch (error) {
      toast({
        variant: 'error',
        title: error instanceof Error ? error.message : 'Failed to delete blog.'
      });
    }
  };

  const { data, isLoading } = useGetAllBlogs();

  const columns = useMemo(() => blogsTableColumns(onEdit, openDeleteModal), []);
  const table = useAdvanceTable({
    columns,
    data: data ?? [],
    selection: true,
    pagination: true,
    pageSize: 10
  });
  return (
    <>
      <AdvanceTableProvider table={table}>
        <BlogsTable isLoading={isLoading} />
      </AdvanceTableProvider>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteBlog.isPending}
        title="Delete blog"
        description="Are you sure you want to delete this blog? This action cannot be undone."
      />
    </>
  );
};

export default BlogsTableContainer;

import React, { useMemo, useState } from 'react';
import { useToast } from '@repo/ui/components';
import DeleteConfirmationModal from 'components/common/DeleteConfirmationModal';
import BlogCategoryTable, {
  blogCategoryTableColumns
} from 'components/tables/BlogCategoryTable';
import { AdvanceTableProvider } from 'context/AdvanceTableProvider';
import { useBlogCategoryMutations } from 'hooks/mutations/useBlogCategoryMutations';
import { useGetAllBlogCategory } from 'hooks/queries/useBlogCategoryQueries';
import { useAdvanceTable } from 'hooks/useAdvanceTable';

interface BlogCategoryTableContainerProps {
  onEdit: (id: number) => void;
}
const BlogCategoryTableContainer = ({
  onEdit
}: BlogCategoryTableContainerProps) => {
  const { toast } = useToast();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { deleteBlogCategory } = useBlogCategoryMutations();
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
      const res = await deleteBlogCategory.mutateAsync(deleteId);
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

  const { data, isLoading } = useGetAllBlogCategory();

  const columns = useMemo(
    () => blogCategoryTableColumns(onEdit, openDeleteModal),
    []
  );
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
        <BlogCategoryTable isLoading={isLoading} />
      </AdvanceTableProvider>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteBlogCategory.isPending}
        title="Delete blog category"
        description="Are you sure you want to delete this blog category? This action cannot be undone."
      />
    </>
  );
};

export default BlogCategoryTableContainer;

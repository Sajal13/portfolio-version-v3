import React, { useMemo } from 'react';
import { Blog } from '@repo/types';
import BlogsTable, { blogsTableColumns } from 'components/tables/BlogsTable';
import { AdvanceTableProvider } from 'context/AdvanceTableProvider';
import { useGetAllBlogs } from 'hooks/queries/useBlogQueries';
import { useAdvanceTable } from 'hooks/useAdvanceTable';

interface BlogsTableContainerProps {
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}
const BlogsTableContainer = ({
  onEdit,
  onDelete
}: BlogsTableContainerProps) => {
  const { data, isLoading } = useGetAllBlogs();
  const columns = useMemo(() => blogsTableColumns(onEdit, onDelete), []);
  const table = useAdvanceTable({
    columns,
    data: data ?? [],
    selection: true,
    pagination: true,
    pageSize: 10
  });
  return (
    <AdvanceTableProvider table={table}>
      <BlogsTable isLoading={isLoading} />
    </AdvanceTableProvider>
  );
};

export default BlogsTableContainer;

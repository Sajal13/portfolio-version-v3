'use client';

import React, { useState } from 'react';
import { Button, useToast } from '@repo/ui/components';
import DeleteConfirmationModal from 'components/common/DeleteConfirmationModal';
import PageHeader from 'components/common/PageHeader';
import BlogsModal from 'components/modal/BlogsModal';
import { useBlogMutations } from 'hooks/mutations/useBlogMutations';
import BlogsTableContainer from './BlogsTableContainer';

const BlogsContainer = () => {
  const { toast } = useToast();

  const { deleteBlog } = useBlogMutations();
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
  return (
    <section>
      <PageHeader title="Blogs">
        <Button variant="filled" color="primary" onClick={openAddModal}>
          Add Blog
        </Button>
      </PageHeader>
      <BlogsTableContainer onEdit={openEditModal} onDelete={openDeleteModal} />
      <BlogsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editId={editId}
      />
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteBlog.isPending}
        title="Delete blog"
        description="Are you sure you want to delete this blog? This action cannot be undone."
      />
    </section>
  );
};

export default BlogsContainer;

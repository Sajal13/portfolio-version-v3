'use client';

import React, { useState } from 'react';
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@repo/ui/components';
import PageHeader from 'components/common/PageHeader';
import AddBlogsCategoryModal from 'components/modal/AddBlogsCategoryModal';
import BlogsModal from 'components/modal/BlogsModal';
import BlogCategoryTableContainer from './BlogCategoryTableContainer';
import BlogsTableContainer from './BlogsTableContainer';

const BlogsContainer = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | undefined>(undefined);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryEditId, setCategoryEditId] = useState<number | undefined>(
    undefined
  );

  const openAddModal = () => {
    setEditId(undefined);
    setModalOpen(true);
  };

  const openEditModal = (id: number) => {
    setEditId(id);
    setModalOpen(true);
  };

  const categoryAddModalOpen = () => {
    setCategoryEditId(undefined);
    setIsCategoryModalOpen(true);
  };

  const categoryEditModalOpen = (id: number) => {
    setCategoryEditId(id);
    setIsCategoryModalOpen(true);
  };

  return (
    <section>
      <PageHeader title="Blogs">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            color="secondary"
            onClick={categoryAddModalOpen}
          >
            Add Category
          </Button>
          <Button variant="filled" color="primary" onClick={openAddModal}>
            Add Blog
          </Button>
        </div>
      </PageHeader>
      <Tabs defaultValue="blogs">
        <TabsList>
          <TabsTrigger value="blogs">Blogs List</TabsTrigger>
          <TabsTrigger value="category">Category List</TabsTrigger>
        </TabsList>

        <TabsContent value="blogs">
          <BlogsTableContainer onEdit={openEditModal} />
        </TabsContent>
        <TabsContent value="category">
          <BlogCategoryTableContainer onEdit={categoryEditModalOpen} />
        </TabsContent>
      </Tabs>
      <BlogsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editId={editId}
      />

      <AddBlogsCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        editId={categoryEditId}
      />
    </section>
  );
};

export default BlogsContainer;

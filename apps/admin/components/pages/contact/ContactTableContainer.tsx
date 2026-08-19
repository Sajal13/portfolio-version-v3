import React, { useMemo } from 'react';
import ContactTable, {
  contactTableColumn
} from 'components/tables/ContactTable';
import { AdvanceTableProvider } from 'context/AdvanceTableProvider';
import { useGetAllContact } from 'hooks/queries/useContactQueries';
import { useAdvanceTable } from 'hooks/useAdvanceTable';

interface ContactTableContainerProps {
  onView: (id: number) => void;
  onDelete: (id: number) => void;
}

const ContactTableContainer = ({
  onView,
  onDelete
}: ContactTableContainerProps) => {
  const { data, isLoading } = useGetAllContact();
  const columns = useMemo(() => contactTableColumn(onView, onDelete), []);

  const table = useAdvanceTable({
    data: data ?? [],
    columns,
    selection: true,
    pagination: true,
    pageSize: 10
  });
  return (
    <AdvanceTableProvider table={table}>
      <ContactTable isLoading={isLoading} />
    </AdvanceTableProvider>
  );
};

export default ContactTableContainer;

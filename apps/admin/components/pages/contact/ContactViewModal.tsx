'use client';

import React from 'react';
import { Badge, Modal, DetailRow } from '@repo/ui/components';
import dayjs from 'dayjs';
import { useGetContactById } from 'hooks/queries/useContactQueries';
import { formatMonthYear } from 'utils/helpers/formatMonthYear';

interface ContactViewModalProps {
  open: boolean;
  onClose: () => void;
  viewId?: number;
}

const ContactViewModal = ({ open, onClose, viewId }: ContactViewModalProps) => {
  const { data: contact, isLoading } = useGetContactById(viewId ?? 0);

  return (
    <Modal isOpen={open} onClose={onClose}>
      <Modal.Content>
        <Modal.Header>
          Contact Details
          <Modal.Close
            aria-label="Close modal"
            className="text-xl leading-none cursor-pointer"
          >
            &times;
          </Modal.Close>
        </Modal.Header>

        <Modal.Body className="flex flex-col gap-6">
          {isLoading || !contact ? (
            <div className="py-10 text-center text-sm text-secondary-300">
              Loading portfolio...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <DetailRow label="Name">{contact?.name}</DetailRow>

              <DetailRow label="Email Address">
                <Badge color="primary">
                  <a
                    href={`mailto: ${contact.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline"
                  >
                    {contact.email}
                  </a>
                </Badge>
              </DetailRow>

              <DetailRow label="IP Address">
                <Badge color="secondary">{contact.ip}</Badge>
              </DetailRow>

              <DetailRow label="Received At">
                {dayjs(contact.createdAt).format('MMM DD, YYYY HH:mm:ss A') ??
                  '-'}
              </DetailRow>
              <div className="md:col-span-2">
                <DetailRow label="Message">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {contact.message}
                  </p>
                </DetailRow>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default ContactViewModal;

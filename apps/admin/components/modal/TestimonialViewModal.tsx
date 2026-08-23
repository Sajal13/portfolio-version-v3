'use client';

import React from 'react';
import Image from 'next/image';
import { Modal, DetailRow } from '@repo/ui/components';
import dayjs from 'dayjs';
import { useGetTestimonialById } from 'hooks/queries/useTestimonialQueries';

interface TestimonialViewModalProps {
  open: boolean;
  onClose: () => void;
  viewId?: number;
}

const TestimonialViewModal = ({
  open,
  onClose,
  viewId
}: TestimonialViewModalProps) => {
  const { data: testimonial, isLoading } = useGetTestimonialById(viewId ?? 0);

  return (
    <Modal isOpen={open} onClose={onClose}>
      <Modal.Content>
        <Modal.Header>
          Testimonial Details
          <Modal.Close
            aria-label="Close modal"
            className="text-xl leading-none cursor-pointer"
          >
            &times;
          </Modal.Close>
        </Modal.Header>

        <Modal.Body className="flex flex-col gap-6">
          {isLoading || !testimonial ? (
            <div className="py-10 text-center text-sm text-secondary-300">
              Loading testimonial...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 flex items-center gap-4">
                {testimonial.image && (
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={64}
                    height={64}
                    className="size-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-secondary-100">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-secondary-300">
                    {testimonial.designation} · {testimonial.company}
                  </p>
                </div>
              </div>

              <div className="md:col-span-2">
                <DetailRow label="Testimonial">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {testimonial.description}
                  </p>
                </DetailRow>
              </div>

              <DetailRow label="Company">{testimonial.company}</DetailRow>
              <DetailRow label="Designation">
                {testimonial.designation}
              </DetailRow>

              <DetailRow label="Created">
                {dayjs(testimonial.createdAt).format('MMM D, YYYY h:mm A')}
              </DetailRow>

              <DetailRow label="Last Updated">
                {dayjs(testimonial.updatedAt).format('MMM D, YYYY h:mm A')}
              </DetailRow>
            </div>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default TestimonialViewModal;

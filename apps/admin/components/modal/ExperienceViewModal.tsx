'use client';

import React from 'react';
import { ExperienceStatus } from '@repo/types';
import { Badge, Modal, DetailRow } from '@repo/ui/components';
import dayjs from 'dayjs';
import { useGetExperienceById } from 'hooks/queries/useExperienceQueries';
import { formatMonthYear } from 'utils/helpers/formatMonthYear';

interface ExperienceViewModalProps {
  open: boolean;
  onClose: () => void;
  viewId?: number;
}

const experienceTypeLabel: Record<string, string> = {
  Education: 'Education',
  FullTime: 'Full Time',
  PartTime: 'Part Time'
};

const ExperienceViewModal = ({
  open,
  onClose,
  viewId
}: ExperienceViewModalProps) => {
  const { data: experience, isLoading } = useGetExperienceById(viewId ?? 0);

  return (
    <Modal isOpen={open} onClose={onClose}>
      <Modal.Content>
        <Modal.Header>
          Experience Details
          <Modal.Close
            aria-label="Close modal"
            className="text-xl leading-none cursor-pointer"
          >
            &times;
          </Modal.Close>
        </Modal.Header>

        <Modal.Body className="flex flex-col gap-6">
          {isLoading || !experience ? (
            <div className="py-10 text-center text-sm text-secondary-300">
              Loading experience...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <DetailRow label="Title">{experience.title}</DetailRow>
              <div className="md:col-span-2">
                <DetailRow label="Description">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {experience.description}
                  </p>
                </DetailRow>
              </div>
              <DetailRow label="Type">
                <Badge color="primary">
                  {experienceTypeLabel[experience.experienceType] ??
                    experience.experienceType}
                </Badge>
              </DetailRow>

              <DetailRow label="Status">
                <Badge
                  color={
                    experience.status === ExperienceStatus.active
                      ? 'success'
                      : 'error'
                  }
                >
                  {experience.status === ExperienceStatus.active
                    ? 'Active'
                    : 'Inactive'}
                </Badge>
              </DetailRow>

              <DetailRow label="Company">{experience.company}</DetailRow>

              <DetailRow label="Location">{experience.location}</DetailRow>

              <DetailRow label="Duration">
                {formatMonthYear(experience.startDate) ?? '-'} —{' '}
                {formatMonthYear(experience.endDate) ?? 'Present'}
              </DetailRow>

              <div className="md:col-span-2">
                <DetailRow label="Tools">
                  <div className="flex flex-wrap gap-1.5">
                    {experience.tools?.length ? (
                      experience.tools.map((tool) => (
                        <Badge key={tool.id} color="secondary">
                          {tool.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-secondary-300">
                        No tools listed
                      </span>
                    )}
                  </div>
                </DetailRow>
              </div>

              <DetailRow label="Created">
                {dayjs(experience.createdAt).format('MMM D, YYYY h:mm A')}
              </DetailRow>

              <DetailRow label="Last Updated">
                {dayjs(experience.updatedAt).format('MMM D, YYYY h:mm A')}
              </DetailRow>
            </div>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default ExperienceViewModal;

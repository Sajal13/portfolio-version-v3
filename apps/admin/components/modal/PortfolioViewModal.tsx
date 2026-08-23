'use client';

import React from 'react';
import { Badge, Modal, DetailRow } from '@repo/ui/components';
import dayjs from 'dayjs';
import { useGetPortfolioById } from 'hooks/queries/usePortfolioQueries';
import { formatMonthYear } from 'utils/helpers/formatMonthYear';

interface PortfolioViewModalProps {
  open: boolean;
  onClose: () => void;
  viewId?: number;
}

const PortfolioViewModal = ({
  open,
  onClose,
  viewId
}: PortfolioViewModalProps) => {
  const { data: portfolio, isLoading } = useGetPortfolioById(viewId ?? 0);

  return (
    <Modal isOpen={open} onClose={onClose}>
      <Modal.Content>
        <Modal.Header>
          Portfolio Details
          <Modal.Close
            aria-label="Close modal"
            className="text-xl leading-none cursor-pointer"
          >
            &times;
          </Modal.Close>
        </Modal.Header>

        <Modal.Body className="flex flex-col gap-6">
          {isLoading || !portfolio ? (
            <div className="py-10 text-center text-sm text-secondary-300">
              Loading portfolio...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {portfolio?.image && (
                <div className="md:col-span-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={portfolio.image}
                    alt={portfolio.title}
                    className="w-full max-h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              <DetailRow label="Title">{portfolio?.title}</DetailRow>

              <DetailRow label="Project Type">
                <Badge color="primary">{portfolio.projectType}</Badge>
              </DetailRow>

              <div className="md:col-span-2">
                <DetailRow label="Description">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {portfolio.description}
                  </p>
                </DetailRow>
              </div>

              <DetailRow label="Published">
                {formatMonthYear(portfolio.publishedDate) ?? '-'}
              </DetailRow>

              <DetailRow label="Live Link">
                <a
                  href={portfolio.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:underline break-all"
                >
                  {portfolio.liveLink}
                </a>
              </DetailRow>

              <DetailRow label="GitHub Link">
                <a
                  href={portfolio.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:underline break-all"
                >
                  {portfolio.githubLink}
                </a>
              </DetailRow>

              <div className="md:col-span-2">
                <DetailRow label="Tools">
                  <div className="flex flex-wrap gap-1.5">
                    {portfolio.tools?.length ? (
                      portfolio.tools.map((tool) => (
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
                {dayjs(portfolio.createdAt).format('MMM D, YYYY h:mm A')}
              </DetailRow>

              <DetailRow label="Last Updated">
                {dayjs(portfolio.updatedAt).format('MMM D, YYYY h:mm A')}
              </DetailRow>
            </div>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default PortfolioViewModal;

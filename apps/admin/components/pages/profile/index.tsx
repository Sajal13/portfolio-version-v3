'use client';

import React, { useState } from 'react';
import { LuLoader, LuFileText, LuDownload } from '@repo/icons/lu';
import { Button, Card, CardContent } from '@repo/ui/components';
import PageHeader from 'components/common/PageHeader';
import { useProfileGet } from 'hooks/queries/useProfileQueries';
import { useResumeGet } from 'hooks/queries/useResumeQueries';
import ProfileModal from './ProfileModal';
import ResumeModal from './ResumeModal';

const ProfileContainer = () => {
  const { data: profileRes, isLoading: isProfileLoading } = useProfileGet();
  const { data: resume, isLoading: isResumeLoading } = useResumeGet();

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  const profile = profileRes?.data;
  const hasProfile = !!profile;

  return (
    <section className="flex flex-col gap-8">
      <PageHeader title="Profile">
        <Button
          variant="filled"
          color="primary"
          onClick={() => setProfileModalOpen(true)}
        >
          {hasProfile ? 'Edit Profile Info' : 'Add Profile Info'}
        </Button>
      </PageHeader>

      {isProfileLoading ? (
        <div className="min-h-40 w-full flex items-center justify-center">
          <LuLoader size={20} className="animate-spin text-primary-500" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <Card variant="illustration">
              <CardContent>
                <h4 className="mb-4">Total Experience</h4>
                <h2 className="font-bold">
                  {profile?.totalYearsOfExperience ?? 0}
                </h2>
              </CardContent>
            </Card>
            <Card variant="illustration">
              <CardContent>
                <h4 className="mb-4">Total Projects</h4>
                <h2 className="font-bold">{profile?.totalProjects ?? 0}</h2>
              </CardContent>
            </Card>
            <Card variant="illustration">
              <CardContent>
                <h4 className="mb-4">Total Clients</h4>
                <h2 className="font-bold">{profile?.totalClients ?? 0}</h2>
              </CardContent>
            </Card>
          </div>
          <div className="mb-8">
            <h3 className="font-medium mb-2">Description</h3>
            <p>{profile?.description ?? ''}</p>
          </div>
        </>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Resume</h3>
        <Button
          variant="filled"
          color="primary"
          onClick={() => setResumeModalOpen(true)}
        >
          {resume ? 'Replace Resume' : 'Add Resume'}
        </Button>
      </div>

      {isResumeLoading ? (
        <div className="min-h-24 w-full flex items-center justify-center">
          <LuLoader size={18} className="animate-spin text-primary-500" />
        </div>
      ) : resume ? (
        <Card>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <LuFileText size={22} className="text-primary-500 shrink-0" />
              <span className="text-sm text-secondary-300 truncate">
                {resume.originalName}
              </span>
            </div>
            <a
              href={resume.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-primary-500 hover:underline shrink-0"
            >
              <LuDownload size={16} />
              Download
            </a>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center text-sm text-secondary-300">
            No resume uploaded yet.
          </CardContent>
        </Card>
      )}

      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profile={profile}
      />

      <ResumeModal
        open={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        currentResumeName={resume?.originalName}
      />
    </section>
  );
};

export default ProfileContainer;

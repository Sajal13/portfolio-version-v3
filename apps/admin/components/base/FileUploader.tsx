import { useMemo } from 'react';
import { Button } from '@repo/ui/components';
import classNames from 'classnames';
import useFilePreviewUrls from 'hooks/useFilePreviewUrls';
import { useDropzone } from 'react-dropzone';
import type { IconType } from 'react-icons';
import { BsFileEarmarkPdf, BsMarkdown, BsFileEarmark } from 'react-icons/bs';
import { FiUploadCloud, FiX, FiImage } from 'react-icons/fi';

type FileKind = 'image' | 'pdf' | 'markdown' | 'other';

type PreviewItem =
  | { source: 'preview'; index: number; value: string }
  | { source: 'file'; index: number; value: File };

interface FileUploaderProps {
  onDrop: (acceptedFiles: File[]) => void;
  multiple?: boolean;
  files?: File[];
  previewUrls?: string[];
  error?: boolean;
  errorText?: string;
  errorClassName?: string;
  fileType: string[];
  onRemove?: (index: number, source: 'file' | 'preview') => void;
  icon?: IconType;
  className?: string;
}

const getFileKind = (input: File | string): FileKind => {
  const name = typeof input === 'string' ? input : input.name;
  const mime = typeof input === 'string' ? '' : input.type;
  const ext = name.split('.').pop()?.toLowerCase() ?? '';

  if (
    mime.startsWith('image/') ||
    ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)
  ) {
    return 'image';
  }
  if (mime === 'application/pdf' || ext === 'pdf') return 'pdf';
  if (mime === 'text/markdown' || ['md', 'markdown'].includes(ext))
    return 'markdown';
  return 'other';
};

const getDisplayName = (input: File | string): string => {
  if (typeof input !== 'string') return input.name;
  try {
    const clean = input.split('?')[0] ?? '';
    return decodeURIComponent(clean.split('/').pop() ?? clean);
  } catch {
    return input;
  }
};

const kindIcon: Record<FileKind, IconType> = {
  image: FiImage,
  pdf: BsFileEarmarkPdf,
  markdown: BsMarkdown,
  other: BsFileEarmark
};

const FileUploader = ({
  onDrop,
  multiple = false,
  files,
  previewUrls,
  error,
  errorText,
  fileType,
  errorClassName,
  icon,
  onRemove,
  className
}: FileUploaderProps) => {
  const UploadIcon = icon ?? FiUploadCloud;
  const fileObjectUrls = useFilePreviewUrls(files);

  const accept = useMemo(() => {
    const mimeTypes = fileType.filter((type) => type.includes('/'));
    const extensions = fileType.filter((type) => type.startsWith('.'));

    if (mimeTypes.length === 0) {
      return extensions.length
        ? { 'application/octet-stream': extensions }
        : undefined;
    }

    return mimeTypes.reduce(
      (acc, type) => {
        acc[type] = extensions;
        return acc;
      },
      {} as Record<string, string[]>
    );
  }, [fileType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept
  });

  const items: PreviewItem[] = useMemo(
    () => [
      ...(previewUrls?.map((value, index) => ({
        source: 'preview' as const,
        index,
        value
      })) ?? []),
      ...(files?.map((value, index) => ({
        source: 'file' as const,
        index,
        value
      })) ?? [])
    ],
    [previewUrls, files]
  );

  const acceptedLabel = useMemo(() => {
    const labels = fileType.map((t) => {
      if (t === 'image/*') return 'Images';
      if (t === 'application/pdf' || t === '.pdf') return 'PDF';
      if (t === '.md' || t === 'text/markdown') return 'Markdown';
      return t.replace('.', '').toUpperCase();
    });
    return [...new Set(labels)].join(', ');
  }, [fileType]);

  const hasItems = items.length > 0;

  return (
    <div className="w-full h-full">
      <div
        {...getRootProps()}
        className={classNames(
          'relative flex flex-col items-center justify-center gap-4',
          'w-full h-full rounded-xl border-2 border-dashed bg-secondary-700',
          'transition-colors duration-200 cursor-pointer border-main px-5 md:px-7.5 py-6 md:py-8',
          {
            'border-success-500 bg-success-500/5': isDragActive,
            'border-error-500!': error
          },
          className
        )}
      >
        <input {...getInputProps()} />

        {!hasItems && (
          <div className="flex flex-col items-center gap-3 text-center">
            <div
              className={classNames(
                'flex items-center justify-center w-14 h-14 rounded-full bg-secondary-600/60 transition-transform',
                { 'scale-110': isDragActive }
              )}
            >
              <UploadIcon size={26} className="text-primary-300" />
            </div>
            <div>
              <p className="font-medium text-sm text-secondary-400">
                <span className="text-primary-300 font-semibold">
                  Click to upload
                </span>{' '}
                {isDragActive ? 'and drop it here' : 'or drag & drop'}
              </p>
              {acceptedLabel && (
                <p className="text-xs text-secondary-300 mt-1">
                  {acceptedLabel}
                </p>
              )}
            </div>
            <Button
              type="button"
              className="inline-flex px-3 py-2 text-xs min-h-7.75"
            >
              Browse File
            </Button>
          </div>
        )}

        {hasItems && (
          <div
            className={classNames('flex flex-wrap gap-3 w-full', {
              'justify-center': !multiple
            })}
          >
            {items.map((item) => {
              const kind = getFileKind(item.value);
              const name = getDisplayName(item.value);
              const src =
                typeof item.value === 'string'
                  ? item.value.startsWith('https://')
                    ? item.value
                    : `${process.env.NEXT_PUBLIC_IMAGE_PREVIEW_URL}/${item.value}`
                  : fileObjectUrls.get(item.value);

              return (
                <div
                  key={`${item.source}-${item.index}-${name}`}
                  onClick={(e) => e.stopPropagation()}
                  className="relative group"
                >
                  {kind === 'image' ? (
                    <img
                      src={src}
                      alt={name}
                      className="object-cover rounded-lg h-32 w-32 border border-secondary-600"
                    />
                  ) : (
                    <div className="flex justify-center items-center gap-2 h-32 w-40 rounded-lg border border-secondary-600 bg-secondary-800 px-3">
                      {(() => {
                        const KindIcon = kindIcon[kind];
                        return (
                          <KindIcon
                            size={28}
                            className="text-primary-500 shrink-0"
                          />
                        );
                      })()}
                      <span className="text-xs text-secondary-300 truncate">
                        {name}
                      </span>
                    </div>
                  )}

                  {onRemove && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(item.index, item.source);
                      }}
                      className="absolute cursor-pointer -top-2 -right-2 bg-black/70 rounded-full p-1 hover:bg-black opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX className="text-white w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}

            {multiple && (
              <div className="flex flex-col items-center justify-center gap-1 h-32 w-32 rounded-lg border-2 border-dashed border-secondary-600 text-secondary-500 hover:text-primary-500 hover:border-primary-500 transition-colors">
                <UploadIcon size={20} />
                <span className="text-xs">Add more</span>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className={classNames('text-red-500 text-xs mt-2', errorClassName)}>
          {errorText}
        </p>
      )}
    </div>
  );
};

export default FileUploader;

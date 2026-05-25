'use client';

import { useEffect, useState } from 'react';
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import css from './Notes.module.css';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { fetchNotes } from '@/lib/api';

const PER_PAGE = 12;

const NotesClient = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [searchDebounced] = useDebounce(search, 500);

  const queryClient = useQueryClient();

  const notesQuery = useQuery({
    queryKey: ['notes', page, searchDebounced],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: searchDebounced || undefined,
      }),
    placeholderData: keepPreviousData,
    staleTime: 50_000,
  });

  const items = notesQuery.data?.data ?? [];
  const totalPages = notesQuery.data?.totalPages ?? 1;

  useEffect(() => {
    if (!notesQuery.data) return;

    const { page: currentPage, totalPages } = notesQuery.data;

    if (currentPage < totalPages) {
      queryClient.prefetchQuery({
        queryKey: ['notes', page + 1, searchDebounced],
        queryFn: () =>
          fetchNotes({
            page: page + 1,
            perPage: PER_PAGE,
            search: searchDebounced || undefined,
          }),
      });
    }
  }, [page, searchDebounced, notesQuery.data, queryClient]);

  if (notesQuery.isLoading || notesQuery.isFetching) {
    return <Loader />;
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={value => {
            setSearch(value);
            setPage(1);
          }}
        />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            page={page}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {notesQuery.isError && (
        <ErrorMessage
          message={
            notesQuery.error instanceof Error
              ? notesQuery.error.message
              : 'Failed to load notes'
          }
        />
      )}

      {!notesQuery.isLoading && !notesQuery.isError && items.length > 0 && (
        <NoteList items={items} />
      )}

      {!notesQuery.isLoading && !notesQuery.isError && items.length === 0 && (
        <div className={css.empty}>No notes yet</div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm
          onCancel={() => setIsModalOpen(false)}
          onCreated={() => {
            setIsModalOpen(false);
            setPage(1);
            queryClient.invalidateQueries({ queryKey: ['notes'] });
          }}
        />
      </Modal>
    </div>
  );
};

export default NotesClient;

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import css from './NoteList.module.css';
import type { Note } from '../../types/note';
import { deleteNote } from '../../lib/api';
import Link from 'next/link';

export interface NoteListProps {
  items: Note[];
}

export default function NoteList({ items }: NoteListProps) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const delMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleDelete = (id: string) => {
    setDeletingId(id);
    delMutation.mutate(id);
  };

  if (!items.length) return null;

  return (
    <ul className={css.list}>
      {items.map(n => (
        <li className={css.listItem} key={n.id}>
          <h2 className={css.title}>{n.title}</h2>
          <p className={css.content}>{n.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{n.tag}</span>
            <Link href={`/notes/${n.id}`} className={css.link}>
              View details
            </Link>

            <button
              className={css.button}
              onClick={() => handleDelete(n.id)}
              disabled={delMutation.isPending && deletingId === n.id}
            >
              {delMutation.isPending && deletingId === n.id
                ? 'Deleting…'
                : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

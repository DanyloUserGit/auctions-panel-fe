import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddItemButton from '../../../shared/ui/AddItemButton';
import { Can } from '../../auth/ui/Can';
import type { Session } from '../model/types';
import SessionItem from './SessionItem';

interface Props {
  sessions: Session[];
}

export default function SessionList({ sessions }: Props) {
  const navigate = useNavigate();
  const handleStartSession = (sessionId?: string) => {
    if (sessionId) {
      navigate(`/session/${sessionId}`);
    } else {
      navigate(`/session`);
    }
  };

  const isEmpty = sessions.length === 0;

  return (
    <Grid container spacing={3}>
      {sessions.map((session) => (
        <SessionItem
          key={session.id}
          session={session}
          onClick={() => handleStartSession(session.id)}
        />
      ))}

      <Can roles={['GroupAdmin', 'SuperAdmin', 'User']}>
        <AddItemButton
          type="session"
          isEmpty={isEmpty}
          onClick={() => handleStartSession()}
        />
      </Can>
    </Grid>
  );
}

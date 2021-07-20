import { useHistory } from 'react-router-dom';
import { FormEvent, useState } from 'react';

import { db } from "../services/firebase"

import Illustration from '../assets/images/illustration.svg';
import logoGoogleImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';
import { LogoIMG } from '../components/Logo/index';

import { useAuth } from '../hooks/useAuth';

import '../styles/auth.scss';

export function Home() {
  const history = useHistory();
  const [roomCode, setRoomCode] = useState("");
  const { user, signInWithGoogle} = useAuth();

  const handleCreateRoom = async () => {
    if (!user) {
      await signInWithGoogle();
    }

    history.push('/rooms/new');
  }

  const handleJoinRoom = async (event: FormEvent) => {
    event.preventDefault()

    if (roomCode.trim() === "") return;

    const roomRef = await db.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert('Room does not exists.')
      return;
    }

    if (roomRef.val().endedAt) {
      alert("sala encerrada")
      return;
    }
    
    history.push(`rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={Illustration} alt="Illustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas de seu audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <LogoIMG />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={logoGoogleImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">Ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

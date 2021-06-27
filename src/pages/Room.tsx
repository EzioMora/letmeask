import { FormEvent, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { db } from '../services/firebase';

import logoIMG from '../assets/images/logo.svg'

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import { useAuth } from '../hooks/useAuth';

import '../styles/room.scss';


type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isHighLighted: boolean,
  isAnswered: boolean
}>

type Questions = {
  id: string,
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isHighLighted: boolean,
  isAnswered: boolean
}

type RoomParams = {
  id: string;
}

export const Room = () => {
  const { user, signInWithGoogle } = useAuth();
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [titleRoom, setTitleRoom] = useState('');
  const params = useParams<RoomParams>();
  const roomId = params.id;

  useEffect(() => {
    const roomRef = db.ref(`/rooms/${roomId}`);

    roomRef.on('value', room => {
      const dbRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = dbRoom.questions ?? {};
      
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          author: value.author,
          content: value.content,
          isHighLighted: value.isHighLighted,
          isAnswered: value.isAnswered
        }
      });

      setTitleRoom(dbRoom.title);
      setQuestions(parsedQuestions);
    })
    
  }, [roomId])

  const handleSendQuestion = async (event: FormEvent) => {
    event.preventDefault();

    if (newQuestion.trim() === "") return;

    if (!user) return;

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighLighted: false,
      isAnswered: false
    };

    await db.ref(`/rooms/${roomId}/questions`).push(question);

    setNewQuestion("");
  };

  return (
    <div className="page-room">
      <header>
        <div className="content">
          <img src={logoIMG} alt="letmeask" />
          <RoomCode code={roomId}/>
        </div>
      </header>
      
      <main className="content">
        <div className="room-title">
          <h1>Sala {titleRoom}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {user ?
              (
                <div className="user-info">
                  <img src={user.avatar} alt={user.name} />
                  <span>{user.name}</span>
                </div>
              )
                : (
                <span>Para enviar uma pergunta, <button onClick={signInWithGoogle}>faça seu login</button>.</span>
              )
            }
              <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>

        {
          JSON.stringify(questions)
        }

      </main>
    </div>
  );
};
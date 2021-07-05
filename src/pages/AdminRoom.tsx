import { useParams } from 'react-router-dom'

import logoIMG from '../assets/images/logo.svg'
import deleteIMG from '../assets/images/delete.svg'

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Questions } from '../components/Questions/index'
import { ModalRoom } from '../components/Modals/ModalRoom';
import { ModalQuestion } from '../components/Modals/ModalQuestion';

// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss';
// import { db } from '../services/firebase';
import { useState } from 'react';

type RoomParams = {
  id: string;
}

export const AdminRoom = () => {
  // const { user } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { titleRoom, questions } = useRoom(roomId);
  const [modalRoomIsOpen, setModalRoomIsOpen] = useState(false);
  const [modalQuestionIsOpen, setModalQuestionIsOpen] = useState(false);
  const [questionId, setQuestionId] = useState('');

  const handleDeletedQuestion = (questionId: string) => {
    setModalQuestionIsOpen(true);
    setQuestionId(questionId);
  }
  
  return (
    <div className="page-room">
      <header>
        <div className="content">
          <img src={logoIMG} alt="letmeask" />

          <div>
          <RoomCode code={roomId}/>
            <Button
              isOutlined
              onClick={() => setModalRoomIsOpen(true)}
            >
              Encerrar Sala
            </Button>
          </div>
        </div>
      </header>
      
      <main className="content">
        <div className="room-title">
          <h1>Sala {titleRoom}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>

        <div className="questions-list">
          {
            questions.length > 0
              ? (
                questions.map(question => {
                  return (
                    <Questions
                      key={question.id}
                      content={question.content}
                      author={question.author}
                    >
                      <button
                        type="button"
                        onClick={() => handleDeletedQuestion(question.id)}
                      >
                        <img src={deleteIMG} alt="Deleted Question" />
                      </button>
                    </Questions>
                  )
                })
              ) : (
                <h1>Sem perguntas</h1>
            )
          }
        </div>
        <ModalRoom
          modalIsOpen={modalRoomIsOpen}
          closeModal={() => setModalRoomIsOpen(false)}
          roomId={roomId}
        />
        <ModalQuestion
          modalIsOpen={modalQuestionIsOpen}
          closeModal={() => setModalQuestionIsOpen(false)}
          roomId={roomId}
          questionId={questionId}
        />
      </main>
    </div>
  );
};
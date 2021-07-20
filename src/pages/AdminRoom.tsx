import { useParams } from 'react-router-dom'

import deleteIMG from '../assets/images/delete.svg'
import checkIMG from '../assets/images/check.svg'
import answerIMG from '../assets/images/answer.svg'

import { LogoIMG } from '../components/Logo/index'
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
import { db } from '../services/firebase'

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

  const handleCheckQuestionAsAnswered = async (questionId: string) => {
    await db.ref(`/rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    });
  }

  const handleHighLightedQuestion = async (questionId: string) => {
    await db.ref(`/rooms/${roomId}/questions/${questionId}`).update({
      isHighLighted: true
    });
  }
  
  return (
    <div className="page-room">
      <header>
        <div className="content">
          <LogoIMG clickRedirect='/'/>

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
                      isAnswered={question.isAnswered}
                      isHighLighted={question.isHighLighted}
                    >
                      {
                        !question.isAnswered && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleCheckQuestionAsAnswered(question.id)}
                            >
                              <img src={checkIMG} alt="Marcar pergunta como respondida" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleHighLightedQuestion(question.id)}
                            >
                              <img src={answerIMG} alt="Dar destaque à pergunta" />
                            </button>
                          </>
                        )
                      }
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
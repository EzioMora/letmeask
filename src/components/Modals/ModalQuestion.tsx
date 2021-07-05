import { db } from '../../services/firebase';
import Modal from 'react-modal';

import deleteQuestionIMG from '../../assets/images/delete.svg'


type ModalQuestionProps = {
  modalIsOpen: boolean;
  closeModal: () => void;
  roomId: string;
  questionId: string;
}


export const ModalQuestion = ({ modalIsOpen , roomId, closeModal, questionId }: ModalQuestionProps) => {

  const handleDeletedQuestion = async () => {
    await db.ref(`/rooms/${roomId}/questions/${questionId}`).remove();
    closeModal();
  };

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        contentLabel="Example Modal"
        className="modal-admin"
      >
        <img className="modal-admin__icon" src={deleteQuestionIMG} alt="Icon Delete Room" />
        <h2 className="modal-admin__title">Excluir pergunta</h2>
        <p className="modal-admin__description">
          Tem certeza que você deseja excluir esta pergunta?        </p>
        <div className="modal-admin__buttons">
         <button className="modal-admin__btn-cancel" onClick={closeModal}>Cancelar</button>
         <button className="modal-admin__btn-delete"  onClick={handleDeletedQuestion}>Sim, excluir</button>
        </div>
      </Modal>
    </div>
  );
};